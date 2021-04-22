// Assumes zrcTokensPropertiesMap is declared

window.addEventListener("load", async () => {
    computeZilPriceInUsd(showZilPriceInUsd);

    if (!refreshMainContentVisibility(getZilpayStatus())) {
        return;
    }

    // Subscribe if there are changes with the account
    window.zilPay.wallet.observableAccount().subscribe(account => {
        refreshMainContentData(account);
    });

    // Subscribe if there are changes with network
    window.zilPay.wallet.observableNetwork().subscribe(() => {
        refreshMainContentVisibility(getZilpayStatus());
    });

    if (window.zilPay.wallet.isConnect) {
        refreshMainContentData(window.zilPay.wallet.defaultAccount);
    }
});

$("#wallet_connect").click(function () {
    connectZilpayService().then(
        function (isUnlockSuccessful) {
            console.log("Wallet connect unlock successful: " + isUnlockSuccessful);
            if (isUnlockSuccessful) {
                refreshMainContentData(window.zilPay.wallet.defaultAccount)
            }
        },
        function () {
            console.log("Wallet connect failed!");
        }
    );
});

$("#wallet_refresh").click(function () {
    window.location.reload();
});

function refreshMainContentData(account) {
    // (1) show main screen
    refreshMainContentVisibility(ZilpayStatus.connected);

    // (2) Refresh login button state
    refreshLoginButtonState(account);

    // (3) Get ZIL balance, async.
    computeZilBalance(account, showZilWalletBalance);

    // (4) Get ZRC-2 tokens price, async.
    computeZrcTokensPrice(zrcTokensPropertiesMap, showZrcTokenPriceInZil);

    // (5) Get ZRC-2 tokens balances, async.
    computeZrcTokensBalance(account, zrcTokensPropertiesMap, showZrcTokenWalletBalance);

    // (6) Get ZRC-2 tokens LP balances in Zilswap, async.
    computeZrcTokensZilSwapLpBalance(account, zrcTokensPropertiesMap, showZrcTokenLpBalance);

    // (7) Get Potential LP reward next epoch.
    computeTotalLpRewardNextEpoch(account, showTotalLpRewardNextEpoch);
}

function refreshLoginButtonState(account) {
    $('#wallet_connect').hide();
    $('#wallet_address').html(censorBech32Address(account.bech32));
    $('#wallet_address').show();
    $('#wallet_refresh').show();
}

function refreshMainContentVisibility(zilpayStatus) {
    if (ZilpayStatus.connected === zilpayStatus) {
        $('#main_content_container').show();
        $('#error_message_container').hide();
        return true;
    } else {
        possiblyShowErrorState(zilpayStatus);
        return false;
    }
}

function possiblyShowErrorState(zilpayStatus) {
    if (ZilpayStatus.not_installed === zilpayStatus) {
        $('#main_content_container').hide();
        $('#error_message').html('ZilPay not installed! <a href="https://zilpay.io">Download here</a>');
        $('#error_message_container').show();
    } else if (ZilpayStatus.locked === zilpayStatus || ZilpayStatus.not_connected === zilpayStatus) {
        $('#main_content_container').hide();
        $('#error_message').html('Please connect to ZilPay! (top right button)');
        $('#error_message_container').show();
    } else if (ZilpayStatus.not_mainnet === zilpayStatus) {
        $('#main_content_container').hide();
        $('#error_message').html('Please switch to mainnet!');
        $('#error_message_container').show();
    }
}

function showZilPriceInUsd(zilPriceInUsd) {
    $("#zil_price").text(zilPriceInUsd.toFixed(4));
    onZilUsdPriceLoaded();
}

function showZilWalletBalance(balance) {
    $('#zil_balance').text(balance);

    onZilWalletBalanceLoaded();
}

function showZrcTokenPriceInZil( /* nullable */ zrcTokenPriceInZil, ticker) {
    if (zrcTokenPriceInZil) {
        $('#' + ticker + '_price').text(zrcTokenPriceInZil);

        onZrcTokenPriceInZilLoaded(ticker);
    } else {
        $('#' + ticker + '_price').hide();
    }
}

