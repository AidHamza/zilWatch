// controller_main.js

/**
 * --------------------------------------------------------------------------------
 */

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

function onZrcTokensCirculatingSupplyLoaded() {
    if (!zrcTokensCirculatingSupplyData) {
        return;
    }

    for (let ticker in zrcTokensCirculatingSupplyData) {
        let zrcTokenString = convertNumberQaToDecimalString(parseInt(zrcTokensCirculatingSupplyData[ticker]), zrcTokenPropertiesListMap[ticker].decimals);
        bindViewZrcTokenCirculatingSupply(zrcTokenString, ticker);

        // Circulating supply
        refreshZrcTokenCirculatingSupplyZilFiat(ticker);
    }
}

function onZrcTokensTotalSupplyLoaded() {
    if (!zrcTokensTotalSupplyData) {
        return;
    }

    for (let ticker in zrcTokensTotalSupplyData) {
        let zrcTokenString = convertNumberQaToDecimalString(parseInt(zrcTokensTotalSupplyData[ticker]), zrcTokenPropertiesListMap[ticker].decimals);
        bindViewZrcTokenTotalSupply(zrcTokenString, ticker);

        // Total supply
        refreshZrcTokenTotalSupplyZilFiat(ticker);
    }
}

function refreshZrcTokenCirculatingSupplyZilFiat(ticker) {
    let zrcCirculatingSupply = getNumberFromView('#' + ticker + '_circulating_supply_zrc');
    if (Number.isNaN(zrcCirculatingSupply)) {
        return;
    }
    let zrcTokenPriceInZil = getNumberFromView('.' + ticker + '_price_zil');
    if (Number.isNaN(zrcTokenPriceInZil)) {
        return;
    }
    let zilPriceInFiatFloat = coinPriceStatus.getCoinPriceFiat('ZIL');
    if (!zilPriceInFiatFloat) {
        return;
    }

    let zrcCirculatingSupplyInFiat = 1.0 * zrcCirculatingSupply * zrcTokenPriceInZil * zilPriceInFiatFloat;
    let zrcCirculatingSupplyInFiatString = commafyNumberToString(zrcCirculatingSupplyInFiat, /* decimals= */ 0);
    bindViewZrcTokenCirculatingSupplyFiat(zrcCirculatingSupplyInFiatString, ticker);
}

function refreshZrcTokenTotalSupplyZilFiat(ticker) {
    let zrcTotalSupply = getNumberFromView('#' + ticker + '_total_supply_zrc');
    if (Number.isNaN(zrcTotalSupply)) {
        return;
    }
    let zrcTokenPriceInZil = getNumberFromView('.' + ticker + '_price_zil');
    if (Number.isNaN(zrcTokenPriceInZil)) {
        return;
    }
    let zilPriceInFiatFloat = coinPriceStatus.getCoinPriceFiat('ZIL');
    if (!zilPriceInFiatFloat) {
        return;
    }

    let zrcTotalSupplyInFiat = 1.0 * zrcTotalSupply * zrcTokenPriceInZil * zilPriceInFiatFloat;
    let zrcTotalSupplyInFiatString = commafyNumberToString(zrcTotalSupplyInFiat, /* decimals= */ 0);
    bindViewZrcTokenTotalSupplyFiat(zrcTotalSupplyInFiatString, ticker);
}

/**
 * --------------------------------------------------------------------------------
 */

