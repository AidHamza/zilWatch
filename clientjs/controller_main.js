// controller_main.js

/**
 * --------------------------------------------------------------------------------
 */

function onCoinFiatPriceLoaded(currencyCode, coinPriceCoingeckoDataObject) {
    if (!coinPriceCoingeckoDataObject) {
        return;
    }
    let currencySymbol = currencyMap[currencyCode];

    // Get zilliqa price in fiat first to use to compute other coins in ZIL later on
    let zilPriceInFiatFloat = null;
    if (coinPriceCoingeckoDataObject.zilliqa && coinPriceCoingeckoDataObject.zilliqa[currencyCode]) {
        zilPriceInFiatFloat = parseFloat(coinPriceCoingeckoDataObject.zilliqa[currencyCode]);
    }

    for (let coinTicker in coinMap) {
        let coingeckoId = coinMap[coinTicker].coingecko_id;
        if (coinPriceCoingeckoDataObject[coingeckoId] && coinPriceCoingeckoDataObject[coingeckoId][currencyCode]) {
            let coinPriceInFiatFloat = parseFloat(coinPriceCoingeckoDataObject[coingeckoId][currencyCode]);

            if (!coinPriceInFiatFloat) {
                continue;
            }

            let decimals = (zilPriceInFiatFloat > 1000) ? 0 : 2;
            let coinPriceInFiatString = commafyNumberToString(coinPriceInFiatFloat, decimals);
            if (coingeckoId === 'zilliqa') {
                coinPriceInFiatString = convertNumberQaToDecimalString(coinPriceInFiatFloat, /* decimals= */ 0);
            }
            bindViewCoinPriceInFiat(currencySymbol, coinPriceInFiatString, coinTicker);

            // Compute other coins in ZIL.
            let coinPriceInZilFloat = 1.0 * coinPriceInFiatFloat / zilPriceInFiatFloat;
            if (!coinPriceInZilFloat) {
                continue;
            }
            bindViewCoinPriceInZil(commafyNumberToString(coinPriceInZilFloat, 2), coinTicker);
        }
    }

    refreshZrcTokenPriceFiat();

    // Wallet Balance
    refreshZilWalletBalanceFiat();
    for (let ticker in zrcTokenPropertiesListMap) {
        refreshZrcTokenWalletBalanceZilFiat(ticker);
    }
    refreshTotalWalletBalanceZilFiat();

    // Lp balance
    for (let ticker in zrcTokenPropertiesListMap) {
        refreshTotalTradeVolumeFiat(ticker);
        refreshZrcTokenLpTotalPoolBalanceFiat(ticker);
        refreshZrcTokenLpBalanceFiat(ticker);
    }
    refreshTotalLpBalanceZilFiat();

    // Lp reward
    refreshTotalLpRewardFiat();

    // ZIL staking
    for (let ssnAddress in ssnListMap) {
        refreshZilStakingFiat(ssnAddress);
    }
    refreshZilStakingWithdrawalPendingFiat();
    refreshCarbonStakingZilFiat();
    refreshTotalStakingZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
}

function onZilWalletBalanceLoaded(zilBalanceQa) {
    var userFriendlyZilBalance = convertNumberQaToDecimalString(parseInt(zilBalanceQa), /* decimals= */ 12);
    if (!userFriendlyZilBalance) {
        return;
    }
    bindViewZilBalance(userFriendlyZilBalance);

    // Wallet Balance
    refreshZilWalletBalanceFiat();
    refreshTotalWalletBalanceZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
}

function onZilswapDexStatusLoaded(dataObject, walletAddressBase16 = null) {
    if (!dataObject) {
        return;
    }
    for (const key in zrcTokenPropertiesListMap) {
        let zrcTokenProperties = zrcTokenPropertiesListMap[key];
        let zrcTokenAddressBase16 = zrcTokenProperties.address_base16.toLowerCase();

        // To get ZrcTokensPrice in ZIL, already in decimal.
        let zilswapSinglePairPublicStatus = getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, zrcTokenProperties.decimals);
        onZilswapSinglePairPublicStatusLoaded(zilswapSinglePairPublicStatus, zrcTokenProperties.ticker);

        if (!walletAddressBase16) {
            continue;
        }

        // To get ZilswapLp balance and Total pool status
        let walletShareRatio = getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
        let zilswapSinglePairPersonalStatus = new ZilswapSinglePairPersonalStatus(walletShareRatio, zilswapSinglePairPublicStatus);
        onZrcTokenLpBalanceLoaded(zilswapSinglePairPersonalStatus, zrcTokenProperties.ticker);
    }
}

