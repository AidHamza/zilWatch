
/** A class to represent global coin price status.  */
class CoinPriceStatus {
    
    constructor(coinMap, currencyMap, activeCurrencyCode, /* nullable= */ coinPriceCoingeckoData, /* nullable= */ coinPriceCoingecko24hAgoData) {
        this.coinMap_ = coinMap; // Refer to constants.js for definition
        this.currencyMap_ = currencyMap; // Refer to constants.js for definition
        this.activeCurrencyCode_ = activeCurrencyCode;
        this.coinPriceCoingeckoData_ = coinPriceCoingeckoData;
        this.coinPriceCoingecko24hAgoData_ = coinPriceCoingecko24hAgoData;
        this.bindViewIfDataExist();
    }

    /**
     * Returns coin price in fiat, number data type.
     * 
     * Any error will result in returning null.
     */
    getCoinPriceFiat(coinSymbol) {
        // If data doesn't exist.
        if (!this.coinPriceCoingeckoData_ ) {
            return null;
        }
        // If coin symbol or fiat symbol is not supported.
        if (!this.coinMap_[coinSymbol] || !this.currencyMap_[this.activeCurrencyCode_]) {
            return null;
        }
        // If data doesn't contain coin symbol ID.
        let coingeckoId = this.coinMap_[coinSymbol].coingecko_id;
        if (!this.coinPriceCoingeckoData_[coingeckoId]) {
            return null;
        }
        // If data doesn't contain fiat symbol.
        if (!this.coinPriceCoingeckoData_[coingeckoId][this.activeCurrencyCode_]) {
            return null;
        }
        // If not a number.
        let coinPriceFiat = parseFloat(this.coinPriceCoingeckoData_[coingeckoId][this.activeCurrencyCode_]);
        if (Number.isNaN(coinPriceFiat)) {
            return null;
        }
        return coinPriceFiat;
    }

    /**
     * Returns coin price in fiat 24h ago, number data type.
     * 
     * Any error will result in returning null.
     */
     getCoinPriceFiat24hAgo(coinSymbol) {
        // If data doesn't exist.
        if (!this.coinPriceCoingecko24hAgoData_ ) {
            return null;
        }
        // If coin symbol or fiat symbol is not supported.
        if (!this.coinMap_[coinSymbol] || !this.currencyMap_[this.activeCurrencyCode_]) {
            return null;
        }
        // If data doesn't contain coin symbol ID.
        let coingeckoId = this.coinMap_[coinSymbol].coingecko_id;
        if (!this.coinPriceCoingecko24hAgoData_[coingeckoId]) {
            return null;
        }
        // If data doesn't contain fiat symbol.
        if (!this.coinPriceCoingecko24hAgoData_[coingeckoId][this.activeCurrencyCode_]) {
            return null;
        }
        // If not a number.
        let coinPriceFiat = parseFloat(this.coinPriceCoingecko24hAgoData_[coingeckoId][this.activeCurrencyCode_]);
        if (Number.isNaN(coinPriceFiat)) {
            return null;
        }
        return coinPriceFiat;
    }

    getCurrentActiveDollarSymbol() {
       return this.currencyMap_[this.activeCurrencyCode_];
    }

    setActiveCurrencyCode(currencyCode) {
        if (!this.currencyMap_[currencyCode]) {
            return;
        }
        this.activeCurrencyCode_ = currencyCode;
        this.bindViewIfDataExist();
    }

    computeDataRpcIfDataNoExist(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        // If data is already loaded, do not perform RPC.
        if (this.coinPriceCoingeckoData_) {
            beforeRpcCallback();
            onSuccessCallback(); // Call success callback as if the RPC is successful.
            return;
        }
    
        this.computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback);
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        beforeRpcCallback();

        // Prepare URL for query
        let allCurrenciesCode = 'usd';
        for (let code in currencyMap) {
            allCurrenciesCode += ',' + code;
        }
    
        let allCoinsCode = 'zilliqa';
        for (let coinCode in coinMap) {
            allCoinsCode += ',' + coinMap[coinCode].coingecko_id;
        }

