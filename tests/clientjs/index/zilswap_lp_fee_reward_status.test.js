var indexJsdom = require('../../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../../clientjs/index/zilswap_dex_status.js');
var ZilswapTradeVolumeStatus = require('../../../clientjs/index/zilswap_trade_volume_status.js');
var ZilswapLpFeeRewardStatus = require('../../../clientjs/index//zilswap_lp_fee_reward_status.js');
var Constants = require('../../../constants.js');

describe('ZilswapLpFeeRewardStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#constructor()', function () {

        it('create empty object', function () {
            let zilswapLpFeeRewardStatus = new ZilswapLpFeeRewardStatus.ZilswapLpFeeRewardStatus(Constants.zrcTokenPropertiesListMap, /* zilswapDexStatus= */ null, /* zilswapTradeVolumeStatus= */ null);

            assert.strictEqual(zilswapLpFeeRewardStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(zilswapLpFeeRewardStatus.zilswapDexStatus_, null);
            assert.strictEqual(zilswapLpFeeRewardStatus.zilswapTradeVolumeStatus_, null);
            assert.deepStrictEqual(zilswapLpFeeRewardStatus.coinToFeeRewardMap_, {});
        });
    });

    describe('#method()', function () {
        var zilswapLpFeeRewardStatus;

        var expectedEarnedFeeMap = {
            ZWAP: 0.10500495435051646,
            ZLP: 0.10713231771128974,
            REDC: 0.12633472902637125,
            CARB: 0.23565218003481672
        };

        var expectedEarnedFeeStringMap = {
            ZWAP: "0.1050",
            ZLP: "0.1071",
            REDC: "0.1263",
            CARB: "0.2357"
        };


        beforeEach(function () {
            let zilswap24hTradeVolumeData = JSON.parse('[{"pool":"zil14jmjrkvfcz2uvj3y69kl6gas34ecuf2j5ggmye","in_zil_amount":"3817477743960542","out_token_amount":"185950095979","out_zil_amount":"77510195322491315","in_token_amount":"3785774718449"},{"pool":"zil177u3jh5x4hqual22zy7s2ru3gc2y4yq5wnq2un","in_zil_amount":"2162671959339823","out_token_amount":"174116","out_zil_amount":"0","in_token_amount":"0"},{"pool":"zil1hpwshtxspjakjh5sn7vn4e7pp4gaqkefup24h2","in_zil_amount":"1000000000000","out_token_amount":"2154","out_zil_amount":"771473664749","in_token_amount":"2034"},{"pool":"zil1n7tue7za53lk0r9034m085p8f46g8cg9qupged","in_zil_amount":"0","out_token_amount":"0","out_zil_amount":"12785500865554","in_token_amount":"714644"},{"pool":"zil1ykcdhtgyercmv7ndfxt00wm9xzpq4k7hjmfm4e","in_zil_amount":"69693646410081063","out_token_amount":"533840506445766553","out_zil_amount":"62861712363663810","in_token_amount":"490613340831484197"},{"pool":"zil1lq3ghn3yaqk0w7fqtszv53hejunpyfyh3rx9gc","in_zil_amount":"52544565609466770","out_token_amount":"3094","out_zil_amount":"57206773068919036","in_token_amount":"3384"},{"pool":"zil1kwfu3x9n6fsuxc4ynp72uk5rxge25enw7zsf9z","in_zil_amount":"5543578752126675415","out_token_amount":"10904051934","out_zil_amount":"6481483409812383877","in_token_amount":"12809614446"},{"pool":"zil1p5suryq6q647usxczale29cu3336hhp376c627","in_zil_amount":"2271879632713767773","out_token_amount":"897453043004307","out_zil_amount":"4287181664186561415","in_token_amount":"1701066823666927"},{"pool":"zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4","in_zil_amount":"65854009096210692","out_token_amount":"3928566002208342954494","out_zil_amount":"335612091534067668","in_token_amount":"20214985170697004959534"},{"pool":"zil168qdlq4xsua6ac9hugzntqyasf8gs7aund882v","in_zil_amount":"6000000000000000","out_token_amount":"23368","out_zil_amount":"46869778391176583","in_token_amount":"181602"},{"pool":"zil1pdxm02u4v6wmjtwswqm305uyth2lkwurawkvre","in_zil_amount":"0","out_token_amount":"0","out_zil_amount":"504797339985812","in_token_amount":"717310249"},{"pool":"zil1x6z064fkssmef222gkhz3u5fhx57kyssn7vlu0","in_zil_amount":"100105459181800","out_token_amount":"340817474979492805964","out_zil_amount":"0","in_token_amount":"0"},{"pool":"zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t","in_zil_amount":"12421999727971345196","out_token_amount":"1822073779363","out_zil_amount":"9706738668645789010","in_token_amount":"1414476670204"},{"pool":"zil1w5hwupgc9rxyuyd742g2c9annwahugrx80fw9h","in_zil_amount":"81265511521974934","out_token_amount":"16946","out_zil_amount":"102579661439133681","in_token_amount":"21372"},{"pool":"zil1qzwxvp3wz3q5ewzg3afesut9pqfax0sjdyna42","in_zil_amount":"12834753073606536","out_token_amount":"2171837","out_zil_amount":"6597329278422943","in_token_amount":"591534"},{"pool":"zil1ucvrn22x8366vzpw5t7su6eyml2auczu6wnqqg","in_zil_amount":"66606935060739523","out_token_amount":"42276214214967","out_zil_amount":"21261481281891853","in_token_amount":"13371235494888"},{"pool":"zil1h63h5rlg7avatnlzhfnfzwn8vfspwkapzdy2aw","in_zil_amount":"1330374998529380167","out_token_amount":"64278616327","out_zil_amount":"1875098884545933226","in_token_amount":"89288834953"},{"pool":"zil17hdu9r4h49d7gyh8s7zkeh3yatqft62uvsu8ep","in_zil_amount":"0","out_token_amount":"0","out_zil_amount":"737566808158080","in_token_amount":"5000"},{"pool":"zil1rk9vdfu2xsp7y4h24qg78n6ss23mxxge5slsv2","in_zil_amount":"527410334913536","out_token_amount":"668066281","out_zil_amount":"612610486053968","in_token_amount":"815684813"},{"pool":"zil133vrh59edllqz7guq7htfthjmj7gct5jxqqtl7","in_zil_amount":"88948532772974","out_token_amount":"2000000","out_zil_amount":"283590174792985","in_token_amount":"6436081"},{"pool":"zil12drvflckms6874ffuujcdxj75raavl4yfn4ssc","in_zil_amount":"7517516722042033","out_token_amount":"2625232807912129","out_zil_amount":"10799266296432955","in_token_amount":"3851920554042949"},{"pool":"zil1r9dcsrya4ynuxnzaznu00e6hh3kpt7vhvzgva0","in_zil_amount":"74816922932888244","out_token_amount":"53911077","out_zil_amount":"211322733168581811","in_token_amount":"148567688"},{"pool":"zil1c6akv8k6dqaac7ft8ezk5gr2jtxrewfw8hc27d","in_zil_amount":"25070992486993500","out_token_amount":"245","out_zil_amount":"32210225669586338","in_token_amount":"316"},{"pool":"zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk","in_zil_amount":"202400031341801563","out_token_amount":"1352397919896","out_zil_amount":"404242645590089614","in_token_amount":"2718309184514"},{"pool":"zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2","in_zil_amount":"1557030485856189059","out_token_amount":"197579927","out_zil_amount":"2568246176198045895","in_token_amount":"326775330"},{"pool":"zil1s8xzysqcxva2x6aducncv9um3zxr36way3fx9g","in_zil_amount":"262173525678469436","out_token_amount":"9542374093","out_zil_amount":"512328173584165960","in_token_amount":"18883672869"},{"pool":"zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e","in_zil_amount":"2052667968754572413","out_token_amount":"1728713324675295133","out_zil_amount":"2953195678656489450","in_token_amount":"2497925808457035286"}]');

            let zilswapTradeVolumeStatus = new ZilswapTradeVolumeStatus.ZilswapTradeVolumeStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, zilswap24hTradeVolumeData);

            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* xcadDexStatus= */ null, walletAddressBase16, zilswapDexSmartContractStateData, /* zilswapDexSmartContractStateData24hAgo= */ null);

            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), "Loading...");
            }
            zilswapLpFeeRewardStatus = new ZilswapLpFeeRewardStatus.ZilswapLpFeeRewardStatus(Constants.zrcTokenPropertiesListMap, zilswapDexStatus, zilswapTradeVolumeStatus);
        });

        it('Data computed and binded', function () {

            assert.deepStrictEqual(zilswapLpFeeRewardStatus.coinToFeeRewardMap_, expectedEarnedFeeMap);

            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                if (ticker in expectedEarnedFeeStringMap) {
                    assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), expectedEarnedFeeStringMap[ticker]);
                } else {
                    assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), "0");
                }
            }
        });

        it('Reset, data and view cleared', function () {
            // Reset
            zilswapLpFeeRewardStatus.reset();

            // Assert Empty
            assert.deepStrictEqual(zilswapLpFeeRewardStatus.coinToFeeRewardMap_, {});
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), 'Loading...');
            }
        });

        it('Reset, onZilswapDexStatusChange, data computed and binded', function () {
            // Reset
            zilswapLpFeeRewardStatus.reset();

            // OnChange
            zilswapLpFeeRewardStatus.onZilswapDexStatusChange();

            // Assert
            assert.deepStrictEqual(zilswapLpFeeRewardStatus.coinToFeeRewardMap_, expectedEarnedFeeMap);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                if (ticker in expectedEarnedFeeStringMap) {
                    assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), expectedEarnedFeeStringMap[ticker]);
                } else {
                    assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), "0");
                }
            }
        });

        it('Reset, onZilswapTradeVolumeStatusChange, data computed and binded', function () {
            // Reset
            zilswapLpFeeRewardStatus.reset();

            // OnChange
            zilswapLpFeeRewardStatus.onZilswapTradeVolumeStatusChange();

            // Assert
            assert.deepStrictEqual(zilswapLpFeeRewardStatus.coinToFeeRewardMap_, expectedEarnedFeeMap);
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                if (ticker in expectedEarnedFeeStringMap) {
                    assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), expectedEarnedFeeStringMap[ticker]);
                } else {
                    assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), "0");
                }
            }
        });
    });

    describe('bindViewPublic', function () {
        var zilswapLpFeeRewardStatus;

        beforeEach(function () {
            zilswapLpFeeRewardStatus = new ZilswapLpFeeRewardStatus.ZilswapLpFeeRewardStatus(Constants.zrcTokenPropertiesListMap, /* zilswapDexStatus= */ null, /* zilswapTradeVolumeStatus= */ null);
        });

        describe('#bindViewLpFeeReward()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), 'Loading...');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapLpFeeRewardStatus.bindViewLpFeeReward('1234.4', ticker);

                    // Assert
                    assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), '1234.4');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapLpFeeRewardStatus.bindViewLpFeeReward('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#zilswap_' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(), 'asdf');
                }
            });
        });
    });
});
