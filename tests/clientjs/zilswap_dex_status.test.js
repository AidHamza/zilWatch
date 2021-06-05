var indexJsdom = require('../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../clientjs/zilswap_dex_status.js');
var CoinPriceStatus = require('../../clientjs/coin_price_status.js');
var TokenUtils = require('../../clientjs/token_utils.js');
var Constants = require('../../constants.js');

/* ============ Public =========== */

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

/* ============ Personal =========== */

// console.log("'%s': ['%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'],",
// ticker,
// $('#' + ticker + '_lp_pool_share_percent_24h_ago').text(),
// $('#' + ticker + '_lp_zil_balance_24h_ago').text(),
// $('#' + ticker + '_lp_token_balance_24h_ago').text(),
// $('#' + ticker + '_lp_balance_zil_24h_ago').text(),
// $('#' + ticker + '_lp_balance_zil_percent_change_24h').text(),
// $('#' + ticker + '_lp_pool_share_percent').text(),
// $('#' + ticker + '_lp_zil_balance').text(),
// $('#' + ticker + '_lp_token_balance').text(),
// $('#' + ticker + '_lp_balance_zil').text(),
// $('#' + ticker + '_lp_balance_fiat_24h_ago').text(),
// $('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(),
// $('#' + ticker + '_lp_balance_fiat').text());
let expectedPersonalBalanceMap = {
    'gZIL': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'XSGD': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZWAP': ['', '', '', '', '', '0.000534', '1,134', '0.4324', '2,267', '', '', '267.98'],
    'PORT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'XPORT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZLP': ['', '', '', '', '', '0.00890', '903.1', '47.12', '1,806', '', '', '213.47'],
    'REDC': ['', '', '', '', '', '0.0518', '1,093', '51.84', '2,185', '', '', '258.27'],
    'CARB': ['', '', '', '', '', '0.0129', '1,523', '100.4', '3,046', '', '', '360.02'],
    'SCO': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'SRV': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'DUCK': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ELONS': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZCH': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'BOLT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZYRO': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZLF': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'GARY': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'RECAP': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'AXT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'GOD': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'SHRK': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'XCAD': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
}

let expectedPersonalBalanceWith24hAgoMap = {
    'gZIL': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'XSGD': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZWAP': ['0.000651', '1,360', '0.3579', '2,720', '-16.6', '0.000534', '1,134', '0.4324', '2,267', '286.07', '-6.3', '267.98'],
    'PORT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'XPORT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZLP': ['0.00966', '1,167', '36.03', '2,334', '-22.6', '0.00890', '903.1', '47.12', '1,806', '245.50', '-13.0', '213.47'],
    'REDC': ['0.183', '935.5', '59.50', '1,871', '16.8', '0.0518', '1,093', '51.84', '2,185', '196.82', '31.2', '258.27'],
    'CARB': ['0.0363', '1,596', '94.08', '3,192', '-4.6', '0.0129', '1,523', '100.4', '3,046', '335.78', '7.2', '360.02'],
    'SCO': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'SRV': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'DUCK': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ELONS': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZCH': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'BOLT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZYRO': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZLF': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'GARY': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'RECAP': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'AXT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'GOD': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'SHRK': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'XCAD': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
}

let expectedPersonalBalanceWith24hAgoIdrMap = {
    'gZIL': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'XSGD': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZWAP': ['0.000651', '1,360', '0.3579', '2,720', '-16.6', '0.000534', '1,134', '0.4324', '2,267', '4,073,930', '-10.3', '3,654,947'],
    'PORT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'XPORT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZLP': ['0.00966', '1,167', '36.03', '2,334', '-22.6', '0.00890', '903.1', '47.12', '1,806', '3,496,119', '-16.7', '2,911,523'],
    'REDC': ['0.183', '935.5', '59.50', '1,871', '16.8', '0.0518', '1,093', '51.84', '2,185', '2,802,850', '25.7', '3,522,548'],
    'CARB': ['0.0363', '1,596', '94.08', '3,192', '-4.6', '0.0129', '1,523', '100.4', '3,046', '4,781,752', '2.7', '4,910,270'],
    'SCO': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'SRV': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'DUCK': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ELONS': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZCH': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'BOLT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZYRO': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'ZLF': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'GARY': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'RECAP': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'AXT': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'GOD': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'SHRK': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
    'XCAD': ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'],
}

