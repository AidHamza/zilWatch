// Assumes zrcTokensPropertiesMap is declared
// Assumes ssnListMap is declared

window.addEventListener("load", async () => {
    computeZilPriceInUsd(onZilUsdPriceLoaded);

    let zilpayStatus = checkZilpayStatus();
    bindViewMainContainer(zilpayStatus);
    if (ZilpayStatus.connected !== zilpayStatus) {
        return;
    }

    // Subscribe if there are changes with the account
    window.zilPay.wallet.observableAccount().subscribe(account => {
        refreshMainContentData(account);
    });

    // Subscribe if there are changes with network
    window.zilPay.wallet.observableNetwork().subscribe(() => {
        bindViewMainContainer(checkZilpayStatus());
    });

    if (window.zilPay.wallet.isConnect) {
        refreshMainContentData(window.zilPay.wallet.defaultAccount);
    }
});

$("#wallet_connect").click(function () {
    window.zilPay.wallet.connect().then(
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
    bindViewMainContainer(ZilpayStatus.connected);

    // (2) Refresh login button state
    bindViewLoggedInButton(censorBech32Address(account.bech32));

    // (3) Get ZIL balance, async.
    computeZilBalance(account, onZilWalletBalanceLoaded);

    // (4) Get ZRC-2 tokens price & ZRC-2 tokens LP balances in Zilswap, async.
    // Do this together because they are one API call, using the same data.
    computeZrcTokensPriceAndZilswapLpBalance(zrcTokensPropertiesMap, onZrcTokenPriceInZilLoaded, account, onZrcTokenLpBalanceLoaded);

    // (5) Get ZRC-2 tokens balances, async.
    computeZrcTokensBalance(account, zrcTokensPropertiesMap, onZrcTokenWalletBalanceLoaded);

    // (6) Get Potential LP reward next epoch and time duration counter to the next epoch
    computeTotalLpRewardNextEpoch(account, showLpRewardNextEpoch);
    computeLpNextEpochStart(showLpNextEpochCounter);

    // (7) Get ZIL staking balance
    computeZilStakingBalance(account, onZilStakingBalanceLoaded);
}

/**
 * --------------------------------------------------------------------------------
 */

function showLpRewardNextEpoch(contractAddressToRewardMap) {
    if (!contractAddressToRewardMap) {
        return;
    }
    // Sum of the rewards from all pools.
    let totalZwapRewardQa = 0;

    // Loop all individuals ZRC token LP and show ZWAP reward per ZRC LP.
    for (let ticker in zrcTokensPropertiesMap) {
        let zrcTokenAddress = zrcTokensPropertiesMap[ticker].address;

        if (contractAddressToRewardMap[zrcTokenAddress]) {
            let zwapRewardQa = parseInt(contractAddressToRewardMap[zrcTokenAddress]);
            if (zwapRewardQa) {
                totalZwapRewardQa += zwapRewardQa;

                let zwapRewardString = convertNumberQaToDecimalString(zwapRewardQa, zrcTokensPropertiesMap['ZWAP'].decimals);
                bindViewZwapRewardLp(zwapRewardString, ticker);
            }
        }
    }

    // Total reward from all pools
    let totalRewardZwapString = convertNumberQaToDecimalString(totalZwapRewardQa, zrcTokensPropertiesMap['ZWAP'].decimals)
    bindViewTotalZwapRewardAllLp(totalRewardZwapString);
}

function showLpNextEpochCounter(nextEpochStartSeconds) {
    if (nextEpochStartSeconds) {
        let currentDate = new Date();
        let currentTimeSeconds = currentDate.getTime() / 1000;
        let timeDiffSeconds = Math.max(0, nextEpochStartSeconds - currentTimeSeconds);
        let timeDiffDuration = new Duration(timeDiffSeconds);

        bindViewLpNextEpochCounter(timeDiffDuration.getUserFriendlyString());
    }
}

/**
 * --------------------------------------------------------------------------------
 */

function onZilUsdPriceLoaded(zilPriceInUsd) {
    let zilPriceInUsdFloat = parseFloat(zilPriceInUsd);
    if (!zilPriceInUsdFloat) {
        return;
    }
    bindViewZilPriceInUsd(zilPriceInUsdFloat.toFixed(4));

    // Wallet Balance
    refreshZilWalletBalanceUsd();
    for (let ticker in zrcTokensPropertiesMap) {
        refreshZrcTokenWalletBalanceZilUsd(ticker);
    }
    refreshTotalWalletBalanceZilUsd();

    // Lp balance
    for (let ticker in zrcTokensPropertiesMap) {
        refreshZrcTokenLpBalanceUsd(ticker)
    }
    refreshTotalLpBalanceZilUsd();

    // Lp reward
    refreshTotalLpRewardUsd();

    // ZIL staking
    for (let ssnAddress in ssnListMap) {
        refreshZilStakingUsd(ssnAddress);
    }
    refreshTotalZilStakingZilUsd();

    // Net worth
    refreshNetWorthZilUsd();
}

function onZilWalletBalanceLoaded(zilBalanceQa) {
    var userFriendlyZilBalance = convertNumberQaToDecimalString(parseInt(zilBalanceQa), /* decimals= */ 12);
    if (!userFriendlyZilBalance) {
        return;
    }
    bindViewZilBalance(userFriendlyZilBalance);

    // Wallet Balance
    refreshZilWalletBalanceUsd();
    refreshTotalWalletBalanceZilUsd();

    // Net worth
    refreshNetWorthZilUsd();
}

function onZrcTokenPriceInZilLoaded(zrcTokenPriceInZilNumber, ticker) {
    let userFriendlyZrcTokenPriceInZil = convertNumberQaToDecimalString(zrcTokenPriceInZilNumber, /* decimals= */ 0);
    if (!userFriendlyZrcTokenPriceInZil) {
        return;
    }
    bindViewZrcTokenPriceInZil(userFriendlyZrcTokenPriceInZil, ticker)

    // Wallet Balance
    refreshZrcTokenWalletBalanceZilUsd(ticker);
    refreshTotalWalletBalanceZilUsd();

    // Lp balance
    refreshZrcTokenLpBalanceUsd(ticker)
    refreshTotalLpBalanceZilUsd();

    // Lp reward
    if (ticker === 'ZWAP') {
        refreshTotalLpRewardUsd();
    }

    // Net worth
    refreshNetWorthZilUsd();
}

function onZrcTokenWalletBalanceLoaded(zrcTokenBalanceNumberQa, zrcTokenProperties) {
    let userFriendlyZrcTokenBalanceString = convertNumberQaToDecimalString(zrcTokenBalanceNumberQa, zrcTokenProperties.decimals);
    if (!userFriendlyZrcTokenBalanceString) {
        return;
    }
    bindViewZrcTokenWalletBalance(userFriendlyZrcTokenBalanceString, zrcTokenProperties.ticker);

    // Wallet Balance
    refreshZrcTokenWalletBalanceZilUsd(zrcTokenProperties.ticker);
    refreshTotalWalletBalanceZilUsd();

    // Net worth
    refreshNetWorthZilUsd();
}

function onTotalLpRewardNextEpochLoaded() {
    refreshTotalLpRewardUsd();
}

function onZrcTokenLpBalanceLoaded(walletZilswapSingleTokenLpStatus, ticker) {
    if (!walletZilswapSingleTokenLpStatus) {
        return;
    }
    let poolSharePercent = parseFloat((walletZilswapSingleTokenLpStatus.shareRatio) * 100).toPrecision(3);
    let zilAmount = convertNumberQaToDecimalString(walletZilswapSingleTokenLpStatus.zilAmount, /* decimals= */ 0);
    let zrcTokenAmount = convertNumberQaToDecimalString(walletZilswapSingleTokenLpStatus.zrcTokenAmount, /* decimals= */ 0);

    if (!poolSharePercent || !zilAmount || !zrcTokenAmount) {
        return;
    }
    bindViewZrcTokenLpBalance(poolSharePercent, zilAmount, zrcTokenAmount, ticker);

    // Lp balance
    refreshZrcTokenLpBalanceUsd(ticker)
    refreshTotalLpBalanceZilUsd();

    // Net worth
    refreshNetWorthZilUsd();
}

function onZilStakingBalanceLoaded(zilBalanceQa, ssnAddress) {
    let userFriendlyZilStakingBalanceString = convertNumberQaToDecimalString(parseInt(zilBalanceQa), /* decimals= */ 12);
    if (!userFriendlyZilStakingBalanceString) {
        return;
    }
    bindViewZilStakingBalance(userFriendlyZilStakingBalanceString, ssnAddress);

    // ZIL Staking balance
    refreshZilStakingUsd(ssnAddress)
    refreshTotalZilStakingZilUsd();

    // Net worth
    refreshNetWorthZilUsd();
}

/**
 * --------------------------------------------------------------------------------
 */

/**
 * Obtain Zil price in USD if data has been loaded.
 * 
 * @returns {?number} The number reprentation of USD amount per ZIL, otherwise null.
 */
function getZilPriceInUsdIfLoaded() {
    let usdPrice = $('#zil_price').text();
    usdPrice = parseFloatFromCommafiedNumberString(usdPrice);
    if (!usdPrice) {
        return null;
    }
    return usdPrice;
}

function refreshZilWalletBalanceUsd() {
    let usdPrice = getZilPriceInUsdIfLoaded();
    if (!usdPrice) {
        return;
    }

    let zilBalance = $('#zil_balance').text();
    zilBalance = parseFloatFromCommafiedNumberString(zilBalance);
    if (!zilBalance) {
        return;
    }
    let zilBalanceUsd = (usdPrice * zilBalance);
    $('#zil_balance_usd').text(commafyNumberToString(zilBalanceUsd));
}

function refreshZrcTokenWalletBalanceZilUsd(ticker) {

    let zrcTokenPriceInZil = $('#' + ticker + '_price').text();
    zrcTokenPriceInZil = parseFloatFromCommafiedNumberString(zrcTokenPriceInZil);
    if (!zrcTokenPriceInZil) {
        return;
    }

    let zrcTokenBalance = $('#' + ticker + '_balance').text();
    zrcTokenBalance = parseFloatFromCommafiedNumberString(zrcTokenBalance);
    if (!zrcTokenBalance) {
        return;
    }

    let zrcTokenBalanceZil = 1.0 * zrcTokenPriceInZil * zrcTokenBalance;
    $('#' + ticker + '_balance_zil').text(convertNumberQaToDecimalString(zrcTokenBalanceZil, /* decimals= */ 0));

    let usdPrice = getZilPriceInUsdIfLoaded();
    if (!usdPrice) {
        return;
    }

    let zrcTokenBalanceUsd = 1.0 * usdPrice * zrcTokenBalanceZil;
    $('#' + ticker + '_balance_usd').text(commafyNumberToString(zrcTokenBalanceUsd));
}

function refreshTotalWalletBalanceZilUsd() {
    // Sum balance in ZIL.
    let totalZil = 0;
    let zil = $('#zil_balance').text()
    zil = parseFloatFromCommafiedNumberString(zil);
    if (zil) {
        totalZil += zil;
    }
    for (let ticker in zrcTokensPropertiesMap) {
        let zrcZil = $('#' + ticker + '_balance_zil').text();
        zrcZil = parseFloatFromCommafiedNumberString(zrcZil);
        if (zrcZil) {
            totalZil += zrcZil;
        }
    }
    $('#wallet_balance_zil').text(convertNumberQaToDecimalString(totalZil, /* decimals= */ 0));

    let usdPrice = getZilPriceInUsdIfLoaded();
    if (!usdPrice) {
        return;
    }

    // Sum balance in USD
    let totalUsd = 1.0 * totalZil * usdPrice;
    $('#wallet_balance_usd').text(commafyNumberToString(totalUsd));
}

function refreshZrcTokenLpBalanceUsd(ticker) {

    let usdPrice = getZilPriceInUsdIfLoaded();
    if (!usdPrice) {
        return;
    }

    let zilLpBalance = $('#' + ticker + '_lp_zil_balance').text();
    zilLpBalance = parseFloatFromCommafiedNumberString(zilLpBalance);
    if (!zilLpBalance) {
        return;
    }

    // total worth is always times 2 (e.g., ZRC2-ZIL pair always have 50:50 value).
    // For now ZilSwap only support 50-50 weight pair.
    let lpTokenBalanceUsd = 1.0 * usdPrice * (zilLpBalance * 2.0);
    $('#' + ticker + '_lp_balance_usd').text(commafyNumberToString(lpTokenBalanceUsd));
}

function refreshTotalLpBalanceZilUsd() {
    // Sum balance in ZIL.
    let totalZil = 0;
    for (let ticker in zrcTokensPropertiesMap) {
        let lpZil = $('#' + ticker + '_lp_zil_balance').text();
        lpZil = parseFloatFromCommafiedNumberString(lpZil);
        if (lpZil) {
            // total worth is always times 2 (e.g., ZRC2-ZIL pair always have 50:50 value)
            // For now ZilSwap only support 50-50 weight pair.
            totalZil += (lpZil * 2.0);
        }
    }
    $('#lp_balance_zil').text(convertNumberQaToDecimalString(totalZil, /* decimals= */ 0));

    // Sum balance in USD.
    let usdPrice = getZilPriceInUsdIfLoaded();
    if (!usdPrice) {
        return;
    }
    let totalUsd = 1.0 * totalZil * usdPrice;
    $('#lp_balance_usd').text(commafyNumberToString(totalUsd));
}

function refreshZilStakingUsd(ssnAddress) {
    let usdPrice = getZilPriceInUsdIfLoaded();
    if (!usdPrice) {
        return;
    }

    let zilStakingBalance = $('#' + ssnAddress + '_zil_staking_balance').text();
    zilStakingBalance = parseFloatFromCommafiedNumberString(zilStakingBalance);
    if (!zilStakingBalance) {
        return;
    }

    let zilStakingBalanceUsd = 1.0 * usdPrice * zilStakingBalance;
    $('#' + ssnAddress + '_zil_staking_balance_usd').text(commafyNumberToString(zilStakingBalanceUsd));
}

function refreshTotalZilStakingZilUsd() {
    // Sum balance in ZIL.
    let totalZil = 0;
    for (let ssnAddress in ssnListMap) {
        let stakingZil = $('#' + ssnAddress + '_zil_staking_balance').text();
        stakingZil = parseFloatFromCommafiedNumberString(stakingZil);
        if (stakingZil) {
            totalZil += stakingZil;
        }
    }
    $('#zil_staking_balance_zil').text(convertNumberQaToDecimalString(totalZil, /* decimals= */ 0));

    // Sum balance in USD.
    let usdPrice = getZilPriceInUsdIfLoaded();
    if (!usdPrice) {
        return;
    }
    let totalUsd = 1.0 * totalZil * usdPrice;
    $('#zil_staking_balance_usd').text(commafyNumberToString(totalUsd));
}

function refreshNetWorthZilUsd() {
    // Sum balance in ZIL.
    let totalZil = 0;

    let walletBalanceZil = $('#wallet_balance_zil').text();
    walletBalanceZil = parseFloatFromCommafiedNumberString(walletBalanceZil);
    if (walletBalanceZil) {
        totalZil += walletBalanceZil;
    }

    let lpBalanceZil = $('#lp_balance_zil').text();
    lpBalanceZil = parseFloatFromCommafiedNumberString(lpBalanceZil);
    if (lpBalanceZil) {
        totalZil += lpBalanceZil;
    }

    let zilStakingBalanceZil = $('#zil_staking_balance_zil').text();
    zilStakingBalanceZil = parseFloatFromCommafiedNumberString(zilStakingBalanceZil);
    if (zilStakingBalanceZil) {
        totalZil += zilStakingBalanceZil;
    }
    $('#net_worth_zil').text(convertNumberQaToDecimalString(totalZil, /* decimals= */ 0));

    // Sum balance in USD.
    let usdPrice = getZilPriceInUsdIfLoaded();
    if (!usdPrice) {
        return;
    }
    let totalUsd = 1.0 * totalZil * usdPrice;
    $('#net_worth_usd').text(commafyNumberToString(totalUsd));
}

/**
 * --------------------------------------------------------------------------------
 */

function refreshTotalLpRewardUsd() {
    let ticker = 'ZWAP';

    let usdPrice = getZilPriceInUsdIfLoaded();
    if (!usdPrice) {
        return;
    }

    let zrcTokenPriceInZil = $('#' + ticker + '_price').text();
    zrcTokenPriceInZil = parseFloatFromCommafiedNumberString(zrcTokenPriceInZil);
    if (!zrcTokenPriceInZil) {
        return;
    }

    let rewardBalance = $('#total_all_lp_reward_next_epoch_zwap').text();
    rewardBalance = parseFloatFromCommafiedNumberString(rewardBalance);
    if (!rewardBalance) {
        return;
    }

    let rewardBalanceUsd = (usdPrice * zrcTokenPriceInZil * rewardBalance);
    $('#total_all_lp_reward_next_epoch_usd').text(commafyNumberToString(rewardBalanceUsd));
}