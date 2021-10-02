var indexJsdom = require('../../index.jsdom.js');
var $ = indexJsdom.$;

var BindView = require('../../../clientjs/index//bind_view.js');
var ZilpayUtils = require('../../../clientjs/index/zilpay_utils.js');
var assert = require('assert');

describe('BindView1', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
        indexJsdom.assertDefaultStateMainContent();
    });

    afterEach(function () {
        BindView.resetMainContainerContent();
        indexJsdom.assertDefaultStateMainContent();
    });

    describe('#bindViewLoggedInButton()', function () {

        beforeEach(function () {
            assert.strictEqual($('#wallet_address').text(), '');
            assert.strictEqual($('#wallet_address').css('display'), 'none');
            assert.strictEqual($('#wallet_refresh').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_connect').css('display'), 'inline-block');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewLoggedInButton('abcd');

            // Assert
            assert.strictEqual($('#wallet_address').text(), 'abcd');
            assert.strictEqual($('#wallet_address').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_refresh').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_connect').css('display'), 'none');
        });

        it('bind view empty string', function () {
            // Act
            BindView.bindViewLoggedInButton('');

            // Assert
            assert.strictEqual($('#wallet_address').text(), '');
            assert.strictEqual($('#wallet_address').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_refresh').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_connect').css('display'), 'none');
        });

        it('bind view null', function () {
            // Act
            BindView.bindViewLoggedInButton(null);

            // Assert
            assert.strictEqual($('#wallet_address').text(), '');
            assert.strictEqual($('#wallet_address').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_refresh').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_connect').css('display'), 'none');
        });
    });


    describe('full wallet address', function () {
        let walletFullAddress = 'abc123456xyz';
        let walletCensoredAddress = 'abc...xyz';

        beforeEach(function () {
            assert.strictEqual($('#wallet_full_address').text(), '');
            assert.strictEqual($('#wallet_censored_address').text(), '');
            assert.strictEqual($('#wallet_full_address').css('display'), 'none');
            assert.strictEqual($('#wallet_censored_address').css('display'), 'none');
        });

        it('#bindViewFullWalletAddress()', function () {
            // Act
            BindView.bindViewFullWalletAddress(walletFullAddress, walletCensoredAddress);

            // Assert
            assert.strictEqual($('#wallet_full_address').text(), walletFullAddress);
            assert.strictEqual($('#wallet_censored_address').text(), walletCensoredAddress);
            assert.strictEqual($('#wallet_full_address').css('display'), 'none');
            assert.strictEqual($('#wallet_censored_address').css('display'), '');
            assert.strictEqual($('#wallet_censor_icon').hasClass('fa-eye'), true);
            assert.strictEqual($('#wallet_censor_icon').hasClass('fa-eye-slash'), false);
            assert.strictEqual($('#wallet_viewblock_anchor').attr('href'), "https://viewblock.io/zilliqa/address/" + walletFullAddress);
        });

        it('#showFullWalletAddress()', function () {
            // Act
            BindView.showFullWalletAddress();

            // Assert
            assert.strictEqual($('#wallet_full_address').css('display'), '');
            assert.strictEqual($('#wallet_censored_address').css('display'), 'none');
            assert.strictEqual($('#wallet_censor_icon').hasClass('fa-eye'), false);
            assert.strictEqual($('#wallet_censor_icon').hasClass('fa-eye-slash'), true);
        });

        it('#hideFullWalletAddress()', function () {
            // Act
            BindView.hideFullWalletAddress();

            // Assert
            assert.strictEqual($('#wallet_full_address').css('display'), 'none');
            assert.strictEqual($('#wallet_censored_address').css('display'), '');
            assert.strictEqual($('#wallet_censor_icon').hasClass('fa-eye'), true);
            assert.strictEqual($('#wallet_censor_icon').hasClass('fa-eye-slash'), false);
        });
    });

    describe('#bindViewMainContainer()', function () {

        beforeEach(function () {
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
        });

        it('bindView ZilpayStatus.connected', function () {
            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.connected);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'block');
            assert.strictEqual($('#error_message_container').css('display'), 'none');
        });

        it('bindView ZilpayStatus.not_installed', function () {
            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.not_installed);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
            assert.strictEqual($('#error_message').html(), 'ZilPay not installed! <a href="https://zilpay.io">Download here</a>');
        });

        it('bindView ZilpayStatus.locked', function () {
            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.locked);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
            assert.strictEqual($('#error_message').html(), 'Please connect to ZilPay! (top right button)');
        });

        it('bindView ZilpayStatus.not_connected', function () {
            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.not_connected);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
            assert.strictEqual($('#error_message').html(), 'Please connect to ZilPay! (top right button)');
        });

        it('bindView ZilpayStatus.not_mainnet', function () {
            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.not_mainnet);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
            assert.strictEqual($('#error_message').html(), 'Please switch to mainnet!');
        });

        it('bindView ZilpayStatus illegal enum', function () {
            // Act
            BindView.bindViewMainContainer(6);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
            assert.strictEqual($('#error_message').html(), 'Unknown Error! Please contact zilWatch team on <a href="https://t.me/zilWatch_community">Telegram</a>!');
        });
    });
});