describe('ZilswapDexStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#constructor()', function () {

        it('create plain object', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);

            assert.strictEqual(zilswapDexStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(zilswapDexStatus.coinPriceStatus_, coinPriceStatus);
            assert.strictEqual(zilswapDexStatus.walletAddressBase16_, null);
            assert.strictEqual(zilswapDexStatus.zilswapDexSmartContractStateData_, null);
            assert.strictEqual(zilswapDexStatus.zilswapDexSmartContractState24hAgoData_, null);
            assert.deepStrictEqual(zilswapDexStatus.zilswapPairPublicStatusMap_, {});
            assert.deepStrictEqual(zilswapDexStatus.zilswapPairPublicStatus24hAgoMap_, {});
            assert.deepStrictEqual(zilswapDexStatus.zilswapPairPublicStatusMap_, {});
            assert.deepStrictEqual(zilswapDexStatus.zilswapPairPublicStatus24hAgoMap_, {});
        });
    });

    describe('#methods()', function () {
        it('set basic: without 24h ago ', function () {
            // Arrange
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));

            // Act
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);

            // Assert
            let zilswapSinglePairPublicStatusGzil = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */
                66488850.966800526,
                /* totalPoolZrcTokenAmount= */
                51815.94955267148,
                /* zrcTokenPriceInZil= */
                1283.1734541352732
            );

            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPublicStatus('gZIL'), zilswapSinglePairPublicStatusGzil);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPublicStatus('random'), undefined);

            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('gZIL'), undefined);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('random'), undefined);

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
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);

            // Assert
            let zilswapSinglePairPublicStatusZwap24hAgo = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */
                208967662.45707452,
                /* totalPoolZrcTokenAmount= */
                55003.09484344847,
                /* zrcTokenPriceInZil= */
                3799.198264240309
            );
            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPublicStatus24hAgo('ZWAP'), zilswapSinglePairPublicStatusZwap24hAgo);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPublicStatus24hAgo('random'), undefined);

            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('ZWAP'), undefined);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('random'), undefined);

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
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);

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

    describe('#methodsPersonal()', function () {
        it('set basic: bindViewPersonal() without 24h ago ', function () {
            // Arrange
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));

            // Prepare expected values
            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let zilswapSinglePairPublicStatusZlp = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */
                10152543.808845125,
                /* totalPoolZrcTokenAmount= */
                529716.7651811893,
                /* zrcTokenPriceInZil= */
                9.165985440110536,
            );
            let shareRatio = 0.00008895090398508389;
            let zilswapSinglePairPersonalStatusZlp = new TokenUtils.ZilswapSinglePairPersonalStatus(shareRatio, zilswapSinglePairPublicStatusZlp);

            // Act
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, walletAddressBase16, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);
            zilswapDexStatus.bindViewPersonalDataIfDataExist();

            // Assert
            // Public
            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPublicStatus('ZLP'), zilswapSinglePairPublicStatusZlp);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPublicStatus('random'), undefined);

            // Personal
            assert.strictEqual(zilswapDexStatus.hasBalanceData(), true);
            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('ZLP', walletAddressBase16), zilswapSinglePairPersonalStatusZlp);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('random'), undefined);

            // Public
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

            // Personal
            for (let ticker in Constants.zrcTokenPropertiesListMap) {

                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), expectedPersonalBalanceMap[ticker][0]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), expectedPersonalBalanceMap[ticker][1]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), expectedPersonalBalanceMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), expectedPersonalBalanceMap[ticker][3]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_24h').text(), expectedPersonalBalanceMap[ticker][4]);

                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), expectedPersonalBalanceMap[ticker][5]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), expectedPersonalBalanceMap[ticker][6]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), expectedPersonalBalanceMap[ticker][7]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), expectedPersonalBalanceMap[ticker][8]);

                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), expectedPersonalBalanceMap[ticker][9]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), expectedPersonalBalanceMap[ticker][10]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), expectedPersonalBalanceMap[ticker][11]);

                if (expectedPersonalBalanceMap[ticker][6]) {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
                    assert.strictEqual($('#lp_container').css('display'), 'block');
                } else {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
                }
            }
        });

        it('set basic: bindViewPersonal() with 24h ago ', function () {
            // Arrange
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));

            // Prepare expected values
            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let zilswapSinglePairPublicStatusZlp24hAgo = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */
                12082076.770067781,
                /* totalPoolZrcTokenAmount= */
                373028.3471918095,
                /* zrcTokenPriceInZil= */
                32.389165223025884,
            );
            let shareRatio = 0.00009658347940140957;
            let zilswapSinglePairPersonalStatusZlp24hAgo = new TokenUtils.ZilswapSinglePairPersonalStatus(shareRatio, zilswapSinglePairPublicStatusZlp24hAgo);

            // Act
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, walletAddressBase16, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);
            zilswapDexStatus.bindViewPersonalDataIfDataExist();

            // Assert
            // Public
            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPublicStatus24hAgo('ZLP'), zilswapSinglePairPublicStatusZlp24hAgo);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPublicStatus24hAgo('random'), undefined);

            // Personal
            assert.strictEqual(zilswapDexStatus.hasBalanceData(), true);
            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPersonalStatus24hAgo('ZLP', walletAddressBase16), zilswapSinglePairPersonalStatusZlp24hAgo);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus24hAgo('random'), undefined);

            // Public
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

            // Personal
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][0]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][1]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][3]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_24h').text(), expectedPersonalBalanceWith24hAgoMap[ticker][4]);

                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), expectedPersonalBalanceWith24hAgoMap[ticker][5]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), expectedPersonalBalanceWith24hAgoMap[ticker][6]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), expectedPersonalBalanceWith24hAgoMap[ticker][7]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), expectedPersonalBalanceWith24hAgoMap[ticker][8]);

                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][9]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), expectedPersonalBalanceWith24hAgoMap[ticker][10]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), expectedPersonalBalanceWith24hAgoMap[ticker][11]);

                if (expectedPersonalBalanceWith24hAgoMap[ticker][6]) {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
                    assert.strictEqual($('#lp_container').css('display'), 'block');
                } else {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
                }
            }
        });

        it('set basic, changeCurrency, updated!', function () {
            // Arrange
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, walletAddressBase16, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);

            // Act
            zilswapDexStatus.bindViewPersonalDataIfDataExist();
            coinPriceStatus.setActiveCurrencyCode('idr');
            zilswapDexStatus.onCoinPriceStatusChange();

            // Assert

            // Public
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

            // Personal
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][0]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][1]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][3]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_24h').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][4]);

                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][5]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][6]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][7]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][8]);

                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][9]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][10]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][11]);

                if (expectedPersonalBalanceWith24hAgoIdrMap[ticker][6]) {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
                    assert.strictEqual($('#lp_container').css('display'), 'block');
                } else {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
                }
            }

        });
    });

    describe('bindViewPersonal', function () {

        var zilswapDexStatus;

        beforeEach(function () {
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
        });

        describe('#bindViewZrcTokenLpBalance24hAgo()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_24h').text(), '');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpBalance24hAgo( /* poolSharePercent= */ '0.0012', /* zilBalance= */ '1234.4', /* zrcBalance = */ '54.43', /* balanceZil= */ '2468.8', /* percentChange= */ '5.8', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), '0.0012');
                    assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), '1234.4');
                    assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), '54.43');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), '2468.8');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_24h').text(), '5.8');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpBalance24hAgo( /* poolSharePercent= */ 'asdf', /* zilBalance= */ 'hjkl', /* zrcBalance = */ 'qwer', /* balanceZil= */ 'ert', /* percentChange= */ 'abcd', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), 'hjkl');
                    assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), 'qwer');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), 'ert');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_24h').text(), 'abcd');
                }
            });
        });

        describe('#bindViewZrcTokenLpBalance()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'Loading...');
                    assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
                }
                assert.strictEqual($('#lp_container').css('display'), 'none');
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpBalance( /* poolSharePercent= */ '0.0012', /* zilBalance= */ '1234.4', /* zrcBalance = */ '54.43', /* balanceZil= */ '2468.8', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), '0.0012');
                    assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '1234.4');
                    assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '54.43');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), '2468.8');
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
                    assert.strictEqual($('#lp_container').css('display'), 'block');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpBalance( /* poolSharePercent= */ 'asdf', /* zilBalance= */ 'hjkl', /* zrcBalance = */ 'qwer', /* balanceZil= */ 'ert', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'asdf');
                    assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), 'hjkl');
                    assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), 'qwer');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), 'ert');
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
                    assert.strictEqual($('#lp_container').css('display'), 'block');
                }
            });
        });

        describe('#bindViewZrcTokenLpBalanceFiat24hAgo()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), '');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpBalanceFiat24hAgo('1234.4', '2.3', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), '1234.4');
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), '2.3');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpBalanceFiat24hAgo('asdf', 'fdew', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), 'fdew');
                }
            });
        });

        describe('#bindViewZrcTokenLpBalanceFiat()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), 'Loading...');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpBalanceFiat('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpBalanceFiat('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), 'asdf');
                }
            });
        });
    });

    describe('bindViewPublic', function () {
        var zilswapDexStatus;

        beforeEach(function () {
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
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
                        assert.strictEqual($(this).text(), '0');
                    });
                    assert.strictEqual($('#public_' + ticker + '_price_zil').text(), '0');
                }
            });

            it('bind view happy case', function () {
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
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenPriceInFiat24hAgo('1234.4', '4322', ticker);

                    // Assert
                    assert.strictEqual($('#public_' + ticker + '_price_fiat_24h_ago').text(), '1234.4');
                    assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), '4322');
                }
            });

            it('bind view random string', function () {
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
                    assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), '0');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenPriceInFiat('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
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
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpTotalPoolBalanceFiat('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpTotalPoolBalanceFiat('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), 'asdf');
                }
            });
        });
    });
});