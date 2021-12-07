var indexJsdom = require('../../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../../clientjs/index//zilswap_dex_status.js');
var CoinPriceStatus = require('../../../clientjs/index//coin_price_status.js');
var TokenUtils = require('../../../clientjs/index//token_utils.js');
var Constants = require('../../../constants.js');

/* ============ Public =========== */

// Prepare expected list
// The array represents: [priceInZil, publicPriceInZil, priceInFiat, totalPoolFiat]
// console.log("'%s': ['%s', '%s', '%s', '%s'],", ticker, $('.' + ticker + '_price_zil:first').text(), $('#public_' + ticker + '_price_zil').text(), $('#public_' + ticker + '_price_fiat').text(),$('#' + ticker + '_lp_total_pool_fiat').text());
let expectedZrcPriceMap = {
    'BOLT': ['0.3044', '0.30', '0.04', '12,531'],
    'CARB': ['15.17', '15.17', '1.79', '2,780,378'],
    'DogZilliqa': ['1,436', '1,435.73', '169.69', '5,659'],
    'DUCK': ['7,334', '7,334.35', '866.85', '91,088'],
    'ELONS': ['20,938', '20,937.67', '2,474.62', '772,963'],
    'FLAT': ['5.219', '5.22', '0.62', '12,537'],
    'GARY': ['64,581', '64,581.31', '7,632.86', '432,658'],
    'gZIL': ['1,283', '1,283.17', '151.66', '15,716,635'],
    'MAMBO': ['0.01177', '0.01', '0.001', '10,299'],
    'PORT': ['102.5', '102.49', '12.11', '5,473,894'],
    'RECAP': ['4.567', '4.57', '0.54', '18,245'],
    'REDC': ['21.08', '21.08', '2.49', '498,781'],
    'SCO': ['7.359', '7.36', '0.87', '3,401,670'],
    'SHRK': ['1.768', '1.77', '0.21', '2,344'],
    'SRV': ['28.53', '28.53', '3.37', '575,905'],
    'XSGD': ['5.980', '5.98', '0.71', '17,236,443'],
    'ZCH': ['32.20', '32.20', '3.81', '2,026,002'],
    'ZLF': ['159.2', '159.19', '18.81', '467,154'],
    'ZLP': ['19.17', '19.17', '2.27', '2,399,858'],
    'ZWAP': ['2,622', '2,621.53', '309.84', '50,216,901'],
    'ZYRO': ['0.1439', '0.14', '0.02', '499,493'],
    'wZIL': ['1.0000', '1.00', '0.12', '23,638,000'],
    'XPORT': ['1.025', '1.02', '0.12', '54,739'],
}
// If token not in the list, i.e., new token, we add default value into the list
for (let ticker in Constants.zrcTokenPropertiesListMap) {
    if (!(ticker in expectedZrcPriceMap)) {
        expectedZrcPriceMap[ticker] = ['0', '0', '0', '0'];
    }
}

// The array represents: [priceZil24h, publicPriceInZil24h, publicPriceInZil24hPercentChange, publicPriceFiat24hAgo, publicPriceFiat24hAgoPercentChange]
// console.log("'%s': ['%s', '%s'],", ticker, $('.' + ticker + '_price_zil_percent_change_24h:first').text(),$('.' + ticker + '_price_fiat_percent_change_24h:first').text());
let expectedZrcPrice24hAgoMap = {
    'BOLT': ['-52.5', '-46.6'],
    'CARB': ['-10.6', '0.5'],
    'DUCK': ['55.3', '74.5'],
    'ELONS': ['13.5', '27.5'],
    'GARY': ['821.5', '935.4'],
    'gZIL': ['-25.7', '-16.5'],
    'PORT': ['-62.0', '-57.3'],
    'RECAP': ['314.0', '365.1'],
    'REDC': ['34.1', '50.6'],
    'SHRK': ['-25.0', '-15.7'],
    'SRV': ['45.1', '63.0'],
    'XSGD': ['45.2', '63.1'],
    'ZCH': ['82.3', '104.9'],
    'ZLF': ['276.6', '323.1'],
    'ZLP': ['-40.8', '-33.5'],
    'ZWAP': ['-31.0', '-22.5'],
    'ZYRO': ['-0.4', '12.0'],
    'wZIL': ['0.0', '12.4'],
    'XPORT': ['-62.0', '-57.3'],
}
// If token not in the list, i.e., new token, we add default value into the list
for (let ticker in Constants.zrcTokenPropertiesListMap) {
    if (!(ticker in expectedZrcPrice24hAgoMap)) {
        expectedZrcPrice24hAgoMap[ticker] = ['', '', '', '', ''];
    }
}