function onZilswapSinglePairPublicStatusLoaded(zilswapSinglePairPublicStatus, ticker) {
    let zrcTokenPriceInZilNumber = zilswapSinglePairPublicStatus.zrcTokenPriceInZil;

    let publicUserFriendlyZrcTokenPriceInZil = commafyNumberToString(zrcTokenPriceInZilNumber, 2);
    let userFriendlyZrcTokenPriceInZil = convertNumberQaToDecimalString(zrcTokenPriceInZilNumber, /* decimals= */ 0);
    bindViewZrcTokenPriceInZil(publicUserFriendlyZrcTokenPriceInZil, userFriendlyZrcTokenPriceInZil, ticker)
    refreshZrcTokenPriceFiat()

    // public total pool container
    let totalPoolZilAmount = convertNumberQaToDecimalString(zilswapSinglePairPublicStatus.totalPoolZilAmount, /* decimals= */ 0);
    let totalPoolZrcTokenAmount = convertNumberQaToDecimalString(zilswapSinglePairPublicStatus.totalPoolZrcTokenAmount, /* decimals= */ 0);
    bindViewZrcTokenLpTotalPoolBalance(totalPoolZilAmount, totalPoolZrcTokenAmount, ticker);
    refreshZrcTokenLpTotalPoolBalanceFiat(ticker)

    // Wallet Balance
    refreshZrcTokenWalletBalanceZilFiat(ticker);
    refreshTotalWalletBalanceZilFiat();

    // Lp balance
    refreshZrcTokenLpBalanceFiat(ticker)
    refreshTotalLpBalanceZilFiat();

    // Lp reward
    if (ticker === 'ZWAP') {
        refreshTotalLpRewardFiat();
    } else if (ticker === 'CARB') {
        // Staking Balance
        refreshCarbonStakingZilFiat();
        refreshTotalStakingZilFiat();
    }

    // Net worth
    refreshNetWorthZilFiat();
}

function onZrcTokenWalletBalanceLoaded(zrcTokenBalanceNumberQa, zrcTokenProperties) {
    let userFriendlyZrcTokenBalanceString = convertNumberQaToDecimalString(zrcTokenBalanceNumberQa, zrcTokenProperties.decimals);
    if (!userFriendlyZrcTokenBalanceString) {
        return;
    }
    bindViewZrcTokenWalletBalance(userFriendlyZrcTokenBalanceString, zrcTokenProperties.ticker);

    // Wallet Balance
    refreshZrcTokenWalletBalanceZilFiat(zrcTokenProperties.ticker);
    refreshTotalWalletBalanceZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
}

function onTotalLpRewardNextEpochLoaded() {
    refreshTotalLpRewardFiat();
}

function onZrcTokenLpBalanceLoaded(zilswapSinglePairPersonalStatus, ticker) {
    if (!zilswapSinglePairPersonalStatus) {
        return;
    }
    let poolSharePercent = parseFloat((zilswapSinglePairPersonalStatus.shareRatio) * 100).toPrecision(3);
    let zilAmount = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus.zilAmount, /* decimals= */ 0);
    let zrcTokenAmount = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus.zrcTokenAmount, /* decimals= */ 0);

    if (!poolSharePercent || !zilAmount || !zrcTokenAmount) {
        return;
    }
    bindViewZrcTokenLpBalance(poolSharePercent, zilAmount, zrcTokenAmount, ticker);

    // Lp balance
    refreshZrcTokenLpBalanceFiat(ticker)
    refreshTotalLpBalanceZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
}

