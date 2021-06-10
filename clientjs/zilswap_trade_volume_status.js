/** A class to represent Zilswap DEX trade volume status.  */
class ZilswapTradeVolumeStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDex24hTradeVolumeData) {
        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDex24hTradeVolumeData_ = zilswapDex24hTradeVolumeData;

        // private variable
        this.coinToVolumeMap_ = {};

        this.computeCoinToVolumeMap();
        this.bindViewTradeVolumeFiat();
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        this.bindViewTradeVolumeFiat();
    }

    getTradeVolumeInZil(coinSymbol) {
        return this.coinToVolumeMap_[coinSymbol];
    }

    computeCoinToVolumeMap() {
        if (!this.zilswapDex24hTradeVolumeData_) {
            return;
        }
        let poolToVolumeMap = {}
        for (let i = 0; i < this.zilswapDex24hTradeVolumeData_.length; i++) {
            let key = this.zilswapDex24hTradeVolumeData_[i].pool;
            poolToVolumeMap[key] = this.zilswapDex24hTradeVolumeData_[i];
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

            this.coinToVolumeMap_[ticker] = totalVolumeZilAmount / Math.pow(10, 12);
        }
    }

    bindViewTradeVolumeFiat() {
        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }

        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let tradeVolumeInZil = this.getTradeVolumeInZil(ticker);
            if (!tradeVolumeInZil) {
                continue;
            }

            let totalVolumeFiat = (1.0 * zilPriceInFiatFloat * tradeVolumeInZil);
            let totalVolumeFiatString = commafyNumberToString(totalVolumeFiat, /* decimals= */ 0);
            this.bindViewTotalTradeVolumeFiat(totalVolumeFiatString, ticker);
        }
    }

    computeDataRpcIfDataNoExist(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        if (this.zilswapDex24hTradeVolumeData_) {
            beforeRpcCallback();
            this.computeCoinToVolumeMap();
            this.bindViewTradeVolumeFiat();
            onSuccessCallback();
        }
        this.computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback);
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        beforeRpcCallback();

        let currentDate = new Date();
        let currentTimeSeconds = currentDate.getTime() / 1000;
        let oneDayAgoSeconds = currentTimeSeconds - (60 * 60 * 24);

        let self = this;
        queryUrlGetAjax(
            /* urlToGet= */
            "https://stats.zilswap.org/volume?from=" + oneDayAgoSeconds.toFixed(0),
            /* successCallback= */
            function (data) {
                self.zilswapDex24hTradeVolumeData_ = data;
                self.computeCoinToVolumeMap();
                self.bindViewTradeVolumeFiat();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    // Exception, no need reset
    bindViewTotalTradeVolumeFiat(totalVolumeFiat, ticker) {
        $('#' + ticker + '_lp_total_volume_fiat').text(totalVolumeFiat);
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