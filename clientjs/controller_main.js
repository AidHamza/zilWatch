// controller_main.js

/**
 * --------------------------------------------------------------------------------
 */

function onCoinFiatPriceLoaded(currencyCode, coinPriceCoingeckoDataObject) {
    if (!coinPriceCoingeckoDataObject) {
        return;
    }
    let currencySymbol = currencyMap[currencyCode];

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
    refreshPrevTotalLpRewardFiat();

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

        // To get pool status and zrc token price in ZIL, for values 24h ago
        let zilswapSinglePairPublicStatus24hAgo = null;
        if (zilswapDexSmartContractState24hAgoData) {
            zilswapSinglePairPublicStatus24hAgo = getZilswapSinglePairPublicStatusFromDexState(zilswapDexSmartContractState24hAgoData, zrcTokenAddressBase16, zrcTokenProperties.decimals);
        }

        // To get pool status and zrc token price in ZIL
        let zilswapSinglePairPublicStatus = getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, zrcTokenProperties.decimals);

        onZilswapSinglePairPublicStatusLoaded(zilswapSinglePairPublicStatus24hAgo, zilswapSinglePairPublicStatus, zrcTokenProperties.ticker);

        if (!walletAddressBase16) {
            continue;
        }

        // To get ZilswapLp balance and Total pool status
        let walletShareRatio = getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
        let zilswapSinglePairPersonalStatus = new ZilswapSinglePairPersonalStatus(walletShareRatio, zilswapSinglePairPublicStatus);
        
        // To getZilswapLp balance and share ratio 24h ago
        let zilswapSinglePairPersonalStatus24hAgo = null;
        if (zilswapDexSmartContractState24hAgoData && zilswapDexSmartContractState24hAgoData.result && zilswapSinglePairPublicStatus24hAgo) {
            zilswapDexSmartContractState24hAgoData.result.balances = dataObject.result.balances;
            let walletShareRatio24hAgo = getZilswapSinglePairShareRatio(zilswapDexSmartContractState24hAgoData, zrcTokenAddressBase16, walletAddressBase16);
            zilswapSinglePairPersonalStatus24hAgo = new ZilswapSinglePairPersonalStatus(walletShareRatio24hAgo, zilswapSinglePairPublicStatus24hAgo);
        }

        onZrcTokenLpBalanceLoaded(zilswapSinglePairPersonalStatus24hAgo, zilswapSinglePairPersonalStatus, zrcTokenProperties.ticker);
    }
}

function onZilswapSinglePairPublicStatusLoaded( /* nullable */ zilswapSinglePairPublicStatus24hAgo, zilswapSinglePairPublicStatus, ticker) {
    if (zilswapSinglePairPublicStatus24hAgo) {
        let zrcTokenPriceInZilNumber24hAgo = zilswapSinglePairPublicStatus24hAgo.zrcTokenPriceInZil;
        let userFriendlyZrcTokenPriceInZil24hAgo = convertNumberQaToDecimalString(zrcTokenPriceInZilNumber24hAgo, /* decimals= */ 0);
        bindViewZrcTokenPriceInZil24hAgo(userFriendlyZrcTokenPriceInZil24hAgo, ticker);
    }

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
        refreshPrevTotalLpRewardFiat();
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
    refreshPrevTotalLpRewardFiat();
}

