var indexJsdom = require('../index.jsdom.js');
var fs = require('fs')

var assert = require('assert');
var ZilswapDexStatus = require('../../clientjs/zilswap_dex_status.js');
var CoinPriceStatus = require('../../clientjs/coin_price_status.js');
var WalletBalanceStatus = require('../../clientjs/wallet_balance_status.js');
var StakingCarbonStatus = require('../../clientjs/staking_carbon_status.js');
var StakingBalanceStatus = require('../../clientjs/staking_balance_status.js');
var UniqueCoinStatus = require('../../clientjs/unique_coin_status.js');
var Constants = require('../../constants.js');

describe('NetWorthStatus', function () {

    describe('#constructor()', function () {

        it('create empty object', function () {
            let uniqueCoinStatus = new UniqueCoinStatus.UniqueCoinStatus(Constants.zrcTokenPropertiesListMap, /* barChartDrawer= */ null, /* zilswapDexStatus= */ null, /* walletBalanceStatus= */ null, /* stakingBalanceStatus= */ null, /* stakingCarbonStatus= */ null);

            assert.strictEqual(uniqueCoinStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(uniqueCoinStatus.barChartDrawer_, null);
            assert.strictEqual(uniqueCoinStatus.zilswapDexStatus_, null);
            assert.strictEqual(uniqueCoinStatus.walletBalanceStatus_, null);
            assert.strictEqual(uniqueCoinStatus.stakingBalanceStatus_, null);
            assert.strictEqual(uniqueCoinStatus.stakingCarbonStatus_, null);
        });
    });

    describe('#methods(), with 24h ago, includes everything', function () {
        var zilswapDexStatus;
        var walletBalanceStatus;
        var stakingCarbonStatus;
        var stakingBalanceStatus;
        var uniqueCoinStatus;

        beforeEach(function () {
            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceCoingecko24hAgoData = JSON.parse('{"zilliqa":{"usd":0.10519,"idr":1498}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, coinPriceCoingecko24hAgoData);

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

            uniqueCoinStatus = new UniqueCoinStatus.UniqueCoinStatus(Constants.zrcTokenPropertiesListMap, /* barChartDrawer= */ null, zilswapDexStatus, walletBalanceStatus, stakingBalanceStatus, stakingCarbonStatus);
        });

        it('compute unique coins, computed and sorted correctly', function () {
            // Default data from LP
            let expectedBeforeCompute = [
                [ 'ZIL', 4652.384684855229 ],
                [ 'CARB', 1523.0365065993913 ],
                [ 'ZWAP', 1133.668348840813 ],
                [ 'REDC', 1092.6018798700845 ],
                [ 'ZLP', 903.0779495449406 ],
                [ 'gZIL', 0 ],
                [ 'XSGD', 0 ],
                [ 'PORT', 0 ],
                [ 'XPORT', 0 ],
                [ 'SCO', 0 ],
                [ 'SRV', 0 ],
                [ 'DUCK', 0 ],
                [ 'ELONS', 0 ],
                [ 'ZCH', 0 ],
                [ 'BOLT', 0 ],
                [ 'ZYRO', 0 ],
                [ 'ZLF', 0 ],
                [ 'GARY', 0 ],
                [ 'RECAP', 0 ],
                [ 'AXT', 0 ],
                [ 'SHRK', 0 ],
                [ 'XCAD', 0 ],
                [ 'FLAT', 0 ],
                [ 'RWD', 0 ],
                [ 'DogZilliqa', 0 ],
                [ 'MESSI', 0 ],
                [ 'MAMBO', 0 ],
                [ 'STREAM', 0 ],
                [ 'SPW', 0 ]
              ];

            assert.deepStrictEqual(uniqueCoinStatus.sortedUniqueCoinsBalanceInZil_, expectedBeforeCompute);

            // Compute all status
            walletBalanceStatus.computeTokenBalanceMap('ZIL');
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                walletBalanceStatus.computeTokenBalanceMap(ticker);
            }
            stakingCarbonStatus.computeCarbonBalance();
            stakingBalanceStatus.computeStakingBalanceMap();
            stakingBalanceStatus.computeStakingWithdrawalBalance();
            zilswapDexStatus.computeZilswapPairPublicPersonalStatusMap();

            // Compute unique cion status
            uniqueCoinStatus.computeUniqueCoinsBalance();

            // Assert
            let expectedAfterCompute = [
                [ 'ZIL', 42618.29686039673 ],
                [ 'CARB', 3068.5166993553257 ],
                [ 'ZWAP', 1133.668348840813 ],
                [ 'REDC', 1106.4699349599064 ],
                [ 'ZLP', 903.0779495449406 ],
                [ 'gZIL', 0 ],
                [ 'XSGD', 0 ],
                [ 'PORT', 0 ],
                [ 'XPORT', 0 ],
                [ 'SCO', 0 ],
                [ 'SRV', 0 ],
                [ 'DUCK', 0 ],
                [ 'ELONS', 0 ],
                [ 'ZCH', 0 ],
                [ 'BOLT', 0 ],
                [ 'ZYRO', 0 ],
                [ 'ZLF', 0 ],
                [ 'GARY', 0 ],
                [ 'RECAP', 0 ],
                [ 'AXT', 0 ],
                [ 'SHRK', 0 ],
                [ 'XCAD', 0 ],
                [ 'FLAT', 0 ],
                [ 'RWD', 0 ],
                [ 'DogZilliqa', 0 ],
                [ 'MESSI', 0 ],
                [ 'MAMBO', 0 ],
                [ 'STREAM', 0 ],
                [ 'SPW', 0 ]
              ];
              
            assert.deepStrictEqual(uniqueCoinStatus.sortedUniqueCoinsBalanceInZil_, expectedAfterCompute);
        });
    });
});
