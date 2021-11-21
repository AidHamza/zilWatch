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
            assert.strictEqual($('#topbar_wallet_address').text(), '');
            assert.strictEqual($('#topbar_wallet_address_container').css('display'), 'none');
            assert.strictEqual($('#wallet_refresh').css('display'), 'inline-block');
            assert.strictEqual($('#topbar_wallet_connect_button').css('display'), 'inline-block');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewLoggedInButton('abcd');

            // Assert
            assert.strictEqual($('#topbar_wallet_address').text(), 'abcd');
            assert.strictEqual($('#topbar_wallet_address_container').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_refresh').css('display'), 'inline-block');
            assert.strictEqual($('#topbar_wallet_connect_button').css('display'), 'none');
        });

        it('bind view empty string', function () {
            // Act
            BindView.bindViewLoggedInButton('');

            // Assert
            assert.strictEqual($('#topbar_wallet_address').text(), '');
            assert.strictEqual($('#topbar_wallet_address_container').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_refresh').css('display'), 'inline-block');
            assert.strictEqual($('#topbar_wallet_connect_button').css('display'), 'none');
        });

        it('bind view null', function () {
            // Act
            BindView.bindViewLoggedInButton(null);

            // Assert
            assert.strictEqual($('#topbar_wallet_address').text(), '');
            assert.strictEqual($('#topbar_wallet_address_container').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_refresh').css('display'), 'inline-block');
            assert.strictEqual($('#topbar_wallet_connect_button').css('display'), 'none');
        });
    });


    describe('full wallet address', function () {
        let walletFullAddress = 'abc123456xyz';
        let walletCensoredAddress = 'abc...xyz';

        beforeEach(function () {
            $('.wallet-full-address').each(function() {
                assert.strictEqual($(this).text(), '');
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.wallet-censored-address').each(function() {
                assert.strictEqual($(this).text(), '');
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('#bindViewFullWalletAddress()', function () {
            // Act
            BindView.bindViewFullWalletAddress(walletFullAddress, walletCensoredAddress);

            // Assert
            $('.wallet-full-address').each(function() {
                assert.strictEqual($(this).text(), walletFullAddress);
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.wallet-censored-address').each(function() {
                assert.strictEqual($(this).text(), walletCensoredAddress);
                assert.strictEqual($(this).css('display'), '');
            });
            $('.wallet-censor-icon').each(function() {
                assert.strictEqual($(this).hasClass('fa-eye'), true);
                assert.strictEqual($(this).hasClass('fa-eye-slash'), false);
            });
            $('.wallet_viewblock_anchor').each(function() {
                assert.strictEqual($(this).attr('href'), "https://viewblock.io/zilliqa/address/" + walletFullAddress);
            })
        });

        it('#showFullWalletAddress()', function () {
            // Act
            BindView.showFullWalletAddress();

            // Assert
            $('.wallet-full-address').each(function() {
                assert.strictEqual($(this).css('display'), '');
            });
            $('.wallet-censored-address').each(function() {
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.wallet-censor-icon').each(function() {
                assert.strictEqual($(this).hasClass('fa-eye'), false);
                assert.strictEqual($(this).hasClass('fa-eye-slash'), true);
            });
        });

        it('#hideFullWalletAddress()', function () {
            // Act
            BindView.hideFullWalletAddress();

            // Assert
            $('.wallet-full-address').each(function() {
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.wallet-censored-address').each(function() {
                assert.strictEqual($(this).css('display'), '');
            });
            $('.wallet-censor-icon').each(function() {
                assert.strictEqual($(this).hasClass('fa-eye'), true);
                assert.strictEqual($(this).hasClass('fa-eye-slash'), false);
            });
        });
    });

    describe('#bindViewMainContainer()', function () {

        beforeEach(function () {
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#wallet_nft_content_container').css('display'), 'none');

            $('.error_message_container').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
            $('.error_wallet_connect_button').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.error_download_zilpay_button').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('bindView ZilpayStatus.connected', function () {
            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.connected);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'block');
            assert.strictEqual($('#wallet_nft_content_container').css('display'), 'block');
            $('.error_message_container').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.error_wallet_connect_button').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.error_download_zilpay_button').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('bindView ZilpayStatus.not_installed', function () {
            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.not_installed);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#wallet_nft_content_container').css('display'), 'none');
            $('.error_message_container').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
            $('.error_message').each(function () {
                assert.strictEqual($(this).html(), 'ZilPay wallet not installed!');
            });
            $('.error_wallet_connect_button').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.error_download_zilpay_button').each(function () {
                assert.strictEqual($(this).css('display'), '');
            });
        });

        it('bindView ZilpayStatus.locked', function () {
            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.locked);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#wallet_nft_content_container').css('display'), 'none');

            $('.error_message_container').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
            $('.error_message').each(function () {
                assert.strictEqual($(this).html(), 'ZilPay wallet not connected!');
            });
            $('.error_wallet_connect_button').each(function () {
                assert.strictEqual($(this).css('display'), 'inline-block');
            });
            $('.error_download_zilpay_button').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('bindView ZilpayStatus.not_connected', function () {
            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.not_connected);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#wallet_nft_content_container').css('display'), 'none');
            $('.error_message_container').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
            $('.error_message').each(function () {
                assert.strictEqual($(this).html(), 'ZilPay wallet not connected!');
            });
            $('.error_wallet_connect_button').each(function () {
                assert.strictEqual($(this).css('display'), 'inline-block');
            });
            $('.error_download_zilpay_button').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('bindView ZilpayStatus.not_mainnet', function () {
            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.not_mainnet);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#wallet_nft_content_container').css('display'), 'none');

            $('.error_message_container').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
            $('.error_message').each(function () {
                assert.strictEqual($(this).html(), 'Please switch to mainnet!');
            });
        });

        it('bindView ZilpayStatus illegal enum', function () {
            // Act
            BindView.bindViewMainContainer(6);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#wallet_nft_content_container').css('display'), 'none');

            $('.error_message_container').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
            $('.error_message').each(function () {
                assert.strictEqual($(this).html(), 'Unknown Error! Please contact zilWatch team on <a href="https://t.me/zilWatch_community">Telegram</a>!');
            });
        });
    });
});