function onZrcTokenLpBalanceLoaded(/* nullable */ zilswapSinglePairPersonalStatus24hAgo, zilswapSinglePairPersonalStatus, ticker) {
    if (!zilswapSinglePairPersonalStatus) {
        return;
    }
    let poolSharePercent = parseFloat((zilswapSinglePairPersonalStatus.shareRatio) * 100).toPrecision(3);
    let zilAmount = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus.zilAmount, /* decimals= */ 0);
    let zrcTokenAmount = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus.zrcTokenAmount, /* decimals= */ 0);
    let balanceInZilAmount = convertNumberQaToDecimalString(2.0 * zilswapSinglePairPersonalStatus.zilAmount, /* decimals= */ 0);

    if (!poolSharePercent || !zilAmount || !zrcTokenAmount || !balanceInZilAmount) {
        return;
    }
    bindViewZrcTokenLpBalance(poolSharePercent, zilAmount, zrcTokenAmount, balanceInZilAmount, ticker);

    // If there is a 24h ago data
    if (zilswapSinglePairPersonalStatus24hAgo) {
        let poolSharePercent24hAgo = parseFloat((zilswapSinglePairPersonalStatus24hAgo.shareRatio) * 100).toPrecision(3);
        let zilAmount24hAgo = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus24hAgo.zilAmount, /* decimals= */ 0);
        let zrcTokenAmount24hAgo = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus24hAgo.zrcTokenAmount, /* decimals= */ 0);
        let balanceInZilAmount24hAgo = convertNumberQaToDecimalString(2.0 * zilswapSinglePairPersonalStatus24hAgo.zilAmount, /* decimals= */ 0);
        let balanceInZilPercentChange24h = getPercentChange(zilswapSinglePairPersonalStatus.zilAmount, zilswapSinglePairPersonalStatus24hAgo.zilAmount).toFixed(1);

        if (poolSharePercent24hAgo && zilAmount24hAgo && zrcTokenAmount24hAgo && balanceInZilAmount24hAgo) {
            bindViewZrcTokenLpBalance24hAgo(poolSharePercent24hAgo, zilAmount24hAgo, zrcTokenAmount24hAgo, balanceInZilAmount24hAgo, balanceInZilPercentChange24h, ticker);
        }
    }

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
    let userFriendlyCarbonStakingBalanceString = convertNumberQaToDecimalString(parseInt(carbonBalanceQa), zrcTokenPropertiesListMap['CARB'].decimals);
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

    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let zilBalance = getNumberFromView('#zil_balance');
    if (!zilBalance) {
        return;
    }

    let zilBalanceFiat = (zilPriceInFiatFloat * zilBalance);
    bindViewZilBalanceFiat(commafyNumberToString(zilBalanceFiat, decimals));

    // Set token wallet balance in fiat 24h ago
    if (zilPriceInFiat24hAgoFloat) {
        let zilBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zilBalance;
        let zilBalanceFiat24hAgoString = commafyNumberToString(zilBalanceFiat24hAgo, decimals);
        let zilBalanceFiatPercentChange24h = getPercentChange(zilBalanceFiat, zilBalanceFiat24hAgo).toFixed(1);
        bindViewZilBalanceFiat24hAgo(zilBalanceFiat24hAgoString, zilBalanceFiatPercentChange24h);
    }
}

function refreshZrcTokenPriceFiat() {
    let decimals = (zilPriceInFiatFloat > 1000) ? 0 : 2;

    for (let ticker in zrcTokenPropertiesListMap) {
        let zrcTokenPriceInZil = getNumberFromView('.' + ticker + '_price_zil');
        if (!zrcTokenPriceInZil) {
            return;
        }
        let zrcTokenPriceInFiat = 1.0 * zilPriceInFiatFloat * zrcTokenPriceInZil;
        let zrcTokenPriceInFiatString = commafyNumberToString(zrcTokenPriceInFiat, decimals);
        bindViewZrcTokenPriceInFiat(zrcTokenPriceInFiatString, ticker);
    }
}

