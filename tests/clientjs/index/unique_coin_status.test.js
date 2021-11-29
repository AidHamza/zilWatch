var indexJsdom = require('../../index.jsdom.js');
var fs = require('fs')

var assert = require('assert');
var ZilswapDexStatus = require('../../../clientjs/index/zilswap_dex_status.js');
var CoinPriceStatus = require('../../../clientjs/index/coin_price_status.js');
var WalletBalanceStatus = require('../../../clientjs/index/wallet_balance_status.js');
var StakingZrcStatus = require('../../../clientjs/index/staking_zrc_status.js');
var StakingBalanceStatus = require('../../../clientjs/index/staking_balance_status.js');
var UniqueCoinStatus = require('../../../clientjs/index/unique_coin_status.js');
var Constants = require('../../../constants.js');

describe('NetWorthStatus', function () {

    describe('#constructor()', function () {

        it('create empty object', function () {
            let uniqueCoinStatus = new UniqueCoinStatus.UniqueCoinStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, /* barChartDrawer= */ null, /* zilswapDexStatus= */ null, /* walletBalanceStatus= */ null, /* stakingBalanceStatus= */ null, /* stakingZrcStatus= */ null);

            assert.strictEqual(uniqueCoinStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(uniqueCoinStatus.barChartDrawer_, null);
            assert.strictEqual(uniqueCoinStatus.zilswapDexStatus_, null);
            assert.strictEqual(uniqueCoinStatus.walletBalanceStatus_, null);
            assert.strictEqual(uniqueCoinStatus.stakingBalanceStatus_, null);
            assert.strictEqual(uniqueCoinStatus.stakingZrcStatus_, null);
        });
    });

    describe('#methods(), with 24h ago, includes everything', function () {
        var zilswapDexStatus;
        var walletBalanceStatus;
        var stakingZrcStatus;
        var stakingBalanceStatus;
        var uniqueCoinStatus;
        let carbonBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}');
        let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

        beforeEach(function () {
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

            let zilswapDexSmartContractStateData24hAgo = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210422.txt', 'utf8'));
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
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

            stakingZrcStatus = new StakingZrcStatus.StakingZrcStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus);

            let zilStakingBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"deposit_amt_deleg":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b":"2300000000000000", "0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0":"7063107679853089"}}}}');
            let zilStakingBalanceWithdrawalData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"withdrawal_pending":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":{"1037958":"14063107679853089", "1137958":"7063107679853089"}}}}');
            stakingBalanceStatus = new StakingBalanceStatus.StakingBalanceStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, Constants.ssnListMap, coinPriceStatus, walletAddressBase16, zilStakingBalanceData, zilStakingBalanceWithdrawalData, stakingZrcStatus);

            uniqueCoinStatus = new UniqueCoinStatus.UniqueCoinStatus(Constants.zrcTokenPropertiesListMap, Constants.zrcStakingTokenPropertiesListMap, /* barChartDrawer= */ null, zilswapDexStatus, walletBalanceStatus, stakingBalanceStatus, stakingZrcStatus);
        });

        it('compute unique coins, computed and sorted correctly', function () {
            // Default data from LP
            let expectedBeforeCompute = [
                ['ZIL', 4652.384684855229],
                ['CARB', 1523.0365065993913],
                ['ZWAP', 1133.668348840813],
                ['REDC', 1092.6018798700845],
                ['ZLP', 903.0779495449406],
            ];
            let nonZeroTickerDummyMap = {
                'ZIL': 0,
                'CARB': 0,
                'ZWAP': 0,
                'REDC': 0,
                'ZLP': 0
            }
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // If token not in the list, i.e., new token, it's 0, we add it into the list
                if (!(ticker in nonZeroTickerDummyMap)) {
                    expectedBeforeCompute.push([ticker, 0]);
                }
            }

            assert.deepStrictEqual(uniqueCoinStatus.sortedUniqueCoinsBalanceInZil_, expectedBeforeCompute);

            // Compute all status
            walletBalanceStatus.computeTokenBalanceMap('ZIL');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                walletBalanceStatus.computeTokenBalanceMap(ticker);
            }
            stakingZrcStatus.computeZrcBalance(carbonBalanceData, 'CARB', 'staked', walletAddressBase16);
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();
            zilswapDexStatus.computeZilswapPairPublicPersonalStatusMap();

            // Compute unique cion status
            uniqueCoinStatus.computeUniqueCoinsBalance();

            // Assert
            let expectedAfterCompute = [
                ['ZIL', 42618.29686039673],
                ['CARB', 3068.5166993553257],
                ['ZWAP', 1133.668348840813],
                ['REDC', 1106.4699349599064],
                ['ZLP', 903.0779495449406],
            ];
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // If token not in the list, i.e., new token, it's 0, we add it into the list
                if (!(ticker in nonZeroTickerDummyMap)) {
                    expectedAfterCompute.push([ticker, 0]);
                }
            }

            assert.deepStrictEqual(uniqueCoinStatus.sortedUniqueCoinsBalanceInZil_, expectedAfterCompute);
        });
    });
});