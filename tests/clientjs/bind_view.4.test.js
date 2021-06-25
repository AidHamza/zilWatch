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