var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var assert = require('assert');
var CoinPriceStatus = require('../../clientjs/coin_price_status.js');
var Constants = require('../../constants.js');

describe('CoinPriceStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#constructor()', function () {

        it('create plain object', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);

            assert.strictEqual(coinPriceStatus.coinMap_, Constants.coinMap);
            assert.strictEqual(coinPriceStatus.currencyMap_, Constants.currencyMap);
            assert.strictEqual(coinPriceStatus.activeCurrencyCode_, 'usd');
            assert.strictEqual(coinPriceStatus.coinPriceCoingeckoData_, null);
            assert.strictEqual(coinPriceStatus.coinPriceCoingecko24hAgoData_, null);
        });
    });

    describe('#methods()', function () {
        it('set basic: zil usd, without 24h ago ', function () {
            // Arrange
            let dataString = '{"zilliqa":{"usd":0.11819}}';
            let dataObject = JSON.parse(dataString);

            // Act
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);

            // Assert getter
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('ZIL'), 0.11819);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('ZIL'), null);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('ETH'), null);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('ETH'), null);
            
            // Assert UI
            assert.strictEqual($('#public_ZIL_price_fiat_percent_change_24h').text(), '');
            assert.strictEqual($('#public_ZIL_price_zil_percent_change_24h').text(), '');
            $('.ZIL_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '0.1182');
            });
            $(".currency_symbol").each(function () {
                assert.strictEqual($(this).text(), '$');
            });
            $('.ZIL_price_zil').each(function () {
                assert.strictEqual($(this).text(), '1.00');
            });
        });

        it('set basic: zil usd, ', function () {
            // Arrange
            let dataString = '{"zilliqa":{"usd":0.11819}}';
            let dataObject = JSON.parse(dataString);
            let dataString24hAgo = '{"zilliqa":{"usd":0.10819}}';
            let dataObject24hAgo = JSON.parse(dataString24hAgo);

            // Act
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ dataObject24hAgo);

            // Assert getter
            assert.strictEqual(coinPriceStatus.getCurrentActiveDollarSymbol(), '$');
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('ZIL'), 0.11819);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('ZIL'), 0.10819);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('ETH'), null);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('ETH'), null);
            
            // Assert UI
            $(".currency_symbol").each(function () {
                assert.strictEqual($(this).text(), '$');
            });

            assert.strictEqual($('#public_ZIL_price_fiat_percent_change_24h').text(), '9.2');
            assert.strictEqual($('#public_ZIL_price_zil_percent_change_24h').text(), '0.0');
            $('.ZIL_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '0.1182');
            });
            $('.ZIL_price_zil').each(function () {
                assert.strictEqual($(this).text(), '1.00');
            });
        });

        it('set zil, eth, btc: usd, sgd, idr', function () {
            // Arrange
            let dataString = '{"bitcoin":{"usd":36849,"sgd":48679,"idr":524710026},"ethereum":{"usd":2619.41,"sgd":3460.34,"idr":37299229},"zilliqa":{"usd":0.119358,"sgd":0.157676,"idr":1699.6}}';
            let dataObject = JSON.parse(dataString);
            let dataString24hAgo = '{"bitcoin":{"usd":35774,"sgd":45174,"idr":484710026},"ethereum":{"usd":3214.41,"sgd":5160.31,"idr":51299329},"zilliqa":{"usd":0.129318,"sgd":0.169686,"idr":2179.6}}';
            let dataObject24hAgo = JSON.parse(dataString24hAgo);

            // Act
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ dataObject24hAgo);

            // Assert getter (default 'usd')
            assert.strictEqual(coinPriceStatus.getCurrentActiveDollarSymbol(), '$');
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('ZIL'), 0.119358);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('ZIL'), 0.129318);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('ETH'), 2619.41);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('ETH'), 3214.41);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('BTC'), 36849);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('BTC'), 35774);
            
            // Assert UI (default 'usd')
            $(".currency_symbol").each(function () {
                assert.strictEqual($(this).text(), '$');
            });

            assert.strictEqual($('#public_ZIL_price_fiat_percent_change_24h').text(), '-7.7');
            assert.strictEqual($('#public_ZIL_price_zil_percent_change_24h').text(), '0.0');
            $('.ZIL_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '0.1194');
            });
            $('.ZIL_price_zil').each(function () {
                assert.strictEqual($(this).text(), '1.00');
            });

            assert.strictEqual($('#public_ETH_price_fiat_percent_change_24h').text(), '-18.5');
            assert.strictEqual($('#public_ETH_price_zil_percent_change_24h').text(), '-11.7');
            $('.ETH_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '2,619.41');
            });
            $('.ETH_price_zil').each(function () {
                assert.strictEqual($(this).text(), '21,945.83');
            });

            assert.strictEqual($('#public_BTC_price_fiat_percent_change_24h').text(), '3.0');
            assert.strictEqual($('#public_BTC_price_zil_percent_change_24h').text(), '11.6');
            $('.BTC_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '36,849.00');
            });
            $('.BTC_price_zil').each(function () {
                assert.strictEqual($(this).text(), '308,726.69');
            });
        });

        it('setActiveCurrency(idr): zil, eth, btc: usd, sgd, idr, bindView() updated', function () {
            // Arrange
            let dataString = '{"bitcoin":{"usd":36849,"sgd":48679,"idr":524710026},"ethereum":{"usd":2619.41,"sgd":3460.34,"idr":37299229},"zilliqa":{"usd":0.119358,"sgd":0.157676,"idr":1699.6}}';
            let dataObject = JSON.parse(dataString);
            let dataString24hAgo = '{"bitcoin":{"usd":35774,"sgd":45174,"idr":484710026},"ethereum":{"usd":3214.41,"sgd":5160.31,"idr":51299329},"zilliqa":{"usd":0.129318,"sgd":0.169686,"idr":2179.6}}';
            let dataObject24hAgo = JSON.parse(dataString24hAgo);

            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ dataObject24hAgo);
            
            // Act
            coinPriceStatus.setActiveCurrencyCode('idr');

            // Assert getter (default 'usd')
            assert.strictEqual(coinPriceStatus.getCurrentActiveDollarSymbol(), 'Rp');
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('ZIL'), 1699.6);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('ZIL'), 2179.6);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('ETH'), 37299229);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('ETH'), 51299329);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('BTC'), 524710026);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('BTC'), 484710026);
            
            // Assert UI (default 'usd')
            $(".currency_symbol").each(function () {
                assert.strictEqual($(this).text(), 'Rp');
            });

            assert.strictEqual($('#public_ZIL_price_fiat_percent_change_24h').text(), '-22.0');
            assert.strictEqual($('#public_ZIL_price_zil_percent_change_24h').text(), '0.0');
            $('.ZIL_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '1,700');
            });
            $('.ZIL_price_zil').each(function () {
                assert.strictEqual($(this).text(), '1.00');
            });

            assert.strictEqual($('#public_ETH_price_fiat_percent_change_24h').text(), '-27.3');
            assert.strictEqual($('#public_ETH_price_zil_percent_change_24h').text(), '-6.8');
            $('.ETH_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '37,299,229');
            });
            $('.ETH_price_zil').each(function () {
                assert.strictEqual($(this).text(), '21,945.89');
            });

            assert.strictEqual($('#public_BTC_price_fiat_percent_change_24h').text(), '8.3');
            assert.strictEqual($('#public_BTC_price_zil_percent_change_24h').text(), '38.8');
            $('.BTC_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '524,710,026');
            });
            $('.BTC_price_zil').each(function () {
                assert.strictEqual($(this).text(), '308,725.60');
            });
        });

        it('setActiveCurrency() valid currency, but not available in data, getCoinPriceFiat return null, bindView() no op', function () {
            // Arrange
            let dataString = '{"bitcoin":{"usd":36849,"sgd":48679,"idr":524710026},"ethereum":{"usd":2619.41,"sgd":3460.34,"idr":37299229},"zilliqa":{"usd":0.119358,"sgd":0.157676,"idr":1699.6}}';
            let dataObject = JSON.parse(dataString);
            let dataString24hAgo = '{"bitcoin":{"usd":35774,"sgd":45174,"idr":484710026},"ethereum":{"usd":3214.41,"sgd":5160.31,"idr":51299329},"zilliqa":{"usd":0.129318,"sgd":0.169686,"idr":2179.6}}';
            let dataObject24hAgo = JSON.parse(dataString24hAgo);

            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ dataObject24hAgo);

            // Act
            coinPriceStatus.setActiveCurrencyCode('krw');

            // Assert getter (default 'usd')
            assert.strictEqual(coinPriceStatus.getCurrentActiveDollarSymbol(), '₩');
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('ZIL'), null);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('ZIL'), null);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('ETH'), null);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('ETH'), null);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat('BTC'), null);
            assert.strictEqual(coinPriceStatus.getCoinPriceFiat24hAgo('BTC'), null);
            
            // Assert UI (default 'usd')
            $(".currency_symbol").each(function () {
                assert.strictEqual($(this).text(), '$');
            });

            assert.strictEqual($('#public_ZIL_price_fiat_percent_change_24h').text(), '-7.7');
            assert.strictEqual($('#public_ZIL_price_zil_percent_change_24h').text(), '0.0');
            $('.ZIL_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '0.1194');
            });
            $('.ZIL_price_zil').each(function () {
                assert.strictEqual($(this).text(), '1.00');
            });

            assert.strictEqual($('#public_ETH_price_fiat_percent_change_24h').text(), '-18.5');
            assert.strictEqual($('#public_ETH_price_zil_percent_change_24h').text(), '-11.7');
            $('.ETH_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '2,619.41');
            });
            $('.ETH_price_zil').each(function () {
                assert.strictEqual($(this).text(), '21,945.83');
            });

            assert.strictEqual($('#public_BTC_price_fiat_percent_change_24h').text(), '3.0');
            assert.strictEqual($('#public_BTC_price_zil_percent_change_24h').text(), '11.6');
            $('.BTC_price_fiat').each(function () {
                assert.strictEqual($(this).text(), '36,849.00');
            });
            $('.BTC_price_zil').each(function () {
                assert.strictEqual($(this).text(), '308,726.69');
            });
        });
    });

    describe('#bindViewCoinPriceInFiat24hAgo()', function () {

        it('bind view price in fiat', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            for (let coinTicker in Constants.coinMap) {
                // Act
                coinPriceStatus.bindViewCoinPriceInFiat24hAgo('0.123', coinTicker);

                // Assert
                assert.strictEqual($('#public_' + coinTicker + '_price_fiat_percent_change_24h').text(), '0.123');
            }
        });

        it('bind view random string', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            for (let coinTicker in Constants.coinMap) {
                // Act
                coinPriceStatus.bindViewCoinPriceInFiat24hAgo('asdf', coinTicker);

                // Assert
                assert.strictEqual($('#public_' + coinTicker + '_price_fiat_percent_change_24h').text(), 'asdf');
            }
        });
    });

    describe('#bindViewCoinPriceInFiat()', function () {

        it('bind view price in fiat', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            for (let coinTicker in Constants.coinMap) {
                // Act
                coinPriceStatus.bindViewCoinPriceInFiat('Rp', '0.123', coinTicker);

                // Assert
                $('.' + coinTicker + '_price_fiat').each(function () {
                    assert.strictEqual($(this).text(), '0.123');
                });
                $(".currency_symbol").each(function () {
                    assert.strictEqual($(this).text(), 'Rp');
                });
            }
        });

        it('bind view random string', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            for (let coinTicker in Constants.coinMap) {
                // Act
                coinPriceStatus.bindViewCoinPriceInFiat('qwer', 'asdf', coinTicker);

                // Assert
                $('.' + coinTicker + '_price_fiat').each(function () {
                    assert.strictEqual($(this).text(), 'asdf');
                });
                $(".currency_symbol").each(function () {
                    assert.strictEqual($(this).text(), 'qwer');
                });
            }
        });
    });

    describe('#bindViewCoinPriceInZil24hAgo()', function () {

        it('bind view price in fiat', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            for (let coinTicker in Constants.coinMap) {
                // Act
                coinPriceStatus.bindViewCoinPriceInZil24hAgo('0.123', coinTicker);

                // Assert
                assert.strictEqual($('#public_' + coinTicker + '_price_zil_percent_change_24h').text(), '0.123');
            }
        });

        it('bind view random string', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            for (let coinTicker in Constants.coinMap) {
                // Act
                coinPriceStatus.bindViewCoinPriceInZil24hAgo('asdf', coinTicker);

                // Assert
                assert.strictEqual($('#public_' + coinTicker + '_price_zil_percent_change_24h').text(), 'asdf');
            }
        });
    });

    describe('#bindViewCoinPriceInZil()', function () {

        it('bind view price in fiat', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            for (let coinTicker in Constants.coinMap) {
                // Act
                coinPriceStatus.bindViewCoinPriceInZil('0.123', coinTicker);

                // Assert
                $('.' + coinTicker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), '0.123');
                });
            }
        });

        it('bind view random string', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            for (let coinTicker in Constants.coinMap) {
                // Act
                coinPriceStatus.bindViewCoinPriceInZil('asdf', coinTicker);

                // Assert
                $('.' + coinTicker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), 'asdf');
                });
            }
        });
    });
});