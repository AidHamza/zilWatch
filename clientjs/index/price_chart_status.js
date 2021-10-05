/**
 * A utility class to draw full price charts.
 * Requires lightweight charts library script src='https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js'.
 */
class PriceChartStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexStatus, /* nullable= */ zilswapTradeVolumeStatus) {
        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition

        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;
        this.zilswapTradeVolumeStatus_ = zilswapTradeVolumeStatus;

        // Default to gZIL, 24h
        // This is subject to change for future logic
        this.historicalPriceData_ = {
            'ticker': 'gZIL',
            'range': '24h',
        };
    }

    onCoinPriceStatusChange() {
        if (!this.historicalPriceData_) {
            return;
        }
        if (!('ticker' in this.historicalPriceData_)) {
            return;
        }
        if (!('range' in this.historicalPriceData_)) {
            return;
        }
        this.bindViewPriceTextInformation(this.historicalPriceData_.ticker);
        this.bindViewZilswapDexAndFiatInformation(this.historicalPriceData_.ticker, this.historicalPriceData_.range);
    }

    onZilswapDexStatusChange() {
        if (!this.historicalPriceData_) {
            return;
        }
        if (!('ticker' in this.historicalPriceData_)) {
            return;
        }
        if (!('range' in this.historicalPriceData_)) {
            return;
        }
        this.bindViewPriceTextInformation(this.historicalPriceData_.ticker);
        this.bindViewZilswapDexAndFiatInformation(this.historicalPriceData_.ticker, this.historicalPriceData_.range);
    }

    refreshChartTheme() {
        this.bindViewAllInformation();
    }

    refreshChartSize() {
        this.bindViewAllInformation();
    }

    computePriceChartTicker(ticker) {
        if (!('range' in this.historicalPriceData_)) {
            return;
        }
        let currRange = this.historicalPriceData_.range;

        this.computePriceChart(ticker, currRange);
    }

    computePriceChartRange(range) {
        if (!('ticker' in this.historicalPriceData_)) {
            return;
        }
        let currTicker = this.historicalPriceData_.ticker;

        this.computePriceChart(currTicker, range);
    }

    computePriceChart(ticker, range) {
        this.historicalPriceData_ = {
            'ticker': ticker,
            'range': range,
        }
        this.computeDataRpc(
            /* beforeRpcCallback= */
            function () {
                incrementShowSpinnerFullPriceChart();
            },
            /* onSuccessCallback= */
            function () {
                decrementShowSpinnerFullPriceChart();
            },
            /* onErrorCallback= */
            function () {
                decrementShowSpinnerFullPriceChart();
            });
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        if (typeof queryZilliqaApiAjax === 'undefined') {
            // Skip if undefined, this is to cater for test.
            return;
        }
        if (!('ticker' in this.historicalPriceData_) || !('range' in this.historicalPriceData_)) {
            return;
        }
        beforeRpcCallback();

        let self = this;
        queryUrlGetAjax(
            /* urlToGet= */
            CONST_ZILWATCH_ROOT_URL + "/api/tokenprice?token_symbol=" + self.historicalPriceData_.ticker + "&range=" + self.historicalPriceData_.range + "&requester=zilwatch_dashboard",
            /* successCallback= */
            function (data) {
                try {
                    if ('ticker' in data && 'range' in data) {
                        if (data.ticker === self.historicalPriceData_.ticker && data.range === self.historicalPriceData_.range) {
                            self.historicalPriceData_ = data;
                            self.bindViewAllInformation();
                            onSuccessCallback();
                            return;
                        }
                    }
                } catch {
                    console.warn("Failed to get historical price data for price chart!");
                }
                self.bindViewChartErrorDataNotAvailable();
                onErrorCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    bindViewChartErrorDataNotAvailable() {
        let currContainer = document.getElementById('full_price_chart');
        currContainer.innerHTML = "";
        currContainer.innerHTML = "<p class='h4'>Sorry, data is not available!</p>";
    }

    bindViewAllInformation() {
        if (!this.historicalPriceData_) {
            return;
        }
        if (!('ticker' in this.historicalPriceData_)) {
            return;
        }
        if (!('range' in this.historicalPriceData_)) {
            return;
        }
        this.bindViewStaticInformation(this.historicalPriceData_.ticker);
        this.bindViewPriceTextInformation(this.historicalPriceData_.ticker);
        this.bindViewZilswapDexAndFiatInformation(this.historicalPriceData_.ticker, this.historicalPriceData_.range);

        if (!('data' in this.historicalPriceData_)) {
            return;
        }

        let currContainer = document.getElementById('full_price_chart');
        currContainer.innerHTML = "";
        this.bindViewPriceChart(currContainer, this.historicalPriceData_.data);
    }

    bindViewStaticInformation(ticker) {
        if (!(ticker in this.zrcTokenPropertiesListMap_)) {
            return;
        }

        let address = this.zrcTokenPropertiesListMap_[ticker].address;

        let imgSrc = this.zrcTokenPropertiesListMap_[ticker].logo_url;
        if ($("html").hasClass("dark-mode")) {
            imgSrc = imgSrc + '?t=dark';
        }
        $('#price_chart_token_logo').attr('src', imgSrc);
        $('#price_chart_token_name').text(this.zrcTokenPropertiesListMap_[ticker].name);
        $('#price_chart_token_ticker').text(this.zrcTokenPropertiesListMap_[ticker].ticker);

        $('#price_chart_token_address_anchor').attr('href', 'https://viewblock.io/zilliqa/address/' + address);
        $('#price_chart_token_address_span').text(address);

        if ('website' in this.zrcTokenPropertiesListMap_[ticker]) {
            $('#price_chart_token_website_anchor').attr('href', this.zrcTokenPropertiesListMap_[ticker].website);
            $('#price_chart_token_website_anchor').show();
        } else {
            $('#price_chart_token_website_anchor').hide();
        }

        if ('telegram' in this.zrcTokenPropertiesListMap_[ticker]) {
            $('#price_chart_token_telegram_anchor').attr('href', this.zrcTokenPropertiesListMap_[ticker].telegram);
            $('#price_chart_token_telegram_anchor').show();
        } else {
            $('#price_chart_token_telegram_anchor').hide();
        }

        if ('whitepaper' in this.zrcTokenPropertiesListMap_[ticker]) {
            $('#price_chart_token_whitepaper_anchor').attr('href', this.zrcTokenPropertiesListMap_[ticker].whitepaper);
            $('#price_chart_token_whitepaper_anchor').show();
        } else {
            $('#price_chart_token_whitepaper_anchor').hide();
        }
    }

    bindViewPriceTextInformation(ticker) {
        if (!('data' in this.historicalPriceData_)) {
            return;
        }
        if (!('low' in this.historicalPriceData_)) {
            return;
        }
        if (!('high' in this.historicalPriceData_)) {
            return;
        }
        let currPriceInZil = null;
        if (this.zilswapDexStatus_) {
            currPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil(ticker);
        }

        let currRange = this.historicalPriceData_.range;
        let currData = this.historicalPriceData_.data;
        let currLow = this.historicalPriceData_.low;
        let currHigh = this.historicalPriceData_.high;

        let currPriceInZilRangeAgo = parseFloat(currData[0].value);
        if (!currPriceInZil) {
            currPriceInZil = parseFloat(currData[currData.length - 1].value);
        }

        let userFriendlyZrcTokenPriceInZil = convertNumberQaToDecimalString(currPriceInZil, /* decimals= */ 0);
        $('#price_chart_current_token_price_zil').text(userFriendlyZrcTokenPriceInZil);

        let userFriendlyZrcTokenPricePercentChange = getPercentChange(currPriceInZil, currPriceInZilRangeAgo).toFixed(1);
        $('#price_chart_current_percent_change').text(userFriendlyZrcTokenPricePercentChange);
        bindViewPercentChangeColorContainer('#price_chart_current_percent_change_container', userFriendlyZrcTokenPricePercentChange);

        $('.price_chart_range').text(currRange);
        let userFriendlyLow = convertNumberQaToDecimalString(currLow, /* decimals= */ 0);
        $('#price_chart_range_low').text(userFriendlyLow);
        let userFriendlyHigh = convertNumberQaToDecimalString(currHigh, /* decimals= */ 0);
        $('#price_chart_range_high').text(userFriendlyHigh);

        let currentPricePercent = getNormalizedPercent(currPriceInZil, currLow, currHigh);
        let currentPricePercentString = currentPricePercent.toString();
        $('#price_chart_low_high_progress').attr('aria-valuenow', currentPricePercentString);
        $('#price_chart_low_high_progress').width(currentPricePercentString + '%');

        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let currPriceInFiat = zilPriceInFiatFloat * currPriceInZil;
        let currPriceInFiatString = commafyNumberToString(currPriceInFiat, /* decimals= */ 2);
        $('#price_chart_current_token_price_fiat').text(currPriceInFiatString);
    }

    bindViewZilswapDexAndFiatInformation(ticker, range) {
        if (!this.zilswapDexStatus_) {
            return;
        }
        if (!this.coinPriceStatus_) {
            return;
        }
        let zrcPairPublicStatus = this.zilswapDexStatus_.getZilswapPairPublicStatus(ticker);
        if (!zrcPairPublicStatus) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        $('.price-chart-ticker').text(ticker);

        // ---- Circulating supply and market cap ----
        let zrcCirculatingSupply = this.zilswapDexStatus_.getCirculatingSupply(ticker);
        let zrcCirculatingSupplyInFiat = null;
        if (zrcCirculatingSupply) {
            // Circulating supply and market cap
            let zrcCirculatingSupplyString = convertNumberQaToDecimalString(zrcCirculatingSupply, /* decimals= */ 0);
            $('#price_chart_circulating_supply').text(zrcCirculatingSupplyString);

            zrcCirculatingSupplyInFiat = 1.0 * zrcCirculatingSupply * zrcPairPublicStatus.zrcTokenPriceInZil * zilPriceInFiatFloat;
            let zrcCirculatingSupplyInFiatString = commafyNumberToString(zrcCirculatingSupplyInFiat, /* decimals= */ 0);
            $('#price_chart_market_cap').text(zrcCirculatingSupplyInFiatString);
        }

        // ---- Liquidity ----
        // ZRC token price in ZIL
        let zrcPool = convertNumberQaToDecimalString(zrcPairPublicStatus.totalPoolZrcTokenAmount, /* decimals= */ 0);
        let zilPool = convertNumberQaToDecimalString(zrcPairPublicStatus.totalPoolZilAmount, /* decimals= */ 0);
        $("#price_chart_liquidity_zrc").text(zrcPool);
        $("#price_chart_liquidity_zil").text(zilPool);

        let totalLiquidityFiat = 2.0 * zrcPairPublicStatus.totalPoolZilAmount * zilPriceInFiatFloat;
        let totalLiquidityFiatString = commafyNumberToString(totalLiquidityFiat, /* decimals= */ 0);
        $("#price_chart_liquidity_fiat").text(totalLiquidityFiatString);

        if (zrcCirculatingSupplyInFiat) {
            // Liquidity to Market Cap ratio
            let liquidityMarketCapRatio = totalLiquidityFiat / zrcCirculatingSupplyInFiat;
            let liquidityMarketCapRatioString = convertNumberQaToDecimalString(liquidityMarketCapRatio, /* decimals= */ 0);
            $('#price_chart_liquidity_market_cap_ratio').text(liquidityMarketCapRatioString);
        }

        // ---- Trade Volume ----
        if (!this.zilswapTradeVolumeStatus_) {
            return;
        }
        let tradeVolumeInZil = this.zilswapTradeVolumeStatus_.getTradeVolumeInZil(ticker, range);
        let tradeVolumeInFiat = zilPriceInFiatFloat * tradeVolumeInZil;
        let tradeVolumeInFiatString = convertNumberQaToDecimalString(tradeVolumeInFiat, /* decimals= */ 0);
        if (!tradeVolumeInFiatString) {
            tradeVolumeInFiatString = 0;
        }
        $('#price_chart_trade_volume_fiat').text(tradeVolumeInFiatString);

        if (zrcCirculatingSupplyInFiat) {
            // Liquidity to Market Cap ratio
            let volumeMarketCapRatio = tradeVolumeInFiat / zrcCirculatingSupplyInFiat;
            let volumeMarketCapRatioString = convertNumberQaToDecimalString(volumeMarketCapRatio, /* decimals= */ 0);
            if (!volumeMarketCapRatioString) {
                volumeMarketCapRatioString = 0;
            }
            $('#price_chart_trade_volume_market_cap_ratio').text(volumeMarketCapRatioString);
        }
    }

    bindViewPriceChart(container, data) {
        if (typeof LightweightCharts === 'undefined') {
            // Skip if undefined, this is to cater for test.
            // LightweightCharts are not testable because it's 3rd party library.
            return null;
        }

        let chart = LightweightCharts.createChart(container, {
            width: $('#full_price_chart').width(),
            height: 400,
            priceLineVisible: false,
            layout: {
                backgroundColor: CONST_WHITE_TRANSPARENT_RGBA_STRING,
                textColor: $("html").hasClass("dark-mode") ? '#d5d9dd' : '#212529',
            },
            rightPriceScale: {
                mode: LightweightCharts.PriceScaleMode.Normal, // Can be .Logarithmic or .Percentage
            },
            timeScale: {
                borderVisible: true,
                timeVisible: true,
                visible: true,
            },
            grid: {
                vertLines: {
                    color: $("html").hasClass("dark-mode") ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                },
                horzLines: {
                    color: $("html").hasClass("dark-mode") ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                },
            },
        });

        chart.timeScale().setVisibleLogicalRange({
            from: 0,
            to: data.length,
        });

        let priceDifference = data[data.length - 1].value - data[0].value;
        let series = chart.addAreaSeries({
            topColor: priceDifference >= 0 ? CONST_GREEN_TOP_GRADIENT_RGBA_STRING : CONST_RED_TOP_GRADIENT_RGBA_STRING,
            bottomColor: $("html").hasClass("dark-mode") ? CONST_BLACK_TRANSPARENT_RGBA_STRING : CONST_WHITE_TRANSPARENT_RGBA_STRING,
            lineColor: priceDifference >= 0 ? CONST_GREEN_LINE_RGBA_STRING : CONST_RED_LINE_RGBA_STRING,
            lineWidth: 2,
        });
        series.setData(data);
    }
}


if (typeof exports !== 'undefined') {

    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }
    if (typeof getNormalizedPercent === 'undefined') {
        TokenUtils = require('./token_utils.js');
        getNormalizedPercent = TokenUtils.getNormalizedPercent;
    }

    exports.PriceChartStatus = PriceChartStatus;
}