var indexJsdom = require('../../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var XcadDexStatus = require('../../../clientjs/index/xcad_dex_status.js');
var ZilswapDexStatus = require('../../../clientjs/index/zilswap_dex_status.js');
var CoinPriceStatus = require('../../../clientjs/index/coin_price_status.js');
var StakingZrcStatus = require('../../../clientjs/index/staking_zrc_status.js');

let blankXcadDexStatus = new XcadDexStatus.XcadDexStatus(Constants.zrcTokenPropertiesListMap, /* walletAddressBase16= */ null, /* xcadDexSmartContractStateData= */ null);

describe('StakingZrcStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(function() {
            for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                    // bindViewZrcStakingBalance()
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_container').css('display'), 'none');
                    assert.strictEqual($('#staking_container').css('display'), 'none');

                    // bindViewZrcStakingBalanceZil24hAgo()
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '');

                    // bindViewZrcStakingBalanceZil()
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(), 'Loading...');

                    // bindViewZrcStakingBalanceFiat24hAgo()
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '');

                    // bindViewZrcStakingBalanceFiat()
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(), 'Loading...');
                }
            }

            done();
        });
    });

    describe('#constructor()', function () {

        it('create plain object', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, blankXcadDexStatus, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
            let stakingZrcStatus = new StakingZrcStatus.StakingZrcStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus);

            assert.strictEqual(stakingZrcStatus.coinPriceStatus_, coinPriceStatus);
            assert.strictEqual(stakingZrcStatus.zilswapDexStatus_, zilswapDexStatus);
            assert.strictEqual(stakingZrcStatus.walletAddressBase16_, null);
            assert.deepStrictEqual(stakingZrcStatus.zrcBalance_, {});
        });
    });

    describe('#methods(), without 24h ago', function () {

        var walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
        var coinPriceStatus;
        var zilswapDexStatus;
        var stakingZrcStatus;
        let carbTickerId = 'CARB';
        let carbStakingCategoryId = 'staked';
        let carbonBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}');

        beforeEach(function () {
            // Arrange
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, blankXcadDexStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);

            stakingZrcStatus = new StakingZrcStatus.StakingZrcStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus);
        });

        it('no action, no token balance data', function () {
            // Assert
            for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                assert.strictEqual(stakingZrcStatus.getZrcStakingBalance(tickerId), 0);
                for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                    assert.strictEqual(stakingZrcStatus.getSingleCategoryZrcStakingBalance(tickerId, stakingCategoryId), null);
                }
            }
        });

        it('compute, wallet not set, no token balance data', function () {
            // Act
            stakingZrcStatus.computeZrcBalance(carbonBalanceData, carbTickerId, carbStakingCategoryId, null);

            // Assert
            assert.strictEqual(stakingZrcStatus.getZrcStakingBalance(carbTickerId), 0);
            assert.strictEqual(stakingZrcStatus.getSingleCategoryZrcStakingBalance(carbTickerId, carbStakingCategoryId), null);
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_container').css('display'), 'none');
            assert.strictEqual($('#staking_container').css('display'), 'none');

            for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                assert.strictEqual(stakingZrcStatus.getZrcStakingBalance(tickerId), 0);
                for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                    assert.strictEqual(stakingZrcStatus.getSingleCategoryZrcStakingBalance(tickerId, stakingCategoryId), null);
                }
            }
        });

        it('compute, wallet set, have token balance data', function () {
            stakingZrcStatus.setWalletAddressBase16(walletAddressBase16);

            // Act
            stakingZrcStatus.computeZrcBalance(carbonBalanceData, carbTickerId, carbStakingCategoryId, walletAddressBase16);

            // Assert
            assert.strictEqual(stakingZrcStatus.getZrcStakingBalance(carbTickerId), 90.36430995);
            assert.strictEqual(stakingZrcStatus.getSingleCategoryZrcStakingBalance(carbTickerId, carbStakingCategoryId), 90.36430995);
            assert.strictEqual(stakingZrcStatus.getZrcStakingBalanceInZil(carbTickerId), 1370.614259676004);
            assert.strictEqual(stakingZrcStatus.getZrcStakingBalanceInZil24hAgo(carbTickerId), 0); // 24h Ago not set

            for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                if (tickerId === carbTickerId) {
                    continue;
                }
                for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                    if (stakingCategoryId === carbStakingCategoryId) {
                        continue;
                    }
                    assert.strictEqual(stakingZrcStatus.getSingleCategoryZrcStakingBalance(tickerId, stakingCategoryId), null);
                }
                assert.strictEqual(stakingZrcStatus.getZrcStakingBalance(tickerId), 0);
                assert.strictEqual(stakingZrcStatus.getZrcStakingBalanceInZil(tickerId), 0);
                assert.strictEqual(stakingZrcStatus.getZrcStakingBalanceInZil24hAgo(tickerId), 0);
            }
        });

        it('compute, wallet set, bindView(), assertView', function () {
            stakingZrcStatus.setWalletAddressBase16(walletAddressBase16);

            // Act
            stakingZrcStatus.computeZrcBalance(carbonBalanceData, carbTickerId, carbStakingCategoryId, walletAddressBase16);
            stakingZrcStatus.bindViewStakingBalance(carbTickerId, carbStakingCategoryId);

            // Assert
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance').text(), '90.36');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_zil').text(), '1,371');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_fiat').text(), '161.99');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');

            for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                if (tickerId === carbTickerId) {
                    continue;
                }
                for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                    if (stakingCategoryId === carbStakingCategoryId) {
                        continue;
                    }
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_container').css('display'), 'none');
                }
            }
        });

        it('compute, wallet set, bindView(), reset(), view reset', function () {
            stakingZrcStatus.setWalletAddressBase16(walletAddressBase16);

            stakingZrcStatus.computeZrcBalance(carbonBalanceData, carbTickerId, carbStakingCategoryId, walletAddressBase16);
            stakingZrcStatus.bindViewStakingBalance(carbTickerId, carbStakingCategoryId);

            // Act
            stakingZrcStatus.reset();

            // Assert
            assert.deepStrictEqual(stakingZrcStatus.zrcBalance_, {});

            for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_container').css('display'), 'none');
                }
            }
        });
    });

    describe('#methods(), with 24h ago, in idr', function () {
        let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
        let carbonBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}');
        let carbTickerId = 'CARB';
        let carbStakingCategoryId = 'staked';
        var coinPriceStatus;
        var zilswapDexStatus;
        var stakingZrcStatus;

        beforeEach(function () {
            // Arrange

            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, blankXcadDexStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);

            stakingZrcStatus = new StakingZrcStatus.StakingZrcStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus);
        });

        it('compute, wallet set, bindView(), assertView', function () {
            // Act
            stakingZrcStatus.computeZrcBalance(carbonBalanceData, carbTickerId, carbStakingCategoryId, walletAddressBase16);
            stakingZrcStatus.bindViewStakingBalance(carbTickerId, carbStakingCategoryId);

            // Assert
            assert.strictEqual(stakingZrcStatus.getZrcStakingBalance(carbTickerId), 90.36430995);
            assert.strictEqual(stakingZrcStatus.getZrcStakingBalanceInZil(carbTickerId), 1370.614259676004);
            assert.strictEqual(stakingZrcStatus.getZrcStakingBalanceInZil24hAgo(carbTickerId), 1533.0481802184236);

            // Assert
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance').text(), '90.36');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_zil').text(), '1,371');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '1,533');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '-10.6');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_fiat').text(), '161.99');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '161.26');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '0.5');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');

            for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                if (tickerId === carbTickerId) {
                    continue;
                }
                for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                    if (stakingCategoryId === carbStakingCategoryId) {
                        continue;
                    }
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_container').css('display'), 'none');
                }
            }

            // Change currency
            coinPriceStatus.setActiveCurrencyCode('idr');
            zilswapDexStatus.onCoinPriceStatusChange();
            stakingZrcStatus.onCoinPriceStatusChange();

            // Assert IDR
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance').text(), '90.36');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_zil').text(), '1,371');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '1,533');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '-10.6');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_fiat').text(), '2,209,430');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '2,296,506');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '-3.8');
            assert.strictEqual($('#' + carbTickerId + '_' + carbStakingCategoryId + '_staking_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');

            for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                if (tickerId === carbTickerId) {
                    continue;
                }
                for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                    if (stakingCategoryId === carbStakingCategoryId) {
                        continue;
                    }
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(), 'Loading...');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '');
                    assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_container').css('display'), 'none');
                }
            }
        });
    });

    describe('#bindView()', function () {
        var stakingZrcStatus;

        beforeEach(function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, blankXcadDexStatus, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
            stakingZrcStatus = new StakingZrcStatus.StakingZrcStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus);
        });

        describe('#bindViewZrcStakingBalance()', function () {

            beforeEach(function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(), 'Loading...');
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_container').css('display'), 'none');
                        assert.strictEqual($('#staking_container').css('display'), 'none');
                    }
                }
            });

            it('bind view happy case', function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        stakingZrcStatus.bindViewZrcStakingBalance(tickerId, stakingCategoryId, '1234.4');

                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(), '1234.4');
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_container').css('display'), 'block');
                        assert.strictEqual($('#staking_container').css('display'), 'block');
                    }
                }
            });

            it('bind view random string', function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        stakingZrcStatus.bindViewZrcStakingBalance(tickerId, stakingCategoryId, 'asdf');

                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(), 'asdf');
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_container').css('display'), 'block');
                        assert.strictEqual($('#staking_container').css('display'), 'block');
                    }
                }
            });
        });

        describe('#bindViewZrcStakingBalanceZil24hAgo()', function () {

            beforeEach(function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '');
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '');
                    }
                }
            });

            it('bind view happy case', function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        stakingZrcStatus.bindViewZrcStakingBalanceZil24hAgo(tickerId, stakingCategoryId, '1234.4', '4.2');

                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(), '1234.4');
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), '4.2');
                    }
                }
            });

            it('bind view random string', function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        stakingZrcStatus.bindViewZrcStakingBalanceZil24hAgo(tickerId, stakingCategoryId, 'asdf', 'qwer');

                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(), 'asdf');
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(), 'qwer');
                    }
                }
            });
        });


        describe('#bindViewZrcStakingBalanceZil()', function () {

            beforeEach(function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(), 'Loading...');
                    }
                }
            });

            it('bind view happy case', function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        stakingZrcStatus.bindViewZrcStakingBalanceZil(tickerId, stakingCategoryId, '1234.4');

                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(), '1234.4');
                    }
                }
            });

            it('bind view random string', function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        stakingZrcStatus.bindViewZrcStakingBalanceZil(tickerId, stakingCategoryId, 'asdf');

                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(), 'asdf');
                    }
                }
            });
        });

        describe('#bindViewZrcStakingBalanceFiat24hAgo()', function () {

            beforeEach(function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '');
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '');
                    }
                }
            });

            it('bind view happy case', function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        stakingZrcStatus.bindViewZrcStakingBalanceFiat24hAgo(tickerId, stakingCategoryId, '1234.4', '21');

                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), '1234.4');
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), '21');
                    }
                }
            });

            it('bind view random string', function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        stakingZrcStatus.bindViewZrcStakingBalanceFiat24hAgo(tickerId, stakingCategoryId, 'asdf', 'qwer');

                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(), 'asdf');
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(), 'qwer');
                    }
                }
            });
        });

        describe('#bindViewZrcStakingBalanceFiat()', function () {

            beforeEach(function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(), 'Loading...');
                    }
                }
            });

            it('bind view happy case', function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        stakingZrcStatus.bindViewZrcStakingBalanceFiat(tickerId, stakingCategoryId, '1234.4');

                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(), '1234.4');
                    }
                }
            });

            it('bind view random string', function () {
                for (let tickerId in Constants.zrcStakingTokenPropertiesListMap) {
                    for (let stakingCategoryId in Constants.zrcStakingTokenPropertiesListMap[tickerId].staked_attributes_amount) {
                        stakingZrcStatus.bindViewZrcStakingBalanceFiat(tickerId, stakingCategoryId, 'asdf');

                        assert.strictEqual($('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(), 'asdf');
                    }
                }
            });
        });

    });
});