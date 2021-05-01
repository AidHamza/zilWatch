var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var Constants = require('../../constants.js');
var ControllerLpReward = require('../../clientjs/controller_lp_reward.js');
var assert = require('assert');
var sinon = require('sinon');

describe('ControllerLpReward', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);

        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
            assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
        }
        assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
        assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
    });

    describe('#onLpRewardNextEpochLoaded()', function () {

        it('LP reward loaded happy case', function () {
            // Arrange
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
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), '0.06802');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
        });

        it('LP reward loaded amount too small, no show', function () {
            // Arrange
            let contractAddressToRewardMap = {
                "zil1p5suryq6q647usxczale29cu3336hhp376c627": "286",
                "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "187",
                "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "1287",
                "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4": "124"
            };
          
            // Act
            ControllerLpReward.onLpRewardNextEpochLoaded(contractAddressToRewardMap);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
        });

        it('LP reward data not a number, no show', function () {
            // Arrange
            let contractAddressToRewardMap = {
                "zil1p5suryq6q647usxczale29cu3336hhp376c627": "asdf",
                "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "asdf",
                "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "fds",
            };

            // Act
            ControllerLpReward.onLpRewardNextEpochLoaded(contractAddressToRewardMap);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
        });

        it('LP reward data not a map', function () {
            // Arrange
            let contractAddressToRewardMap = "asdffds";

            // Act
            ControllerLpReward.onLpRewardNextEpochLoaded(contractAddressToRewardMap);

            // Assert
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
        });
    });

    describe('#onLpCurrentEpochInfoLoaded()', function () {

        beforeEach(function () {
            // 2021 May 01, 2.34pm
            clock = sinon.useFakeTimers(new Date(2021, 04, 1, 2, 34).getTime());

            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
        });

        it('LP epoch info loaded happy case', function () {
            // Arrange
            let epochInfoData = {
                "epoch_period": 604800,
                "tokens_per_epoch": 6250,
                "first_epoch_start": 1612339200,
                "next_epoch_start": 1620201600,
                "total_epoch": 153,
                "current_epoch": 14
            };

            // Act
            ControllerLpReward.onLpCurrentEpochInfoLoaded(epochInfoData);

            // Assert
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '4d 13h 26m');
        });

        it('LP epoch info not number', function () {
            // Arrange
            let epochInfoData = {
                "epoch_period": 604800,
                "tokens_per_epoch": 6250,
                "first_epoch_start": 1612339200,
                "next_epoch_start": "asdfasdf",
                "total_epoch": 153,
                "current_epoch": 14
            };

            // Act
            ControllerLpReward.onLpCurrentEpochInfoLoaded(epochInfoData);

            // Assert
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
        });


        it('LP epoch info invalid data', function () {
            // Arrange
            let epochInfoData = "asdf";

            // Act
            ControllerLpReward.onLpCurrentEpochInfoLoaded(epochInfoData);

            // Assert
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
        });

        afterEach(function () {
            clock.restore();
        });
    });
});