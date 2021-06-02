var indexJsdom = require('../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../clientjs/zilswap_dex_status.js');
var CoinPriceStatus = require('../../clientjs/coin_price_status.js');
var Constants = require('../../constants.js');

// Prepare expected list
// The array represents: [priceInZil, publicPriceInZil, priceInFiat, totalPoolFiat]
// console.log("'%s': ['%s', '%s', '%s', '%s'],", ticker, $('.' + ticker + '_price_zil:first').text(), $('#public_' + ticker + '_price_zil').text(), $('#public_' + ticker + '_price_fiat').text(),$('#' + ticker + '_lp_total_pool_fiat').text());
let expectedZrcPriceMap = {
    'gZIL': ['1,283', '1,283.17', '151.66', '15,716,635'],
    'XSGD': ['5.980', '5.98', '0.71', '17,236,443'],
    'ZWAP': ['2,622', '2,621.53', '309.84', '50,216,901'],
    'PORT': ['102.5', '102.49', '12.11', '5,473,894'],
    'XPORT': ['0.4397', '0.44', '0.05', '0'],
    'ZLP': ['19.17', '19.17', '2.27', '2,399,858'],
    'REDC': ['21.08', '21.08', '2.49', '498,781'],
    'CARB': ['15.17', '15.17', '1.79', '2,780,378'],
    'SCO': ['7.359', '7.36', '0.87', '3,401,670'],
    'SRV': ['28.53', '28.53', '3.37', '575,905'],
    'DUCK': ['7,334', '7,334.35', '866.85', '91,088'],
    'ELONS': ['20,938', '20,937.67', '2,474.62', '772,963'],
    'ZCH': ['32.20', '32.20', '3.81', '2,026,002'],
    'BOLT': ['0.3044', '0.30', '0.04', '12,531'],
    'ZYRO': ['0.1439', '0.14', '0.02', '499,493'],
    'ZLF': ['159.2', '159.19', '18.81', '467,154'],
    'GARY': ['64,581', '64,581.31', '7,632.86', '432,658'],
    'RECAP': ['4.567', '4.57', '0.54', '18,245'],
    'AXT': ['0.7232', '0.72', '0.09', '347'],
    'GOD': ['0.000494', '0.0005', '0.00006', '750'],
    'SHRK': ['1.768', '1.77', '0.21', '2,344'],
    'XCAD': ['24.85', '24.85', '2.94', '2,907,768'],
}

// The array represents: [priceZil24h, publicPriceInZil24h, publicPriceInZil24hPercentChange, publicPriceFiat24hAgo, publicPriceFiat24hAgoPercentChange]
// console.log("'%s': ['%s', '%s', '%s', '%s', '%s'],", ticker, $('.' + ticker + '_price_zil_24h_ago:first').text(), $('#public_' + ticker + '_price_zil_24h_ago').text(), $('#public_' + ticker + '_price_zil_percent_change_24h').text(),$('#public_' + ticker + '_price_fiat_24h_ago').text(),$('#public_' + ticker + '_price_fiat_percent_change_24h').text());
let expectedZrcPrice24hAgoMap = {
    'gZIL': ['1,728', '1,727.58', '-25.7', '181.72', '-16.5'],
    'XSGD': ['4.118', '4.12', '45.2', '0.43', '63.1'],
    'ZWAP': ['3,799', '3,799.20', '-31.0', '399.64', '-22.5'],
    'PORT': ['269.9', '269.92', '-62.0', '28.39', '-57.3'],
    'XPORT': ['357.5', '357.48', '-99.9', '37.60', '-99.9'],
    'ZLP': ['32.39', '32.39', '-40.8', '3.41', '-33.5'],
    'REDC': ['15.72', '15.72', '34.1', '1.65', '50.6'],
    'CARB': ['16.97', '16.97', '-10.6', '1.78', '0.5'],
    'SCO': ['', '', '', '', ''],
    'SRV': ['19.66', '19.66', '45.1', '2.07', '63.0'],
    'DUCK': ['4,723', '4,723.41', '55.3', '496.86', '74.5'],
    'ELONS': ['18,444', '18,444.06', '13.5', '1,940.13', '27.5'],
    'ZCH': ['17.66', '17.66', '82.3', '1.86', '104.9'],
    'BOLT': ['0.6409', '0.64', '-52.5', '0.07', '-46.6'],
    'ZYRO': ['0.1444', '0.14', '-0.4', '0.02', '12.0'],
    'ZLF': ['42.27', '42.27', '276.6', '4.45', '323.1'],
    'GARY': ['7,008', '7,008.28', '821.5', '737.20', '935.4'],
    'RECAP': ['1.103', '1.10', '314.0', '0.12', '365.1'],
    'AXT': ['0.6356', '0.64', '13.8', '0.07', '27.8'],
    'GOD': ['0.001433', '0.001', '-65.6', '0.0002', '-61.3'],
    'SHRK': ['2.357', '2.36', '-25.0', '0.25', '-15.7'],
    'XCAD': ['', '', '', '', ''],
}

