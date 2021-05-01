var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var Constants = require('../../constants.js');
var ControllerLpReward = require('../../clientjs/controller_lp_reward.js');
var assert = require('assert');

describe('Controller', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#onLpRewardNextEpochLoaded()', function () {

        it('LP reward loaded happy case', function () {
            let contractAddressToRewardMap = {
                "zil1p5suryq6q647usxczale29cu3336hhp376c627": "12710374110",
                "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "26977710437",
                "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "12548281867",
                "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4": "15783071977"
            };
            let contractAddressToUserFriendlyRewardString = {
                "zil1p5suryq6q647usxczale29cu3336hhp376c627": "0.01271",
                "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "0.02698",
                "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "0.01255",
                "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4": "0.01578"
            };
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }

            // Act
            ControllerLpReward.onLpRewardNextEpochLoaded(contractAddressToRewardMap);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                let currAddress = Constants.zrcTokenPropertiesListMap[ticker].address;
                if (!contractAddressToRewardMap[currAddress]) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
                } else {
                    let expectedRewardString = contractAddressToUserFriendlyRewardString[currAddress];
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), expectedRewardString);
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
                }
            }
        });

        it('LP reward loaded amount too small, no show', function () {
            let contractAddressToRewardMap = {
                "zil1p5suryq6q647usxczale29cu3336hhp376c627": "286",
                "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "187",
                "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "1287",
                "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4": "124"
            };
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }

            // Act
            ControllerLpReward.onLpRewardNextEpochLoaded(contractAddressToRewardMap);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }
        });

        it('LP reward data not a number, no show', function () {
            let contractAddressToRewardMap = {
                "zil1p5suryq6q647usxczale29cu3336hhp376c627": "asdf",
                "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "asdf",
                "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "fds",
            };
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }

            // Act
            ControllerLpReward.onLpRewardNextEpochLoaded(contractAddressToRewardMap);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }
        });

        it('LP reward data not a map', function () {
            let contractAddressToRewardMap = "asdffds";
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }

            // Act
            ControllerLpReward.onLpRewardNextEpochLoaded(contractAddressToRewardMap);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }
        });
    });
});