        let self = this;
        queryUrlGetAjax(
            /* urlToGet= */
            "https://api.coingecko.com/api/v3/simple/price?ids=" + allCoinsCode + "&vs_currencies=" + allCurrenciesCode,
            /* successCallback= */
            function (data) {
                self.coinPriceCoingeckoData_ = data;
                self.bindViewIfDataExist();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    bindViewIfDataExist() {
        if (!this.coinPriceCoingeckoData_) {
            return;
        }

        let zilPriceInFiatFloat = this.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let zilPriceInFiat24hAgoFloat = this.getCoinPriceFiat24hAgo('ZIL');

        for (let coinTicker in this.coinMap_) {
            let coinPriceInFiatFloat = this.getCoinPriceFiat(coinTicker);
            if (!coinPriceInFiatFloat) {
                continue;
            }

            // Coin price in fiat
            let decimals = (zilPriceInFiatFloat > 1000) ? 0 : 2;

            let coinPriceInFiatString = commafyNumberToString(coinPriceInFiatFloat, decimals);
            if (coinTicker === 'ZIL') {
                // Special case for zilliqa, 0 decimals to show more decimal point
                coinPriceInFiatString = convertNumberQaToDecimalString(coinPriceInFiatFloat, /* decimals= */ 0);
            }
            this.bindViewCoinPriceInFiat(this.getCurrentActiveDollarSymbol(), coinPriceInFiatString, coinTicker);

            // Coin price in ZIL
            let coinPriceInZilFloat = 1.0 * coinPriceInFiatFloat / zilPriceInFiatFloat;
            if (!coinPriceInZilFloat) {
                continue;
            }
            this.bindViewCoinPriceInZil(commafyNumberToString(coinPriceInZilFloat, 2), coinTicker);

            // ================== 24h ago =====================
            let coinPriceInFiat24hAgoFloat = this.getCoinPriceFiat24hAgo(coinTicker);
            if (!coinPriceInFiat24hAgoFloat) {
                continue;
            }
            let coinPriceInFiatPercentChange24h = getPercentChange(coinPriceInFiatFloat, coinPriceInFiat24hAgoFloat).toFixed(1);
            this.bindViewCoinPriceInFiat24hAgo(coinPriceInFiatPercentChange24h, coinTicker);

            if (!zilPriceInFiat24hAgoFloat) {
                continue;
            }
            let coinPriceInZil24hAgoFloat = 1.0 * coinPriceInFiat24hAgoFloat / zilPriceInFiat24hAgoFloat;
            let coinPriceInZilPercentChange24h = getPercentChange(coinPriceInZilFloat, coinPriceInZil24hAgoFloat).toFixed(1);
            this.bindViewCoinPriceInZil24hAgo(coinPriceInZilPercentChange24h, coinTicker);
        }
    }

    /** Private static method */
    bindViewCoinPriceInFiat24hAgo(coinPriceInFiatPercentChange24h, coinTicker) {
        $("." + coinTicker + "_price_fiat_percent_change_past_range").text(coinPriceInFiatPercentChange24h);
        bindViewPercentChangeColorContainer('.' + coinTicker + '_price_fiat_percent_change_past_range_container', coinPriceInFiatPercentChange24h);
    }

    /** Private static method */
    bindViewCoinPriceInFiat(currencySymbol, coinPriceInFiat, coinTicker) {
        $("." + coinTicker + "_price_fiat").text(coinPriceInFiat);
        $(".currency_symbol").text(currencySymbol);
    }

    /** Private static method */
    bindViewCoinPriceInZil24hAgo(coinPriceInZilPercentChange24h, coinTicker) {
        $("." + coinTicker + "_price_zil_percent_change_past_range").text(coinPriceInZilPercentChange24h);
        bindViewPercentChangeColorContainer('.' + coinTicker + '_price_zil_percent_change_past_range_container', coinPriceInZilPercentChange24h);
    }

    /** Private static method */
    bindViewCoinPriceInZil(coinPriceInZil, coinTicker) {
        $("." + coinTicker + "_price_zil").text(coinPriceInZil);
    }
}

if (typeof exports !== 'undefined') {
    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
        commafyNumberToString = FormattingUtils.commafyNumberToString;
    }
    if (typeof getPercentChange === 'undefined') {
        TokenUtils = require('./token_utils.js');
        getPercentChange = TokenUtils.getPercentChange;
    }

    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }

    if (typeof bindViewPercentChangeColorContainer === 'undefined') {
        BindView = require('./bind_view.js');
        bindViewPercentChangeColorContainer = BindView.bindViewPercentChangeColorContainer;
    }

    exports.CoinPriceStatus = CoinPriceStatus;
}
