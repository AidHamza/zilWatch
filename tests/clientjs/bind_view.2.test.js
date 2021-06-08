var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var Constants = require('../../constants.js');
var BindView = require('../../clientjs/bind_view.js');
var assert = require('assert');

describe('BindView2', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
        indexJsdom.assertDefaultStateMainContent();
    });

    afterEach(function () {
        BindView.resetMainContainerContent();
        indexJsdom.assertDefaultStateMainContent();
    });

    describe('#bindViewZwapRewardLp()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZwapRewardLp('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZwapRewardLp('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), 'asdf');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
            }
        });
    });
});
