var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var BindView = require('../../clientjs/bind_view.js');
var assert = require('assert');

describe('BindView4', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
        indexJsdom.assertDefaultStateMainContent();
    });

    afterEach(function () {
        BindView.resetMainContainerContent();
        indexJsdom.assertDefaultStateMainContent();
    });


    describe('#bindViewTotalRewardAllLpZwap()', function () {

        beforeEach(function () {
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
            assert.strictEqual($('#lp_container').css('display'), 'none');
        });

        it('bind view legit balance', function () {
            // Act
            BindView.bindViewTotalRewardAllLpZwap('1234.4');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), '1234.4');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
            assert.strictEqual($('#lp_container').css('display'), 'block');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalRewardAllLpZwap('asdf');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'asdf');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
            assert.strictEqual($('#lp_container').css('display'), 'block');
        });
    });

    describe('#bindViewTotalRewardAllLpFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalRewardAllLpFiat('1234.52');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalRewardAllLpFiat('asdf');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewPrevTotalRewardAllLpZwap()', function () {

        beforeEach(function () {
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), '');
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'Loading...');
        });

        it('bind view legit balance', function () {
            // Act
            BindView.bindViewPrevTotalRewardAllLpZwap('15', '1234.4');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), '15');
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), '1234.4');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewPrevTotalRewardAllLpZwap('ss', 'asdf');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), 'ss');
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'asdf');
        });
    });

    describe('#bindViewPrevTotalRewardAllLpFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewPrevTotalRewardAllLpFiat('1234.52');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewPrevTotalRewardAllLpFiat('asdf');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'asdf');
        });
    });

    describe('#enable|disableTooltipPastTotalRewardAllLpZwap()', function () {

        beforeEach(function () {
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
        });

        it('default disable, mouseover or touchstart, nothing happens', function () {
            // Act
            $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

            // Act
            $('#total_all_lp_reward_past_epoch_container').trigger('touchstart');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
        });

        it('default disable, disable, mouseover or touchstart, nothing happens', function () {
            // Act
            BindView.disableTooltipPastTotalRewardAllLpZwap();

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

            // Act
            $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

            // Act
            $('#total_all_lp_reward_past_epoch_container').trigger('touchstart');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
        });

        it('default disable, enable, mouseover, activated', function () {
            // Act
            BindView.enableTooltipPastTotalRewardAllLpZwap();

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

            // Act
            $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'table-row-group');
        });

        it('default disable, enable, touchstart, activated', function () {
            // Act
            BindView.enableTooltipPastTotalRewardAllLpZwap();

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

            // Act
            $('#total_all_lp_reward_past_epoch_container').trigger('touchstart');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'table-row-group');
        });

        it('default disable, then enable, then disable, mouseover or touchstart, nothing happens', function () {
            // Act
            BindView.enableTooltipPastTotalRewardAllLpZwap();
            BindView.disableTooltipPastTotalRewardAllLpZwap();

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

            // Act
            $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

            // Act
            $('#total_all_lp_reward_past_epoch_container').trigger('touchstart');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
        });
    });

    describe('#clear|addViewPastTotalRewardAllLpZwap()', function () {

        beforeEach(function () {
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
        });

        it('addView, 2x, view appended', function () {
            let epochNumber = '12345';
            let pastTotalRewardZwapString = 'qwertyuiop';

            let epochNumber2 = '54321';
            let pastTotalRewardZwapString2 = 'asdfghjkl';

            // Act
            BindView.addViewPastTotalRewardAllLpZwap(epochNumber, pastTotalRewardZwapString);

            // Assert
            assert.notStrictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(pastTotalRewardZwapString), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(epochNumber), true);

            // Act
            BindView.addViewPastTotalRewardAllLpZwap(epochNumber2, pastTotalRewardZwapString2);

            // Assert
            assert.notStrictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(pastTotalRewardZwapString), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(epochNumber), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(pastTotalRewardZwapString2), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(epochNumber2), true);
        });

        it('addView 2x, clearView, empty', function () {
            let epochNumber = '12345';
            let pastTotalRewardZwapString = 'qwertyuiop';

            let epochNumber2 = '54321';
            let pastTotalRewardZwapString2 = 'asdfghjkl';

            // Act
            BindView.addViewPastTotalRewardAllLpZwap(epochNumber, pastTotalRewardZwapString);
            BindView.addViewPastTotalRewardAllLpZwap(epochNumber2, pastTotalRewardZwapString2);
            BindView.clearViewPastTotalRewardAllLpZwap();

            // Assert
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
        });
    });


    describe('#bindViewPastTotalRewardAllLpFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
            assert.strictEqual($('.past_lp_reward_fiat').length, 0);
        });

        it('2 rows, bindViewPastTotalRewardAllLpFiat', function () {
            let epochNumber = '12345';
            let pastTotalRewardZwapString = '1000.5';

            let epochNumber2 = '54321';
            let pastTotalRewardZwapString2 = '9500.2';

            BindView.addViewPastTotalRewardAllLpZwap(epochNumber, pastTotalRewardZwapString);

            // Assert
            assert.notStrictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(pastTotalRewardZwapString), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(epochNumber), true);
            assert.strictEqual($('#total_all_lp_reward_epoch_' + epochNumber + '_fiat').text(), '');
            assert.strictEqual($('.past_lp_reward_fiat').length, 1);

            BindView.addViewPastTotalRewardAllLpZwap(epochNumber2, pastTotalRewardZwapString2);

            // Assert
            assert.notStrictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(pastTotalRewardZwapString), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(epochNumber), true);
            assert.strictEqual($('#total_all_lp_reward_epoch_' + epochNumber + '_fiat').text(), '');
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(pastTotalRewardZwapString2), true);
            assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html().includes(epochNumber2), true);
            assert.strictEqual($('#total_all_lp_reward_epoch_' + epochNumber2 + '_fiat').text(), '');
            assert.strictEqual($('.past_lp_reward_fiat').length, 2);

            function doubleReward(zwapReward) {
                return 2.0 * parseFloat(zwapReward);
            }
            // Act
            BindView.bindViewPastTotalRewardAllLpFiat(doubleReward);
            
            // Assert
            let expectedPastRewardFiat = doubleReward(pastTotalRewardZwapString).toString();
            assert.strictEqual($('#total_all_lp_reward_epoch_' + epochNumber + '_fiat').text(), expectedPastRewardFiat);
            let expectedPastRewardFiat2 = doubleReward(pastTotalRewardZwapString2).toString();
            assert.strictEqual($('#total_all_lp_reward_epoch_' + epochNumber2 + '_fiat').text(), expectedPastRewardFiat2);
        });
    });

    describe('#bindViewLpNextEpochCounter()', function () {

        beforeEach(function () {
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewLpNextEpochCounter('4d 5h 12m');

            // Assert
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '4d 5h 12m');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewLpNextEpochCounter('asdf');

            // Assert
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), 'asdf');
        });
    });


    describe('#bindViewPercentChangeColorContainer()', function () {

        beforeEach(function () {
            // Any container ID will do
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('text-secondary'), true);
        });

        it('negative', function () {
            BindView.bindViewPercentChangeColorContainer('#net_worth_fiat_percent_change_24h_container',"-43.453");
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('negative-red'), true);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('positive-green'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('text-secondary'), false);
        });
    
        it('positive', function () {
            BindView.bindViewPercentChangeColorContainer('#net_worth_fiat_percent_change_24h_container',"436.453");
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('negative-red'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('positive-green'), true);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('text-secondary'), false);
        });
    
        it('double negative', function () {
            BindView.bindViewPercentChangeColorContainer('#net_worth_fiat_percent_change_24h_container',"--436.453");
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('negative-red'), true);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('positive-green'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('text-secondary'), false);
        });
    
        it('zero, return false', function () {
            BindView.bindViewPercentChangeColorContainer('#net_worth_fiat_percent_change_24h_container',"0");
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('negative-red'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('positive-green'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('text-secondary'), true);
        });

        it('floating zero, return false', function () {
            BindView.bindViewPercentChangeColorContainer('#net_worth_fiat_percent_change_24h_container',"0.000");
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('negative-red'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('positive-green'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('text-secondary'), true);
        });
    
        it('not a string, return null', function () {
            BindView.bindViewPercentChangeColorContainer('#net_worth_fiat_percent_change_24h_container', 1234);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('negative-red'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('positive-green'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('text-secondary'), true);
        });
    
        it('empty string, return null', function () {
            BindView.bindViewPercentChangeColorContainer('#net_worth_fiat_percent_change_24h_container', '');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('negative-red'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('positive-green'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('text-secondary'), true);
        });
    });
});