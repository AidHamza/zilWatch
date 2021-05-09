// controller_main.js

/**
 * --------------------------------------------------------------------------------
 */

function onZilUsdPriceLoaded(zilPriceInUsd) {
    let zilPriceInUsdFloat = parseFloat(zilPriceInUsd);
    if (!zilPriceInUsdFloat) {
        return;
    }
    bindViewZilPriceInUsd(zilPriceInUsdFloat.toFixed(4));

    refreshZrcTokenPriceUsd();

    // Wallet Balance
    refreshZilWalletBalanceUsd();
    for (let ticker in zrcTokenPropertiesListMap) {
        refreshZrcTokenWalletBalanceZilUsd(ticker);
    }
    refreshTotalWalletBalanceZilUsd();

    // Lp balance
    for (let ticker in zrcTokenPropertiesListMap) {
        refreshZrcTokenLpTotalPoolBalanceUsd(ticker);
        refreshZrcTokenLpBalanceUsd(ticker);
    }
    refreshTotalLpBalanceZilUsd();

    // Lp reward
    refreshTotalLpRewardUsd();

    // ZIL staking
    for (let ssnAddress in ssnListMap) {
        refreshZilStakingUsd(ssnAddress);
    }
    refreshZilStakingWithdrawalPendingUsd();
    refreshCarbonStakingZilUsd();
    refreshTotalStakingZilUsd();

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

function onZilswapDexStatusLoaded(dataObject, account = null) {
    for (const key in zrcTokenPropertiesListMap) {
        let zrcTokenProperties = zrcTokenPropertiesListMap[key];
        let zrcTokenAddressBase16 = zrcTokenProperties.address_base16.toLowerCase();

        // To get ZrcTokensPrice in ZIL, already in decimal.
        let zrcTokenPriceInZilNumber = getZrcTokenPriceInZilFromZilswapDexState(dataObject, zrcTokenAddressBase16, zrcTokenProperties.decimals);

        onZrcTokenPriceInZilLoaded(zrcTokenPriceInZilNumber, zrcTokenProperties.ticker);

        let walletAddressBase16 = null;
        if (account) {
            walletAddressBase16 = account.base16.toLowerCase();
        }
        // To get ZilswapLp balance and Total pool status
        let walletPoolStatus = getSingleTokenLpStatusFromZilswapDexState(dataObject, zrcTokenAddressBase16, zrcTokenProperties.decimals, walletAddressBase16);
        onZrcTokenLpBalanceLoaded(walletPoolStatus, zrcTokenProperties.ticker);
    }
}

function onZrcTokenPriceInZilLoaded(zrcTokenPriceInZilNumber, ticker) {
    let publicUserFriendlyZrcTokenPriceInZil = commafyNumberToString(zrcTokenPriceInZilNumber, 2);
    let userFriendlyZrcTokenPriceInZil = convertNumberQaToDecimalString(zrcTokenPriceInZilNumber, /* decimals= */ 0);
    if (!publicUserFriendlyZrcTokenPriceInZil && !userFriendlyZrcTokenPriceInZil) {
        return;
    }
    bindViewZrcTokenPriceInZil(publicUserFriendlyZrcTokenPriceInZil, userFriendlyZrcTokenPriceInZil, ticker)

    refreshZrcTokenPriceUsd()

    // Wallet Balance
    refreshZrcTokenWalletBalanceZilUsd(ticker);
    refreshTotalWalletBalanceZilUsd();

    // Lp balance
    refreshZrcTokenLpBalanceUsd(ticker)
    refreshTotalLpBalanceZilUsd();

    // Lp reward
    if (ticker === 'ZWAP') {
        refreshTotalLpRewardUsd();
    } else if (ticker === 'CARB') {
        // Staking Balance
        refreshCarbonStakingZilUsd();
        refreshTotalStakingZilUsd();
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

    // public total pool container
    let totalPoolZilAmount = convertNumberQaToDecimalString(walletZilswapSingleTokenLpStatus.totalPoolZilAmount, /* decimals= */ 0);
    let totalPoolZrcTokenAmount = convertNumberQaToDecimalString(walletZilswapSingleTokenLpStatus.totalPoolZrcTokenAmount, /* decimals= */ 0);
    bindViewZrcTokenLpTotalPoolBalance(totalPoolZilAmount, totalPoolZrcTokenAmount, ticker);

    // Refresh USD
    refreshZrcTokenLpTotalPoolBalanceUsd(ticker)

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

    // Staking balance
    refreshZilStakingUsd(ssnAddress)
    refreshTotalStakingZilUsd();

    // Net worth
    refreshNetWorthZilUsd();
}

function onZilStakingWithdrawalPendingBalanceLoaded(blockNumberToBalanceMap) {
    let totalZilQa = 0;
    for (let blockNumber in blockNumberToBalanceMap) {
        let zilBalanceQa = parseInt(blockNumberToBalanceMap[blockNumber]);
        if (zilBalanceQa) {
            totalZilQa += zilBalanceQa;
        }
    }

    let userFriendlyZilWithdrawalString = convertNumberQaToDecimalString(totalZilQa, /* decimals= */ 12);
    bindViewZilStakingWithdrawalPendingBalance(userFriendlyZilWithdrawalString);

    // Staking balance
    refreshZilStakingWithdrawalPendingUsd();
    refreshTotalStakingZilUsd();

    // Net worth
    refreshNetWorthZilUsd();
}

function onCarbonStakingBalanceLoaded(carbonBalanceQa) {
    let userFriendlyCarbonStakingBalanceString = convertNumberQaToDecimalString(parseInt(carbonBalanceQa),zrcTokenPropertiesListMap['CARB'].decimals);
    if (!userFriendlyCarbonStakingBalanceString) {
        return;
    }
    bindViewCarbonStakingBalance(userFriendlyCarbonStakingBalanceString);

    // Staking balance
    refreshCarbonStakingZilUsd();
    refreshTotalStakingZilUsd();

    // Net worth
    refreshNetWorthZilUsd();
}

/**
 * --------------------------------------------------------------------------------
 */

/**
 * Obtain the contents of a view, parse it into a number, and return the number.
 * 
 * If the view is not parseable as a number, return null.
 * 
 * @returns {?number} The number reprentation of the view content, otherwise null.
 */
function getNumberFromView(viewId) {
    let viewContent = $(viewId + ":first").text();
    let contentInNumber = parseFloatFromCommafiedNumberString(viewContent);
    if (!contentInNumber) {
        return null;
    }
    return contentInNumber;
}

function refreshZilWalletBalanceUsd() {
    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    let zilBalance = getNumberFromView('#zil_balance');
    if (!zilBalance) {
        return;
    }

    let zilBalanceUsd = (usdPrice * zilBalance);
    bindViewZilBalanceUsd(commafyNumberToString(zilBalanceUsd));
}

function refreshZrcTokenPriceUsd() {
    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    for (let ticker in zrcTokenPropertiesListMap) {
        let zrcTokenPriceInZil = getNumberFromView('#' + ticker + '_price_zil');
        if (!zrcTokenPriceInZil) {
            return;
        }
        let zrcTokenPriceInUsd = 1.0 * usdPrice * zrcTokenPriceInZil;
        let zrcTokenPriceInUsdString = commafyNumberToString(zrcTokenPriceInUsd, /* decimals= */ 2);
        bindViewZrcTokenPriceInUsd(zrcTokenPriceInUsdString, ticker);
    }
}

function refreshZrcTokenWalletBalanceZilUsd(ticker) {

    let zrcTokenPriceInZil = getNumberFromView('#' + ticker + '_price_zil');
    if (!zrcTokenPriceInZil) {
        return;
    }

    let zrcTokenBalance = getNumberFromView('#' + ticker + '_balance');
    if (!zrcTokenBalance) {
        return;
    }

    let zrcTokenBalanceZil = 1.0 * zrcTokenPriceInZil * zrcTokenBalance;
    let zrcTokenBalanceZilString = convertNumberQaToDecimalString(zrcTokenBalanceZil, /* decimals= */ 0);
    bindViewZrcTokenWalletBalanceZil(zrcTokenBalanceZilString, ticker);

    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    let zrcTokenBalanceUsd = 1.0 * usdPrice * zrcTokenBalanceZil;
    let zrcTokenBalanceUsdString = commafyNumberToString(zrcTokenBalanceUsd);
    bindViewZrcTokenWalletBalanceUsd(zrcTokenBalanceUsdString, ticker);
}

function refreshTotalWalletBalanceZilUsd() {
    // Sum balance in ZIL.
    let totalZil = 0;

    let zil = getNumberFromView('#zil_balance');
    if (zil) {
        totalZil += zil;
    }

    for (let ticker in zrcTokenPropertiesListMap) {
        let zrcZil = getNumberFromView('#' + ticker + '_balance_zil');
        if (zrcZil) {
            totalZil += zrcZil;
        }
    }

    let totalWalletBalanceZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalWalletBalanceZil(totalWalletBalanceZil);

    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    // Sum balance in USD
    let totalUsd = 1.0 * totalZil * usdPrice;
    let totalWalletBalanceUsd = commafyNumberToString(totalUsd);
    bindViewTotalWalletBalanceUsd(totalWalletBalanceUsd);
}

function refreshZrcTokenLpTotalPoolBalanceUsd(ticker) {

    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    let zilLpBalance = getNumberFromView('#' + ticker + '_lp_total_pool_zil');
    if (!zilLpBalance) {
        return;
    }

    // total worth is always times 2 (e.g., ZRC2-ZIL pair always have 50:50 value).
    // For now ZilSwap only support 50-50 weight pair.
    let lpTotalPoolBalanceUsd = 1.0 * usdPrice * (zilLpBalance * 2.0);
    let lpTotalPoolBalanceUsdString = commafyNumberToString(lpTotalPoolBalanceUsd, /* decimals= */ 0);
    bindViewZrcTokenLpTotalPoolBalanceUsd(lpTotalPoolBalanceUsdString, ticker);
}

function refreshZrcTokenLpBalanceUsd(ticker) {

    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    let zilLpBalance = getNumberFromView('#' + ticker + '_lp_zil_balance');
    if (!zilLpBalance) {
        return;
    }

    // total worth is always times 2 (e.g., ZRC2-ZIL pair always have 50:50 value).
    // For now ZilSwap only support 50-50 weight pair.
    let lpBalanceUsd = 1.0 * usdPrice * (zilLpBalance * 2.0);
    let lpBalanceUsdString = commafyNumberToString(lpBalanceUsd);
    bindViewZrcTokenLpBalanceUsd(lpBalanceUsdString, ticker);
}


function refreshTotalLpBalanceZilUsd() {
    // Sum balance in ZIL.
    let totalZil = 0;
    for (let ticker in zrcTokenPropertiesListMap) {
        let lpZil = getNumberFromView('#' + ticker + '_lp_zil_balance');
        if (lpZil) {
            // total worth is always times 2 (e.g., ZRC2-ZIL pair always have 50:50 value)
            // For now ZilSwap only support 50-50 weight pair.
            totalZil += (lpZil * 2.0);
        }
    }
    let totalLpBalanceZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalLpBalanceZil(totalLpBalanceZil);

    // Sum balance in USD.
    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }
    let totalUsd = 1.0 * totalZil * usdPrice;
    let totalLpBalanceUsd = commafyNumberToString(totalUsd);
    bindViewTotalLpBalanceUsd(totalLpBalanceUsd);
}

function refreshZilStakingUsd(ssnAddress) {
    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    let zilStakingBalance = getNumberFromView('#' + ssnAddress + '_zil_staking_balance');
    if (!zilStakingBalance) {
        return;
    }

    let zilStakingBalanceUsd = 1.0 * usdPrice * zilStakingBalance;
    let zilStakingBalanceUsdString = commafyNumberToString(zilStakingBalanceUsd);
    bindViewZilStakingBalanceUsd(zilStakingBalanceUsdString, ssnAddress);
}

function refreshZilStakingWithdrawalPendingUsd() {
    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    let zilStakingWithdrawalBalance = getNumberFromView('#zil_staking_withdrawal_pending_balance');
    if (!zilStakingWithdrawalBalance) {
        return;
    }

    let zilStakingWithdrawalBalanceUsd = 1.0 * usdPrice * zilStakingWithdrawalBalance;
    let zilStakingWithdrawalBalanceUsdString = commafyNumberToString(zilStakingWithdrawalBalanceUsd);
    bindViewZilStakingWithdrawalPendingBalanceUsd(zilStakingWithdrawalBalanceUsdString);
}

function refreshCarbonStakingZilUsd() {

    let carbonPriceInZil = getNumberFromView('#' + zrcTokenPropertiesListMap['CARB'].ticker + '_price_zil');
    if (!carbonPriceInZil) {
        return;
    }

    let carbonStakingBalance = getNumberFromView('#carbon_staking_balance');
    if (!carbonStakingBalance) {
        return;
    }

    let carbonStakingBalanceZil = 1.0 * carbonPriceInZil * carbonStakingBalance;
    let carbonStakingBalanceZilString = convertNumberQaToDecimalString(carbonStakingBalanceZil, /* decimals= */ 0);
    bindViewCarbonStakingBalanceZil(carbonStakingBalanceZilString);

    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    let carbonStakingBalanceUsd = 1.0 * usdPrice * carbonStakingBalanceZil;
    let carbonStakingBalanceUsdString = commafyNumberToString(carbonStakingBalanceUsd);
    bindViewCarbonStakingBalanceUsd(carbonStakingBalanceUsdString);
}

function refreshTotalStakingZilUsd() {
    // ZIL staking sum
    let totalZil = 0;
    for (let ssnAddress in ssnListMap) {
        let stakingZil = getNumberFromView('#' + ssnAddress + '_zil_staking_balance');
        if (stakingZil) {
            totalZil += stakingZil;
        }
    }

    // ZIL staking withdrawal pending sum
    let zilWithdrawalBalance = getNumberFromView('#zil_staking_withdrawal_pending_balance');
    if (zilWithdrawalBalance) {
        totalZil += zilWithdrawalBalance
    }

    // Carbon staking
    let carbonStakingBalanceZil = getNumberFromView('#carbon_staking_balance_zil');
    if (carbonStakingBalanceZil) {
        totalZil += carbonStakingBalanceZil
    }

    let totalStakingBalanceZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalStakingBalanceZil(totalStakingBalanceZil);

    // Sum balance in USD.
    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }
    let totalUsd = 1.0 * totalZil * usdPrice;
    let totalStakingBalanceUsd = commafyNumberToString(totalUsd);
    bindViewTotalStakingBalanceUsd(totalStakingBalanceUsd);
}

