/**
 * A utility class to draw full price charts.
 * Requires lightweight charts library script src='https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js'.
 */
class PriceChartStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ defaultTokenSymbol, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexStatus, /* nullable= */ zilswapTradeVolumeStatus) {
        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition

        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;
        this.zilswapTradeVolumeStatus_ = zilswapTradeVolumeStatus;

        let initTokenSymbol = 'gZIL';
        if (defaultTokenSymbol in this.zrcTokenPropertiesListMap_) {
            if (!('fixed_token_rate' in this.zrcTokenPropertiesListMap_[defaultTokenSymbol])) {
                initTokenSymbol = defaultTokenSymbol;
            }
        }

        this.lightweightChartData_ = {
            'ticker': null,
            'range': null,
            'series' : null,
        }

        // Default to defaultTokenSymbol if set, else gZIL, 24h
        // This is subject to change for future logic
        this.historicalPriceData_ = {
            'ticker': initTokenSymbol,
            'range': '24h',
        };
        this.updateTokenUrlState(initTokenSymbol, /* isUserAction= */ false);
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

    redrawChart() {
        this.bindViewPriceChart(/* isForceRedraw= */ true);
    }

    updateTokenUrlState(tokenSymbol, isUserAction) {
        let state = {
            'tokenSymbol': tokenSymbol
        };
        let title = "zilWatch - " + tokenSymbol;
        let queryAttr = "?token=" + tokenSymbol;

        if (isUserAction) {
            history.pushState(state, title, queryAttr);
        } else {
            history.replaceState(state, title, queryAttr);
        }
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
        if (!(this.historicalPriceData_.ticker in this.zrcTokenPropertiesListMap_)) {
            return;
        }
        beforeRpcCallback();

        // Still try to bindView all first to update the static information, to make the page doesn't look hanging.
        this.bindViewAllInformation();

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
                            self.bindViewPriceChart(/* isForceRedraw= */ false);
                            onSuccessCallback();
                            return;
                        }
                    }
                } catch {
                    console.warn("Failed to get historical price data for price chart!");
                }
                self.bindViewAllInformation();
                self.bindViewChartErrorDataNotAvailable();
                onErrorCallback();
            },
            /* errorCallback= */
            function () {
                self.bindViewAllInformation();
                self.bindViewChartErrorDataNotAvailable();
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
    }

    bindViewStaticInformation(ticker) {
        if (!(ticker in this.zrcTokenPropertiesListMap_)) {
            return;
        }

        let address = this.zrcTokenPropertiesListMap_[ticker].address;

        let imgSrc = this.zrcTokenPropertiesListMap_[ticker].logo_url;
        if (isCurrentDarkMode()) {
            imgSrc = imgSrc + CONST_VIEWBLOCK_LOGO_DARK_SUFFIX;
        }
        $('#price_chart_token_logo').attr('src', imgSrc);
        $('#price_chart_token_name').text(this.zrcTokenPropertiesListMap_[ticker].name);
        // Do not trigger change() on purpose, this is just updating the value of the selector.
        $('#price_chart_token_ticker_selector').val(this.zrcTokenPropertiesListMap_[ticker].ticker);

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
        let currPriceInZil = null;
        if (this.zilswapDexStatus_) {
            currPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil(ticker);
            let userFriendlyZrcTokenPriceInZil = convertNumberQaToDecimalString(currPriceInZil, /* decimals= */ 0);
            $('#price_chart_current_token_price_zil').text(userFriendlyZrcTokenPriceInZil);
        }

        if (this.coinPriceStatus_) {
            let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
            if (zilPriceInFiatFloat) {
                let currPriceInFiat = zilPriceInFiatFloat * currPriceInZil;
                let currPriceInFiatString = commafyNumberToString(currPriceInFiat, /* decimals= */ 2);
                $('#price_chart_current_token_price_fiat').text(currPriceInFiatString);
            }
        }

        if ('all_time_high' in this.historicalPriceData_) {
            let ath_dict = this.historicalPriceData_.all_time_high;
            if ('value' in ath_dict) {
                let athValue = ath_dict.value;
                let athValueString = convertNumberQaToDecimalString(athValue, /* decimals= */ 0);
                $('#price_chart_all_time_high').text(athValueString);

                if ('time' in ath_dict) {
                    let athTimestampEpoch = ath_dict.time;
                    let dateTimestamp = new Date(athTimestampEpoch * 1000).toLocaleTimeString([], {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    });
                    $('#price_chart_all_time_high_timestamp').text(dateTimestamp);
                }
            }
        }

        if ('all_time_low' in this.historicalPriceData_) {
            let atl_dict = this.historicalPriceData_.all_time_low;
            if ('value' in atl_dict) {
                let athValue = atl_dict.value;
                let athValueString = convertNumberQaToDecimalString(athValue, /* decimals= */ 0);
                $('#price_chart_all_time_low').text(athValueString);

                if ('time' in atl_dict) {
                    let atlTimestampEpoch = atl_dict.time;
                    let dateTimestamp = new Date(atlTimestampEpoch * 1000).toLocaleTimeString([], {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    });
                    $('#price_chart_all_time_low_timestamp').text(dateTimestamp);
                }
            }
        }

        if (!('data' in this.historicalPriceData_)) {
            return;
        }
        if (!('low' in this.historicalPriceData_)) {
            return;
        }
        if (!('high' in this.historicalPriceData_)) {
            return;
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
        $('.price_chart_range').text(range);

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

    bindViewPriceChart(isForceRedraw) {
        if (typeof LightweightCharts === 'undefined') {
            // Skip if undefined, this is to cater for test.
            // LightweightCharts are not testable because it's 3rd party library.
            return;
        }
        if (!('data' in this.historicalPriceData_)) {
            return;
        }
        if (!('ticker' in this.historicalPriceData_)) {
            return;
        }
        if (!('range' in this.historicalPriceData_)) {
            return;
        }

        let data = this.historicalPriceData_.data;

        // If not force redraw, and ticker and range are the same, means it's just data update.
        // Hence we just setData not to reset the view (e.g., if user is already scrolling and zooming on the graph)
        if (!isForceRedraw) {
            if (this.lightweightChartData_.ticker === this.historicalPriceData_.ticker && this.lightweightChartData_.range === this.historicalPriceData_.range) {
                if (this.lightweightChartData_.series) {
                    this.lightweightChartData_.series.setData(data);
                    return;
                }
            }
        }

        let container = document.getElementById('full_price_chart');
        container.innerHTML = "";

        let chart = LightweightCharts.createChart(container, {
            // Use #main_content_tabs_container instead of #full_price_chart because when the view is hidden/gone
            // the width becomes 0px and it will be invisible
            width: $('#main_content_tabs_container').width(),
            height: 400,
            priceLineVisible: false,
            layout: {
                backgroundColor: CONST_WHITE_TRANSPARENT_RGBA_STRING,
                textColor: isCurrentDarkMode() ? '#d5d9dd' : '#212529',
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
                    color: isCurrentDarkMode() ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                },
                horzLines: {
                    color: isCurrentDarkMode() ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
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
            bottomColor: isCurrentDarkMode() ? CONST_BLACK_TRANSPARENT_RGBA_STRING : CONST_WHITE_TRANSPARENT_RGBA_STRING,
            lineColor: priceDifference >= 0 ? CONST_GREEN_LINE_RGBA_STRING : CONST_RED_LINE_RGBA_STRING,
            lineWidth: 2,
        });
        series.setData(data);

        this.lightweightChartData_.ticker = this.historicalPriceData_.ticker;
        this.lightweightChartData_.range = this.historicalPriceData_.range;
        this.lightweightChartData_.series = series;
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

    if (typeof isCurrentDarkMode === 'undefined') {
        UtilsTheme = require('../utils_theme.js');
        isCurrentDarkMode = UtilsTheme.isCurrentDarkMode;
    }
    if (typeof CONST_VIEWBLOCK_LOGO_DARK_SUFFIX === 'undefined') {
        UtilsConstants = require('../utils_constants.js');
        CONST_VIEWBLOCK_LOGO_DARK_SUFFIX = UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX;
    }

    exports.PriceChartStatus = PriceChartStatus;
}