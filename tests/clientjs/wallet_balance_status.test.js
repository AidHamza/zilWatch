var indexJsdom = require('../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../clientjs/zilswap_dex_status.js');
var CoinPriceStatus = require('../../clientjs/coin_price_status.js');
var WalletBalanceStatus = require('../../clientjs/wallet_balance_status.js');
var Constants = require('../../constants.js');

describe('WalletBalanceStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);

        // bindViewZilBalance()
        assert.strictEqual($('#zil_balance').text(), 'Loading...');

        // bindViewZrcTokenWalletBalance()
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            assert.strictEqual($('#' + ticker + '_balance').text(), 'Loading...');
            assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');
        }

        // bindViewZilBalanceFiat24hAgo()
        assert.strictEqual($('#zil_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), '');

        // bindViewZilBalanceFiat()
        assert.strictEqual($('#zil_balance_fiat').text(), 'Loading...');

        // bindViewZrcTokenWalletBalanceZil24hAgo()
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), '');
        }

        // bindViewZrcTokenWalletBalanceZil()
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'Loading...');
        }

        // bindViewZrcTokenWalletBalanceFiat24hAgo()
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), '');
        }

        // bindViewZrcTokenWalletBalanceFiat()
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            assert.strictEqual($('#' + ticker + '_balance_fiat').text(), 'Loading...');
        }
    });

    describe('#constructor()', function () {

        it('create plain object', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            let walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBase16= */ null, /* zilBalanceData= */ null, /* zrcBalanceDataMap= */ null);
    
            assert.strictEqual(walletBalanceStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(walletBalanceStatus.coinPriceStatus_, coinPriceStatus);
            assert.strictEqual(walletBalanceStatus.zilswapDexStatus_, zilswapDexStatus);
            assert.strictEqual(walletBalanceStatus.walletAddressBase16_, null);
            assert.strictEqual(walletBalanceStatus.zilBalanceData_, null);
            assert.deepStrictEqual(walletBalanceStatus.zrcBalanceDataMap_, {});
        });
    });

    describe('#methods(), without 24h ago', function () {
        // console.log("'%s': ['%s', '', '', '', '%s', '%s', '%s'],",
        // 'ZIL',
        // $('#zil_balance').text(),
        // $('#zil_balance_fiat').text(),
        // $('#zil_balance_fiat_24h_ago').text(),
        // $('#zil_balance_fiat_percent_change_24h').text());

        // console.log("'%s': ['%s', '%s', '%s', '%s', '%s', '%s', '%s'],",
        // ticker,
        // $('#' + ticker + '_balance').text(),
        // $('#' + ticker + '_balance_zil').text(),
        // $('#' + ticker + '_balance_zil_24h_ago').text(),
        // $('#' + ticker + '_balance_zil_percent_change_24h').text(),
        // $('#' + ticker + '_balance_fiat').text(),
        // $('#' + ticker + '_balance_fiat_24h_ago').text(),
        // $('#' + ticker + '_balance_fiat_percent_change_24h').text());
        
        var expectedDataMap = {
            'ZIL': ['7,477', '', '', '', '883.66', '', ''],
            'gZIL': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'XSGD': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZWAP': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'PORT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'XPORT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZLP': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'REDC': ['0.6579', '13.87', '', '', '1.64', '', ''],
            'CARB': ['11.53', '174.9', '', '', '20.67', '', ''],
            'SCO': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'SRV': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'DUCK': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ELONS': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZCH': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'BOLT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZYRO': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZLF': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'GARY': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'RECAP': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'AXT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'GOD': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'SHRK': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'XCAD': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
        }

        let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
        var coinPriceStatus;
        var coinPriceStatus;
        var zilBalanceData;
        var zrcBalanceData;
        var walletBalanceStatus;

        beforeEach(function () {
            // Arrange
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData,  /* zilswapDexSmartContractState24hAgoData= */ null);
            
            zilBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balance":"7476589135982234","nonce":46}}');

            let redcBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"657942857"}}}');
            let carbBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"1152887420"}}}');
            let zwapBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x55bda0a066942d33103cfc47f08d0338536184ef":"54342341"}}}');
            zrcBalanceData = {
                'REDC': redcBalanceData,
                'CARB': carbBalanceData,
                'ZWAP': zwapBalanceData,
            }
            
            walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBase16= */ null, zilBalanceData, zrcBalanceData);
        });

        it('no action, no token balance data', function () {
            // Assert
            assert.strictEqual(walletBalanceStatus.getTokenBalance('ZIL'), undefined);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual(walletBalanceStatus.getTokenBalance(ticker), undefined);
            }
        });

        it('compute, wallet not set, no token balance data', function () {
            // Act
            walletBalanceStatus.computeTokenBalanceMap('REDC');

            // Assert
            assert.strictEqual(walletBalanceStatus.getTokenBalance('ZIL'), undefined);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual(walletBalanceStatus.getTokenBalance(ticker), undefined);
            }
        });

        
        it('compute, wallet set, have token balance data', function () {
            walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletAddressBase16, zilBalanceData, zrcBalanceData);
            
            // Act
            walletBalanceStatus.computeTokenBalanceMap('REDC');

            // Assert
            assert.strictEqual(walletBalanceStatus.getTokenBalance('ZIL'), undefined);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                if (ticker === 'REDC') {
                    continue;
                }
                assert.strictEqual(walletBalanceStatus.getTokenBalance(ticker), undefined);
            }
            assert.strictEqual(walletBalanceStatus.getTokenBalance('REDC'), 0.657942857);
        });

        it('compute, wallet set, bindView(), assertView', function () {
            walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletAddressBase16, zilBalanceData, zrcBalanceData);
            
            // Act
            walletBalanceStatus.computeTokenBalanceMap('ZIL');
            walletBalanceStatus.bindViewIfDataExist('ZIL');
            walletBalanceStatus.bindViewDataFiat('ZIL');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                walletBalanceStatus.computeTokenBalanceMap(ticker);
                walletBalanceStatus.bindViewIfDataExist(ticker);
                walletBalanceStatus.bindViewDataFiat(ticker);
            }

            assert.strictEqual($('#zil_balance').text(), expectedDataMap['ZIL'][0]);
            assert.strictEqual($('#zil_balance_fiat').text(), expectedDataMap['ZIL'][4]);
            assert.strictEqual($('#zil_balance_fiat_24h_ago').text(),  expectedDataMap['ZIL'][5]);
            assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), expectedDataMap['ZIL'][6]);
            
            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                if (Number.isNaN(parseFloat(expectedDataMap[ticker][0]))) {
                    assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');
                } else {
                    assert.strictEqual($('#' + ticker + '_container').css('display'), 'block');
                }
                
                assert.strictEqual($('#' + ticker + '_balance').text(),  expectedDataMap[ticker][0]);
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), expectedDataMap[ticker][1]);
                assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), expectedDataMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), expectedDataMap[ticker][3]);
                
                assert.strictEqual($('#' + ticker + '_balance_fiat').text(), expectedDataMap[ticker][4]);
                assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), expectedDataMap[ticker][5]);
                assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), expectedDataMap[ticker][6]);
            }
        });

        it('compute, wallet set, bindView(), resetView(), viwe reset', function () {
            walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletAddressBase16, zilBalanceData, zrcBalanceData);
            
            walletBalanceStatus.computeTokenBalanceMap('ZIL');
            walletBalanceStatus.bindViewIfDataExist('ZIL');
            walletBalanceStatus.bindViewDataFiat('ZIL');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                walletBalanceStatus.computeTokenBalanceMap(ticker);
                walletBalanceStatus.bindViewIfDataExist(ticker);
                walletBalanceStatus.bindViewDataFiat(ticker);
            }

            // Act
            walletBalanceStatus.reset();

            // bindViewZilBalance()
            assert.strictEqual($('#zil_balance').text(), 'Loading...');
            assert.strictEqual($('#zil_balance_fiat').text(), 'Loading...');
            assert.strictEqual($('#zil_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), '');

            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');
                assert.strictEqual($('#' + ticker + '_balance').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), '');
                assert.strictEqual($('#' + ticker + '_balance_fiat').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), '');
            }
        });
    });

    describe('#methods(), with 24h ago, in idr', function () {
        // console.log("'%s': ['%s', '', '', '', '%s', '%s', '%s'],",
        // 'ZIL',
        // $('#zil_balance').text(),
        // $('#zil_balance_fiat').text(),
        // $('#zil_balance_fiat_24h_ago').text(),
        // $('#zil_balance_fiat_percent_change_24h').text());

        // console.log("'%s': ['%s', '%s', '%s', '%s', '%s', '%s', '%s'],",
        // ticker,
        // $('#' + ticker + '_balance').text(),
        // $('#' + ticker + '_balance_zil').text(),
        // $('#' + ticker + '_balance_zil_24h_ago').text(),
        // $('#' + ticker + '_balance_zil_percent_change_24h').text(),
        // $('#' + ticker + '_balance_fiat').text(),
        // $('#' + ticker + '_balance_fiat_24h_ago').text(),
        // $('#' + ticker + '_balance_fiat_percent_change_24h').text());
        var expectedDataMap = {
            'ZIL': ['7,477', '', '', '', '883.66', '786.46', '12.4'],
            'gZIL': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'XSGD': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZWAP': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'PORT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'XPORT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZLP': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'REDC': ['0.6579', '13.87', '10.34', '34.1', '1.64', '1.09', '50.6'],
            'CARB': ['11.53', '174.9', '195.6', '-10.6', '20.67', '20.57', '0.5'],
            'SCO': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'SRV': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'DUCK': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ELONS': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZCH': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'BOLT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZYRO': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZLF': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'GARY': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'RECAP': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'AXT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'GOD': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'SHRK': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'XCAD': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
        }

        var expectedIdrDataMap = {
            'ZIL': ['7,477', '', '', '', '12,052,262', '11,199,931', '7.6'],
            'gZIL': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'XSGD': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZWAP': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'PORT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'XPORT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZLP': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'REDC': ['0.6579', '13.87', '10.34', '34.1', '22,355', '15,497', '44.3'],
            'CARB': ['11.53', '174.9', '195.6', '-10.6', '281,884', '292,993', '-3.8'],
            'SCO': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'SRV': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'DUCK': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ELONS': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZCH': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'BOLT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZYRO': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'ZLF': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'GARY': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'RECAP': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'AXT': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'GOD': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'SHRK': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
            'XCAD': ['Loading...', 'Loading...', '', '', 'Loading...', '', ''],
        }

        var walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
        var coinPriceStatus;
        var zilswapDexStatus;
        var walletBalanceStatus;

        beforeEach(function () {
            // Arrange
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData,  zilswapDexSmartContractStateData24hAgo);

            let zilBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balance":"7476589135982234","nonce":46}}');
            let redcBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"657942857"}}}');
            let carbBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"1152887420"}}}');
            let zwapBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x55bda0a066942d33103cfc47f08d0338536184ef":"54342341"}}}');
            let emptyResultBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{}}');
            let emptyData = JSON.parse('{}');
            let emptyString = '';
            
            let zrcBalanceData = {
                'REDC': redcBalanceData,
                'CARB': carbBalanceData,
                'ZWAP': zwapBalanceData,
                'XCAD': emptyResultBalanceData,
                'SCO': emptyData,
                'GARY': emptyString,
            }
            
            walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletAddressBase16, zilBalanceData, /* zrcBalanceDataMap= */ zrcBalanceData);
        });

        it('compute, wallet set, bindView(), assertView', function () {
            // Act
            walletBalanceStatus.computeTokenBalanceMap('ZIL');
            walletBalanceStatus.bindViewIfDataExist('ZIL');
            walletBalanceStatus.bindViewDataFiat('ZIL');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                walletBalanceStatus.computeTokenBalanceMap(ticker);
                walletBalanceStatus.bindViewIfDataExist(ticker);
                walletBalanceStatus.bindViewDataFiat(ticker);
            }

            assert.strictEqual($('#zil_balance').text(), expectedDataMap['ZIL'][0]);
            assert.strictEqual($('#zil_balance_fiat').text(), expectedDataMap['ZIL'][4]);
            assert.strictEqual($('#zil_balance_fiat_24h_ago').text(),  expectedDataMap['ZIL'][5]);
            assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), expectedDataMap['ZIL'][6]);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                if (Number.isNaN(parseFloat(expectedDataMap[ticker][0]))) {
                    assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');
                } else {
                    assert.strictEqual($('#' + ticker + '_container').css('display'), 'block');
                }
                
                assert.strictEqual($('#' + ticker + '_balance').text(),  expectedDataMap[ticker][0]);
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), expectedDataMap[ticker][1]);
                assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), expectedDataMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), expectedDataMap[ticker][3]);
                
                assert.strictEqual($('#' + ticker + '_balance_fiat').text(), expectedDataMap[ticker][4]);
                assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), expectedDataMap[ticker][5]);
                assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), expectedDataMap[ticker][6]);
            }
            
            // Change currency
            coinPriceStatus.setActiveCurrencyCode('idr');
            zilswapDexStatus.onCoinPriceStatusChange();
            walletBalanceStatus.onCoinPriceStatusChange();

            // Assert IDR
            assert.strictEqual($('#zil_balance').text(), expectedIdrDataMap['ZIL'][0]);
            assert.strictEqual($('#zil_balance_fiat').text(), expectedIdrDataMap['ZIL'][4]);
            assert.strictEqual($('#zil_balance_fiat_24h_ago').text(),  expectedIdrDataMap['ZIL'][5]);
            assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), expectedIdrDataMap['ZIL'][6]);

            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                if (Number.isNaN(parseFloat(expectedIdrDataMap[ticker][0]))) {
                    assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');
                } else {
                    assert.strictEqual($('#' + ticker + '_container').css('display'), 'block');
                }
                
                assert.strictEqual($('#' + ticker + '_balance').text(),  expectedIdrDataMap[ticker][0]);
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), expectedIdrDataMap[ticker][1]);
                assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), expectedIdrDataMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), expectedIdrDataMap[ticker][3]);
                
                assert.strictEqual($('#' + ticker + '_balance_fiat').text(), expectedIdrDataMap[ticker][4]);
                assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), expectedIdrDataMap[ticker][5]);
                assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), expectedIdrDataMap[ticker][6]);
            }
        });
    });

    describe('#bindView()', function () {
        var walletBalanceStatus;

        beforeEach(function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* zilswapDexSmartContractStateData= */ null,  /* zilswapDexSmartContractState24hAgoData= */ null);
            walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBase16= */ null, /* zilBalanceData= */ null, /* zrcBalanceDataMap= */ null);
        });

        describe('#bindViewZilBalance()', function () {

            beforeEach(function () {
                assert.strictEqual($('#zil_balance').text(), 'Loading...');
            });

            it('bind view legit balance', function () {
                // Act
                walletBalanceStatus.bindViewZilBalance('1234.4');

                // Assert
                assert.strictEqual($('#zil_balance').text(), '1234.4');
            });

            it('bind view random string', function () {
                // Act
                walletBalanceStatus.bindViewZilBalance('asdf');

                // Assert
                assert.strictEqual($('#zil_balance').text(), 'asdf');
            });
        });

        describe('#bindViewZrcTokenWalletBalance()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_balance').text(), 'Loading...');
                    assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    walletBalanceStatus.bindViewZrcTokenWalletBalance('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_balance').text(), '1234.4');
                    assert.strictEqual($('#' + ticker + '_container').css('display'), 'block');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    walletBalanceStatus.bindViewZrcTokenWalletBalance('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_balance').text(), 'asdf');
                    assert.strictEqual($('#' + ticker + '_container').css('display'), 'block');
                }
            });
        });


        describe('#bindViewZilBalanceFiat24hAgo()', function () {

            beforeEach(function () {
                assert.strictEqual($('#zil_balance_fiat_24h_ago').text(), '');
                assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), '');
            });

            it('bind view happy case', function () {
                // Act
                walletBalanceStatus.bindViewZilBalanceFiat24hAgo('1234.52', '143');

                // Assert
                assert.strictEqual($('#zil_balance_fiat_24h_ago').text(), '1234.52');
                assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), '143');
            });

            it('bind view random string', function () {
                // Act
                walletBalanceStatus.bindViewZilBalanceFiat24hAgo('asdf', 'qwer');

                // Assert
                assert.strictEqual($('#zil_balance_fiat_24h_ago').text(), 'asdf');
                assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), 'qwer');
            });
        });

        describe('#bindViewZilBalanceFiat()', function () {

            beforeEach(function () {
                assert.strictEqual($('#zil_balance_fiat').text(), 'Loading...');
            });

            it('bind view happy case', function () {
                // Act
                walletBalanceStatus.bindViewZilBalanceFiat('1234.52');

                // Assert
                assert.strictEqual($('#zil_balance_fiat').text(), '1234.52');
            });

            it('bind view random string', function () {
                // Act
                walletBalanceStatus.bindViewZilBalanceFiat('asdf');

                // Assert
                assert.strictEqual($('#zil_balance_fiat').text(), 'asdf');
            });
        });

        describe('#bindViewZrcTokenWalletBalanceZil24hAgo()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), '');
                    assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), '');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    walletBalanceStatus.bindViewZrcTokenWalletBalanceZil24hAgo('1234.4', '12.2', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), '1234.4');
                    assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), '12.2');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    walletBalanceStatus.bindViewZrcTokenWalletBalanceZil24hAgo('asdf', 'qwer', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), 'qwer');
                }
            });
        });

        describe('#bindViewZrcTokenWalletBalanceZil()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'Loading...');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    walletBalanceStatus.bindViewZrcTokenWalletBalanceZil('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_balance_zil').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    walletBalanceStatus.bindViewZrcTokenWalletBalanceZil('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'asdf');
                }
            });
        });

        describe('#bindViewZrcTokenWalletBalanceFiat24hAgo()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), '');
                    assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), '');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    walletBalanceStatus.bindViewZrcTokenWalletBalanceFiat24hAgo('1234.4', '12.5', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), '1234.4');
                    assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), '12.5');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    walletBalanceStatus.bindViewZrcTokenWalletBalanceFiat24hAgo('asdf', 'qwer', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), 'qwer');
                }
            });
        });

        describe('#bindViewZrcTokenWalletBalanceFiat()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_balance_fiat').text(), 'Loading...');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    walletBalanceStatus.bindViewZrcTokenWalletBalanceFiat('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_balance_fiat').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    walletBalanceStatus.bindViewZrcTokenWalletBalanceFiat('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_balance_fiat').text(), 'asdf');
                }
            });
        });
    });
});