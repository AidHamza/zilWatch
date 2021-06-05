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