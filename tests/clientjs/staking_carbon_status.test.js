var indexJsdom = require('../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../clientjs/zilswap_dex_status.js');
var CoinPriceStatus = require('../../clientjs/coin_price_status.js');
var StakingCarbonStatus = require('../../clientjs/staking_carbon_status.js');

describe('StakingCarbonStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);

        // bindViewCarbonStakingBalance()
        assert.strictEqual($('#carbon_staking_balance').text(), 'Loading...');
        assert.strictEqual($('#carbon_staking_container').css('display'), 'none');
        assert.strictEqual($('#staking_container').css('display'), 'none');

        // bindViewCarbonStakingBalanceZil24hAgo()
        assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '');
        assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '');

        // bindViewCarbonStakingBalanceZil()
        assert.strictEqual($('#carbon_staking_balance_zil').text(), 'Loading...');

        // bindViewCarbonStakingBalanceFiat24hAgo()
        assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '');

        // bindViewCarbonStakingBalanceFiat()
        assert.strictEqual($('#carbon_staking_balance_fiat').text(), 'Loading...');
    });

    describe('#constructor()', function () {

        it('create plain object', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
            let stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus(coinPriceStatus, zilswapDexStatus, /* walletAddressBase16= */ null, /* carbonBalanceData= */ null);

            assert.strictEqual(stakingCarbonStatus.coinPriceStatus_, coinPriceStatus);
            assert.strictEqual(stakingCarbonStatus.zilswapDexStatus_, zilswapDexStatus);
            assert.strictEqual(stakingCarbonStatus.walletAddressBase16_, null);
            assert.strictEqual(stakingCarbonStatus.carbonBalanceData_, null);
            assert.strictEqual(stakingCarbonStatus.carbonBalance_, null);
        });
    });

    describe('#methods(), without 24h ago', function () {

        var walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
        var coinPriceStatus;
        var zilswapDexStatus;
        var stakingCarbonStatus;

        beforeEach(function () {
            // Arrange
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);

            carbonBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}');

            stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus(coinPriceStatus, zilswapDexStatus, /* walletAddressBase16= */ null, carbonBalanceData);
        });

        it('no action, no token balance data', function () {
            // Assert
            assert.strictEqual(stakingCarbonStatus.getCarbonStakingBalance(), null);
        });

        it('compute, wallet not set, no token balance data', function () {
            // Act
            stakingCarbonStatus.computeCarbonBalance();

            // Assert
            assert.strictEqual(stakingCarbonStatus.getCarbonStakingBalance(), null);
            assert.strictEqual($('#carbon_staking_container').css('display'), 'none');
            assert.strictEqual($('#staking_container').css('display'), 'none');
        });

        it('compute, wallet set, have token balance data', function () {
            stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus(coinPriceStatus, zilswapDexStatus, walletAddressBase16, carbonBalanceData);

            // Act
            stakingCarbonStatus.computeCarbonBalance();

            // Assert
            assert.strictEqual(stakingCarbonStatus.getCarbonStakingBalance(), 90.36430995);
        });

        it('compute, wallet set, bindView(), assertView', function () {
            stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus(coinPriceStatus, zilswapDexStatus, walletAddressBase16, carbonBalanceData);

            // Act
            stakingCarbonStatus.computeCarbonBalance();
            stakingCarbonStatus.bindViewStakingBalance();

            // Assert
            assert.strictEqual($('#carbon_staking_balance').text(), '90.36');
            assert.strictEqual($('#carbon_staking_balance_zil').text(), '1,371');
            assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#carbon_staking_balance_fiat').text(), '161.99');
            assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '');
            assert.strictEqual($('#carbon_staking_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');
        });

        it('compute, wallet set, bindView(), reset(), view reset', function () {
            stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus(coinPriceStatus, zilswapDexStatus, walletAddressBase16, carbonBalanceData);

            stakingCarbonStatus.computeCarbonBalance();
            stakingCarbonStatus.bindViewStakingBalance();

            // Act
            stakingCarbonStatus.reset();

            // Assert
            assert.strictEqual(stakingCarbonStatus.carbonBalanceData_, null);
            assert.strictEqual(stakingCarbonStatus.carbonBalance_, null);

            assert.strictEqual($('#carbon_staking_container').css('display'), 'none');
            assert.strictEqual($('#carbon_staking_balance').text(), 'Loading...');
            assert.strictEqual($('#carbon_staking_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#carbon_staking_balance_fiat').text(), 'Loading...');
            assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '');
        });
    });

    describe('#methods(), with 24h ago, in idr', function () {
        var coinPriceStatus;
        var zilswapDexStatus;
        var stakingCarbonStatus;

        beforeEach(function () {
            // Arrange
            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);

            let carbonBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}');
            stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus(coinPriceStatus, zilswapDexStatus, walletAddressBase16, carbonBalanceData);
        });

        it('compute, wallet set, bindView(), assertView', function () {
            // Act
            stakingCarbonStatus.computeCarbonBalance();
            stakingCarbonStatus.bindViewStakingBalance();

            // Assert
            assert.strictEqual($('#carbon_staking_balance').text(), '90.36');
            assert.strictEqual($('#carbon_staking_balance_zil').text(), '1,371');
            assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '1,533');
            assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '-10.6');
            assert.strictEqual($('#carbon_staking_balance_fiat').text(), '161.99');
            assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '161.26');
            assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '0.5');
            assert.strictEqual($('#carbon_staking_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');

            // Change currency
            coinPriceStatus.setActiveCurrencyCode('idr');
            zilswapDexStatus.onCoinPriceStatusChange();
            stakingCarbonStatus.onCoinPriceStatusChange();

            // Assert IDR
            assert.strictEqual($('#carbon_staking_balance').text(), '90.36');
            assert.strictEqual($('#carbon_staking_balance_zil').text(), '1,371');
            assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '1,533');
            assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '-10.6');
            assert.strictEqual($('#carbon_staking_balance_fiat').text(), '2,209,430');
            assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '2,296,506');
            assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '-3.8');
            assert.strictEqual($('#carbon_staking_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');
        });
    });

    describe('#bindView()', function () {
        var stakingCarbonStatus;

        beforeEach(function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
            stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus(coinPriceStatus, zilswapDexStatus, /* walletAddressBase16= */ null, /* carbonBalanceData= */ null);
        });

        describe('#bindViewCarbonStakingBalance()', function () {

            beforeEach(function () {
                assert.strictEqual($('#carbon_staking_balance').text(), 'Loading...');
                assert.strictEqual($('#carbon_staking_container').css('display'), 'none');
                assert.strictEqual($('#staking_container').css('display'), 'none');
            });

            it('bind view happy case', function () {
                // Act
                stakingCarbonStatus.bindViewCarbonStakingBalance('1234.4');

                // Assert
                assert.strictEqual($('#carbon_staking_balance').text(), '1234.4');
                assert.strictEqual($('#carbon_staking_container').css('display'), 'block');
                assert.strictEqual($('#staking_container').css('display'), 'block');
            });

            it('bind view random string', function () {
                // Act
                stakingCarbonStatus.bindViewCarbonStakingBalance('asdf');

                // Assert
                assert.strictEqual($('#carbon_staking_balance').text(), 'asdf');
                assert.strictEqual($('#carbon_staking_container').css('display'), 'block');
                assert.strictEqual($('#staking_container').css('display'), 'block');
            });
        });

        describe('#bindViewCarbonStakingBalanceZil24hAgo()', function () {

            beforeEach(function () {
                assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '');
                assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '');
            });

            it('bind view happy case', function () {
                // Act
                stakingCarbonStatus.bindViewCarbonStakingBalanceZil24hAgo('1234.4', '4.2');

                // Assert
                assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '1234.4');
                assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '4.2');
            });

            it('bind view random string', function () {
                // Act
                stakingCarbonStatus.bindViewCarbonStakingBalanceZil24hAgo('asdf', 'qwer');

                // Assert
                assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), 'asdf');
                assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), 'qwer');
            });
        });


        describe('#bindViewCarbonStakingBalanceZil()', function () {

            beforeEach(function () {
                assert.strictEqual($('#carbon_staking_balance_zil').text(), 'Loading...');
            });

            it('bind view happy case', function () {
                // Act
                stakingCarbonStatus.bindViewCarbonStakingBalanceZil('1234.4');

                // Assert
                assert.strictEqual($('#carbon_staking_balance_zil').text(), '1234.4');
            });

            it('bind view random string', function () {
                // Act
                stakingCarbonStatus.bindViewCarbonStakingBalanceZil('asdf');

                // Assert
                assert.strictEqual($('#carbon_staking_balance_zil').text(), 'asdf');
            });
        });

        describe('#bindViewCarbonStakingBalanceFiat24hAgo()', function () {

            beforeEach(function () {
                assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '');
                assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '');
            });

            it('bind view happy case', function () {
                // Act
                stakingCarbonStatus.bindViewCarbonStakingBalanceFiat24hAgo('1234.4', '21');

                // Assert
                assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '1234.4');
                assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '21');
            });

            it('bind view random string', function () {
                // Act
                stakingCarbonStatus.bindViewCarbonStakingBalanceFiat24hAgo('asdf', 'qwer');

                // Assert
                assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), 'asdf');
                assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), 'qwer');
            });
        });

        describe('#bindViewCarbonStakingBalanceFiat()', function () {

            beforeEach(function () {
                assert.strictEqual($('#carbon_staking_balance_fiat').text(), 'Loading...');
            });

            it('bind view happy case', function () {
                // Act
                stakingCarbonStatus.bindViewCarbonStakingBalanceFiat('1234.4');

                // Assert
                assert.strictEqual($('#carbon_staking_balance_fiat').text(), '1234.4');
            });

            it('bind view random string', function () {
                // Act
                stakingCarbonStatus.bindViewCarbonStakingBalanceFiat('asdf');

                // Assert
                assert.strictEqual($('#carbon_staking_balance_fiat').text(), 'asdf');
            });
        });

    });
});