function refreshTotalWalletBalanceZilFiat() {
    // Sum balance in ZIL.
    let totalZil = 0;
    let totalZil24hAgo = 0;

    let zil = getNumberFromView('#zil_balance');
    if (!Number.isNaN(zil)) {
        totalZil += zil;
        totalZil24hAgo += zil;
    }

    for (let ticker in zrcTokenPropertiesListMap) {
        let zrcZil = getNumberFromView('#' + ticker + '_balance_zil');
        if (!Number.isNaN(zrcZil)) {
            totalZil += zrcZil;
        }
        let zrcZil24hAgo = getNumberFromView('#' + ticker + '_balance_zil_24h_ago');
        if (!Number.isNaN(zrcZil24hAgo)) {
            totalZil24hAgo += zrcZil24hAgo;
        }
    }

    let totalWalletBalanceZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalWalletBalanceZil(totalWalletBalanceZil);

    let zilPriceInFiatFloat = coinPriceStatus.getCoinPriceFiat('ZIL');
    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    // Sum balance in USD
    let totalFiat = 1.0 * totalZil * zilPriceInFiatFloat;
    let totalWalletBalanceFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalWalletBalanceFiat(totalWalletBalanceFiat);

    let zilPriceInFiat24hAgoFloat = coinPriceStatus.getCoinPriceFiat24hAgo('ZIL');
    if (!zilPriceInFiat24hAgoFloat) {
        return;
    }
    let totalWalletBalanceZil24hAgo = convertNumberQaToDecimalString(totalZil24hAgo, /* decimals= */ 0);
    let totalWalletBalanceZilPercentChange24h = getPercentChange(totalZil, totalZil24hAgo).toFixed(1);
    bindViewTotalWalletBalanceZil24hAgo(totalWalletBalanceZil24hAgo, totalWalletBalanceZilPercentChange24h);

    let totalFiat24hAgo = 1.0 * totalZil24hAgo * zilPriceInFiat24hAgoFloat;
    let totalWalletBalanceFiat24hAgo = commafyNumberToString(totalFiat24hAgo, decimals);
    let totalWalletBalanceFiatPercentChange24h = getPercentChange(totalFiat, totalFiat24hAgo).toFixed(1);
    bindViewTotalWalletBalanceFiat24hAgo(totalWalletBalanceFiat24hAgo, totalWalletBalanceFiatPercentChange24h);
}

function refreshTotalLpBalanceZilFiat() {
    // Sum balance in ZIL.
    let totalZil = 0;
    let totalZil24hAgo = 0;
    for (let ticker in zrcTokenPropertiesListMap) {
        let lpZil = getNumberFromView('#' + ticker + '_lp_balance_zil');
        if (!Number.isNaN(lpZil)) {
            totalZil += lpZil;
        }
        let lpZil24hAgo = getNumberFromView('#' + ticker + '_lp_balance_zil_24h_ago');
        if (!Number.isNaN(lpZil24hAgo)) {
            totalZil24hAgo += lpZil24hAgo;
        }
    }
    let totalLpBalanceZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalLpBalanceZil(totalLpBalanceZil);


    // Sum balance in USD.
    let zilPriceInFiatFloat = coinPriceStatus.getCoinPriceFiat('ZIL');
    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let totalFiat = 1.0 * totalZil * zilPriceInFiatFloat;
    let totalLpBalanceFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalLpBalanceFiat(totalLpBalanceFiat);

    let zilPriceInFiat24hAgoFloat = coinPriceStatus.getCoinPriceFiat24hAgo('ZIL');
    if (!zilPriceInFiat24hAgoFloat) {
        return;
    }
    let totalLpBalanceZil24hAgo = convertNumberQaToDecimalString(totalZil24hAgo, /* decimals= */ 0);
    let totalLpBalanceZilPercentChange24h = getPercentChange(totalZil, totalZil24hAgo).toFixed(1);
    bindViewTotalLpBalanceZil24hAgo(totalLpBalanceZil24hAgo, totalLpBalanceZilPercentChange24h);
    
    let totalFiat24hAgo = 1.0 * totalZil24hAgo * zilPriceInFiat24hAgoFloat;
    let totalLpBalanceFiat24hAgo = commafyNumberToString(totalFiat24hAgo, decimals);
    let totalLpBalanceFiatPercentChange24h = getPercentChange(totalFiat, totalFiat24hAgo).toFixed(1);
    bindViewTotalLpBalanceFiat24hAgo(totalLpBalanceFiat24hAgo, totalLpBalanceFiatPercentChange24h);
    
}