function refreshZrcTokenWalletBalanceZilFiat(ticker) {

    let zrcTokenPriceInZil = getNumberFromView('.' + ticker + '_price_zil');
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

    // Set token wallet balance in ZIL 24h ago
    let zrcTokenPriceInZil24hAgo = getNumberFromView('.' + ticker + '_price_zil_24h_ago');
    let zrcTokenBalanceZil24hAgo = null;
    if (zrcTokenPriceInZil24hAgo) {
        zrcTokenBalanceZil24hAgo = 1.0 * zrcTokenPriceInZil24hAgo * zrcTokenBalance;
        let zrcTokenBalanceZil24hAgoString = convertNumberQaToDecimalString(zrcTokenBalanceZil24hAgo, /* decimals= */ 0);
        let zrcTokenInZilPercentChange24h = getPercentChange(zrcTokenBalanceZil, zrcTokenBalanceZil24hAgo);
        bindViewZrcTokenWalletBalanceZil24hAgo(zrcTokenBalanceZil24hAgoString, zrcTokenInZilPercentChange24h.toFixed(1), ticker);
    }

    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let zrcTokenBalanceFiat = 1.0 * zilPriceInFiatFloat * zrcTokenBalanceZil;
    let zrcTokenBalanceFiatString = commafyNumberToString(zrcTokenBalanceFiat, decimals);
    bindViewZrcTokenWalletBalanceFiat(zrcTokenBalanceFiatString, ticker);

    // Set token wallet balance in fiat 24h ago
    if (zilPriceInFiat24hAgoFloat && zrcTokenBalanceZil24hAgo) {
        let zrcTokenBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zrcTokenBalanceZil24hAgo;
        let zrcTokenBalanceFiat24hAgoString = commafyNumberToString(zrcTokenBalanceFiat24hAgo, decimals);
        let zrcTokenBalanceFiatPercentChange24h = getPercentChange(zrcTokenBalanceFiat, zrcTokenBalanceFiat24hAgo);
        bindViewZrcTokenWalletBalanceFiat24hAgo(zrcTokenBalanceFiat24hAgoString, zrcTokenBalanceFiatPercentChange24h.toFixed(1), ticker);
    }
}

function refreshTotalWalletBalanceZilFiat() {
    // Sum balance in ZIL.
    let totalZil = 0;
    let totalZil24hAgo = 0;

    let zil = getNumberFromView('#zil_balance');
    if (zil) {
        totalZil += zil;
        totalZil24hAgo += zil;
    }

    for (let ticker in zrcTokenPropertiesListMap) {
        let zrcZil = getNumberFromView('#' + ticker + '_balance_zil');
        if (zrcZil) {
            totalZil += zrcZil;
        }
        let zrcZil24hAgo = getNumberFromView('#' + ticker + '_balance_zil_24h_ago');
        if (zrcZil24hAgo) {
            totalZil24hAgo += zrcZil24hAgo;
        }
    }

    let totalWalletBalanceZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalWalletBalanceZil(totalWalletBalanceZil);
    let totalWalletBalanceZil24hAgo = convertNumberQaToDecimalString(totalZil24hAgo, /* decimals= */ 0);
    let totalWalletBalanceZilPercentChange24h = getPercentChange(totalZil, totalZil24hAgo).toFixed(1);
    bindViewTotalWalletBalanceZil24hAgo(totalWalletBalanceZil24hAgo, totalWalletBalanceZilPercentChange24h);

    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    // Sum balance in USD
    let totalFiat = 1.0 * totalZil * zilPriceInFiatFloat;
    let totalWalletBalanceFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalWalletBalanceFiat(totalWalletBalanceFiat);

    if (zilPriceInFiat24hAgoFloat) {
        let totalFiat24hAgo = 1.0 * totalZil24hAgo * zilPriceInFiat24hAgoFloat;
        let totalWalletBalanceFiat24hAgo = commafyNumberToString(totalFiat24hAgo, decimals);
        let totalWalletBalanceFiatPercentChange24h = getPercentChange(totalFiat, totalFiat24hAgo).toFixed(1);
        bindViewTotalWalletBalanceFiat24hAgo(totalWalletBalanceFiat24hAgo, totalWalletBalanceFiatPercentChange24h);
    }
}

function refreshZrcTokenLpTotalPoolBalanceFiat(ticker) {

    if (!zilPriceInFiatFloat) {
        return;
    }

    let zilLpBalance = getNumberFromView('#' + ticker + '_lp_total_pool_zil');
    if (!zilLpBalance) {
        return;
    }

    // total worth is always times 2 (e.g., ZRC2-ZIL pair always have 50:50 value).
    // For now ZilSwap only support 50-50 weight pair.
    let lpTotalPoolBalanceFiat = 1.0 * zilPriceInFiatFloat * (zilLpBalance * 2.0);
    let lpTotalPoolBalanceFiatString = commafyNumberToString(lpTotalPoolBalanceFiat, /* decimals= */ 0);
    bindViewZrcTokenLpTotalPoolBalanceFiat(lpTotalPoolBalanceFiatString, ticker);
}