function refreshNetWorthZilUsd() {
    // Sum balance in ZIL.
    let totalZil = 0;

    let walletBalanceZil = getNumberFromView('#wallet_balance_zil');
    if (walletBalanceZil) {
        totalZil += walletBalanceZil;
    }

    let lpBalanceZil = getNumberFromView('#lp_balance_zil');
    if (lpBalanceZil) {
        totalZil += lpBalanceZil;
    }

    let zilStakingBalanceZil = getNumberFromView('#staking_balance_zil');
    if (zilStakingBalanceZil) {
        totalZil += zilStakingBalanceZil;
    }
    let totalNetWorthZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalNetWorthZil(totalNetWorthZil);

    // Sum balance in USD.
    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }
    let totalUsd = 1.0 * totalZil * usdPrice;
    let totalNetWorthUsd = commafyNumberToString(totalUsd);
    bindViewTotalNetWorthUsd(totalNetWorthUsd);
}

/**
 * --------------------------------------------------------------------------------
 */

function refreshTotalLpRewardUsd() {
    let ticker = 'ZWAP';

    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    let zrcTokenPriceInZil = getNumberFromView('#' + ticker + '_price_zil');
    if (!zrcTokenPriceInZil) {
        return;
    }

    let rewardBalance = getNumberFromView('#total_all_lp_reward_next_epoch_zwap');
    if (!rewardBalance) {
        return;
    }

    let rewardBalanceUsd = (usdPrice * zrcTokenPriceInZil * rewardBalance);
    let totalAllLpRewardUsd = commafyNumberToString(rewardBalanceUsd);
    bindViewTotalRewardAllLpUsd(totalAllLpRewardUsd);
}