function refreshTotalStakingZilFiat() {
    // -----------------------------------------------
    // ZIL staking sum
    let totalZil = 0;
    for (let ssnAddress in ssnListMap) {
        let stakingZil = getNumberFromView('#' + ssnAddress + '_zil_staking_balance');
        if (!Number.isNaN(stakingZil)) {
            totalZil += stakingZil;
        }
    }

    // ZIL staking withdrawal pending sum
    let zilWithdrawalBalance = getNumberFromView('#zil_staking_withdrawal_pending_balance');
    if (!Number.isNaN(zilWithdrawalBalance)) {
        totalZil += zilWithdrawalBalance;
    }

    // Carbon staking
    let carbonStakingBalanceZil = getNumberFromView('#carbon_staking_balance_zil');
    if (!Number.isNaN(carbonStakingBalanceZil)) {
        totalZil += carbonStakingBalanceZil;
    }

    let totalStakingBalanceZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalStakingBalanceZil(totalStakingBalanceZil);

    // -----------------------------------------------
    // Compute Total 24h ago
    // ZIL staking sum
    let totalZil24hAgo = 0;
    for (let ssnAddress in ssnListMap) {
        let stakingZil24hAgo = getNumberFromView('#' + ssnAddress + '_zil_staking_balance');
        if (!Number.isNaN(stakingZil24hAgo)) {
            totalZil24hAgo += stakingZil24hAgo;
        }
    }

    // ZIL staking withdrawal pending sum
    let zilWithdrawalBalance24hAgo = getNumberFromView('#zil_staking_withdrawal_pending_balance');
    if (!Number.isNaN(zilWithdrawalBalance24hAgo)) {
        totalZil24hAgo += zilWithdrawalBalance24hAgo
    }

    // Carbon staking
    let carbonStakingBalanceZil24hAgo = getNumberFromView('#carbon_staking_balance_zil_24h_ago');
    if (!Number.isNaN(carbonStakingBalanceZil24hAgo)) {
        totalZil24hAgo += carbonStakingBalanceZil24hAgo
    }

    // -----------------------------------------------
    // Sum balance in USD.

    let zilPriceInFiatFloat = coinPriceStatus.getCoinPriceFiat('ZIL');
    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let totalFiat = 1.0 * totalZil * zilPriceInFiatFloat;
    let totalStakingBalanceFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalStakingBalanceFiat(totalStakingBalanceFiat);

    // -----------------------------------------------
    let zilPriceInFiat24hAgoFloat = coinPriceStatus.getCoinPriceFiat24hAgo('ZIL');
    if (!zilPriceInFiat24hAgoFloat) {
        return;
    }
    let totalStakingBalanceZil24hAgo = convertNumberQaToDecimalString(totalZil24hAgo, /* decimals= */ 0);
    let totalStakingBalanceZilPercentChange24h = getPercentChange(totalZil, totalZil24hAgo).toFixed(1);
    bindViewTotalStakingBalanceZil24hAgo(totalStakingBalanceZil24hAgo, totalStakingBalanceZilPercentChange24h);
    
    let totalFiat24hAgo = 1.0 * totalZil24hAgo * zilPriceInFiat24hAgoFloat;
    let totalStakingBalanceFiat24hAgo = commafyNumberToString(totalFiat24hAgo, decimals);
    let totalStakingBalanceFiatPercentChange24h = getPercentChange(totalFiat, totalFiat24hAgo).toFixed(1);
    bindViewTotalStakingBalanceFiat24hAgo(totalStakingBalanceFiat24hAgo, totalStakingBalanceFiatPercentChange24h);

}

