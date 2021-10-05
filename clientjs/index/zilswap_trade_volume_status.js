/** A class to represent Zilswap DEX trade volume status.  */
class ZilswapTradeVolumeStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDex24hTradeVolumeData) {
        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDex24hTradeVolumeData_ = zilswapDex24hTradeVolumeData;

        this.timeRangeStringToSecondsMap_ = {
            '1h' : 60 * 30 * 2, // Make it 1.5-hrs because zilswap API doesn't update in real time, so most values shows as 0
            '24h' : 60 * 60 * 24,
            '7d' : 60 * 60 * 24 * 7,
            '1m' : 60 * 60 * 24 * 30,
            '3m' : 60 * 60 * 24 * 90,
            '1y' : 60 * 60 * 24 * 365,
        }

        // private variable
        this.coinToVolumeMap_ = {
            '1h' : {},
            '24h' : {},
            '7d' : {},
            '1m' : {},
            '3m' : {},
            '1y' : {},
        }

        this.computeCoinToVolumeMap(this.zilswapDex24hTradeVolumeData_, '24h');
        this.bindView24hTradeVolumeFiat();
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        this.bindView24hTradeVolumeFiat();
    }

    getTradeVolumeInZil(coinSymbol, timeRange) {
        if (!(timeRange in this.coinToVolumeMap_)) {
            return null;
        }
        return this.coinToVolumeMap_[timeRange][coinSymbol];
    }

    computeCoinToVolumeMap(currData, timeRange) {
        if (!currData) {
            return;
        }
        let poolToVolumeMap = {}
        for (let i = 0; i < currData.length; i++) {
            let key = currData[i].pool;
            poolToVolumeMap[key] = currData[i];
        }

        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let contractAddress = this.zrcTokenPropertiesListMap_[ticker].address;
            let volumeList = poolToVolumeMap[contractAddress];
            if (!volumeList) {
                continue;
            }
            let inZilAmount = parseInt(volumeList.in_zil_amount);
            let outZilAmount = parseInt(volumeList.out_zil_amount);
            let totalVolumeZilAmount = inZilAmount + outZilAmount;

            this.coinToVolumeMap_[timeRange][ticker] = totalVolumeZilAmount / Math.pow(10, 12);
        }
    }

    bindView24hTradeVolumeFiat() {
        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }

        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let tradeVolumeInZil = this.getTradeVolumeInZil(ticker, '24h');
            if (!tradeVolumeInZil) {
                continue;
            }

            let totalVolumeFiat = (1.0 * zilPriceInFiatFloat * tradeVolumeInZil);
            let totalVolumeFiatString = commafyNumberToString(totalVolumeFiat, /* decimals= */ 0);
            this.bindView24hVolumeFiat(totalVolumeFiatString, ticker);
        }
    }

    computeDataRpcIfDataNoExist(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        if (this.zilswapDex24hTradeVolumeData_) {
            beforeRpcCallback();
            this.computeCoinToVolumeMap(this.zilswapDex24hTradeVolumeData_, '24h');
            this.bindView24hTradeVolumeFiat();
            onSuccessCallback();
        }
        this.computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback);
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {

        for (let timeRange in this.timeRangeStringToSecondsMap_) {
            beforeRpcCallback();

            let timeDifferenceSeconds = this.timeRangeStringToSecondsMap_[timeRange];

            let currentDate = new Date();
            let currentTimeSeconds = currentDate.getTime() / 1000;
            let oneDayAgoSeconds = currentTimeSeconds - timeDifferenceSeconds;

            let self = this;
            queryUrlGetAjax(
                /* urlToGet= */
                CONST_STATS_ZILSWAP_ROOT_URL + "/volume?from=" + oneDayAgoSeconds.toFixed(0),
                /* successCallback= */
                function (data) {
                    self.computeCoinToVolumeMap(data, timeRange);
                    if (timeRange === '24h') {
                        self.zilswapDex24hTradeVolumeData_ = data;
                        self.bindView24hTradeVolumeFiat();
                    }
                    onSuccessCallback();
                },
                /* errorCallback= */
                function () {
                    onErrorCallback();
                });
        }
    }

    // Exception, no need reset
    bindView24hVolumeFiat(totalVolumeFiat, ticker) {
        $('#' + ticker + '_lp_24h_volume_fiat').text(totalVolumeFiat);
    }
}

if (typeof exports !== 'undefined') {
    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
        commafyNumberToString = FormattingUtils.commafyNumberToString;
    }
    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }
    exports.ZilswapTradeVolumeStatus = ZilswapTradeVolumeStatus;
}