let expectedZrcPriceIdrMap = {
    'gZIL': ['1,283', '1,283.17', '2,068,476', '214,360,055,517'],
    'XSGD': ['5.980', '5.98', '9,639', '235,088,800,778'],
    'ZWAP': ['2,622', '2,621.53', '4,225,908', '684,911,106,208'],
    'PORT': ['102.5', '102.49', '165,206', '74,658,739,289'],
    'XPORT': ['0.4397', '0.44', '709', '559'],
    'ZLP': ['19.17', '19.17', '30,896', '32,731,801,240'],
    'REDC': ['21.08', '21.08', '33,978', '6,802,895,889'],
    'CARB': ['15.17', '15.17', '24,450', '37,921,726,247'],
    'SCO': ['7.359', '7.36', '11,862', '46,395,565,143'],
    'SRV': ['28.53', '28.53', '45,987', '7,854,805,185'],
    'DUCK': ['7,334', '7,334.35', '11,822,968', '1,242,357,442'],
    'ELONS': ['20,938', '20,937.67', '33,751,525', '10,542,491,399'],
    'ZCH': ['32.20', '32.20', '51,907', '27,632,747,904'],
    'BOLT': ['0.3044', '0.30', '491', '170,913,502'],
    'ZYRO': ['0.1439', '0.14', '232', '6,812,615,422'],
    'ZLF': ['159.2', '159.19', '256,614', '6,371,541,744'],
    'GARY': ['64,581', '64,581.31', '104,105,069', '5,901,050,106'],
    'RECAP': ['4.567', '4.57', '7,362', '248,845,552'],
    'AXT': ['0.7232', '0.72', '1,166', '4,737,720'],
    'GOD': ['0.000494', '0.0005', '1', '10,224,723'],
    'SHRK': ['1.768', '1.77', '2,850', '31,967,195'],
    'XCAD': ['24.85', '24.85', '40,061', '39,659,208,291'],
}

