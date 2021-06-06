var indexJsdom = require('../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../clientjs/zilswap_dex_status.js');
var CoinPriceStatus = require('../../clientjs/coin_price_status.js');
var WalletBalanceStatus = require('../../clientjs/wallet_balance_status.js');
var StakingCarbonStatus = require('../../clientjs/staking_carbon_status.js');
var StakingBalanceStatus = require('../../clientjs/staking_balance_status.js');
var NetWorthStatus = require('../../clientjs/net_worth_status.js');
var Constants = require('../../constants.js');

describe('NetWorthStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);

        // bindViewTotalWalletBalanceZil24hAgo()
        assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '');
        assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '');

        // bindViewTotalWalletBalanceZil()
        assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');

        // bindViewTotalWalletBalanceFiat24hAgo()
        assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '');

        // bindViewTotalWalletBalanceFiat()
        assert.strictEqual($('#wallet_balance_fiat').text(), 'Loading...');

        // bindViewTotalLpBalanceZil24hAgo()
        assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '');
        assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '');

        // bindViewTotalLpBalanceZil()
        assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');

        // bindViewTotalLpBalanceFiat24hAgo()
        assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '');

        // bindViewTotalLpBalanceFiat()
        assert.strictEqual($('#lp_balance_fiat').text(), 'Loading...');

        // bindViewTotalStakingBalanceZil24hAgo()
        assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '');
        assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '');

        // bindViewTotalStakingBalanceZil()
        assert.strictEqual($('#staking_balance_zil').text(), 'Loading...');

        // bindViewTotalStakingBalanceFiat24hAgo()
        assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '');

        // bindViewTotalStakingBalanceFiat()
        assert.strictEqual($('#staking_balance_fiat').text(), 'Loading...');

        // bindViewTotalNetWorthZil24hAgo()
        assert.strictEqual($('#net_worth_zil_24h_ago').text(), '');
        assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '');

        // bindViewTotalNetWorthZil()
        assert.strictEqual($('#net_worth_zil').text(), 'Loading...');

        // bindViewTotalNetWorthFiat24hAgo()
        assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '');
        assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '');

        // bindViewTotalNetWorthFiat()
        assert.strictEqual($('#net_worth_fiat').text(), 'Loading...');
    });

    describe('#constructor()', function () {

        it('create empty object', function () {
            let netWorthStatus = new NetWorthStatus.NetWorthStatus( /* barChartDrawer= */ null, /* coinPriceStatus= */ null, /* zilswapDexStatus= */ null, /* walletBalanceStatus= */ null, /* stakingBalanceStatus= */ null);

            assert.strictEqual(netWorthStatus.coinPriceStatus_, null);
            assert.strictEqual(netWorthStatus.zilswapDexStatus_, null);
            assert.strictEqual(netWorthStatus.walletBalanceStatus_, null);
            assert.strictEqual(netWorthStatus.stakingBalanceStatus_, null);
        });

        it('create legit object', function () {
            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);

            let zilBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balance":"7476589135982234","nonce":46}}');
            let redcBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"657942857"}}}');
            let carbBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"1152887420"}}}');
            let zwapBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x55bda0a066942d33103cfc47f08d0338536184ef":"54342341"}}}');
            let emptyResultBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{}}');
            let emptyData = JSON.parse('{}');
            let emptyString = '';

            let zrcBalanceDataMap = {
                'REDC': redcBalanceData,
                'CARB': carbBalanceData,
                'ZWAP': zwapBalanceData,
                'XCAD': emptyResultBalanceData,
                'SCO': emptyData,
                'GARY': emptyString,
            }

            let walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletAddressBase16, zilBalanceData, zrcBalanceDataMap);

            let carbonBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}');
            let stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus(coinPriceStatus, zilswapDexStatus, walletAddressBase16, carbonBalanceData);

            let zilStakingBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"deposit_amt_deleg":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b":"2300000000000000", "0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0":"7063107679853089"}}}}');
            let zilStakingBalanceWithdrawalData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"withdrawal_pending":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"1037958":"14063107679853089", "1137958":"7063107679853089"}}}}');
            let stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, walletAddressBase16, zilStakingBalanceData, zilStakingBalanceWithdrawalData, stakingCarbonStatus);

            let netWorthStatus = new NetWorthStatus.NetWorthStatus(/* barChartDrawer= */ null, coinPriceStatus, zilswapDexStatus, walletBalanceStatus, stakingBalanceStatus);

            assert.strictEqual(netWorthStatus.coinPriceStatus_, coinPriceStatus);
            assert.strictEqual(netWorthStatus.zilswapDexStatus_, zilswapDexStatus);
            assert.strictEqual(netWorthStatus.walletBalanceStatus_, walletBalanceStatus);
            assert.strictEqual(netWorthStatus.stakingBalanceStatus_, stakingBalanceStatus);
        });
    });

    describe('#methods(), with 24h ago, includes everything', function () {
        var walletBalanceStatus;
        var coinPriceStatus;
        var stakingCarbonStatus;
        var stakingBalanceStatus;
        var zilswapDexStatus;
        var netWorthStatus;

        beforeEach(function () {
            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, walletAddressBase16, zilswapDexSmartContractStateData, zilswapDexSmartContractStateData24hAgo);

            let zilBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balance":"7476589135982234","nonce":46}}');
            let redcBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"657942857"}}}');
            let carbBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"1152887420"}}}');
            let zwapBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x55bda0a066942d33103cfc47f08d0338536184ef":"54342341"}}}');
            let emptyResultBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{}}');
            let emptyData = JSON.parse('{}');
            let emptyString = '';

            let zrcBalanceDataMap = {
                'REDC': redcBalanceData,
                'CARB': carbBalanceData,
                'ZWAP': zwapBalanceData,
                'XCAD': emptyResultBalanceData,
                'SCO': emptyData,
                'GARY': emptyString,
            }

            walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletAddressBase16, zilBalanceData, zrcBalanceDataMap);

            let carbonBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}');
            stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus(coinPriceStatus, zilswapDexStatus, walletAddressBase16, carbonBalanceData);

            let zilStakingBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"deposit_amt_deleg":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b":"2300000000000000", "0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0":"7063107679853089"}}}}');
            let zilStakingBalanceWithdrawalData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"withdrawal_pending":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"1037958":"14063107679853089", "1137958":"7063107679853089"}}}}');
            stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, walletAddressBase16, zilStakingBalanceData, zilStakingBalanceWithdrawalData, stakingCarbonStatus);

            netWorthStatus = new NetWorthStatus.NetWorthStatus(/* barChartDrawer= */ null, coinPriceStatus, zilswapDexStatus, walletBalanceStatus, stakingBalanceStatus);
        });

        it('onCoinPriceStatusChange() only updates fiat', function () {
            // Act
            netWorthStatus.onCoinPriceStatusChange();

            // This will show LP price although only invoking fiats, because LP
            // is already precomputed.

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#wallet_balance_fiat').text(), '0.00');
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '0.00');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '0.0');

            assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#lp_balance_fiat').text(), '1,099.73');
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '1,064.16');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '3.3');

            assert.strictEqual($('#staking_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#staking_balance_fiat').text(), '0.00');
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '0.00');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '0.0');

            assert.strictEqual($('#net_worth_zil').text(), '9,305');
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '10,117');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '-8.0');
            assert.strictEqual($('#net_worth_fiat').text(), '1,099.73');
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '1,064.16');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '3.3');
        });

        it('onWalletBalanceStatusChange() updates wallet balance and net worth', function () {
            walletBalanceStatus.computeTokenBalanceMap('ZIL');
            walletBalanceStatus.bindViewIfDataExist('ZIL');
            walletBalanceStatus.bindViewDataFiat('ZIL');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                walletBalanceStatus.computeTokenBalanceMap(ticker);
                walletBalanceStatus.bindViewIfDataExist(ticker);
                walletBalanceStatus.bindViewDataFiat(ticker);
            }

            // Act
            netWorthStatus.onWalletBalanceStatusChange();

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), '7,665');
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '7,683');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '-0.2');
            assert.strictEqual($('#wallet_balance_fiat').text(), '905.96');
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '808.12');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '12.1');

            assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#lp_balance_fiat').text(), 'Loading...');
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '');

            assert.strictEqual($('#staking_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#staking_balance_fiat').text(), 'Loading...');
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '');

            assert.strictEqual($('#net_worth_zil').text(), '16,970');
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '17,799');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '-4.7');
            assert.strictEqual($('#net_worth_fiat').text(), '2,005.70');
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '1,872.29');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '7.1');
        });

        it('onStakingBalanceStatusChange() updates staking balance and net worth', function () {

            stakingCarbonStatus.computeCarbonBalance();
            stakingCarbonStatus.bindViewStakingBalance();
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();
            // Act
            netWorthStatus.onStakingBalanceStatusChange();

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#wallet_balance_fiat').text(), 'Loading...');
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '');

            assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#lp_balance_fiat').text(), 'Loading...');
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '');

            assert.strictEqual($('#staking_balance_zil').text(), '31,860');
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '32,022');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '-0.5');
            assert.strictEqual($('#staking_balance_fiat').text(), '3,765.53');
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '3,368.43');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '11.8');

            assert.strictEqual($('#net_worth_zil').text(), '41,165');
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '42,139');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '-2.3');
            assert.strictEqual($('#net_worth_fiat').text(), '4,865.26');
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '4,432.60');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '9.8');
        });

        it('onZilswapDexStatusChange() updates everything', function () {
            zilswapDexStatus.computeZilswapPairPublicPersonalStatusMap();

            // Act
            netWorthStatus.onZilswapDexStatusChange();

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), '');
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '0.0');
            assert.strictEqual($('#wallet_balance_fiat').text(), '0.00');
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '0.00');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '0.0');

            assert.strictEqual($('#lp_balance_zil').text(), '9,305');
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '10,117');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '-8.0');
            assert.strictEqual($('#lp_balance_fiat').text(), '1,099.73');
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '1,064.16');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '3.3');

            assert.strictEqual($('#staking_balance_zil').text(), '');
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '0.0');
            assert.strictEqual($('#staking_balance_fiat').text(), '0.00');
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '0.00');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '0.0');

            assert.strictEqual($('#net_worth_zil').text(), '9,305');
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '10,117');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '-8.0');
            assert.strictEqual($('#net_worth_fiat').text(), '1,099.73');
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '1,064.16');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '3.3');
        });

        it('all invoked, updates everything', function () {
            walletBalanceStatus.computeTokenBalanceMap('ZIL');
            walletBalanceStatus.bindViewIfDataExist('ZIL');
            walletBalanceStatus.bindViewDataFiat('ZIL');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                walletBalanceStatus.computeTokenBalanceMap(ticker);
                walletBalanceStatus.bindViewIfDataExist(ticker);
                walletBalanceStatus.bindViewDataFiat(ticker);
            }

            stakingCarbonStatus.computeCarbonBalance();
            stakingCarbonStatus.bindViewStakingBalance();
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();

            zilswapDexStatus.computeZilswapPairPublicPersonalStatusMap();

            // Act
            netWorthStatus.onZilswapDexStatusChange();
            netWorthStatus.onStakingBalanceStatusChange();
            netWorthStatus.onWalletBalanceStatusChange();

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), '7,665');
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '7,683');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '-0.2');
            assert.strictEqual($('#wallet_balance_fiat').text(), '905.96');
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '808.12');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '12.1');

            assert.strictEqual($('#lp_balance_zil').text(), '9,305');
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '10,117');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '-8.0');
            assert.strictEqual($('#lp_balance_fiat').text(), '1,099.73');
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '1,064.16');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '3.3');

            assert.strictEqual($('#staking_balance_zil').text(), '31,860');
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '32,022');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '-0.5');
            assert.strictEqual($('#staking_balance_fiat').text(), '3,765.53');
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '3,368.43');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '11.8');

            assert.strictEqual($('#net_worth_zil').text(), '48,830');
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '49,821');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '-2.0');
            assert.strictEqual($('#net_worth_fiat').text(), '5,771.22');
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '5,240.72');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '10.1');
        });

        it('all invoked, updates everything, change currency', function () {
            walletBalanceStatus.computeTokenBalanceMap('ZIL');
            walletBalanceStatus.bindViewIfDataExist('ZIL');
            walletBalanceStatus.bindViewDataFiat('ZIL');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                walletBalanceStatus.computeTokenBalanceMap(ticker);
                walletBalanceStatus.bindViewIfDataExist(ticker);
                walletBalanceStatus.bindViewDataFiat(ticker);
            }

            stakingCarbonStatus.computeCarbonBalance();
            stakingCarbonStatus.bindViewStakingBalance();
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();

            zilswapDexStatus.computeZilswapPairPublicPersonalStatusMap();

            netWorthStatus.onZilswapDexStatusChange();
            netWorthStatus.onStakingBalanceStatusChange();
            netWorthStatus.onWalletBalanceStatusChange();

            // Act
            coinPriceStatus.setActiveCurrencyCode('idr');
            netWorthStatus.onCoinPriceStatusChange();

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), '7,665');
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '7,683');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '-0.2');
            assert.strictEqual($('#wallet_balance_fiat').text(), '12,356,501');
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '11,508,420');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '7.4');

            assert.strictEqual($('#lp_balance_zil').text(), '9,305');
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '10,117');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '-8.0');
            assert.strictEqual($('#lp_balance_fiat').text(), '14,999,288');
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '15,154,651');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '-1.0');

            assert.strictEqual($('#staking_balance_zil').text(), '31,860');
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '32,022');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '-0.5');
            assert.strictEqual($('#staking_balance_fiat').text(), '51,358,219');
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '47,969,512');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '7.1');

            assert.strictEqual($('#net_worth_zil').text(), '48,830');
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '49,821');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '-2.0');
            assert.strictEqual($('#net_worth_fiat').text(), '78,714,008');
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '74,632,584');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '5.5');
        });

        it('all invoked, resetView(), views reset', function () {
            walletBalanceStatus.computeTokenBalanceMap('ZIL');
            walletBalanceStatus.bindViewIfDataExist('ZIL');
            walletBalanceStatus.bindViewDataFiat('ZIL');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                walletBalanceStatus.computeTokenBalanceMap(ticker);
                walletBalanceStatus.bindViewIfDataExist(ticker);
                walletBalanceStatus.bindViewDataFiat(ticker);
            }

            stakingCarbonStatus.computeCarbonBalance();
            stakingCarbonStatus.bindViewStakingBalance();
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();

            zilswapDexStatus.computeZilswapPairPublicPersonalStatusMap();

            netWorthStatus.onZilswapDexStatusChange();
            netWorthStatus.onStakingBalanceStatusChange();
            netWorthStatus.onWalletBalanceStatusChange();

            // Act
            netWorthStatus.reset();

            // Assert
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '');
            assert.strictEqual($('#wallet_balance_fiat').text(), 'Loading...');

            assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#lp_balance_fiat').text(), 'Loading...');
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '');

            assert.strictEqual($('#staking_balance_zil').text(), 'Loading...');
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#staking_balance_fiat').text(), 'Loading...');
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '');

            assert.strictEqual($('#net_worth_zil').text(), 'Loading...');
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '');
            assert.strictEqual($('#net_worth_fiat').text(), 'Loading...');
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '');
        });
    });

    describe('#bindView()', function () {
        var netWorthStatus;

        beforeEach(function () {
            netWorthStatus = new NetWorthStatus.NetWorthStatus(/* barChartDrawer= */ null,  /* coinPriceStatus= */ null, /* zilswapDexStatus= */ null, /* walletBalanceStatus= */ null, /* stakingBalanceStatus= */ null);
        });

        describe('wallet balance', function () {

            describe('#bindViewTotalWalletBalanceZil24hAgo()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '');
                    assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalWalletBalanceZil24hAgo('1234.52', '42.2');

                    // Assert
                    assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '1234.52');
                    assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '42.2');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalWalletBalanceZil24hAgo('asdf', 'qwer');

                    // Assert
                    assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), 'qwer');
                });
            });

            describe('#bindViewTotalWalletBalanceZil()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalWalletBalanceZil('1234.52');

                    // Assert
                    assert.strictEqual($('#wallet_balance_zil').text(), '1234.52');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalWalletBalanceZil('asdf');

                    // Assert
                    assert.strictEqual($('#wallet_balance_zil').text(), 'asdf');
                });
            });


            describe('#bindViewTotalWalletBalanceFiat24hAgo()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '');
                    assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '');
                });


                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalWalletBalanceFiat24hAgo('1234.52', '1.2');

                    // Assert
                    assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '1234.52');
                    assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '1.2');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalWalletBalanceFiat24hAgo('asdf', 'qwer');

                    // Assert
                    assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), 'qwer');
                });
            });

            describe('#bindViewTotalWalletBalanceFiat()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#wallet_balance_fiat').text(), 'Loading...');
                });


                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalWalletBalanceFiat('1234.52');

                    // Assert
                    assert.strictEqual($('#wallet_balance_fiat').text(), '1234.52');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalWalletBalanceFiat('asdf');

                    // Assert
                    assert.strictEqual($('#wallet_balance_fiat').text(), 'asdf');
                });
            });
        });

        describe('lp balance', function () {

            describe('#bindViewTotalLpBalanceZil24hAgo()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '');
                    assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalLpBalanceZil24hAgo('1234.52', '4.2');

                    // Assert
                    assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '1234.52');
                    assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '4.2');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalLpBalanceZil24hAgo('asdf', 'qwer');

                    // Assert
                    assert.strictEqual($('#lp_balance_zil_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), 'qwer');
                });
            });

            describe('#bindViewTotalLpBalanceZil()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalLpBalanceZil('1234.52');

                    // Assert
                    assert.strictEqual($('#lp_balance_zil').text(), '1234.52');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalLpBalanceZil('asdf');

                    // Assert
                    assert.strictEqual($('#lp_balance_zil').text(), 'asdf');
                });
            });

            describe('#bindViewTotalLpBalanceFiat24hAgo()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '');
                    assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalLpBalanceFiat24hAgo('1234.52', '4.2');

                    // Assert
                    assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '1234.52');
                    assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '4.2');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalLpBalanceFiat24hAgo('asdf', 'qwer');

                    // Assert
                    assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), 'qwer');
                });
            });

            describe('#bindViewTotalLpBalanceFiat()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#lp_balance_fiat').text(), 'Loading...');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalLpBalanceFiat('1234.52');

                    // Assert
                    assert.strictEqual($('#lp_balance_fiat').text(), '1234.52');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalLpBalanceFiat('asdf');

                    // Assert
                    assert.strictEqual($('#lp_balance_fiat').text(), 'asdf');
                });
            });

        });

        describe('staking balance', function () {

            describe('#bindViewTotalStakingBalanceZil24hAgo()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '');
                    assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalStakingBalanceZil24hAgo('1234.52', '12');

                    // Assert
                    assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '1234.52');
                    assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '12');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalStakingBalanceZil24hAgo('asdf', 'qwer');

                    // Assert
                    assert.strictEqual($('#staking_balance_zil_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), 'qwer');
                });
            });

            describe('#bindViewTotalStakingBalanceZil()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#staking_balance_zil').text(), 'Loading...');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalStakingBalanceZil('1234.52');

                    // Assert
                    assert.strictEqual($('#staking_balance_zil').text(), '1234.52');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalStakingBalanceZil('asdf');

                    // Assert
                    assert.strictEqual($('#staking_balance_zil').text(), 'asdf');
                });
            });

            describe('#bindViewTotalStakingBalanceFiat24hAgo()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '');
                    assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalStakingBalanceFiat24hAgo('1234.52', '22');

                    // Assert
                    assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '1234.52');
                    assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '22');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalStakingBalanceFiat24hAgo('asdf', 'qwer');

                    // Assert
                    assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), 'qwer');
                });
            });

            describe('#bindViewTotalStakingBalanceFiat()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#staking_balance_fiat').text(), 'Loading...');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalStakingBalanceFiat('1234.52');

                    // Assert
                    assert.strictEqual($('#staking_balance_fiat').text(), '1234.52');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalStakingBalanceFiat('asdf');

                    // Assert
                    assert.strictEqual($('#staking_balance_fiat').text(), 'asdf');
                });
            });

        });

        describe('net worth balance', function () {

            describe('#bindViewTotalNetWorthZil24hAgo()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#net_worth_zil_24h_ago').text(), '');
                    assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalNetWorthZil24hAgo('1234.52', '22');

                    // Assert
                    assert.strictEqual($('#net_worth_zil_24h_ago').text(), '1234.52');
                    assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '22');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalNetWorthZil24hAgo('asdf', 'qwer');

                    // Assert
                    assert.strictEqual($('#net_worth_zil_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), 'qwer');
                });
            });

            describe('#bindViewTotalNetWorthZil()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#net_worth_zil').text(), 'Loading...');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalNetWorthZil('1234.52');

                    // Assert
                    assert.strictEqual($('#net_worth_zil').text(), '1234.52');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalNetWorthZil('asdf');

                    // Assert
                    assert.strictEqual($('#net_worth_zil').text(), 'asdf');
                });
            });


            describe('#bindViewTotalNetWorthFiat24hAgo()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '');
                    assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalNetWorthFiat24hAgo('1234.52', '41');

                    // Assert
                    assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '1234.52');
                    assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '41');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalNetWorthFiat24hAgo('asdf', 'rewq');

                    // Assert
                    assert.strictEqual($('#net_worth_fiat_24h_ago').text(), 'asdf');
                    assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), 'rewq');
                });
            });

            describe('#bindViewTotalNetWorthFiat()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#net_worth_fiat').text(), 'Loading...');
                });

                it('bind view happy case', function () {
                    // Act
                    netWorthStatus.bindViewTotalNetWorthFiat('1234.52');

                    // Assert
                    assert.strictEqual($('#net_worth_fiat').text(), '1234.52');
                });

                it('bind view random string', function () {
                    // Act
                    netWorthStatus.bindViewTotalNetWorthFiat('asdf');

                    // Assert
                    assert.strictEqual($('#net_worth_fiat').text(), 'asdf');
                });
            });
        });
    });
});