/**
 * A utility class to draw price charts on the sidebar.
 * Requires lightweight charts library script src='https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js'.
 */
class SimpleChartStatus {

    constructor(zrcTokenPropertiesListMap, simpleAllTokensData) {
        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition

        this.chartSeriesList_ = [];
        this.simpleAllTokensData_ = {};

        // Bindview immediately if data is provided or retrieve ajax if data is not provided.
        if (simpleAllTokensData) {
            this.simpleAllTokensData_ = simpleAllTokensData;
            this.bindViewAllTokens();
        } else {
            this.computeDataRpc();
        }
    }

    refreshChartTheme() {
        let currThemeBottomColor = isCurrentDarkMode() ? CONST_BLACK_TRANSPARENT_RGBA_STRING : CONST_WHITE_TRANSPARENT_RGBA_STRING;
        for (let i = 0; i < this.chartSeriesList_.length; i++) {
            this.chartSeriesList_[i].applyOptions({
                bottomColor: currThemeBottomColor,
            });
        }
    }

    computeDataRpc() {
        if (typeof queryZilliqaApiAjax === 'undefined') {
            // Skip if undefined, this is to cater for test.
            return;
        }
        let self = this;
        queryUrlGetAjax(
            /* urlToGet= */
            CONST_ZILWATCH_ROOT_URL + "/api/tokenprice/24h_simple_all_tokens?requester=zilwatch_dashboard",
            /* successCallback= */
            function (data) {
                self.simpleAllTokensData_ = data;
                self.bindViewAllTokens();
            },
            /* errorCallback= */
            function () {});
    }

    bindViewAllTokens() {
        if (!this.simpleAllTokensData_ || !('data' in this.simpleAllTokensData_)) {
            return;
        }
        this.chartSeriesList_ = [];
        let currSimpleAllTokensData = this.simpleAllTokensData_.data;
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            if (!(ticker in currSimpleAllTokensData)) {
                continue;
            }
            let currContainer = document.getElementById('simple_chart_' + ticker);
            if (!currContainer) {
                continue;
            }
            currContainer.innerHTML = "";
            let series = this.bindViewSimpleChart(currContainer, currSimpleAllTokensData[ticker]);
            if (series) {
                this.chartSeriesList_.push(series);
            }
        }
    }

    bindViewSimpleChart(container, data) {
        if (typeof LightweightCharts === 'undefined') {
            // Skip if undefined, this is to cater for test.
            // LightweightCharts are not testable because it's 3rd party library.
            return null;
        }

        let chart = LightweightCharts.createChart(container, {
            width: 70,
            height: 30,
            priceLineVisible: false,
            layout: {
                backgroundColor: CONST_WHITE_TRANSPARENT_RGBA_STRING,
            },
            rightPriceScale: {
                mode: LightweightCharts.PriceScaleMode.Normal, // Can be .Logarithmic or .Percentage
                borderVisible: false,
                visible: false,
            },
            grid: {
                vertLines: {
                    visible: false,
                },
                horzLines: {
                    visible: false
                }
            },
            timeScale: {
                borderVisible: false,
                timeVisible: false,
                visible: false,
            },
            crosshair: {
                horzLine: {
                    visible: false,
                },
                vertLine: {
                    visible: false,
                },
            },
            handleScroll: false,
            handleScale: false,
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
            priceLineVisible: false,
        });
        series.setData(data);

        return series;
    }
}


if (typeof exports !== 'undefined') {

    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }

    if (typeof isCurrentDarkMode === 'undefined') {
        UtilsTheme = require('../utils_theme.js');
        isCurrentDarkMode = UtilsTheme.isCurrentDarkMode;
    }

    exports.SimpleChartStatus = SimpleChartStatus;
}