var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var Constants = require('../../constants.js');
var ControllerLpReward = require('../../clientjs/controller_lp_reward.js');
var fs = require('fs')
var assert = require('assert');
var sinon = require('sinon');

describe('ControllerLpReward', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#onLpRewardNextEpochLoaded()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
        });

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
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), 'No reward');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
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
                let currAddress = Constants.zrcTokenPropertiesListMap[ticker].address;
                if (!contractAddressToRewardMap[currAddress]) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), 'No reward');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
                } else {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
                }
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
                let currAddress = Constants.zrcTokenPropertiesListMap[ticker].address;
                if (!contractAddressToRewardMap[currAddress]) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), 'No reward');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
                } else {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
                }
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
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), 'No reward');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
            }
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
        });
    });

    describe('#onLpRewardPastEpochLoaded()', function () {

        beforeEach(function () {
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'Loading...');
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'Loading...');
        });

        it('Past LP reward loaded happy case', function () {
            // Arrange
            let dataString = fs.readFileSync('./tests/clientjs/stats_zilswap_distribution_data_20210516.txt', 'utf8')
            let dataObject = JSON.parse(dataString);

            // Act
            ControllerLpReward.onLpRewardPastEpochLoaded(dataObject);
            $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), '0.09727');
            assert.strictEqual($('#total_all_lp_reward_epoch_14_zwap').text(), '0.06738');
            assert.strictEqual($('#total_all_lp_reward_epoch_13_zwap').text(), '0.06741');
            assert.strictEqual($('#total_all_lp_reward_epoch_12_zwap').text(), '0.04986');
            assert.strictEqual($('#total_all_lp_reward_epoch_11_zwap').text(), '0.007002');
            assert.strictEqual($('#total_all_lp_reward_epoch_10_zwap').length, 0);
            assert.strictEqual($('.past_lp_reward_fiat').length, 4);

            // Assert tooltip shown and displayed
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'table-row-group');
        });

        it('No Past LP reward, show 0', function () {
            // Arrange
            let dataString = "[]";
            let dataObject = JSON.parse(dataString);

            // Act
            ControllerLpReward.onLpRewardPastEpochLoaded(dataObject);

            // Assert
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), '-');
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), '0');
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), '0');
        });

        it('Null Past LP reward, show 0', function () {
            // Arrange
            let dataObject = null;

            // Act
            ControllerLpReward.onLpRewardPastEpochLoaded(dataObject);

            // Assert
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), '-');
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), '0');
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), '0');
        });
    });

    describe('#getViewPastTotalRewardAllLpZwap()', function () {

        it('happy case', function () {
           
            let epochNumber = '12345';
            let pastTotalRewardZwapString = 'qwertyuiop';

            let epochNumber2 = '54321';
            let pastTotalRewardZwapString2 = 'asdfghjkl';

            // Act
            let viewElementString = ControllerLpReward.getViewPastTotalRewardAllLpZwap(epochNumber, pastTotalRewardZwapString);

            // Assert
            assert.notStrictEqual(viewElementString, '');
            assert.strictEqual(viewElementString.includes(pastTotalRewardZwapString), true);
            assert.strictEqual(viewElementString.includes(epochNumber), true);

            // Act
            let viewElementString2 = ControllerLpReward.getViewPastTotalRewardAllLpZwap(epochNumber2, pastTotalRewardZwapString2);

            // Assert
            assert.notStrictEqual(viewElementString2, '');
            assert.strictEqual(viewElementString2.includes(pastTotalRewardZwapString2), true);
            assert.strictEqual(viewElementString2.includes(epochNumber2), true);
        });
    });

    describe('#onLpCurrentEpochInfoLoaded()', function () {

        beforeEach(function () {
            // 2021 May 01, 2.34pm UTC
            clock = sinon.useFakeTimers(new Date(Date.UTC(2021, 04, 1, 2, 34)).getTime());

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
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '4d 5h 26m');
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