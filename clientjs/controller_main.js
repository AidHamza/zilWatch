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

    // Wallet Balance
    refreshZilWalletBalanceUsd();
    for (let ticker in zrcTokenPropertiesListMap) {
        refreshZrcTokenWalletBalanceZilUsd(ticker);
    }
    refreshTotalWalletBalanceZilUsd();

    // Lp balance
    for (let ticker in zrcTokenPropertiesListMap) {
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
 * Obtain the contents of a view, parse it into a number, and return the number.
 * 
 * If the view is not parseable as a number, return null.
 * 
 * @returns {?number} The number reprentation of the view content, otherwise null.
 */
function getNumberFromView(viewId) {
    let viewContent = $(viewId).text();
    let contentInNumber = parseFloatFromCommafiedNumberString(viewContent);
    if (!contentInNumber) {
        return null;
    }
    return contentInNumber;
}

function refreshZilWalletBalanceUsd() {
    let usdPrice = getNumberFromView('#zil_price');
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

function refreshZrcTokenWalletBalanceZilUsd(ticker) {

    let zrcTokenPriceInZil = getNumberFromView('#' + ticker + '_price');
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

    let usdPrice = getNumberFromView('#zil_price');
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

    let usdPrice = getNumberFromView('#zil_price');
    if (!usdPrice) {
        return;
    }

    // Sum balance in USD
    let totalUsd = 1.0 * totalZil * usdPrice;
    let totalWalletBalanceUsd = commafyNumberToString(totalUsd);
    bindViewTotalWalletBalanceUsd(totalWalletBalanceUsd);
}

function refreshZrcTokenLpBalanceUsd(ticker) {

    let usdPrice = getNumberFromView('#zil_price');
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
    let usdPrice = getNumberFromView('#zil_price');
    if (!usdPrice) {
        return;
    }
    let totalUsd = 1.0 * totalZil * usdPrice;
    let totalLpBalanceUsd = commafyNumberToString(totalUsd);
    bindViewTotalLpBalanceUsd(totalLpBalanceUsd);
}

function refreshZilStakingUsd(ssnAddress) {
    let usdPrice = getNumberFromView('#zil_price');
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

function refreshTotalZilStakingZilUsd() {
    // Sum balance in ZIL.
    let totalZil = 0;
    for (let ssnAddress in ssnListMap) {
        let stakingZil = getNumberFromView('#' + ssnAddress + '_zil_staking_balance');
        if (stakingZil) {
            totalZil += stakingZil;
        }
    }
    let totalStakingBalanceZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalStakingBalanceZil(totalStakingBalanceZil);

    // Sum balance in USD.
    let usdPrice = getNumberFromView('#zil_price');
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

    let zilStakingBalanceZil = getNumberFromView('#zil_staking_balance_zil');
    if (zilStakingBalanceZil) {
        totalZil += zilStakingBalanceZil;
    }
    let totalNetWorthZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalNetWorthZil(totalNetWorthZil);

    // Sum balance in USD.
    let usdPrice = getNumberFromView('#zil_price');
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

    let usdPrice = getNumberFromView('#zil_price');
    if (!usdPrice) {
        return;
    }

    let zrcTokenPriceInZil = getNumberFromView('#' + ticker + '_price');
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