let expectedZrcPriceIdr24hAgoMap = {
    'gZIL': ['1,728', '1,727.58', '-25.7', '2,587,917', '-20.1'],
    'XSGD': ['4.118', '4.12', '45.2', '6,169', '56.3'],
    'ZWAP': ['3,799', '3,799.20', '-31.0', '5,691,199', '-25.7'],
    'PORT': ['269.9', '269.92', '-62.0', '404,348', '-59.1'],
    'XPORT': ['357.5', '357.48', '-99.9', '535,507', '-99.9'],
    'ZLP': ['32.39', '32.39', '-40.8', '48,519', '-36.3'],
    'REDC': ['15.72', '15.72', '34.1', '23,553', '44.3'],
    'CARB': ['16.97', '16.97', '-10.6', '25,414', '-3.8'],
    'SCO': ['', '', '', '', ''],
    'SRV': ['19.66', '19.66', '45.1', '29,450', '56.2'],
    'DUCK': ['4,723', '4,723.41', '55.3', '7,075,661', '67.1'],
    'ELONS': ['18,444', '18,444.06', '13.5', '27,629,203', '22.2'],
    'ZCH': ['17.66', '17.66', '82.3', '26,456', '96.2'],
    'BOLT': ['0.6409', '0.64', '-52.5', '960', '-48.9'],
    'ZYRO': ['0.1444', '0.14', '-0.4', '216', '7.2'],
    'ZLF': ['42.27', '42.27', '276.6', '63,326', '305.2'],
    'GARY': ['7,008', '7,008.28', '821.5', '10,498,398', '891.6'],
    'RECAP': ['1.103', '1.10', '314.0', '1,653', '345.5'],
    'AXT': ['0.6356', '0.64', '13.8', '952', '22.4'],
    'GOD': ['0.001433', '0.001', '-65.6', '2', '-62.9'],
    'SHRK': ['2.357', '2.36', '-25.0', '3,531', '-19.3'],
    'XCAD': ['', '', '', '', ''],
}

