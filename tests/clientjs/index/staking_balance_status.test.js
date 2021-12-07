var indexJsdom = require('../../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../../clientjs/index/zilswap_dex_status.js');
var CoinPriceStatus = require('../../../clientjs/index/coin_price_status.js');
var StakingBalanceStatus = require('../../../clientjs/index/staking_balance_status.js');
var StakingZrcStatus = require('../../../clientjs/index/staking_zrc_status.js');
var Constants = require('../../../constants.js');

describe('StakingBalanceStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);

        // bindViewZilStakingBalance()
        for (let ssnAddress in Constants.ssnListMap) {
            assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), 'Loading...');
            assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');
        }
        assert.strictEqual($('#staking_container').css('display'), 'none');

        // bindViewZilStakingWithdrawalPendingBalance()
        assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(), 'Loading...');
        assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'none');
        assert.strictEqual($('#staking_container').css('display'), 'none');

        // bindViewZilStakingBalanceFiat24hAgo()
        for (let ssnAddress in Constants.ssnListMap) {
            assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(), '');
            assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text(), '');
        }

        // bindViewZilStakingBalanceFiat()
        for (let ssnAddress in Constants.ssnListMap) {
            assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), 'Loading...');
        }

        // bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo()
        assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), '');

        // bindViewZilStakingWithdrawalPendingBalanceFiat()
        assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), 'Loading...');
    });

    describe('#constructor()', function () {

        it('create plain object', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilStakingBalanceData= */ null, /* zilStakingWithdrawalBalanceData= */ null);

            assert.strictEqual(stakingBalanceStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(stakingBalanceStatus.ssnListMap_, ssnListMap);
            assert.strictEqual(stakingBalanceStatus.coinPriceStatus_, coinPriceStatus);
            assert.strictEqual(stakingBalanceStatus.walletAddressBase16_, null);
            assert.strictEqual(stakingBalanceStatus.zilStakingBalanceData_, null);
            assert.strictEqual(stakingBalanceStatus.zilStakingBalanceData_, null);
            assert.strictEqual(stakingBalanceStatus.zilStakingWithdrawalBalanceData_, null);
            assert.strictEqual(stakingBalanceStatus.zilStakingWithdrawalBalance_, null);
            assert.deepStrictEqual(stakingBalanceStatus.zilStakingBalanceMap_, {});
        });
    });


    describe('#methods(), without 24h ago', function () {
        // console.log("'%s': ['%s', '%s', '%s', '%s',],",
        // 'withdrawal',
        // $('#zil_staking_withdrawal_pending_balance').text(),
        // $('#zil_staking_withdrawal_pending_balance_fiat').text(),
        // $('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(),
        // $('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text());

        // console.log("'%s': ['%s', '%s', '%s', '%s',],",
        // ssnAddress,
        // $('#' + ssnAddress + '_zil_staking_balance').text(),
        // $('#' + ssnAddress + '_zil_staking_balance_fiat').text(),
        // $('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(),
        // $('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text());
        
        var expectedDataMap = {
            'withdrawal': ['21,126', '2,496.91', '', '',],
            '0x122219cceab410901e96c3a0e55e46231480341b': ['Loading...', 'Loading...', '', '',],
            '0x2afe9e18edd39d927d0ffff8990612fc4afa2295': ['Loading...', 'Loading...', '', '',],
            '0x3ee34d308f962d17774a591f32cd1214e8bc470d': ['Loading...', 'Loading...', '', '',],
            '0x635eff625a147c7ca0397445eee436129ee6ca0b': ['Loading...', 'Loading...', '', '',],
            '0x657077b8dc9a60300fc805d559c0a5ef9bdd94a5': ['Loading...', 'Loading...', '', '',],
            '0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0': ['7,063', '834.79', '', '',],
            '0x90d3dbd71c54c38341a6f5682c607e8a17023c28': ['Loading...', 'Loading...', '', '',],
            '0x9fb9e7ef9d0dd545c2f4a29a5bb97cc8ac15d2eb': ['Loading...', 'Loading...', '', '',],
            '0xb83fc2c72c44b6b869c64384375c979dc3f7cf05': ['Loading...', 'Loading...', '', '',],
            '0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b': ['2,300', '271.84', '', '',],
            '0xc3ed69338765424f4771dd636a5d3bfa0a776a35': ['Loading...', 'Loading...', '', '',],
            '0xd8de27a85c0dbc43bdd9a525e016670732db899f': ['Loading...', 'Loading...', '', '',],
            '0x9598f6224cf66665e74b265680423750b1fd2816': ['Loading...', 'Loading...', '', '',],
            '0xb4305fa80b363d12ddfedcc4bfcf51f70f58032f': ['Loading...', 'Loading...', '', '',],
        }

        let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
        var coinPriceStatus;
        var zilStakingBalanceData;
        var zilStakingBalanceEmptyWithdrawalData;
        var stakingBalanceStatus;

        beforeEach(function () {
            // Arrange
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);
  
            zilStakingBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"deposit_amt_deleg":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b":"2300000000000000", "0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0":"7063107679853089"}}}}');
            zilStakingBalanceEmptyWithdrawalData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":null}');
            zilStakingBalanceWithdrawalData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"withdrawal_pending":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"1037958":"14063107679853089", "1137958":"7063107679853089"}}}}');
            
            stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilStakingBalanceData= */ null, /* zilStakingWithdrawalBalanceData= */ null);
        });

        it('no action, no balance, and no withdrawal balance', function () {
            // Assert
            assert.strictEqual(stakingBalanceStatus.getStakingWithdrawalBalance(), undefined);
            for (let ssnAddress in Constants.ssnListMap) {
                assert.strictEqual(stakingBalanceStatus.getStakingBalance(ssnAddress), undefined);
            }
        });

        it('compute, wallet not set,  no balance, and no withdrawal balance', function () {
            // Act
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();

            // Assert
            assert.strictEqual(stakingBalanceStatus.getStakingWithdrawalBalance(), undefined);
            for (let ssnAddress in Constants.ssnListMap) {
                assert.strictEqual(stakingBalanceStatus.getStakingBalance(ssnAddress), undefined);
            }
        });
        
        it('compute, wallet set, have staking balance', function () {
            stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, walletAddressBase16, zilStakingBalanceData, zilStakingBalanceEmptyWithdrawalData);
        
            // Act
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();

            // Assert
            assert.strictEqual(stakingBalanceStatus.getAllStakingBalanceInZil(), 9363.107679853088);
            assert.strictEqual(stakingBalanceStatus.getAllStakingBalanceInZil24hAgo(), 9363.107679853088);

            // The current address doesn't have  withdrawal balance in the data
            assert.strictEqual(stakingBalanceStatus.getStakingWithdrawalBalance(), undefined);
            for (let ssnAddress in Constants.ssnListMap) {
                if (ssnAddress === '0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b') {
                    // If zillet.io, we have some amount
                    assert.strictEqual(stakingBalanceStatus.getStakingBalance(ssnAddress), 2300);
                } else if (ssnAddress === '0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0') {
                    // If Viewblock.io, we have some amount
                    assert.strictEqual(stakingBalanceStatus.getStakingBalance(ssnAddress), 7063.107679853089);
                } else {
                    assert.strictEqual(stakingBalanceStatus.getStakingBalance(ssnAddress), undefined);
                }
            }
        });

        it('compute, wallet set with withdrawal data, have staking data and withdrawal balance', function () {
            stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, walletAddressBase16, zilStakingBalanceData, zilStakingBalanceWithdrawalData);
        
            // Act
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();

            // Assert
            assert.strictEqual(stakingBalanceStatus.getAllStakingBalanceInZil(), 30489.323039559265);
            assert.strictEqual(stakingBalanceStatus.getAllStakingBalanceInZil24hAgo(), 30489.323039559265);
            
            assert.strictEqual(stakingBalanceStatus.getStakingWithdrawalBalance(), 21126.215359706177);
            for (let ssnAddress in Constants.ssnListMap) {
                // If zillet.io, we have some amount
                if (ssnAddress === '0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b') {
                    // If zillet.io, we have some amount
                    assert.strictEqual(stakingBalanceStatus.getStakingBalance(ssnAddress), 2300);
                } else if (ssnAddress === '0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0') {
                    // If Viewblock.io, we have some amount
                    assert.strictEqual(stakingBalanceStatus.getStakingBalance(ssnAddress), 7063.107679853089);
                } else {
                    assert.strictEqual(stakingBalanceStatus.getStakingBalance(ssnAddress), undefined);
                }
            }
        });

        it('compute, wallet set, bindView(), assertView', function () {
            stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, walletAddressBase16, zilStakingBalanceData, zilStakingBalanceWithdrawalData);
        
            // Act
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();

            stakingBalanceStatus.bindViewStakingBalance();
            stakingBalanceStatus.bindViewStakingBalanceFiat();
            stakingBalanceStatus.bindViewStakingWithdrawalBalance();
            stakingBalanceStatus.bindViewStakingWithdrawalBalanceFiat();

            // Assert
            let isStakingContainerAlreadyShown = false;
            for (let ssnAddress in Constants.ssnListMap) {
                if ($('#' + ssnAddress + '_zil_staking_balance').text() === 'Loading...') {
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');
                } else {
                    assert.strictEqual($('#staking_container').css('display'), 'block'); 
                    isStakingContainerAlreadyShown = true;
                }
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), expectedDataMap[ssnAddress][0]);
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), expectedDataMap[ssnAddress][1]);
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(), expectedDataMap[ssnAddress][2]);
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text(), expectedDataMap[ssnAddress][3]);
                if (isStakingContainerAlreadyShown) {
                    assert.strictEqual($('#staking_container').css('display'), 'block'); 
                }
            }
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(),  expectedDataMap['withdrawal'][0]);
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), expectedDataMap['withdrawal'][1]);
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), expectedDataMap['withdrawal'][2]);
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), expectedDataMap['withdrawal'][3]);
            if ($('#zil_staking_withdrawal_pending_balance').text() === 'Loading...') {
                assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'none');
                assert.strictEqual($('#staking_container').css('display'), 'none');
            } else {
                assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'block');
                assert.strictEqual($('#staking_container').css('display'), 'block');
            }
        });

        it('compute with carbon, wallet set, bindView(), reset(), view reset', function () {
            // Arrange
            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData,  zilswapDexSmartContractStateData24hAgo);
            let carbonBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}');
            let stakingZrcStatus = new StakingZrcStatus.StakingZrcStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus);
            stakingZrcStatus.computeZrcBalance(carbonBalanceData, 'CARB', 'staked', walletAddressBase16);

            stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, walletAddressBase16, zilStakingBalanceData, zilStakingBalanceWithdrawalData, stakingZrcStatus);
        
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();

            stakingBalanceStatus.bindViewStakingBalance();
            stakingBalanceStatus.bindViewStakingBalanceFiat();
            stakingBalanceStatus.bindViewStakingWithdrawalBalance();
            stakingBalanceStatus.bindViewStakingWithdrawalBalanceFiat();

            // Act
            stakingBalanceStatus.reset();

            // Assert
            assert.strictEqual(stakingBalanceStatus.zilStakingBalanceData_, null);
            assert.strictEqual(stakingBalanceStatus.zilStakingBalanceData_, null);
            assert.strictEqual(stakingBalanceStatus.zilStakingWithdrawalBalanceData_, null);
            assert.strictEqual(stakingBalanceStatus.zilStakingWithdrawalBalance_, null);
            assert.deepStrictEqual(stakingBalanceStatus.zilStakingBalanceMap_, {});

            assert.deepStrictEqual(stakingBalanceStatus.stakingZrcStatus_.zrcBalance_, {});

            assert.strictEqual($('#staking_container').css('display'), 'none');

            for (let ssnAddress in Constants.ssnListMap) {
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), 'Loading...');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), 'Loading...');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(), '');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text(), '');
            }

            assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'none');
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(), 'Loading...');
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), 'Loading...');
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), '');

            // Assert zrc staking 
            for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_container').css('display'), 'none');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '');
                }
            }
        });
    });


    describe('#methods(), with 24h ago, in idr', function () {
        // console.log("'%s': ['%s', '%s', '%s', '%s',],",
        // 'withdrawal',
        // $('#zil_staking_withdrawal_pending_balance').text(),
        // $('#zil_staking_withdrawal_pending_balance_fiat').text(),
        // $('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(),
        // $('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text());

        // console.log("'%s': ['%s', '%s', '%s', '%s',],",
        // ssnAddress,
        // $('#' + ssnAddress + '_zil_staking_balance').text(),
        // $('#' + ssnAddress + '_zil_staking_balance_fiat').text(),
        // $('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(),
        // $('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text());
        
        var expectedDataMap = {
            'withdrawal': ['21,126', '2,496.91', '2,222.27', '12.4',],
            '0x122219cceab410901e96c3a0e55e46231480341b': ['Loading...', 'Loading...', '', '',],
            '0x2afe9e18edd39d927d0ffff8990612fc4afa2295': ['Loading...', 'Loading...', '', '',],
            '0x3ee34d308f962d17774a591f32cd1214e8bc470d': ['Loading...', 'Loading...', '', '',],
            '0x635eff625a147c7ca0397445eee436129ee6ca0b': ['Loading...', 'Loading...', '', '',],
            '0x657077b8dc9a60300fc805d559c0a5ef9bdd94a5': ['Loading...', 'Loading...', '', '',],
            '0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0': ['7,063', '834.79', '742.97', '12.4',],
            '0x90d3dbd71c54c38341a6f5682c607e8a17023c28': ['Loading...', 'Loading...', '', '',],
            '0x9fb9e7ef9d0dd545c2f4a29a5bb97cc8ac15d2eb': ['Loading...', 'Loading...', '', '',],
            '0xb83fc2c72c44b6b869c64384375c979dc3f7cf05': ['Loading...', 'Loading...', '', '',],
            '0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b': ['2,300', '271.84', '241.94', '12.4',],
            '0xc3ed69338765424f4771dd636a5d3bfa0a776a35': ['Loading...', 'Loading...', '', '',],
            '0xd8de27a85c0dbc43bdd9a525e016670732db899f': ['Loading...', 'Loading...', '', '',],
            '0x9598f6224cf66665e74b265680423750b1fd2816': ['Loading...', 'Loading...', '', '',],
            '0xb4305fa80b363d12ddfedcc4bfcf51f70f58032f': ['Loading...', 'Loading...', '', '',],
        }

        var expectedIdrDataMap = {
            'withdrawal': ['21,126', '34,055,459', '31,647,071', '7.6',],
            '0x122219cceab410901e96c3a0e55e46231480341b': ['Loading...', 'Loading...', '', '',],
            '0x2afe9e18edd39d927d0ffff8990612fc4afa2295': ['Loading...', 'Loading...', '', '',],
            '0x3ee34d308f962d17774a591f32cd1214e8bc470d': ['Loading...', 'Loading...', '', '',],
            '0x635eff625a147c7ca0397445eee436129ee6ca0b': ['Loading...', 'Loading...', '', '',],
            '0x657077b8dc9a60300fc805d559c0a5ef9bdd94a5': ['Loading...', 'Loading...', '', '',],
            '0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0': ['7,063', '11,385,730', '10,580,535', '7.6',],
            '0x90d3dbd71c54c38341a6f5682c607e8a17023c28': ['Loading...', 'Loading...', '', '',],
            '0x9fb9e7ef9d0dd545c2f4a29a5bb97cc8ac15d2eb': ['Loading...', 'Loading...', '', '',],
            '0xb83fc2c72c44b6b869c64384375c979dc3f7cf05': ['Loading...', 'Loading...', '', '',],
            '0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b': ['2,300', '3,707,600', '3,445,400', '7.6',],
            '0xc3ed69338765424f4771dd636a5d3bfa0a776a35': ['Loading...', 'Loading...', '', '',],
            '0xd8de27a85c0dbc43bdd9a525e016670732db899f': ['Loading...', 'Loading...', '', '',],
            '0x9598f6224cf66665e74b265680423750b1fd2816': ['Loading...', 'Loading...', '', '',],
            '0xb4305fa80b363d12ddfedcc4bfcf51f70f58032f': ['Loading...', 'Loading...', '', '',],
        }

        var walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
        var coinPriceStatus;
        var stakingBalanceStatus;

        beforeEach(function () {
            // Arrange
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilStakingBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"deposit_amt_deleg":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b":"2300000000000000", "0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0":"7063107679853089"}}}}');
            let zilStakingBalanceWithdrawalData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"withdrawal_pending":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"1037958":"14063107679853089", "1137958":"7063107679853089"}}}}');
            
            stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, walletAddressBase16, zilStakingBalanceData, zilStakingBalanceWithdrawalData);
        });

        it('compute, wallet set, bindView(), assertView', function () {
            // Act
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();

            stakingBalanceStatus.bindViewStakingBalance();
            stakingBalanceStatus.bindViewStakingBalanceFiat();
            stakingBalanceStatus.bindViewStakingWithdrawalBalance();
            stakingBalanceStatus.bindViewStakingWithdrawalBalanceFiat();

            // Assert
            let isStakingContainerAlreadyShown = false;
            for (let ssnAddress in Constants.ssnListMap) {
                if ($('#' + ssnAddress + '_zil_staking_balance').text() === 'Loading...') {
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');
                } else {
                    assert.strictEqual($('#staking_container').css('display'), 'block'); 
                    isStakingContainerAlreadyShown = true;
                }
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), expectedDataMap[ssnAddress][0]);
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), expectedDataMap[ssnAddress][1]);
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(), expectedDataMap[ssnAddress][2]);
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text(), expectedDataMap[ssnAddress][3]);
                if (isStakingContainerAlreadyShown) {
                    assert.strictEqual($('#staking_container').css('display'), 'block'); 
                }
            }
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(),  expectedDataMap['withdrawal'][0]);
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), expectedDataMap['withdrawal'][1]);
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), expectedDataMap['withdrawal'][2]);
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), expectedDataMap['withdrawal'][3]);
            if ($('#zil_staking_withdrawal_pending_balance').text() === 'Loading...') {
                assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'none');
                assert.strictEqual($('#staking_container').css('display'), 'none');
            } else {
                assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'block');
                assert.strictEqual($('#staking_container').css('display'), 'block');
            }

            // Change currency
            coinPriceStatus.setActiveCurrencyCode('idr');
            stakingBalanceStatus.onCoinPriceStatusChange();

            // Assert IDR
            for (let ssnAddress in Constants.ssnListMap) {
                if ($('#' + ssnAddress + '_zil_staking_balance').text() === 'Loading...') {
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');
                } else {
                    assert.strictEqual($('#staking_container').css('display'), 'block'); 
                    isStakingContainerAlreadyShown = true;
                }
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), expectedIdrDataMap[ssnAddress][0]);
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), expectedIdrDataMap[ssnAddress][1]);
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(), expectedIdrDataMap[ssnAddress][2]);
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text(), expectedIdrDataMap[ssnAddress][3]);
                if (isStakingContainerAlreadyShown) {
                    assert.strictEqual($('#staking_container').css('display'), 'block'); 
                }
            }
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(),  expectedIdrDataMap['withdrawal'][0]);
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), expectedIdrDataMap['withdrawal'][1]);
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), expectedIdrDataMap['withdrawal'][2]);
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), expectedIdrDataMap['withdrawal'][3]);
            if ($('#zil_staking_withdrawal_pending_balance').text() === 'Loading...') {
                assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'none');
                assert.strictEqual($('#staking_container').css('display'), 'none');
            } else {
                assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'block');
                assert.strictEqual($('#staking_container').css('display'), 'block');
            }
        });
    });

    describe('#methods(), with 24h ago, in idr, with carb staking', function () {

        var walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
        var coinPriceStatus;
        var stakingZrcStatus;
        var stakingBalanceStatus;
        let carbonBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}');

        beforeEach(function () {
            // Arrange
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilStakingBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"deposit_amt_deleg":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b":"2300000000000000", "0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0":"7063107679853089"}}}}');
            let zilStakingBalanceWithdrawalData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"withdrawal_pending":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"1037958":"14063107679853089", "1137958":"7063107679853089"}}}}');
            

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData,  zilswapDexSmartContractStateData24hAgo);

            stakingZrcStatus = new StakingZrcStatus.StakingZrcStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus);
            stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, walletAddressBase16, zilStakingBalanceData, zilStakingBalanceWithdrawalData, stakingZrcStatus);
        });

        it('compute, wallet set, bindView(), assertView', function () {
            // Act
            tickerId = 'CARB';
            stakingCategoryId = 'staked';
            stakingZrcStatus.computeZrcBalance(carbonBalanceData, tickerId, 'staked', walletAddressBase16);
            stakingZrcStatus.bindViewStakingBalance(tickerId, stakingCategoryId);

            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();

            // Change currency
            coinPriceStatus.setActiveCurrencyCode('idr');
            stakingBalanceStatus.onCoinPriceStatusChange();

            // Assert
            assert.strictEqual(stakingBalanceStatus.getAllStakingBalanceInZil(), 31859.93729923527);
            assert.strictEqual(stakingBalanceStatus.getAllStakingBalanceInZil24hAgo(), 32022.371219777688);

            // Assert IDR
            assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(), '90.36');
            assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(), '1,371');
            assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '1,533');
            assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '-10.6');
            assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(), '2,209,430');
            assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '2,296,506');
            assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '-3.8');
            assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');
        });
    });

    describe('#bindView()', function () {
        var stakingBalanceStatus;

        beforeEach(function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilStakingBalanceData= */ null, /* zilStakingWithdrawalBalanceData= */ null);
        });

        describe('#bindViewZilStakingBalance()', function () {

            beforeEach(function () {
                for (let ssnAddress in Constants.ssnListMap) {
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), 'Loading...');
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');
                }
                assert.strictEqual($('#staking_container').css('display'), 'none');
            });

            it('bind view happy case', function () {
                for (let ssnAddress in Constants.ssnListMap) {
                    // Act
                    stakingBalanceStatus.bindViewZilStakingBalance('1234.4', ssnAddress);

                    // Assert

                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), '1234.4');
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'block');
                    assert.strictEqual($('#staking_container').css('display'), 'block');
                }
            });

            it('bind view random string', function () {
                for (let ssnAddress in Constants.ssnListMap) {
                    // Act
                    stakingBalanceStatus.bindViewZilStakingBalance('asdf', ssnAddress);

                    // Assert
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), 'asdf');
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'block');
                    assert.strictEqual($('#staking_container').css('display'), 'block');
                }
            });
        });


        describe('#bindViewZilStakingWithdrawalPendingBalance()', function () {

            beforeEach(function () {
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(), 'Loading...');
                assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'none');
                assert.strictEqual($('#staking_container').css('display'), 'none');
            });

            it('bind view happy case', function () {
                // Act
                stakingBalanceStatus.bindViewZilStakingWithdrawalPendingBalance('1234.4');

                // Assert
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(), '1234.4');
                assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'block');
                assert.strictEqual($('#staking_container').css('display'), 'block');
            });

            it('bind view random string', function () {
                // Act
                stakingBalanceStatus.bindViewZilStakingWithdrawalPendingBalance('asdf');

                // Assert
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(), 'asdf');
                assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'block');
                assert.strictEqual($('#staking_container').css('display'), 'block');
            });
        });

        describe('#bindViewZilStakingBalanceFiat24hAgo()', function () {

            beforeEach(function () {
                for (let ssnAddress in Constants.ssnListMap) {
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(), '');
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text(), '');
                }
            });

            it('bind view happy case', function () {
                for (let ssnAddress in Constants.ssnListMap) {
                    // Act
                    stakingBalanceStatus.bindViewZilStakingBalanceFiat24hAgo('1234.4', '43.2', ssnAddress);

                    // Assert
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(), '1234.4');
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text(), '43.2');
                }
            });

            it('bind view random string', function () {
                for (let ssnAddress in Constants.ssnListMap) {
                    // Act
                    stakingBalanceStatus.bindViewZilStakingBalanceFiat24hAgo('asdf', 'qwer', ssnAddress);

                    // Assert
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(), 'asdf');
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text(), 'qwer');
                }
            });
        });

        describe('#bindViewZilStakingBalanceFiat()', function () {

            beforeEach(function () {
                for (let ssnAddress in Constants.ssnListMap) {
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), 'Loading...');
                }
            });

            it('bind view happy case', function () {
                for (let ssnAddress in Constants.ssnListMap) {
                    // Act
                    stakingBalanceStatus.bindViewZilStakingBalanceFiat('1234.4', ssnAddress);

                    // Assert
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
                for (let ssnAddress in Constants.ssnListMap) {
                    // Act
                    stakingBalanceStatus.bindViewZilStakingBalanceFiat('asdf', ssnAddress);

                    // Assert
                    assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), 'asdf');
                }
            });
        });

        describe('#bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo()', function () {

            beforeEach(function () {
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), '');
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), '');
            });

            it('bind view happy case', function () {
                // Act
                stakingBalanceStatus.bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo('1234.4', '4.2');

                // Assert
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), '1234.4');
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), '4.2');

            });

            it('bind view random string', function () {
                // Act
                stakingBalanceStatus.bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo('asdf', 'qwer');

                // Assert
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), 'asdf');
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), 'qwer');
            });
        });

        describe('#bindViewZilStakingWithdrawalPendingBalanceFiat()', function () {

            beforeEach(function () {
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), 'Loading...');
            });

            it('bind view happy case', function () {
                // Act
                stakingBalanceStatus.bindViewZilStakingWithdrawalPendingBalanceFiat('1234.4');

                // Assert
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), '1234.4');

            });

            it('bind view random string', function () {
                // Act
                stakingBalanceStatus.bindViewZilStakingWithdrawalPendingBalanceFiat('asdf');

                // Assert
                assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), 'asdf');
            });
        });

    });
});