function refreshZrcTokenLpBalanceFiat(ticker) {
    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let lpBalanceInZil = getNumberFromView('#' + ticker + '_lp_balance_zil');
    if (!lpBalanceInZil) {
        return;
    }

    let lpBalanceFiat = 1.0 * zilPriceInFiatFloat * lpBalanceInZil;
    let lpBalanceFiatString = commafyNumberToString(lpBalanceFiat, decimals);
    bindViewZrcTokenLpBalanceFiat(lpBalanceFiatString, ticker);

    if (zilPriceInFiat24hAgoFloat) {
        let lpBalanceInZil24hAgo = getNumberFromView('#' + ticker + '_lp_balance_zil_24h_ago');
        if (!lpBalanceInZil24hAgo) {
            return;
        }
        let lpBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * lpBalanceInZil24hAgo;
        let lpBalanceFiat24hAgoString = commafyNumberToString(lpBalanceFiat24hAgo, decimals);
        let lpBalanceFiatPercentChange24h = getPercentChange(lpBalanceFiat, lpBalanceFiat24hAgo).toFixed(1);
        bindViewZrcTokenLpBalanceFiat24hAgo(lpBalanceFiat24hAgoString, lpBalanceFiatPercentChange24h, ticker);
    }
}


function refreshTotalLpBalanceZilFiat() {
    // Sum balance in ZIL.
    let totalZil = 0;
    let totalZil24hAgo = 0;
    for (let ticker in zrcTokenPropertiesListMap) {
        let lpZil = getNumberFromView('#' + ticker + '_lp_balance_zil');
        if (lpZil) {
            totalZil += lpZil;
        }
        let lpZil24hAgo = getNumberFromView('#' + ticker + '_lp_balance_zil_24h_ago');
        if (lpZil24hAgo) {
            totalZil24hAgo += lpZil24hAgo;
        }
    }
    let totalLpBalanceZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalLpBalanceZil(totalLpBalanceZil);
    let totalLpBalanceZil24hAgo = convertNumberQaToDecimalString(totalZil24hAgo, /* decimals= */ 0);
    let totalLpBalanceZilPercentChange24h = getPercentChange(totalZil, totalZil24hAgo).toFixed(1);
    bindViewTotalLpBalanceZil24hAgo(totalLpBalanceZil24hAgo, totalLpBalanceZilPercentChange24h);

    // Sum balance in USD.
    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let totalFiat = 1.0 * totalZil * zilPriceInFiatFloat;
    let totalLpBalanceFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalLpBalanceFiat(totalLpBalanceFiat);

    if (zilPriceInFiat24hAgoFloat) {
        let totalFiat24hAgo = 1.0 * totalZil24hAgo * zilPriceInFiat24hAgoFloat;
        let totalLpBalanceFiat24hAgo = commafyNumberToString(totalFiat24hAgo, decimals);
        let totalLpBalanceFiatPercentChange24h = getPercentChange(totalFiat, totalFiat24hAgo).toFixed(1);
        bindViewTotalLpBalanceFiat24hAgo(totalLpBalanceFiat24hAgo, totalLpBalanceFiatPercentChange24h);
    }
}

function refreshZilStakingFiat(ssnAddress) {
    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let zilStakingBalance = getNumberFromView('#' + ssnAddress + '_zil_staking_balance');
    if (!zilStakingBalance) {
        return;
    }

    let zilStakingBalanceFiat = 1.0 * zilPriceInFiatFloat * zilStakingBalance;
    let zilStakingBalanceFiatString = commafyNumberToString(zilStakingBalanceFiat, decimals);
    bindViewZilStakingBalanceFiat(zilStakingBalanceFiatString, ssnAddress);

    if (zilPriceInFiat24hAgoFloat) {
        let zilStakingBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zilStakingBalance;
        let zilStakingBalanceFiat24hAgoString = commafyNumberToString(zilStakingBalanceFiat24hAgo, decimals);
        let zilStakingBalanceFiatPercentChange24h = getPercentChange(zilStakingBalanceFiat, zilStakingBalanceFiat24hAgo).toFixed(1);
        bindViewZilStakingBalanceFiat24hAgo(zilStakingBalanceFiat24hAgoString, zilStakingBalanceFiatPercentChange24h, ssnAddress);
    }
}

