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