describe('ZilswapDexStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#constructor()', function () {

        it('create plain object', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);

            assert.strictEqual(zilswapDexStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(zilswapDexStatus.coinPriceStatus_, coinPriceStatus);
            assert.strictEqual(zilswapDexStatus.zilswapDexSmartContractStateData_, null);
            assert.strictEqual(zilswapDexStatus.zilswapDexSmartContractState24hAgoData_, null);
            assert.strictEqual(zilswapDexStatus.zilswapPairPublicStatusMap_, null);
            assert.strictEqual(zilswapDexStatus.zilswapPairPublicStatus24hAgoMap_, null);
        });
    });

    describe('#methods()', function () {
        it('set basic: without 24h ago ', function () {
            // Arrange
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));

            // Act
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexSmartContractStateData,  /* zilswapDexSmartContractState24hAgoData= */ null);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil_24h_ago').each(function () {
                    assert.strictEqual($(this).text(), '');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil_24h_ago').text(), '');
                assert.strictEqual($('#public_' + ticker + '_price_zil_percent_change_24h').text(), '');
                assert.strictEqual($('#public_' + ticker + '_price_fiat_24h_ago').text(), '');
                assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), '');

                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPriceMap[ticker][0]);
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), expectedZrcPriceMap[ticker][1]);
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), expectedZrcPriceMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), expectedZrcPriceMap[ticker][3]);
            }
        });

        it('set basic: with 24h ago ', function () {
            // Arrange
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));

            // Act
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexSmartContractStateData,  zilswapDexSmartContractStateData24hAgo);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil_24h_ago').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPrice24hAgoMap[ticker][0]);
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil_24h_ago').text(), expectedZrcPrice24hAgoMap[ticker][1]);
                assert.strictEqual($('#public_' + ticker + '_price_zil_percent_change_24h').text(), expectedZrcPrice24hAgoMap[ticker][2]);
                assert.strictEqual($('#public_' + ticker + '_price_fiat_24h_ago').text(), expectedZrcPrice24hAgoMap[ticker][3]);
                assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), expectedZrcPrice24hAgoMap[ticker][4]);

                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPriceMap[ticker][0]);
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), expectedZrcPriceMap[ticker][1]);
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), expectedZrcPriceMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), expectedZrcPriceMap[ticker][3]);
            }
        });


        it('set basic, changeCurrency, updated!', function () {
            // Arrange
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexSmartContractStateData,  zilswapDexSmartContractStateData24hAgo);

            // Act
            coinPriceStatus.setActiveCurrencyCode('idr');
            zilswapDexStatus.onCoinPriceStatusChange();

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil_24h_ago').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPriceIdr24hAgoMap[ticker][0]);
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil_24h_ago').text(), expectedZrcPriceIdr24hAgoMap[ticker][1]);
                assert.strictEqual($('#public_' + ticker + '_price_zil_percent_change_24h').text(), expectedZrcPriceIdr24hAgoMap[ticker][2]);
                assert.strictEqual($('#public_' + ticker + '_price_fiat_24h_ago').text(), expectedZrcPriceIdr24hAgoMap[ticker][3]);
                assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), expectedZrcPriceIdr24hAgoMap[ticker][4]);

                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPriceIdrMap[ticker][0]);
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), expectedZrcPriceIdrMap[ticker][1]);
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), expectedZrcPriceIdrMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), expectedZrcPriceIdrMap[ticker][3]);
            }
        });
    });

    describe('#bindViewZrcTokenPriceInZil24hAgo()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil_24h_ago').each(function () {
                    assert.strictEqual($(this).text(), '');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil_24h_ago').text(), '');
                assert.strictEqual($('#public_' + ticker + '_price_zil_percent_change_24h').text(), '');
            }
        });

        it('bind view happy case', function () {
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                zilswapDexStatus.bindViewZrcTokenPriceInZil24hAgo('1234.4', '123', '5.2', ticker);

                // Assert
                $('.' + ticker + '_price_zil_24h_ago').each(function () {
                    assert.strictEqual($(this).text(), '1234.4');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil_24h_ago').text(), '123');
                assert.strictEqual($('#public_' + ticker + '_price_zil_percent_change_24h').text(), '5.2');
            }
        });

        it('bind view random string', function () {
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                zilswapDexStatus.bindViewZrcTokenPriceInZil24hAgo('asdf', 'qwer', 'rfb', ticker);

                // Assert
                $('.' + ticker + '_price_zil_24h_ago').each(function () {
                    assert.strictEqual($(this).text(), 'asdf');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil_24h_ago').text(), 'qwer');
                assert.strictEqual($('#public_' + ticker + '_price_zil_percent_change_24h').text(), 'rfb');
            }
        });
    });

    describe('#bindViewZrcTokenPriceInZil()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), 'Loading...');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                zilswapDexStatus.bindViewZrcTokenPriceInZil('1234.4', '12345.5', ticker);

                // Assert
                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), '1234.4');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), '12345.5');
            }
        });

        it('bind view random string', function () {
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                zilswapDexStatus.bindViewZrcTokenPriceInZil('asdf', 'qwer', ticker);

                // Assert
                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), 'asdf');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), 'qwer');
            }
        });
    });

    describe('#bindViewZrcTokenPriceInFiat24hAgo()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#public_' + ticker + '_price_fiat_24h_ago').text(), '');
                assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), '');
            }
        });

        it('bind view happy case', function () {
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                zilswapDexStatus.bindViewZrcTokenPriceInFiat24hAgo('1234.4', '4322', ticker);

                // Assert
                assert.strictEqual($('#public_' + ticker + '_price_fiat_24h_ago').text(), '1234.4');
                assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), '4322');
            }
        });

        it('bind view random string', function () {
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                zilswapDexStatus.bindViewZrcTokenPriceInFiat24hAgo('asdf', 'qwer', ticker);

                // Assert
                assert.strictEqual($('#public_' + ticker + '_price_fiat_24h_ago').text(), 'asdf');
                assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), 'qwer');
            }
        });
    });

    describe('#bindViewZrcTokenPriceInFiat()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                zilswapDexStatus.bindViewZrcTokenPriceInFiat('1234.4', ticker);

                // Assert
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                zilswapDexStatus.bindViewZrcTokenPriceInFiat('asdf', ticker);

                // Assert
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), 'asdf');
            }
        });
    });

    describe('#bindViewZrcTokenLpTotalPoolBalanceFiat()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                zilswapDexStatus.bindViewZrcTokenLpTotalPoolBalanceFiat('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                zilswapDexStatus.bindViewZrcTokenLpTotalPoolBalanceFiat('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), 'asdf');
            }
        });
    });
});