let expectedZrcPriceIdrMap = {
    'BOLT': ['0.3044', '0.30', '491', '170,913,502'],
    'CARB': ['15.17', '15.17', '24,450', '37,921,726,247'],
    'DogZilliqa': ['1,436', '1,435.73', '2,314,397', '77,188,853'],
    'DUCK': ['7,334', '7,334.35', '11,822,968', '1,242,357,442'],
    'ELONS': ['20,938', '20,937.67', '33,751,525', '10,542,491,399'],
    'FLAT': ['5.219', '5.22', '8,413', '170,988,500'],
    'GARY': ['64,581', '64,581.31', '104,105,069', '5,901,050,106'],
    'gZIL': ['1,283', '1,283.17', '2,068,476', '214,360,055,517'],
    'MAMBO': ['0.01177', '0.01', '19', '140,462,769'],
    'PORT': ['102.5', '102.49', '165,206', '74,658,739,289'],
    'RECAP': ['4.567', '4.57', '7,362', '248,845,552'],
    'REDC': ['21.08', '21.08', '33,978', '6,802,895,889'],
    'SCO': ['7.359', '7.36', '11,862', '46,395,565,143'],
    'SHRK': ['1.768', '1.77', '2,850', '31,967,195'],
    'SRV': ['28.53', '28.53', '45,987', '7,854,805,185'],
    'XSGD': ['5.980', '5.98', '9,639', '235,088,800,778'],
    'ZCH': ['32.20', '32.20', '51,907', '27,632,747,904'],
    'ZLF': ['159.2', '159.19', '256,614', '6,371,541,744'],
    'ZLP': ['19.17', '19.17', '30,896', '32,731,801,240'],
    'ZWAP': ['2,622', '2,621.53', '4,225,908', '684,911,106,208'],
    'ZYRO': ['0.1439', '0.14', '232', '6,812,615,422'],
    'wZIL': ['1.0000', '1.00', '1,612', '322,400,000,000'],
    'XPORT': ['1.025', '1.02', '1,652', '746,587,393'],
}

// If token not in the list, i.e., new token, we add default value into the list
for (let ticker in Constants.zrcTokenPropertiesListMap) {
    if (!(ticker in expectedZrcPriceIdrMap)) {
        expectedZrcPriceIdrMap[ticker] = ['0', '0', '0', '0'];
    }
}

let expectedZrcPriceIdr24hAgoMap = {
    'BOLT': ['-52.5', '-48.9'],
    'CARB': ['-10.6', '-3.8'],
    'DUCK': ['55.3', '67.1'],
    'ELONS': ['13.5', '22.2'],
    'GARY': ['821.5', '891.6'],
    'gZIL': ['-25.7', '-20.1'],
    'PORT': ['-62.0', '-59.1'],
    'RECAP': ['314.0', '345.5'],
    'REDC': ['34.1', '44.3'],
    'SHRK': ['-25.0', '-19.3'],
    'SRV': ['45.1', '56.2'],
    'XSGD': ['45.2', '56.3'],
    'ZCH': ['82.3', '96.2'],
    'ZLF': ['276.6', '305.2'],
    'ZLP': ['-40.8', '-36.3'],
    'ZWAP': ['-31.0', '-25.7'],
    'ZYRO': ['-0.4', '7.2'],
    'wZIL': ['0.0', '7.6'],
    'XPORT': ['-62.0', '-59.1'],
}
// If token not in the list, i.e., new token, we add default value into the list
for (let ticker in Constants.zrcTokenPropertiesListMap) {
    if (!(ticker in expectedZrcPriceIdr24hAgoMap)) {
        expectedZrcPriceIdr24hAgoMap[ticker] = ['', '', '', '', ''];
    }
}

