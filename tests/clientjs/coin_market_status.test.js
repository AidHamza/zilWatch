var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;
var fs = require('fs')

var assert = require('assert');
var CoinPriceStatus = require('../../clientjs/coin_price_status.js');
var CoinMarketStatus = require('../../clientjs/coin_market_status.js');
var Constants = require('../../constants.js');

describe('CoinMarketStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#constructor()', function () {

        it('create plain object', function () {
            let coinMarketStatus = new CoinMarketStatus.CoinMarketStatus(Constants.coinMap, /* coinPriceStatus= */ null, /* coinMarketCoingeckoData= */ null);

            assert.strictEqual(coinMarketStatus.coinMap_, Constants.coinMap);
            assert.strictEqual(coinMarketStatus.coinPriceStatus_, null);
            assert.strictEqual(coinMarketStatus.coinMarketCoingeckoData_, null);
            assert.deepStrictEqual(coinMarketStatus.coinToMarketDataMap_, {});
        });


        it('create object', function () {
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, /* coinPriceCoingecko24hAgoData= */ null);

            let coinMarketStatus = new CoinMarketStatus.CoinMarketStatus(Constants.coinMap, coinPriceStatus, /* coinMarketCoingeckoData= */ null);

            assert.strictEqual(coinMarketStatus.coinMap_, Constants.coinMap);
            assert.strictEqual(coinMarketStatus.coinPriceStatus_, coinPriceStatus);
            assert.strictEqual(coinMarketStatus.coinMarketCoingeckoData_, null);
            assert.deepStrictEqual(coinMarketStatus.coinToMarketDataMap_, {});
        });
    });

    describe('#methods()', function () {
        let coinMarketCoingeckoData = JSON.parse(fs.readFileSync('./tests/clientjs/coingecko_coin_market_20210704.txt', 'utf8'));
        let coinPriceCoingeckoData = JSON.parse('{"bitcoin":{"usd":35398,"idr":511833653,"sgd":47684},"binancecoin":{"usd":304.2,"idr":4398566,"sgd":409.79},"ethereum":{"usd":2319.52,"idr":33539204,"sgd":3124.62},"zilliqa":{"usd":0.083015,"idr":1200.36,"sgd":0.11183}}');
        let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, /* coinPriceCoingecko24hAgoData= */ null);


        // console.log("'%s': ['%s', '%s', '%s', '%s', '%s'],",
        // coinTicker,
        // $('#' + coinTicker + '_lp_total_volume_fiat').text(),
        // $('#' + coinTicker + '_circulating_supply_coin').text(),
        // $('#' + coinTicker + '_circulating_supply_fiat').text(),
        // $('#' + coinTicker + '_total_supply_coin').text(),
        // $('#' + coinTicker + '_total_supply_fiat').text());
        let expectedMap = {
            'BTC': ['23,223,888,493', '18,747,706', '663,631,296,988', '21,000,000', '743,358,000,000'],
            'ETH': ['20,698,973,840', '116,555,562', '270,352,956,733', '', ''],
            'BNB': ['1,083,258,762', '154,533,652', '47,009,136,908', '170,533,652', '51,876,336,908'],
            'ZIL': ['81,914,731', '12,200,293,676', '1,012,807,380', '21,000,000,000', '1,743,315,000'],
        }

        let expectedMapSgd = {
            'BTC': ['31,284,476,493', '18,747,706', '893,965,612,904', '21,000,000', '1,001,364,000,000'],
            'ETH': ['27,883,539,543', '116,555,562', '364,191,839,547', '', ''],
            'BNB': ['1,459,265,641', '154,533,652', '63,326,345,212', '170,533,652', '69,882,985,212'],
            'ZIL': ['110,347,821', '12,200,293,676', '1,364,358,842', '21,000,000,000', '2,348,430,000'],
        }

        it('data set, show to UI', function () {
            let coinMarketStatus = new CoinMarketStatus.CoinMarketStatus(Constants.coinMap, coinPriceStatus, coinMarketCoingeckoData);

            for (let coinTicker in Constants.coinMap) {
                assert.strictEqual($('#' + coinTicker + '_lp_total_volume_fiat').text(), expectedMap[coinTicker][0]);
                assert.strictEqual($('#' + coinTicker + '_circulating_supply_coin').text(), expectedMap[coinTicker][1]);
                assert.strictEqual($('#' + coinTicker + '_circulating_supply_fiat').text(), expectedMap[coinTicker][2]);
                assert.strictEqual($('#' + coinTicker + '_total_supply_coin').text(), expectedMap[coinTicker][3]);
                assert.strictEqual($('#' + coinTicker + '_total_supply_fiat').text(), expectedMap[coinTicker][4]);
            }
        });

        it('data unset, UI not set, set data and compute, UI set.', function () {
            let coinMarketStatus = new CoinMarketStatus.CoinMarketStatus(Constants.coinMap, coinPriceStatus, /* coinMarketCoingeckoData= */ null);

            for (let coinTicker in Constants.coinMap) {
                assert.strictEqual($('#' + coinTicker + '_lp_total_volume_fiat').text(), "0");
                assert.strictEqual($('#' + coinTicker + '_circulating_supply_coin').text(), "0");
                assert.strictEqual($('#' + coinTicker + '_circulating_supply_fiat').text(), "0");
                assert.strictEqual($('#' + coinTicker + '_total_supply_coin').text(), "");
                assert.strictEqual($('#' + coinTicker + '_total_supply_fiat').text(), "");
            }

            coinMarketStatus.coinMarketCoingeckoData_ = coinMarketCoingeckoData;
            coinMarketStatus.computeCoinToMarketDataMap();
            coinMarketStatus.bindViewIfDataExist();

            for (let coinTicker in Constants.coinMap) {
                assert.strictEqual($('#' + coinTicker + '_lp_total_volume_fiat').text(), expectedMap[coinTicker][0]);
                assert.strictEqual($('#' + coinTicker + '_circulating_supply_coin').text(), expectedMap[coinTicker][1]);
                assert.strictEqual($('#' + coinTicker + '_circulating_supply_fiat').text(), expectedMap[coinTicker][2]);
                assert.strictEqual($('#' + coinTicker + '_total_supply_coin').text(), expectedMap[coinTicker][3]);
                assert.strictEqual($('#' + coinTicker + '_total_supply_fiat').text(), expectedMap[coinTicker][4]);
            }
        });

        it('change currency, data updated.', function () {
            let coinMarketStatus = new CoinMarketStatus.CoinMarketStatus(Constants.coinMap, coinPriceStatus, coinMarketCoingeckoData);

            coinPriceStatus.setActiveCurrencyCode('sgd');
            coinMarketStatus.onCoinPriceStatusChange();

            for (let coinTicker in Constants.coinMap) {
                assert.strictEqual($('#' + coinTicker + '_lp_total_volume_fiat').text(), expectedMapSgd[coinTicker][0]);
                assert.strictEqual($('#' + coinTicker + '_circulating_supply_coin').text(), expectedMapSgd[coinTicker][1]);
                assert.strictEqual($('#' + coinTicker + '_circulating_supply_fiat').text(), expectedMapSgd[coinTicker][2]);
                assert.strictEqual($('#' + coinTicker + '_total_supply_coin').text(), expectedMapSgd[coinTicker][3]);
                assert.strictEqual($('#' + coinTicker + '_total_supply_fiat').text(), expectedMapSgd[coinTicker][4]);
            }
        });

    });



    describe('#bindView()', function () {

        let coinMarketStatus = new CoinMarketStatus.CoinMarketStatus(Constants.coinMap, /* coinPriceStatus= */ null, /* coinMarketCoingeckoData= */ null);

        describe('#bindViewTradeVolumeFiat()', function () {

            beforeEach(function () {
                for (let coinTicker in Constants.coinMap) {
                    assert.strictEqual($('#' + coinTicker + '_lp_total_volume_fiat').text(), '0');
                }
            });

            it('bind view', function () {
                for (let coinTicker in Constants.coinMap) {
                    coinMarketStatus.bindViewTradeVolumeFiat('0.123', coinTicker);

                    assert.strictEqual($('#' + coinTicker + '_lp_total_volume_fiat').text(), '0.123');
                }
            });
        });

        describe('#bindViewTokenCirculatingSupply()', function () {

            beforeEach(function () {
                for (let coinTicker in Constants.coinMap) {
                    assert.strictEqual($('#' + coinTicker + '_circulating_supply_coin').text(), '0');
                }
            });

            it('bind view', function () {
                for (let coinTicker in Constants.coinMap) {
                    coinMarketStatus.bindViewTokenCirculatingSupply('0.123', coinTicker);

                    assert.strictEqual($('#' + coinTicker + '_circulating_supply_coin').text(), '0.123');
                }
            });
        });


        describe('#bindViewTokenCirculatingSupplyFiat()', function () {

            beforeEach(function () {
                for (let coinTicker in Constants.coinMap) {
                    assert.strictEqual($('#' + coinTicker + '_circulating_supply_fiat').text(), '0');
                }
            });

            it('bind view', function () {
                for (let coinTicker in Constants.coinMap) {
                    coinMarketStatus.bindViewTokenCirculatingSupplyFiat('0.123', coinTicker);

                    assert.strictEqual($('#' + coinTicker + '_circulating_supply_fiat').text(), '0.123');
                }
            });
        });


        describe('#bindViewTokenTotalSupply()', function () {

            beforeEach(function () {
                for (let coinTicker in Constants.coinMap) {
                    assert.strictEqual($('#' + coinTicker + '_total_supply_coin').text(), '');
                }
            });

            it('bind view', function () {
                for (let coinTicker in Constants.coinMap) {
                    coinMarketStatus.bindViewTokenTotalSupply('0.123', coinTicker);

                    assert.strictEqual($('#' + coinTicker + '_total_supply_coin').text(), '0.123');
                }
            });
        });


        describe('#bindViewTokenTotalSupplyFiat()', function () {

            beforeEach(function () {
                for (let coinTicker in Constants.coinMap) {
                    assert.strictEqual($('#' + coinTicker + '_total_supply_fiat').text(), '');
                }
            });

            it('bind view', function () {
                for (let coinTicker in Constants.coinMap) {
                    coinMarketStatus.bindViewTokenTotalSupplyFiat('0.123', coinTicker);

                    assert.strictEqual($('#' + coinTicker + '_total_supply_fiat').text(), '0.123');
                }
            });
        });
    });
});