function refreshZilStakingWithdrawalPendingFiat() {

    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let zilStakingWithdrawalBalance = getNumberFromView('#zil_staking_withdrawal_pending_balance');
    if (!zilStakingWithdrawalBalance) {
        return;
    }

    let zilStakingWithdrawalBalanceFiat = 1.0 * zilPriceInFiatFloat * zilStakingWithdrawalBalance;
    let zilStakingWithdrawalBalanceFiatString = commafyNumberToString(zilStakingWithdrawalBalanceFiat, decimals);
    bindViewZilStakingWithdrawalPendingBalanceFiat(zilStakingWithdrawalBalanceFiatString);

    if (zilPriceInFiat24hAgoFloat) {
        let zilStakingWithdrawalBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zilStakingWithdrawalBalance;
        let zilStakingWithdrawalBalanceFiat24hAgoString = commafyNumberToString(zilStakingWithdrawalBalanceFiat24hAgo, decimals);
        let zilStakingWithdrawalBalanceFiatPercentChange24h = getPercentChange(zilStakingWithdrawalBalanceFiat, zilStakingWithdrawalBalanceFiat24hAgo).toFixed(1);
        bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo(zilStakingWithdrawalBalanceFiat24hAgoString, zilStakingWithdrawalBalanceFiatPercentChange24h);
    }
}

function refreshCarbonStakingZilFiat() {

    let carbonPriceInZil = getNumberFromView('.' + zrcTokenPropertiesListMap['CARB'].ticker + '_price_zil');
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

    // Balance in ZIL 24h hour ago
    let carbonPriceInZil24hAgo = getNumberFromView('.' + zrcTokenPropertiesListMap['CARB'].ticker + '_price_zil_24h_ago');
    if (carbonPriceInZil24hAgo) {
        let carbonStakingBalanceZil24hAgo = 1.0 * carbonPriceInZil24hAgo * carbonStakingBalance;
        let carbonStakingBalanceZil24hAgoString = convertNumberQaToDecimalString(carbonStakingBalanceZil24hAgo, /* decimals= */ 0);
        let carbonStakingBalanceZilPercentChange24h = getPercentChange(carbonStakingBalanceZil, carbonStakingBalanceZil24hAgo).toFixed(1);
        bindViewCarbonStakingBalanceZil24hAgo(carbonStakingBalanceZil24hAgoString, carbonStakingBalanceZilPercentChange24h);
    }

    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let carbonStakingBalanceFiat = 1.0 * zilPriceInFiatFloat * carbonStakingBalanceZil;
    let carbonStakingBalanceFiatString = commafyNumberToString(carbonStakingBalanceFiat, decimals);
    bindViewCarbonStakingBalanceFiat(carbonStakingBalanceFiatString);

    if (zilPriceInFiat24hAgoFloat) {
        let carbonStakingBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * carbonStakingBalanceZil;
        let carbonStakingBalanceFiat24hAgoString = commafyNumberToString(carbonStakingBalanceFiat24hAgo, decimals);
        let carbonStakingBalanceFiatPercentChange24h = getPercentChange(carbonStakingBalanceFiat, carbonStakingBalanceFiat24hAgo).toFixed(1);
        bindViewCarbonStakingBalanceFiat24hAgo(carbonStakingBalanceFiat24hAgoString, carbonStakingBalanceFiatPercentChange24h);
    }
}