function showZrcTokenWalletBalance( /* nullable */ balance, ticker) {
    if (balance) {
        $('#' + ticker + '_balance').text(balance);
        $('#' + ticker + '_container').show();

        onZrcTokenWalletBalanceLoaded(ticker);
    } else {
        $('#' + ticker + '_container').hide();
    }
}

function showZrcTokenLpBalance( /* nullable */ poolSharePercent, /* nullable */ zilBalance, /* nullable */ zrcBalance, ticker) {
    if (poolSharePercent && zilBalance && zrcBalance) {
        $('#' + ticker + '_lp_pool_share_percent').text(poolSharePercent);
        $('#' + ticker + '_lp_token_balance').text(zrcBalance);
        $('#' + ticker + '_lp_zil_balance').text(zilBalance);
        $('#' + ticker + '_lp_container').show();

        onZrcTokenLpBalanceLoaded(ticker);
    } else {
        $('#' + ticker + '_lp_container').hide();
    }
}

function showTotalLpRewardNextEpoch(zwapReward) {
    if (zwapReward) {
        $('#lp_reward_next_epoch_zwap').text(zwapReward);
        $('#lp_reward_next_epoch_container').show();
    } else {
        $('#lp_reward_next_epoch_container').hide();
    }
}

function onZilUsdPriceLoaded() {
    // Wallet Balance
    refreshZilWalletBalanceUsd();
    for (let ticker in zrcTokensPropertiesMap) {
        refreshZrcTokenWalletBalanceUsd(ticker);
    }
    refreshTotalWalletBalanceUsd();

    // Lp balance
    for (let ticker in zrcTokensPropertiesMap) {
        refreshZrcTokenLpBalanceUsd(ticker)
    }
    refreshTotalLpBalanceUsd();

    // Lp reward
    refreshTotalLpRewardUsd();

    // Net worth
    refreshNetWorthUsd();
}

function onZilWalletBalanceLoaded() {
    // Wallet Balance
    refreshZilWalletBalanceUsd();
    refreshTotalWalletBalanceUsd();

    // Net worth
    refreshNetWorthUsd();
}

function onZrcTokenPriceInZilLoaded(ticker) {
    // Wallet Balance
    refreshZrcTokenWalletBalanceUsd(ticker);
    refreshTotalWalletBalanceUsd();

    // Lp balance
    refreshZrcTokenLpBalanceUsd(ticker)
    refreshTotalLpBalanceUsd();

    // Lp reward
    if (ticker === 'ZWAP') {
        refreshTotalLpRewardUsd();
    }

    // Net worth
    refreshNetWorthUsd();
}

function onZrcTokenWalletBalanceLoaded(ticker) {
    // Wallet Balance
    refreshZrcTokenWalletBalanceUsd(ticker);
    refreshTotalWalletBalanceUsd();

    // Net worth
    refreshNetWorthUsd();
}

function onTotalLpRewardNextEpochLoaded() {
    refreshTotalLpRewardUsd();
}

function onZrcTokenLpBalanceLoaded(ticker) {
    // Lp balance
    refreshZrcTokenLpBalanceUsd(ticker)
    refreshTotalLpBalanceUsd();

    // Net worth
    refreshNetWorthUsd();
}

function refreshZilWalletBalanceUsd() {
    let usdPrice = $('#zil_price').text();
    usdPrice = parseFloatFromCommafiedNumberString(usdPrice);
    if (!usdPrice) {
        return;
    }
    let zilBalance = $('#zil_balance').text();
    zilBalance = parseFloat(zilBalance);
    if (!zilBalance) {
        return;
    }
    let zilBalanceUsd = (usdPrice * zilBalance);
    $('#zil_balance_usd').text(commafyNumberToString(zilBalanceUsd));
}

function refreshZrcTokenWalletBalanceUsd(ticker) {

    let usdPrice = $('#zil_price').text();
    usdPrice = parseFloatFromCommafiedNumberString(usdPrice);
    if (!usdPrice) {
        return;
    }

    let zrcTokenPriceInZil = $('#' + ticker + '_price').text();
    zrcTokenPriceInZil = parseFloat(zrcTokenPriceInZil);
    if (!zrcTokenPriceInZil) {

        return;
    }

    let zrcTokenBalance = $('#' + ticker + '_balance').text();
    zrcTokenBalance = parseFloat(zrcTokenBalance);
    if (!zrcTokenBalance) {
        return;
    }

    let zrcTokenBalanceUsd = (usdPrice * zrcTokenPriceInZil * zrcTokenBalance);
    $('#' + ticker + '_balance_usd').text(commafyNumberToString(zrcTokenBalanceUsd));
}