function onZilStakingBalanceLoaded(zilBalanceQa, ssnAddress) {
    let userFriendlyZilStakingBalanceString = convertNumberQaToDecimalString(parseInt(zilBalanceQa), /* decimals= */ 12);
    if (!userFriendlyZilStakingBalanceString) {
        return;
    }
    bindViewZilStakingBalance(userFriendlyZilStakingBalanceString, ssnAddress);

    // Staking balance
    refreshZilStakingFiat(ssnAddress)
    refreshTotalStakingZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
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
    refreshZilStakingWithdrawalPendingFiat();
    refreshTotalStakingZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
}

function onCarbonStakingBalanceLoaded(carbonBalanceQa) {
    let userFriendlyCarbonStakingBalanceString = convertNumberQaToDecimalString(parseInt(carbonBalanceQa),zrcTokenPropertiesListMap['CARB'].decimals);
    if (!userFriendlyCarbonStakingBalanceString) {
        return;
    }
    bindViewCarbonStakingBalance(userFriendlyCarbonStakingBalanceString);

    // Staking balance
    refreshCarbonStakingZilFiat();
    refreshTotalStakingZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
}

function onLpTradeVolumeLoaded(poolVolumeArray) {
    if (!poolVolumeArray) {
        return;
    }
    poolToVolumeMap = {}
    for (let i = 0; i < poolVolumeArray.length; i++) {
        let key = poolVolumeArray[i].pool;
        poolToVolumeMap[key] = poolVolumeArray[i];
    }

    for (let ticker in zrcTokenPropertiesListMap) {
        let contractAddress = zrcTokenPropertiesListMap[ticker].address;
        let volumeList = poolToVolumeMap[contractAddress];
        if (volumeList) {
            let inZilAmount = parseInt(volumeList.in_zil_amount);
            let outZilAmount = parseInt(volumeList.out_zil_amount);
            let totalVolumeZilAmount = inZilAmount + outZilAmount;

            let totalVolumeZilAmountString = convertNumberQaToDecimalString(totalVolumeZilAmount, /* decimals= */ 12);
            bindViewTotalTradeVolumeZil(totalVolumeZilAmountString, ticker);

            refreshTotalTradeVolumeFiat(ticker);
        }
    }
}

/**
 * --------------------------------------------------------------------------------
 */

function refreshZilWalletBalanceFiat() {
    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1) ? 0 : 2;

    let zilBalance = getNumberFromView('#zil_balance');
    if (!zilBalance) {
        return;
    }

    let zilBalanceFiat = (fiatPrice * zilBalance);
    bindViewZilBalanceFiat(commafyNumberToString(zilBalanceFiat, decimals));
}

function refreshZrcTokenPriceFiat() {
    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1000) ? 0 : 2;

    for (let ticker in zrcTokenPropertiesListMap) {
        let zrcTokenPriceInZil = getNumberFromView('#' + ticker + '_price_zil');
        if (!zrcTokenPriceInZil) {
            return;
        }
        let zrcTokenPriceInFiat = 1.0 * fiatPrice * zrcTokenPriceInZil;
        let zrcTokenPriceInFiatString = commafyNumberToString(zrcTokenPriceInFiat, decimals);
        bindViewZrcTokenPriceInFiat(zrcTokenPriceInFiatString, ticker);
    }
}

function refreshZrcTokenWalletBalanceZilFiat(ticker) {

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

    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1) ? 0 : 2;

    let zrcTokenBalanceFiat = 1.0 * fiatPrice * zrcTokenBalanceZil;
    let zrcTokenBalanceFiatString = commafyNumberToString(zrcTokenBalanceFiat, decimals);
    bindViewZrcTokenWalletBalanceFiat(zrcTokenBalanceFiatString, ticker);
}

function refreshTotalWalletBalanceZilFiat() {
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

    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1) ? 0 : 2;

    // Sum balance in USD
    let totalFiat = 1.0 * totalZil * fiatPrice;
    let totalWalletBalanceFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalWalletBalanceFiat(totalWalletBalanceFiat);
}

function refreshZrcTokenLpTotalPoolBalanceFiat(ticker) {

    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }

    let zilLpBalance = getNumberFromView('#' + ticker + '_lp_total_pool_zil');
    if (!zilLpBalance) {
        return;
    }

    // total worth is always times 2 (e.g., ZRC2-ZIL pair always have 50:50 value).
    // For now ZilSwap only support 50-50 weight pair.
    let lpTotalPoolBalanceFiat = 1.0 * fiatPrice * (zilLpBalance * 2.0);
    let lpTotalPoolBalanceFiatString = commafyNumberToString(lpTotalPoolBalanceFiat, /* decimals= */ 0);
    bindViewZrcTokenLpTotalPoolBalanceFiat(lpTotalPoolBalanceFiatString, ticker);
}

