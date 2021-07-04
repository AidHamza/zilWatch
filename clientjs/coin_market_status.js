/** A class to represent global coin market status.  */
class CoinMarketStatus {

    constructor(coinMap, /* nullable= */ coinPriceStatus, /* nullable= */ coinMarketCoingeckoData) {
        this.coinMap_ = coinMap; // Refer to constants.js for definition

        this.coinPriceStatus_ = coinPriceStatus;
        this.coinMarketCoingeckoData_ = coinMarketCoingeckoData;

        this.coinToMarketDataMap_ = {};

        if (this.coinMarketCoingeckoData_) {
            this.computeCoinToMarketDataMap();
            this.bindViewIfDataExist();
        }
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        this.bindViewIfDataExist();
    }

    getTradeVolumeInToken(coinSymbol) {
        // If coin symbol is not supported.
        if (!this.coinMap_[coinSymbol]) {
            return null;
        }
        return this.coinToMarketDataMap_[coinSymbol].trade_volume_in_token;
    }

    getCirculatingSupply(coinSymbol) {
        // If coin symbol is not supported.
        if (!this.coinMap_[coinSymbol]) {
            return null;
        }
        return this.coinToMarketDataMap_[coinSymbol].circulating_supply;
    }

    getTotalSupply(coinSymbol) {
        // If coin symbol is not supported.
        if (!this.coinMap_[coinSymbol]) {
            return null;
        }
        return this.coinToMarketDataMap_[coinSymbol].total_supply;
    }

    computeCoinToMarketDataMap() {
        if (!this.coinMarketCoingeckoData_) {
            return null;
        }
        let dataArrLength = this.coinMarketCoingeckoData_.length;
        for (let i = 0; i < dataArrLength; i++) {
            let currCoingeckoId = this.coinMarketCoingeckoData_[i].id;

            let currCoinSymbol = this.coinMarketCoingeckoData_[i].symbol;
            if (currCoinSymbol) {
                currCoinSymbol = currCoinSymbol.toUpperCase();
            }
            if (!this.coinMap_[currCoinSymbol] || this.coinMap_[currCoinSymbol].coingecko_id !== currCoingeckoId) {
                continue;
            }
            let currentPriceUsd = parseFloat(this.coinMarketCoingeckoData_[i].current_price);
            let tradeVolumeInUsd = parseFloat(this.coinMarketCoingeckoData_[i].total_volume);
            let circulatingSupply = parseFloat(this.coinMarketCoingeckoData_[i].circulating_supply);
            let totalSupply = parseFloat(this.coinMarketCoingeckoData_[i].total_supply);
            // Some coin doesn't have a total supply or max supply
            if (!totalSupply) {
                totalSupply = null;
            }

            let tradeVolumeInToken = null;
            if (currentPriceUsd && tradeVolumeInUsd) {
                tradeVolumeInToken = 1.0 * tradeVolumeInUsd / currentPriceUsd;
            }

            if (tradeVolumeInToken && circulatingSupply) {
                this.coinToMarketDataMap_[currCoinSymbol] = {
                    trade_volume_in_token: tradeVolumeInToken,
                    circulating_supply: circulatingSupply,
                    total_supply: totalSupply,
                }
            }
        }
    }

    computeDataRpcIfDataNoExist(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        // If data is already loaded, do not perform RPC.
        if (this.coinMarketCoingeckoData_) {
            beforeRpcCallback();
            this.computeCoinToMarketDataMap();
            this.bindViewIfDataExist();
            onSuccessCallback(); // Call success callback as if the RPC is successful.
            return;
        }

        this.computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback);
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        beforeRpcCallback();

        // Prepare URL for query
        let allCoinsCode = 'zilliqa';
        for (let coinCode in coinMap) {
            allCoinsCode += ',' + coinMap[coinCode].coingecko_id;
        }