function refreshNetWorthZilFiat() {
    // -----------------------------------------------
    // Sum balance in ZIL.
    let totalZil = 0;

    let walletBalanceZil = getNumberFromView('#wallet_balance_zil');
    if (!Number.isNaN(walletBalanceZil)) {
        totalZil += walletBalanceZil;
    }

    let lpBalanceZil = getNumberFromView('#lp_balance_zil');
    if (!Number.isNaN(lpBalanceZil)) {
        totalZil += lpBalanceZil;
    }

    let zilStakingBalanceZil = getNumberFromView('#staking_balance_zil');
    if (!Number.isNaN(zilStakingBalanceZil)) {
        totalZil += zilStakingBalanceZil;
    }
    let totalNetWorthZil = convertNumberQaToDecimalString(totalZil, /* decimals= */ 0);
    bindViewTotalNetWorthZil(totalNetWorthZil);

    // -----------------------------------------------
    // Sum balance in ZIL.
    let totalZil24hAgo = 0;

    let walletBalanceZil24hAgo = getNumberFromView('#wallet_balance_zil_24h_ago');
    if (!Number.isNaN(walletBalanceZil24hAgo)) {
        totalZil24hAgo += walletBalanceZil24hAgo;
    }

    let lpBalanceZil24hAgo = getNumberFromView('#lp_balance_zil_24h_ago');
    if (!Number.isNaN(lpBalanceZil24hAgo)) {
        totalZil24hAgo += lpBalanceZil24hAgo;
    }

    let zilStakingBalanceZil24hAgo = getNumberFromView('#staking_balance_zil_24h_ago');
    if (!Number.isNaN(zilStakingBalanceZil24hAgo)) {
        totalZil24hAgo += zilStakingBalanceZil;
    }
    // Sum balance in USD.

    let zilPriceInFiatFloat = coinPriceStatus.getCoinPriceFiat('ZIL');
    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let totalFiat = 1.0 * totalZil * zilPriceInFiatFloat;
    let totalNetWorthFiat = commafyNumberToString(totalFiat, decimals);
    bindViewTotalNetWorthFiat(totalNetWorthFiat);

    // -----------------------------------------------
    let zilPriceInFiat24hAgoFloat = coinPriceStatus.getCoinPriceFiat24hAgo('ZIL');
    if (!zilPriceInFiat24hAgoFloat) {
        return;
    }
    let totalNetWorthZil24hAgo = convertNumberQaToDecimalString(totalZil24hAgo, /* decimals= */ 0);
    let totalNetWorthZilPercentChange24h = getPercentChange(totalZil, totalZil24hAgo).toFixed(1);
    bindViewTotalNetWorthZil24hAgo(totalNetWorthZil24hAgo, totalNetWorthZilPercentChange24h);

    let totalFiat24hAgo = 1.0 * totalZil24hAgo * zilPriceInFiat24hAgoFloat;
    let totalNetWorthFiat24hAgo = commafyNumberToString(totalFiat24hAgo, decimals);
    let totalNetWorthFiatPercentChange24h = getPercentChange(totalFiat, totalFiat24hAgo).toFixed(1);
    bindViewTotalNetWorthFiat24hAgo(totalNetWorthFiat24hAgo, totalNetWorthFiatPercentChange24h);
}

/**
 * --------------------------------------------------------------------------------
 */

function refreshTotalTradeVolumeFiat(ticker) {

    let zilPriceInFiatFloat = coinPriceStatus.getCoinPriceFiat('ZIL');
    if (!zilPriceInFiatFloat) {
        return;
    }

    let totalVolumeZil = getNumberFromView('#' + ticker + '_lp_total_volume_zil');
    if (Number.isNaN(totalVolumeZil)) {
        return;
    }

    let totalVolumeFiat = (1.0 * zilPriceInFiatFloat * totalVolumeZil);
    let totalVolumeFiatString = commafyNumberToString(totalVolumeFiat, /* decimals= */ 0);
    bindViewTotalTradeVolumeFiat(totalVolumeFiatString, ticker);
}