/* ============ Personal =========== */

// console.log("'%s': ['%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'],",
// ticker,
// $('#' + ticker + '_lp_pool_share_percent_24h_ago').text(),
// $('#' + ticker + '_lp_zil_balance_24h_ago').text(),
// $('#' + ticker + '_lp_token_balance_24h_ago').text(),
// $('#' + ticker + '_lp_balance_zil_past_range_ago').text(),
// $('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(),
// $('#' + ticker + '_lp_pool_share_percent').text(),
// $('#' + ticker + '_lp_zil_balance').text(),
// $('#' + ticker + '_lp_token_balance').text(),
// $('#' + ticker + '_lp_balance_zil').text(),
// $('#' + ticker + '_lp_balance_fiat_past_range_ago').text(),
// $('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(),
// $('#' + ticker + '_lp_balance_fiat').text());
let expectedPersonalBalanceMap = {
    'ZWAP': ['', '', '', '', '', '0.000534', '1,134', '0.4324', '2,267', '', '', '267.98'],
    'ZLP': ['', '', '', '', '', '0.00890', '903.1', '47.12', '1,806', '', '', '213.47'],
    'REDC': ['', '', '', '', '', '0.0518', '1,093', '51.84', '2,185', '', '', '258.27'],
    'CARB': ['', '', '', '', '', '0.0129', '1,523', '100.4', '3,046', '', '', '360.02'],
}
// If token not in the list, i.e., new token, we add default value into the list
for (let ticker in Constants.zrcTokenPropertiesListMap) {
    if (!(ticker in expectedPersonalBalanceMap)) {
        expectedPersonalBalanceMap[ticker] = ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'];
    }
}

let expectedPersonalBalanceWith24hAgoMap = {
    'ZWAP': ['0.000651', '1,360', '0.3579', '2,720', '-16.6', '0.000534', '1,134', '0.4324', '2,267', '286.07', '-6.3', '267.98'],
    'ZLP': ['0.00966', '1,167', '36.03', '2,334', '-22.6', '0.00890', '903.1', '47.12', '1,806', '245.50', '-13.0', '213.47'],
    'REDC': ['0.183', '935.5', '59.50', '1,871', '16.8', '0.0518', '1,093', '51.84', '2,185', '196.82', '31.2', '258.27'],
    'CARB': ['0.0363', '1,596', '94.08', '3,192', '-4.6', '0.0129', '1,523', '100.4', '3,046', '335.78', '7.2', '360.02'],
}
// If token not in the list, i.e., new token, we add default value into the list
for (let ticker in Constants.zrcTokenPropertiesListMap) {
    if (!(ticker in expectedPersonalBalanceWith24hAgoMap)) {
        expectedPersonalBalanceWith24hAgoMap[ticker] = ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'];
    }
}

let expectedPersonalBalanceWith24hAgoIdrMap = {
    'ZWAP': ['0.000651', '1,360', '0.3579', '2,720', '-16.6', '0.000534', '1,134', '0.4324', '2,267', '4,073,930', '-10.3', '3,654,947'],
    'ZLP': ['0.00966', '1,167', '36.03', '2,334', '-22.6', '0.00890', '903.1', '47.12', '1,806', '3,496,119', '-16.7', '2,911,523'],
    'REDC': ['0.183', '935.5', '59.50', '1,871', '16.8', '0.0518', '1,093', '51.84', '2,185', '2,802,850', '25.7', '3,522,548'],
    'CARB': ['0.0363', '1,596', '94.08', '3,192', '-4.6', '0.0129', '1,523', '100.4', '3,046', '4,781,752', '2.7', '4,910,270'],
}
// If token not in the list, i.e., new token, we add default value into the list
for (let ticker in Constants.zrcTokenPropertiesListMap) {
    if (!(ticker in expectedPersonalBalanceWith24hAgoIdrMap)) {
        expectedPersonalBalanceWith24hAgoIdrMap[ticker] = ['', '', '', '', '', 'Loading...', '', '', '', '', '', 'Loading...'];
    }
}