        let self = this;
        queryUrlGetAjax(
            /* urlToGet= */
            "https://api.coingecko.com/api/v3/coins/markets?ids=" + allCoinsCode + "&vs_currency=usd" + "&order=market_cap_desc" + "&sparkline=false",
            /* successCallback= */
            function (data) {
                self.coinMarketCoingeckoData_ = data;
                self.computeCoinToMarketDataMap();
                self.bindViewIfDataExist();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    bindViewIfDataExist() {

        for (let coinTicker in this.coinMap_) {
            if (!this.coinToMarketDataMap_[coinTicker]) {
                continue;
            }

            // Circulating supply in token
            let coinCirculatingSupply = this.getCirculatingSupply(coinTicker);
            if (coinCirculatingSupply) {
                let coinCirculatingSupplyString = convertNumberQaToDecimalString(coinCirculatingSupply, /* decimals= */ 0);
                this.bindViewTokenCirculatingSupply(coinCirculatingSupplyString, coinTicker);
            }

            // Total supply in token
            let coinTotalSupply = this.getTotalSupply(coinTicker);
            if (coinTotalSupply) {
                let coinTotalSupplyString = convertNumberQaToDecimalString(coinTotalSupply, /* decimals= */ 0);
                this.bindViewTokenTotalSupply(coinTotalSupplyString, coinTicker);
            }

            if (!this.coinPriceStatus_) {
                continue;
            }

            // Coin price in fiat
            let coinPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat(coinTicker);
            if (!coinPriceInFiatFloat) {
                continue;
            }

            // Circulating supply in fiat (Market cap)
            if (coinCirculatingSupply) {
                let coinCirculatingSupplyFiat = 1.0 * coinPriceInFiatFloat * coinCirculatingSupply;
                let coinCirculatingSupplyFiatString = commafyNumberToString(coinCirculatingSupplyFiat, /* decimals= */ 0);
                this.bindViewTokenCirculatingSupplyFiat(coinCirculatingSupplyFiatString, coinTicker);
            }

            // Total supply in fiat
            if (coinTotalSupply) {
                let coinTotalSupplyFiat = 1.0 * coinPriceInFiatFloat * coinTotalSupply;
                let coinTotalSupplyFiatString = commafyNumberToString(coinTotalSupplyFiat, /* decimals= */ 0);
                this.bindViewTokenTotalSupplyFiat(coinTotalSupplyFiatString, coinTicker);
            }

            // Trade volume in fiat
            let tradeVolumeInToken = this.getTradeVolumeInToken(coinTicker);
            if (tradeVolumeInToken) {
                let coinTradeVolumeFiat = 1.0 * coinPriceInFiatFloat * tradeVolumeInToken;
                let coinTradeVolumeFiatString = commafyNumberToString(coinTradeVolumeFiat, /* decimals= */ 0);
                this.bindViewTradeVolumeFiat(coinTradeVolumeFiatString, coinTicker);
            }
        }
    }

    /** Private static method. Public. */
    bindViewTradeVolumeFiat(tradeVolumeFiat, ticker) {
        $('#' + ticker + '_lp_total_volume_fiat').text(tradeVolumeFiat);
    }

    /** Private static method. Public. */
    bindViewTokenCirculatingSupply(tokenCirculatingSupply, ticker) {
        $('#' + ticker + '_circulating_supply_coin').text(tokenCirculatingSupply);
    }

    /** Private static method. Public. */
    bindViewTokenCirculatingSupplyFiat(tokenCirculatingSupplyFiat, ticker) {
        $('#' + ticker + '_circulating_supply_fiat').text(tokenCirculatingSupplyFiat);
    }

    /** Private static method. Public. */
    bindViewTokenTotalSupply(tokenTotalSupply, ticker) {
        $('#' + ticker + '_total_supply_coin').text(tokenTotalSupply);
    }

    /** Private static method. Public. */
    bindViewTokenTotalSupplyFiat(tokenTotalSupplyFiat, ticker) {
        $('#' + ticker + '_total_supply_fiat').text(tokenTotalSupplyFiat);
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

    exports.CoinMarketStatus = CoinMarketStatus;
}