function refreshTotalStakingZilFiat() {
    // -----------------------------------------------
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

    // -----------------------------------------------
    // Compute Total 24h ago
    // ZIL staking sum
    let totalZil24hAgo = 0;
    for (let ssnAddress in ssnListMap) {
        let stakingZil24hAgo = getNumberFromView('#' + ssnAddress + '_zil_staking_balance');
        if (stakingZil24hAgo) {
            totalZil24hAgo += stakingZil24hAgo;
        }
    }

    // ZIL staking withdrawal pending sum
    let zilWithdrawalBalance24hAgo = getNumberFromView('#zil_staking_withdrawal_pending_balance_24h_ago');
    if (zilWithdrawalBalance24hAgo) {
        totalZil24hAgo += zilWithdrawalBalance24hAgo
    }

    // Carbon staking
    let carbonStakingBalanceZil24hAgo = getNumberFromView('#carbon_staking_balance_zil_24h_ago');
    if (carbonStakingBalanceZil24hAgo) {
        totalZil24hAgo += carbonStakingBalanceZil24hAgo
    }

    let totalStakingBalanceZil24hAgo = convertNumberQaToDecimalString(totalZil24hAgo, /* decimals= */ 0);
    let totalStakingBalanceZilPercentChange24h = getPercentChange(totalZil, totalZil24hAgo).toFixed(1);
    bindViewTotalStakingBalanceZil24hAgo(totalStakingBalanceZil24hAgo, totalStakingBalanceZilPercentChange24h);

    // -----------------------------------------------
    // Sum balance in USD.

    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let totalFiat = 1.0 * totalZil * zilPriceInFiatFloat;
    let totalStakingBalanceFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalStakingBalanceFiat(totalStakingBalanceFiat);

    // -----------------------------------------------
    if (zilPriceInFiat24hAgoFloat) {
        let totalFiat24hAgo = 1.0 * totalZil24hAgo * zilPriceInFiat24hAgoFloat;
        let totalStakingBalanceFiat24hAgo = commafyNumberToString(totalFiat24hAgo, decimals);
        let totalStakingBalanceFiatPercentChange24h = getPercentChange(totalFiat, totalFiat24hAgo).toFixed(1);
        bindViewTotalStakingBalanceFiat24hAgo(totalStakingBalanceFiat24hAgo, totalStakingBalanceFiatPercentChange24h);
    }
}

function refreshNetWorthZilFiat() {
    // -----------------------------------------------
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

    // -----------------------------------------------
     // Sum balance in ZIL.
     let totalZil24hAgo = 0;

     let walletBalanceZil24hAgo = getNumberFromView('#wallet_balance_zil_24h_ago');
     if (walletBalanceZil24hAgo) {
        totalZil24hAgo += walletBalanceZil24hAgo;
     }
 
     let lpBalanceZil24hAgo = getNumberFromView('#lp_balance_zil_24h_ago');
     if (lpBalanceZil24hAgo) {
        totalZil24hAgo += lpBalanceZil24hAgo;
     }
 
     let zilStakingBalanceZil24hAgo = getNumberFromView('#staking_balance_zil_24h_ago');
     if (zilStakingBalanceZil24hAgo) {
        totalZil24hAgo += zilStakingBalanceZil;
     }
     let totalNetWorthZil24hAgo = convertNumberQaToDecimalString(totalZil24hAgo, /* decimals= */ 0);
     let totalNetWorthZilPercentChange24h = getPercentChange(totalZil, totalZil24hAgo).toFixed(1);
     bindViewTotalNetWorthZil24hAgo(totalNetWorthZil24hAgo, totalNetWorthZilPercentChange24h);

    // Sum balance in USD.

    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let totalFiat = 1.0 * totalZil * zilPriceInFiatFloat;
    let totalNetWorthFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalNetWorthFiat(totalNetWorthFiat);

    // -----------------------------------------------
    if (zilPriceInFiat24hAgoFloat) {
        let totalFiat24hAgo = 1.0 * totalZil24hAgo * zilPriceInFiat24hAgoFloat;
        let totalNetWorthFiat24hAgo = commafyNumberToString(totalFiat24hAgo, decimals);
        let totalNetWorthFiatPercentChange24h = getPercentChange(totalFiat, totalFiat24hAgo).toFixed(1);
        bindViewTotalNetWorthFiat24hAgo(totalNetWorthFiat24hAgo, totalNetWorthFiatPercentChange24h);
    }
}

/**
 * --------------------------------------------------------------------------------
 */

function refreshTotalTradeVolumeFiat(ticker) {

    if (!zilPriceInFiatFloat) {
        return;
    }

    let totalVolumeZil = getNumberFromView('#' + ticker + '_lp_total_volume_zil');
    if (!totalVolumeZil) {
        return;
    }

    let totalVolumeFiat = (1.0 * zilPriceInFiatFloat * totalVolumeZil);
    let totalVolumeFiatString = commafyNumberToString(totalVolumeFiat, /* decimals= */ 0);
    bindViewTotalTradeVolumeFiat(totalVolumeFiatString, ticker);
}