function refreshTotalWalletBalanceUsd() {
    let totalUsd = 0;
    let zilUsd = $('#zil_balance_usd').text()
    zilUsd = parseFloatFromCommafiedNumberString(zilUsd);
    if (zilUsd) {
        totalUsd += zilUsd;
    }
    for (let ticker in zrcTokensPropertiesMap) {
        let zrcUsd = $('#' + ticker + '_balance_usd').text();
        zrcUsd = parseFloatFromCommafiedNumberString(zrcUsd);
        if (zrcUsd) {
            totalUsd += zrcUsd;
        }
    }
    $('#wallet_balance_usd').text(commafyNumberToString(totalUsd));
}

function refreshZrcTokenLpBalanceUsd(ticker) {

    let usdPrice = $('#zil_price').text();
    usdPrice = parseFloatFromCommafiedNumberString(usdPrice);
    if (!usdPrice) {
        return;
    }

    let zrcTokenPriceInZil = $('#' + ticker + '_price').text();
    zrcTokenPriceInZil = parseFloat(zrcTokenPriceInZil);
    if (!zrcTokenPriceInZil) {
        return;
    }

    let zrcLpTokenBalance = $('#' + ticker + '_lp_token_balance').text();
    zrcLpTokenBalance = parseFloat(zrcLpTokenBalance);
    if (!zrcLpTokenBalance) {
        return;
    }

    let zilLpBalance = $('#' + ticker + '_lp_zil_balance').text();
    zilLpBalance = parseFloat(zilLpBalance);
    if (!zilLpBalance) {
        return;
    }

    let lpTokenBalanceUsd = (usdPrice * (zilLpBalance + (zrcTokenPriceInZil * zrcLpTokenBalance)));
    $('#' + ticker + '_lp_balance_usd').text(commafyNumberToString(lpTokenBalanceUsd));
}

function refreshTotalLpBalanceUsd() {
    let totalUsd = 0;
    for (let ticker in zrcTokensPropertiesMap) {
        let lpUsd = $('#' + ticker + '_lp_balance_usd').text();
        lpUsd = parseFloatFromCommafiedNumberString(lpUsd);
        if (lpUsd) {
            totalUsd += lpUsd;
        }
    }
    $('#lp_balance_usd').text(commafyNumberToString(totalUsd));
}

function refreshNetWorthUsd() {
    let totalUsd = 0;

    let walletBalanceUsd = $('#wallet_balance_usd').text();
    walletBalanceUsd = parseFloatFromCommafiedNumberString(walletBalanceUsd);
    if (walletBalanceUsd) {
        totalUsd += walletBalanceUsd;
    }

    let lpBalanceUsd = $('#lp_balance_usd').text();
    lpBalanceUsd = parseFloatFromCommafiedNumberString(lpBalanceUsd);
    if (lpBalanceUsd) {
        totalUsd += lpBalanceUsd;
    }

    $('#net_worth_usd').text(commafyNumberToString(totalUsd));
}

function refreshTotalLpRewardUsd() {
    let ticker = 'ZWAP';

    let usdPrice = $('#zil_price').text();
    usdPrice = parseFloatFromCommafiedNumberString(usdPrice.replace(',', ''));
    if (!usdPrice) {
        return;
    }

    let zrcTokenPriceInZil = $('#' + ticker + '_price').text();
    zrcTokenPriceInZil = parseFloatFromCommafiedNumberString(zrcTokenPriceInZil);
    if (!zrcTokenPriceInZil) {
        return;
    }

    let rewardBalance = $('#lp_reward_next_epoch_zwap').text();
    rewardBalance = parseFloatFromCommafiedNumberString(rewardBalance);
    if (!rewardBalance) {
        return;
    }

    let rewardBalanceUsd = (usdPrice * zrcTokenPriceInZil * rewardBalance);
    $('#lp_reward_next_epoch_usd').text(commafyNumberToString(rewardBalanceUsd));
}