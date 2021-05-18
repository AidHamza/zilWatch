var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var Constants = require('../../constants.js');
var TooltipTouchHover = require('../../clientjs/tooltip_touch_hover.js');
var assert = require('assert');

describe('TooltipTouchHover', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#onTouchStartOrMouseOverTooltipFunction()', function () {

        it('default, no listener', function () {
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_tooltip_content').css('display'), 'none');

            // Act
            $('#net_worth_fiat_percent_change_24h_container').trigger('mouseover');

            // Assert
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_tooltip_content').css('display'), 'none');
        });

        it('attach listener on mouseover', function () {
            // Act
            $('#net_worth_fiat_percent_change_24h_container').on('mouseover', TooltipTouchHover.onTouchStartOrMouseOverTooltipFunction);

            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_tooltip_content').css('display'), 'none');

            // Act
            $('#net_worth_fiat_percent_change_24h_container').trigger('mouseover');

            // Assert
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('hover-effect'), true);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_tooltip_content').css('display'), '');
        });

        it('attach listener on mouseover, open another tooltip, previous one closed', function () {
            // Act
            $('#net_worth_fiat_percent_change_24h_container').on('mouseover', TooltipTouchHover.onTouchStartOrMouseOverTooltipFunction);
            $('#net_worth_zil_percent_change_24h_container').on('mouseover', TooltipTouchHover.onTouchStartOrMouseOverTooltipFunction);

            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_tooltip_content').css('display'), 'none');
            assert.strictEqual($('#net_worth_zil_percent_change_24h_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#net_worth_zil_percent_change_24h_tooltip_content').css('display'), 'none');

            // Act
            $('#net_worth_fiat_percent_change_24h_container').trigger('mouseover');

            // Assert
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('hover-effect'), true);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_tooltip_content').css('display'), '');
            assert.strictEqual($('#net_worth_zil_percent_change_24h_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#net_worth_zil_percent_change_24h_tooltip_content').css('display'), 'none');
            $('.tooltip-content').each(function() {
                if ($(this).attr('id') !== 'net_worth_fiat_percent_change_24h_tooltip_content') {
                    assert.strictEqual($(this).css('display'), 'none');
                }
            })

            // Act
            $('#net_worth_zil_percent_change_24h_container').trigger('mouseover');

            // Assert
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_container').hasClass('hover-effect'), false);
            assert.strictEqual($('#net_worth_fiat_percent_change_24h_tooltip_content').css('display'), 'none');
            assert.strictEqual($('#net_worth_zil_percent_change_24h_container').hasClass('hover-effect'), true);
            assert.strictEqual($('#net_worth_zil_percent_change_24h_tooltip_content').css('display'), '');
            $('.tooltip-content').each(function() {
                if ($(this).attr('id') !== 'net_worth_zil_percent_change_24h_tooltip_content') {
                    assert.strictEqual($(this).css('display'), 'none');
                }
            })
        });
    });

});