describe('ZilswapDexStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);

        // bindViewZrcTokenLpBalance24hAgo()
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), '');
            assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), '');
            assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), '');
            assert.strictEqual($('#' + ticker + '_lp_balance_zil_past_range_ago').text(), '');
            assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(), '');
        }

        // bindViewZrcTokenLpBalance()
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'Loading...');
            assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
            assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
            assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), '');
            assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
        }
        assert.strictEqual($('#lp_container').css('display'), 'none');

        // bindViewZrcTokenLpBalanceFiat24hAgo()
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            assert.strictEqual($('#' + ticker + '_lp_balance_fiat_past_range_ago').text(), '');
            assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(), '');
        }

        // bindViewZrcTokenLpBalanceFiat()
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), 'Loading...');
        }
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
            assert.deepStrictEqual(zilswapDexStatus.zilswapPairPersonalStatusMap_, {});
            assert.deepStrictEqual(zilswapDexStatus.zilswapPairPersonalStatus24hAgoMap_, {});
        });
    });

    describe('#methods()', function () {
        it('set basic: without 24h ago ', function () {
            // Arrange
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));

            // Act
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);

            // Assert
            let zilswapSinglePairPublicStatusGzil = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */
                66488850.966800526,
                /* totalPoolZrcTokenAmount= */
                51815.94955267148
            );

            assert.strictEqual(zilswapDexStatus.isWalletAddressSet(), false);

            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPublicStatus('gZIL'), zilswapSinglePairPublicStatusGzil);
            assert.strictEqual(zilswapDexStatus.getZrcPriceInZil('gZIL'), 1283.1734541352732);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPublicStatus('random'), undefined);

            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('gZIL'), undefined);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('random'), undefined);

            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil_percent_change_24h').each(function () {
                    assert.strictEqual($(this).text(), '');
                });
                assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), '');

                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPriceMap[ticker][0]);
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), expectedZrcPriceMap[ticker][1]);
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), expectedZrcPriceMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), expectedZrcPriceMap[ticker][3]);
            }

            zilswapDexStatus.setWalletAddressBase16('asdf');
            assert.strictEqual(zilswapDexStatus.isWalletAddressSet(), true);
        });

        it('set basic: with 24h ago ', function () {
            // Arrange
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));

            // Act
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);

            // Assert
            let zilswapSinglePairPublicStatusZwap24hAgo = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */
                208967662.45707452,
                /* totalPoolZrcTokenAmount= */
                55003.09484344847
            );
            assert.strictEqual(zilswapDexStatus.isWalletAddressSet(), false);

            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPublicStatus24hAgo('ZWAP'), zilswapSinglePairPublicStatusZwap24hAgo);
            assert.strictEqual(zilswapDexStatus.getZrcPriceInZil24hAgo('ZWAP'), 3799.198264240309);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPublicStatus24hAgo('random'), undefined);

            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('ZWAP'), undefined);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('random'), undefined);

            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil_percent_change_24h').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPrice24hAgoMap[ticker][0]);
                });
                $('.' + ticker + '_price_fiat_percent_change_24h').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPrice24hAgoMap[ticker][1]);
                });

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

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);

            // Act
            coinPriceStatus.setActiveCurrencyCode('idr');
            zilswapDexStatus.onCoinPriceStatusChange();

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil_percent_change_24h').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPriceIdr24hAgoMap[ticker][0]);
                });
                $('.' + ticker + '_price_fiat_percent_change_24h').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPriceIdr24hAgoMap[ticker][1]);
                });

                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPriceIdrMap[ticker][0]);
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), expectedZrcPriceIdrMap[ticker][1]);
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), expectedZrcPriceIdrMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), expectedZrcPriceIdrMap[ticker][3]);
            }
        });
    });

    describe('#methods public circulating and total supply()', function () {

        // for (let ticker in Constants.zrcTokenPropertiesListMap) {
        //     console.log("'%s': ['%s', '%s', '%s', '%s'],",
        //         ticker,
        //         $('#' + ticker + '_circulating_supply_zrc').text(),
        //         $('#' + ticker + '_circulating_supply_fiat').text(),
        //         $('#' + ticker + '_total_supply_zrc').text(),
        //         $('#' + ticker + '_total_supply_fiat').text());
        // }
        var expectedCirculatingAndTotalSupplyMap = {
            'gZIL': ['346,029', '52,478,232', '346,029', '52,478,232'],
            'XSGD': ['31,416,534', '22,202,819', '31,416,534', '22,202,819'],
            'ZWAP': ['150,750', '46,708,335', '150,750', '46,708,335'],
            'PORT': ['1,691,713', '20,491,248', '10,000,000', '121,127,223'],
            'XPORT': ['100,000,000', '12,112,722', '100,000,000', '12,112,722'],
            'ZLP': ['1,000,000', '2,265,228', '1,000,000', '2,265,228'],
            'REDC': ['319,493', '795,921', '2,000,000', '4,982,394'],
            'CARB': ['2,760,997', '4,949,542', '10,000,000', '17,926,646'],
            'SCO': ['21,827,496', '18,983,807', '100,000,000', '86,971,987'],
            'SRV': ['182,052', '613,823', '1,000,000', '3,371,690'],
            'DUCK': ['304.7', '264,145', '420.7', '364,674'],
            'ELONS': ['293.8', '727,049', '1000.0', '2,474,623'],
            'ZCH': ['323,425', '1,230,874', '500,000', '1,902,875'],
            'BOLT': ['3,000,000', '107,945', '3,000,000', '107,945'],
            'ZYRO': ['21,220,866', '360,858', '300,000,000', '5,101,463'],
            'ZLF': ['17,927', '337,282', '50,000', '940,731'],
            'GARY': ['80.45', '614,058', '100.00', '763,286'],
            'RECAP': ['200,000', '107,952', '200,000', '107,952'],
            'AXT': ['238,682', '20,401', '311,986', '26,667'],
            'SHRK': ['32,962', '6,887', '91,230,460', '19,061,312'],
        };
        // If token not in the list, i.e., new token, we add default value into the list
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            if (!(ticker in expectedCirculatingAndTotalSupplyMap)) {
                expectedCirculatingAndTotalSupplyMap[ticker] = ['0', '0', '0', '0'];
            }
        }

        it('circulating and total supply is set and shown in view ', function () {
            // Arrange
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));

            let zrcTokensCirculatingSupplyData = JSON.parse("{\"XPORT\": \"1000000000000\", \"gZIL\": \"346029474699163264909\", \"ZWAP\": \"150750452810208786\", \"XSGD\": \"31416533610000\", \"PORT\": \"16917128379\", \"SCO\": \"218274960000\", \"CARB\": \"276099713572760\", \"ZLP\": \"1000000000000000000000000\", \"ZCH\": \"323424763977\", \"REDC\": \"319493437295755\", \"ELONS\": \"293802\", \"SRV\": \"18205194\", \"GARY\": \"804492\", \"ZYRO\": \"2122086556874427\", \"DUCK\": \"30472\", \"ZLF\": \"1792658957\", \"BOLT\": \"3000000000000010000000000\", \"RECAP\": \"200000000000000000\", \"AXT\": \"238682000000\", \"SHRK\": \"32961895429\"}");
            let zrcTokensTotalSupplyData = JSON.parse("{\"gZIL\": \"346029474699163264909\", \"XSGD\": \"31416533610000\", \"ZWAP\": \"150750452810208786\", \"PORT\": \"100000000000\", \"XPORT\": \"1000000000000\", \"ZLP\": \"1000000000000000000000000\", \"REDC\": \"2000000000000000\", \"CARB\": \"1000000000000000\", \"SCO\": \"1000000000000\", \"SRV\": \"100000000\", \"DUCK\": \"42069\", \"ELONS\": \"1000000\", \"ZCH\": \"500000000000\", \"BOLT\": \"3000000000000010000000000\", \"ZYRO\": \"30000000000000000\", \"ZLF\": \"5000000000\", \"GARY\": \"1000000\", \"RECAP\": \"200000000000000000\", \"AXT\": \"311986000000\", \"SHRK\": \"91230460000000\"}");

            // Act
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null, zrcTokensCirculatingSupplyData, zrcTokensTotalSupplyData);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_circulating_supply_zrc').text(), expectedCirculatingAndTotalSupplyMap[ticker][0]);
                assert.strictEqual($('#' + ticker + '_circulating_supply_fiat').text(), expectedCirculatingAndTotalSupplyMap[ticker][1]);
                assert.strictEqual($('#' + ticker + '_total_supply_zrc').text(), expectedCirculatingAndTotalSupplyMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_total_supply_fiat').text(), expectedCirculatingAndTotalSupplyMap[ticker][3]);
            }
        });
    });

    describe('#methodsPersonal()', function () {
        it('set basic: bindViewPersonal() without 24h ago ', function () {
            // Arrange
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));

            // Prepare expected values
            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let zilswapSinglePairPublicStatusZlp = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */
                10152543.808845125,
                /* totalPoolZrcTokenAmount= */
                529716.7651811893
            );
            let shareRatio = 0.00008895090398508389;
            let zilswapSinglePairPersonalStatusZlp = new TokenUtils.ZilswapSinglePairPersonalStatus(shareRatio, zilswapSinglePairPublicStatusZlp);

            // Act
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, walletAddressBase16, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);
            zilswapDexStatus.bindViewPersonalDataIfDataExist();

            // Assert
            // Public
            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPublicStatus('ZLP'), zilswapSinglePairPublicStatusZlp);
            assert.strictEqual(zilswapDexStatus.getZrcPriceInZil('ZLP'), 19.165985440110536);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPublicStatus('random'), undefined);

            // Personal
            assert.strictEqual(zilswapDexStatus.hasBalanceData(), true);
            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('ZLP', walletAddressBase16), zilswapSinglePairPersonalStatusZlp);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus('random'), undefined);

            assert.strictEqual(zilswapDexStatus.getAllPersonalBalanceInZil(), 9304.769369710459);
            assert.strictEqual(zilswapDexStatus.getAllPersonalBalanceInZil24hAgo(), 0);

            // Public
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil_percent_change_24h').each(function () {
                    assert.strictEqual($(this).text(), '');
                });
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
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_past_range_ago').text(), expectedPersonalBalanceMap[ticker][3]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(), expectedPersonalBalanceMap[ticker][4]);

                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), expectedPersonalBalanceMap[ticker][5]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), expectedPersonalBalanceMap[ticker][6]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), expectedPersonalBalanceMap[ticker][7]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), expectedPersonalBalanceMap[ticker][8]);

                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_past_range_ago').text(), expectedPersonalBalanceMap[ticker][9]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(), expectedPersonalBalanceMap[ticker][10]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), expectedPersonalBalanceMap[ticker][11]);

                if (expectedPersonalBalanceMap[ticker][6]) {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
                    assert.strictEqual($('#lp_container').css('display'), 'block');
                } else {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
                }
            }
        });
    });

    describe('#methodsPersonal() with 24h ago', function () {
        var coinPriceStatus;
        var zilswapDexStatus;
        var walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

        beforeEach(function () {
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, walletAddressBase16, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);
        });

        it('set basic: bindViewPersonal() with 24h ago ', function () {
            let zilswapSinglePairPublicStatusZlp24hAgo = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */
                12082076.770067781,
                /* totalPoolZrcTokenAmount= */
                373028.3471918095
            );
            let shareRatio = 0.00009658347940140957;
            let zilswapSinglePairPersonalStatusZlp24hAgo = new TokenUtils.ZilswapSinglePairPersonalStatus(shareRatio, zilswapSinglePairPublicStatusZlp24hAgo);

            // Act
            zilswapDexStatus.bindViewPersonalDataIfDataExist();

            // Assert
            // Public
            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPublicStatus24hAgo('ZLP'), zilswapSinglePairPublicStatusZlp24hAgo);
            assert.strictEqual(zilswapDexStatus.getZrcPriceInZil24hAgo('ZLP'), 32.389165223025884);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPublicStatus24hAgo('random'), undefined);

            // Personal
            assert.strictEqual(zilswapDexStatus.isWalletAddressSet(), true);
            assert.strictEqual(zilswapDexStatus.hasBalanceData(), true);
            assert.deepStrictEqual(zilswapDexStatus.getZilswapPairPersonalStatus24hAgo('ZLP', walletAddressBase16), zilswapSinglePairPersonalStatusZlp24hAgo);
            assert.strictEqual(zilswapDexStatus.getZilswapPairPersonalStatus24hAgo('random'), undefined);

            assert.strictEqual(zilswapDexStatus.getAllPersonalBalanceInZil(), 9304.769369710459);
            assert.strictEqual(zilswapDexStatus.getAllPersonalBalanceInZil24hAgo(), 10116.589684065013);

            // Public
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil_percent_change_24h').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPrice24hAgoMap[ticker][0]);
                });
                $('.' + ticker + '_price_fiat_percent_change_24h').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPrice24hAgoMap[ticker][1]);
                });

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
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_past_range_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][3]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(), expectedPersonalBalanceWith24hAgoMap[ticker][4]);

                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), expectedPersonalBalanceWith24hAgoMap[ticker][5]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), expectedPersonalBalanceWith24hAgoMap[ticker][6]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), expectedPersonalBalanceWith24hAgoMap[ticker][7]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), expectedPersonalBalanceWith24hAgoMap[ticker][8]);

                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_past_range_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][9]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(), expectedPersonalBalanceWith24hAgoMap[ticker][10]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), expectedPersonalBalanceWith24hAgoMap[ticker][11]);

                if (expectedPersonalBalanceWith24hAgoMap[ticker][6]) {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
                    assert.strictEqual($('#lp_container').css('display'), 'block');
                } else {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
                }
            }
        });

        it('bindViewPersonal(), changeCurrency, updated!', function () {
            // Act
            zilswapDexStatus.bindViewPersonalDataIfDataExist();
            coinPriceStatus.setActiveCurrencyCode('idr');
            zilswapDexStatus.onCoinPriceStatusChange();

            // Assert

            // Public
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil_percent_change_24h').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPriceIdr24hAgoMap[ticker][0]);
                });
                $('.' + ticker + '_price_fiat_percent_change_24h').each(function () {
                    assert.strictEqual($(this).text(), expectedZrcPriceIdr24hAgoMap[ticker][1]);
                });

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
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_past_range_ago').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][3]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][4]);

                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][5]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][6]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][7]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][8]);

                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_past_range_ago').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][9]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][10]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), expectedPersonalBalanceWith24hAgoIdrMap[ticker][11]);

                if (expectedPersonalBalanceWith24hAgoIdrMap[ticker][6]) {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
                    assert.strictEqual($('#lp_container').css('display'), 'block');
                } else {
                    assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
                }
            }
        });

        it('bindViewPersonal(), reset(), view reset!', function () {
            zilswapDexStatus.bindViewPersonalDataIfDataExist();
            coinPriceStatus.setActiveCurrencyCode('idr');
            zilswapDexStatus.onCoinPriceStatusChange();

            // Act
            zilswapDexStatus.resetPersonal();

            // Assert
            assert.deepStrictEqual(zilswapDexStatus.zilswapPairPersonalStatusMap_, {});
            assert.deepStrictEqual(zilswapDexStatus.zilswapPairPersonalStatus24hAgoMap_, {});

            assert.strictEqual($('#lp_container').css('display'), 'none');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');

                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), '');

                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), '');

                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), '');

                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_past_range_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(), '');

                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_past_range_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(), '');
            }
        });


        it('bindViewPersonal(), setWalletAddress(), view reset!', function () {
            zilswapDexStatus.bindViewPersonalDataIfDataExist();

            // Act
            zilswapDexStatus.setWalletAddressBase16(walletAddressBase16);

            // Assert
            assert.deepStrictEqual(zilswapDexStatus.zilswapPairPersonalStatusMap_, {});
            assert.deepStrictEqual(zilswapDexStatus.zilswapPairPersonalStatus24hAgoMap_, {});

            assert.strictEqual($('#lp_container').css('display'), 'none');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');

                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), '');

                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), '');

                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), '');

                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_past_range_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(), '');

                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_past_range_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(), '');
            }

            // Act, compute and bind again.
            zilswapDexStatus.computeZilswapPairPublicPersonalStatusMap();
            zilswapDexStatus.bindViewPersonalDataIfDataExist();

            // Personal
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][0]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][1]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_past_range_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][3]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(), expectedPersonalBalanceWith24hAgoMap[ticker][4]);

                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), expectedPersonalBalanceWith24hAgoMap[ticker][5]);
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), expectedPersonalBalanceWith24hAgoMap[ticker][6]);
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), expectedPersonalBalanceWith24hAgoMap[ticker][7]);
                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), expectedPersonalBalanceWith24hAgoMap[ticker][8]);

                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_past_range_ago').text(), expectedPersonalBalanceWith24hAgoMap[ticker][9]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(), expectedPersonalBalanceWith24hAgoMap[ticker][10]);
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), expectedPersonalBalanceWith24hAgoMap[ticker][11]);

                if (expectedPersonalBalanceWith24hAgoMap[ticker][6]) {
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
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_past_range_ago').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(), '');
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
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_past_range_ago').text(), '2468.8');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(), '5.8');
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
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_past_range_ago').text(), 'ert');
                    assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_past_range').text(), 'abcd');
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
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_past_range_ago').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(), '');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpBalanceFiat24hAgo('1234.4', '2.3', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_past_range_ago').text(), '1234.4');
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(), '2.3');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenLpBalanceFiat24hAgo('asdf', 'fdew', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_past_range_ago').text(), 'asdf');
                    assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_past_range').text(), 'fdew');
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
                    $('.' + ticker + '_price_zil_percent_change_24h').each(function () {
                        assert.strictEqual($(this).text(), '');
                    });
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenPriceInZil24hAgo('1234.4', ticker);

                    // Assert
                    $('.' + ticker + '_price_zil_percent_change_24h').each(function () {
                        assert.strictEqual($(this).text(), '1234.4');
                    });
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenPriceInZil24hAgo('asdf', ticker);

                    // Assert
                    $('.' + ticker + '_price_zil_percent_change_24h').each(function () {
                        assert.strictEqual($(this).text(), 'asdf');
                    });
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
                    assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), '');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenPriceInFiat24hAgo('4322', ticker);

                    // Assert

                    $('.' + ticker + '_price_fiat_percent_change_24h').each(function () {
                        assert.strictEqual($(this).text(), '4322');
                    });
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenPriceInFiat24hAgo('qwer', ticker);

                    // Assert
                    $('.' + ticker + '_price_fiat_percent_change_24h').each(function () {
                        assert.strictEqual($(this).text(), 'qwer');
                    });
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
                    assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), '0');
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

        describe('#bindViewZrcTokenCirculatingSupply()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_circulating_supply_zrc').text(), '0');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenCirculatingSupply('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_circulating_supply_zrc').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenCirculatingSupply('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_circulating_supply_zrc').text(), 'asdf');
                }
            });
        });

        describe('#bindViewZrcTokenCirculatingSupplyFiat()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_circulating_supply_fiat').text(), '0');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenCirculatingSupplyFiat('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_circulating_supply_fiat').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenCirculatingSupplyFiat('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_circulating_supply_fiat').text(), 'asdf');
                }
            });
        });

        describe('#bindViewZrcTokenTotalSupply()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_total_supply_zrc').text(), '0');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenTotalSupply('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_total_supply_zrc').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenTotalSupply('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_total_supply_zrc').text(), 'asdf');
                }
            });
        });

        describe('#bindViewZrcTokenTotalSupplyFiat()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_total_supply_fiat').text(), '0');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenTotalSupplyFiat('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_total_supply_fiat').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapDexStatus.bindViewZrcTokenTotalSupplyFiat('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_total_supply_fiat').text(), 'asdf');
                }
            });
        });
    });
});