function refreshZrcTokenLpBalanceFiat(ticker) {

    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1) ? 0 : 2;

    let zilLpBalance = getNumberFromView('#' + ticker + '_lp_zil_balance');
    if (!zilLpBalance) {
        return;
    }

    // total worth is always times 2 (e.g., ZRC2-ZIL pair always have 50:50 value).
    // For now ZilSwap only support 50-50 weight pair.
    let lpBalanceFiat = 1.0 * fiatPrice * (zilLpBalance * 2.0);
    let lpBalanceFiatString = commafyNumberToString(lpBalanceFiat, decimals);
    bindViewZrcTokenLpBalanceFiat(lpBalanceFiatString, ticker);
}


function refreshTotalLpBalanceZilFiat() {
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
    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1) ? 0 : 2;

    let totalFiat = 1.0 * totalZil * fiatPrice;
    let totalLpBalanceFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalLpBalanceFiat(totalLpBalanceFiat);
}

function refreshZilStakingFiat(ssnAddress) {
    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1) ? 0 : 2;

    let zilStakingBalance = getNumberFromView('#' + ssnAddress + '_zil_staking_balance');
    if (!zilStakingBalance) {
        return;
    }

    let zilStakingBalanceFiat = 1.0 * fiatPrice * zilStakingBalance;
    let zilStakingBalanceFiatString = commafyNumberToString(zilStakingBalanceFiat, decimals);
    bindViewZilStakingBalanceFiat(zilStakingBalanceFiatString, ssnAddress);
}

function refreshZilStakingWithdrawalPendingFiat() {
    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1) ? 0 : 2;

    let zilStakingWithdrawalBalance = getNumberFromView('#zil_staking_withdrawal_pending_balance');
    if (!zilStakingWithdrawalBalance) {
        return;
    }

    let zilStakingWithdrawalBalanceFiat = 1.0 * fiatPrice * zilStakingWithdrawalBalance;
    let zilStakingWithdrawalBalanceFiatString = commafyNumberToString(zilStakingWithdrawalBalanceFiat, decimals);
    bindViewZilStakingWithdrawalPendingBalanceFiat(zilStakingWithdrawalBalanceFiatString);
}

function refreshCarbonStakingZilFiat() {

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

    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1) ? 0 : 2;

    let carbonStakingBalanceFiat = 1.0 * fiatPrice * carbonStakingBalanceZil;
    let carbonStakingBalanceFiatString = commafyNumberToString(carbonStakingBalanceFiat, decimals);
    bindViewCarbonStakingBalanceFiat(carbonStakingBalanceFiatString);
}

function refreshTotalStakingZilFiat() {
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
    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1) ? 0 : 2;

    let totalFiat = 1.0 * totalZil * fiatPrice;
    let totalStakingBalanceFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalStakingBalanceFiat(totalStakingBalanceFiat);
}

function refreshNetWorthZilFiat() {
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
    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }
    let decimals = (fiatPrice > 1) ? 0 : 2;

    let totalFiat = 1.0 * totalZil * fiatPrice;
    let totalNetWorthFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalNetWorthFiat(totalNetWorthFiat);
}

/**
 * --------------------------------------------------------------------------------
 */

function refreshTotalTradeVolumeFiat(ticker) {
    let fiatPrice = getNumberFromView('.ZIL_price_fiat');
    if (!fiatPrice) {
        return;
    }

    let totalVolumeZil = getNumberFromView('#' + ticker + '_lp_total_volume_zil');
    if (!totalVolumeZil) {
        return;
    }

    let totalVolumeFiat = (1.0 * fiatPrice * totalVolumeZil);
    let totalVolumeFiatString = commafyNumberToString(totalVolumeFiat, /* decimals= */ 0);
    bindViewTotalTradeVolumeFiat(totalVolumeFiatString, ticker);
}
