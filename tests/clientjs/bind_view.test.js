var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var Constants = require('../../constants.js');
var BindView = require('../../clientjs/bind_view.js');
var ZilpayUtils = require('../../clientjs/zilpay_utils.js');
var assert = require('assert');

describe('BindView', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
        assertDefaultStateMainContent();
    });

    afterEach(function () {
        BindView.resetMainContainerContent();
        assertDefaultStateMainContent();
    });

    describe('#setTheme()', function () {

        beforeEach(function () {
            assert.strictEqual($('html').hasClass('dark-mode'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), false);
        });

        it('default dark, set light', function () {
            // Act
            BindView.setThemeLightMode();

            // Assert
            assert.strictEqual($('html').hasClass('dark-mode'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), true);
            $("img").each(function () {
                let imgSrc = this.src;
                if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
                    assert.strictEqual(imgSrc.indexOf("?t=dark"), -1);
                } else if (imgSrc.toLowerCase().indexOf("cdn.viewblock.io") !== -1) {
                    assert.notStrictEqual(imgSrc.indexOf("viewblock-light.png"), -1);
                    assert.strictEqual(imgSrc.indexOf("viewblock-dark.png"), -1);
                }
            });
        });

        it('default dark, set light 2x', function () {
            // Act
            BindView.setThemeLightMode();
            BindView.setThemeLightMode();

            // Assert
            assert.strictEqual($('html').hasClass('dark-mode'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), true);
            $("img").each(function () {
                let imgSrc = this.src;
                if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
                    assert.strictEqual(imgSrc.indexOf("?t=dark"), -1);
                } else if (imgSrc.toLowerCase().indexOf("cdn.viewblock.io") !== -1) {
                    assert.notStrictEqual(imgSrc.indexOf("viewblock-light.png"), -1);
                    assert.strictEqual(imgSrc.indexOf("viewblock-dark.png"), -1);
                }
            });
        });

        it('default dark, set dark', function () {
            // Act
            BindView.setThemeDarkMode();

            // Assert
            assert.strictEqual($('html').hasClass('dark-mode'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), false);
            $("img").each(function () {
                let imgSrc = this.src;
                if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
                    assert.notStrictEqual(imgSrc.indexOf("?t=dark"), -1);
                } else if (imgSrc.toLowerCase().indexOf("cdn.viewblock.io") !== -1) {
                    assert.strictEqual(imgSrc.indexOf("viewblock-light.png"), -1);
                    assert.notStrictEqual(imgSrc.indexOf("viewblock-dark.png"), -1);
                }
            });
        });

        it('default dark, set light, set dark', function () {
            // Act
            BindView.setThemeLightMode();

            // Assert
            assert.strictEqual($('html').hasClass('dark-mode'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), true);
            $("img").each(function () {
                let imgSrc = this.src;
                if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
                    assert.strictEqual(imgSrc.indexOf("?t=dark"), -1);
                } else if (imgSrc.toLowerCase().indexOf("cdn.viewblock.io") !== -1) {
                    assert.notStrictEqual(imgSrc.indexOf("viewblock-light.png"), -1);
                    assert.strictEqual(imgSrc.indexOf("viewblock-dark.png"), -1);
                }
            });

            // Act
            BindView.setThemeDarkMode();

            // Assert
            assert.strictEqual($('html').hasClass('dark-mode'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), false);
            $("img").each(function () {
                let imgSrc = this.src;
                if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
                    assert.notStrictEqual(imgSrc.indexOf("?t=dark"), -1);
                } else if (imgSrc.toLowerCase().indexOf("cdn.viewblock.io") !== -1) {
                    assert.strictEqual(imgSrc.indexOf("viewblock-light.png"), -1);
                    assert.notStrictEqual(imgSrc.indexOf("viewblock-dark.png"), -1);
                }
            });
        });
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

    describe('#bindViewCoinPriceInFiat()', function () {

        it('bind view price in fiat', function () {
            for (let coinTicker in Constants.coinMap) {
                // Act
                BindView.bindViewCoinPriceInFiat('Rp', '0.123', coinTicker);

                // Assert
                $('.' + coinTicker + '_price_fiat').each(function () {
                    assert.strictEqual($(this).text(), '0.123');
                });
                $(".currency_symbol").each(function () {
                    assert.strictEqual($(this).text(), 'Rp');
                });
            }
        });

        it('bind view random string', function () {
            for (let coinTicker in Constants.coinMap) {
                // Act
                BindView.bindViewCoinPriceInFiat('qwer', 'asdf', coinTicker);

                // Assert
                $('.' + coinTicker + '_price_fiat').each(function () {
                    assert.strictEqual($(this).text(), 'asdf');
                });
                $(".currency_symbol").each(function () {
                    assert.strictEqual($(this).text(), 'qwer');
                });
            }
        });
    });


    describe('#bindViewCoinPriceInZil()', function () {

        it('bind view price in fiat', function () {
            for (let coinTicker in Constants.coinMap) {
                // Act
                BindView.bindViewCoinPriceInZil('0.123', coinTicker);

                // Assert
                $('.' + coinTicker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), '0.123');
                });
            }
        });

        it('bind view random string', function () {
            for (let coinTicker in Constants.coinMap) {
                // Act
                BindView.bindViewCoinPriceInZil('asdf', coinTicker);

                // Assert
                $('.' + coinTicker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), 'asdf');
                });
            }
        });
    });

    describe('#bindViewZilBalance()', function () {

        beforeEach(function () {
            assert.strictEqual($('#zil_balance').text(), 'Loading...');
        });

        it('bind view legit balance', function () {
            // Act
            BindView.bindViewZilBalance('1234.4');

            // Assert
            assert.strictEqual($('#zil_balance').text(), '1234.4');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewZilBalance('asdf');

            // Assert
            assert.strictEqual($('#zil_balance').text(), 'asdf');
        });
    });

    describe('#bindViewZrcTokenPriceInZil24hAgo()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('.' + ticker + '_price_zil_24h_ago').text(), '');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInZil24hAgo('1234.4', ticker);

                // Assert
                assert.strictEqual($('.' + ticker + '_price_zil_24h_ago').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInZil24hAgo('asdf', ticker);

                // Assert
                assert.strictEqual($('.' + ticker + '_price_zil_24h_ago').text(), 'asdf');
            }
        });
    });

    describe('#bindViewZrcTokenPriceInZil()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), 'Loading...');
                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), 'Loading...');
                });
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInZil('12345.5', '1234.4', ticker);

                // Assert
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), '12345.5');
                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), '1234.4');
                });
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInZil('qwer', 'asdf', ticker);

                // Assert
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), 'qwer');
                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), 'asdf');
                });
            }
        });
    });

    describe('#bindViewZrcTokenPriceInFiat()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInFiat('1234.4', ticker);

                // Assert
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInFiat('asdf', ticker);

                // Assert
                assert.strictEqual($('#public_' + ticker + '_price_fiat').text(), 'asdf');
            }
        });
    });

    describe('#bindViewZrcTokenWalletBalance()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenWalletBalance('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_container').css('display'), 'block');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenWalletBalance('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance').text(), 'asdf');
                assert.strictEqual($('#' + ticker + '_container').css('display'), 'block');
            }
        });
    });


    describe('#bindViewZrcTokenLpTotalPoolBalance()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_total_pool_zil').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_lp_total_pool_zrc').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpTotalPoolBalance( /* zilBalance= */ '1234.4', /* zrcBalance = */ '54.43', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_total_pool_zil').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_lp_total_pool_zrc').text(), '54.43');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpTotalPoolBalance( /* zilBalance= */ 'hjkl', /* zrcBalance = */ 'qwer', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_total_pool_zil').text(), 'hjkl');
                assert.strictEqual($('#' + ticker + '_lp_total_pool_zrc').text(), 'qwer');
            }
        });
    });

    describe('#bindViewZrcTokenLpBalance24hAgo()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_24h').text(), '');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpBalance24hAgo( /* poolSharePercent= */ '0.0012', /* zilBalance= */ '1234.4', /* zrcBalance = */ '54.43', /* balanceZil= */ '2468.8', /* percentChange= */ '5.8', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), '0.0012');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), '54.43');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), '2468.8');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_24h').text(), '5.8');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpBalance24hAgo( /* poolSharePercent= */ 'asdf', /* zilBalance= */ 'hjkl', /* zrcBalance = */ 'qwer', /* balanceZil= */ 'ert', /* percentChange= */ 'abcd', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), 'asdf');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), 'hjkl');
                assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), 'qwer');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), 'ert');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil_percent_change_24h').text(), 'abcd');
            }
        });
    });

    describe('#bindViewZrcTokenLpBalance()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
            }
            assert.strictEqual($('#lp_container').css('display'), 'none');
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpBalance( /* poolSharePercent= */ '0.0012', /* zilBalance= */ '1234.4', /* zrcBalance = */ '54.43', /* balanceZil= */ '2468.8', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), '0.0012');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '54.43');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), '2468.8');
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
                assert.strictEqual($('#lp_container').css('display'), 'block');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpBalance( /* poolSharePercent= */ 'asdf', /* zilBalance= */ 'hjkl', /* zrcBalance = */ 'qwer', /* balanceZil= */ 'ert', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'asdf');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), 'hjkl');
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), 'qwer');
                assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), 'ert');
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
                assert.strictEqual($('#lp_container').css('display'), 'block');
            }
        });
    });

    describe('#bindViewCarbonStakingBalance()', function () {

        beforeEach(function () {
            assert.strictEqual($('#carbon_staking_balance').text(), 'Loading...');
            assert.strictEqual($('#carbon_staking_container').css('display'), 'none');
            assert.strictEqual($('#staking_container').css('display'), 'none');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewCarbonStakingBalance('1234.4');

            // Assert
            assert.strictEqual($($('#carbon_staking_balance')).text(), '1234.4');
            assert.strictEqual($('#carbon_staking_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewCarbonStakingBalance('asdf');

            // Assert
            assert.strictEqual($($('#carbon_staking_balance')).text(), 'asdf');
            assert.strictEqual($('#carbon_staking_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');
        });
    });


    describe('#bindViewZilStakingBalance()', function () {

        beforeEach(function () {
            for (let ssnAddress in Constants.ssnListMap) {
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), 'Loading...');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');
            }
            assert.strictEqual($('#staking_container').css('display'), 'none');
        });

        it('bind view happy case', function () {
            for (let ssnAddress in Constants.ssnListMap) {
                // Act
                BindView.bindViewZilStakingBalance('1234.4', ssnAddress);

                // Assert

                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), '1234.4');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'block');
                assert.strictEqual($('#staking_container').css('display'), 'block');
            }
        });

        it('bind view random string', function () {
            for (let ssnAddress in Constants.ssnListMap) {
                // Act
                BindView.bindViewZilStakingBalance('asdf', ssnAddress);

                // Assert
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), 'asdf');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'block');
                assert.strictEqual($('#staking_container').css('display'), 'block');
            }
        });
    });


    describe('#bindViewZilStakingWithdrawalPendingBalance()', function () {

        beforeEach(function () {
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(), 'Loading...');
            assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'none');
            assert.strictEqual($('#staking_container').css('display'), 'none');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewZilStakingWithdrawalPendingBalance('1234.4');

            // Assert
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(), '1234.4');
            assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewZilStakingWithdrawalPendingBalance('asdf');

            // Assert
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(), 'asdf');
            assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'block');
            assert.strictEqual($('#staking_container').css('display'), 'block');
        });
    });

    describe('#bindViewTotalTradeVolumeZil()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_total_volume_zil').text(), '0');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewTotalTradeVolumeZil('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_total_volume_zil').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewTotalTradeVolumeZil('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_total_volume_zil').text(), 'asdf');
            }
        });
    });

    describe('#bindViewTotalTradeVolumeFiat()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_total_volume_fiat').text(), '0');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewTotalTradeVolumeFiat('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_total_volume_fiat').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewTotalTradeVolumeFiat('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_total_volume_fiat').text(), 'asdf');
            }
        });
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

    describe('#bindViewPrevTotalRewardAllLpZwap()', function () {

        beforeEach(function () {
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'Loading...');
        });

        it('bind view legit balance', function () {
            // Act
            BindView.bindViewPrevTotalRewardAllLpZwap('1234.4');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), '1234.4');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewPrevTotalRewardAllLpZwap('asdf');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'asdf');
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

    describe('#bindViewZilBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#zil_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewZilBalanceFiat24hAgo('1234.52', '143');

            // Assert
            assert.strictEqual($('#zil_balance_fiat_24h_ago').text(), '1234.52');
            assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), '143');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewZilBalanceFiat24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#zil_balance_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewZilBalanceFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#zil_balance_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewZilBalanceFiat('1234.52');

            // Assert
            assert.strictEqual($('#zil_balance_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewZilBalanceFiat('asdf');

            // Assert
            assert.strictEqual($('#zil_balance_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewZrcTokenWalletBalanceZil24hAgo()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), '');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenWalletBalanceZil24hAgo('1234.4', '12.2', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), '12.2');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenWalletBalanceZil24hAgo('asdf', 'qwer', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), 'asdf');
                assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), 'qwer');
            }
        });
    });

    describe('#bindViewZrcTokenWalletBalanceZil()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenWalletBalanceZil('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenWalletBalanceZil('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'asdf');
            }
        });
    });

    describe('#bindViewZrcTokenWalletBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), '');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenWalletBalanceFiat24hAgo('1234.4', '12.5', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), '12.5');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenWalletBalanceFiat24hAgo('asdf', 'qwer', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), 'asdf');
                assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), 'qwer');
            }
        });
    });

    describe('#bindViewZrcTokenWalletBalanceFiat()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance_fiat').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenWalletBalanceFiat('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_fiat').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenWalletBalanceFiat('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_fiat').text(), 'asdf');
            }
        });
    });

    describe('#bindViewTotalWalletBalanceZil24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalWalletBalanceZil24hAgo('1234.52', '42.2');

            // Assert
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '1234.52');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '42.2');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalWalletBalanceZil24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), 'asdf');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalWalletBalanceZil()', function () {

        beforeEach(function () {
            assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalWalletBalanceZil('1234.52');

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalWalletBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), 'asdf');
        });
    });


    describe('#bindViewTotalWalletBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '');
        });


        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalWalletBalanceFiat24hAgo('1234.52', '1.2');

            // Assert
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '1234.52');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '1.2');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalWalletBalanceFiat24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalWalletBalanceFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#wallet_balance_fiat').text(), 'Loading...');
        });


        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalWalletBalanceFiat('1234.52');

            // Assert
            assert.strictEqual($('#wallet_balance_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalWalletBalanceFiat('asdf');

            // Assert
            assert.strictEqual($('#wallet_balance_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewZrcTokenLpTotalPoolBalanceFiat()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpTotalPoolBalanceFiat('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpTotalPoolBalanceFiat('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_total_pool_fiat').text(), 'asdf');
            }
        });
    });

    describe('#bindViewZrcTokenLpBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), '');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpBalanceFiat24hAgo('1234.4' , '2.3', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), '2.3');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpBalanceFiat24hAgo('asdf', 'fdew', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), 'asdf');
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), 'fdew');
            }
        });
    });

    describe('#bindViewZrcTokenLpBalanceFiat()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpBalanceFiat('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenLpBalanceFiat('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), 'asdf');
            }
        });
    });

    describe('#bindViewTotalLpBalanceZil24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalLpBalanceZil24hAgo('1234.52', '4.2');

            // Assert
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '1234.52');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '4.2');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalLpBalanceZil24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), 'asdf');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalLpBalanceZil()', function () {

        beforeEach(function () {
            assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalLpBalanceZil('1234.52');

            // Assert
            assert.strictEqual($('#lp_balance_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalLpBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#lp_balance_zil').text(), 'asdf');
        });
    });

    describe('#bindViewTotalLpBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalLpBalanceFiat24hAgo('1234.52', '4.2');

            // Assert
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '1234.52');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '4.2');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalLpBalanceFiat24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalLpBalanceFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#lp_balance_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalLpBalanceFiat('1234.52');

            // Assert
            assert.strictEqual($('#lp_balance_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalLpBalanceFiat('asdf');

            // Assert
            assert.strictEqual($('#lp_balance_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewZilStakingBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            for (let ssnAddress in Constants.ssnListMap) {
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_24h_ago').text(), '');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_24h').text(), '');
            }
        });

        it('bind view happy case', function () {
            for (let ssnAddress in Constants.ssnListMap) {
                // Act
                BindView.bindViewZilStakingBalanceFiat24hAgo('1234.4', '43.2', ssnAddress);

                // Assert
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_24h_ago').text(), '1234.4');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_24h').text(), '43.2');
            }
        });

        it('bind view random string', function () {
            for (let ssnAddress in Constants.ssnListMap) {
                // Act
                BindView.bindViewZilStakingBalanceFiat24hAgo('asdf', 'qwer', ssnAddress);

                // Assert
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_24h_ago').text(), 'asdf');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_24h').text(), 'qwer');
            }
        });
    });

    describe('#bindViewZilStakingBalanceFiat()', function () {

        beforeEach(function () {
            for (let ssnAddress in Constants.ssnListMap) {
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            for (let ssnAddress in Constants.ssnListMap) {
                // Act
                BindView.bindViewZilStakingBalanceFiat('1234.4', ssnAddress);

                // Assert
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ssnAddress in Constants.ssnListMap) {
                // Act
                BindView.bindViewZilStakingBalanceFiat('asdf', ssnAddress);

                // Assert
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), 'asdf');
            }
        });
    });

    describe('#bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo('1234.4', '4.2');

            // Assert
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), '1234.4');
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), '4.2');

        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewZilStakingWithdrawalPendingBalanceFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewZilStakingWithdrawalPendingBalanceFiat('1234.4');

            // Assert
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), '1234.4');

        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewZilStakingWithdrawalPendingBalanceFiat('asdf');

            // Assert
            assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewCarbonStakingBalanceZil24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceZil24hAgo('1234.4', '4.2');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '1234.4');
            assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '4.2');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceZil24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), 'asdf');
            assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), 'qwer');
        });
    });


    describe('#bindViewCarbonStakingBalanceZil()', function () {

        beforeEach(function () {
            assert.strictEqual($('#carbon_staking_balance_zil').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceZil('1234.4');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_zil').text(), '1234.4');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_zil').text(), 'asdf');
        });
    });

    describe('#bindViewCarbonStakingBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceFiat24hAgo('1234.4', '21');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '1234.4');
            assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '21');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceFiat24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewCarbonStakingBalanceFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#carbon_staking_balance_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceFiat('1234.4');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_fiat').text(), '1234.4');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceFiat('asdf');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewTotalStakingBalanceZil24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalStakingBalanceZil24hAgo('1234.52', '12');

            // Assert
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '1234.52');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '12');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalStakingBalanceZil24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), 'asdf');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalStakingBalanceZil()', function () {

        beforeEach(function () {
            assert.strictEqual($('#staking_balance_zil').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalStakingBalanceZil('1234.52');

            // Assert
            assert.strictEqual($('#staking_balance_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalStakingBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#staking_balance_zil').text(), 'asdf');
        });
    });

    describe('#bindViewTotalStakingBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalStakingBalanceFiat24hAgo('1234.52', '22');

            // Assert
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '1234.52');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '22');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalStakingBalanceFiat24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalStakingBalanceFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#staking_balance_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalStakingBalanceFiat('1234.52');

            // Assert
            assert.strictEqual($('#staking_balance_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalStakingBalanceFiat('asdf');

            // Assert
            assert.strictEqual($('#staking_balance_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewTotalNetWorthZil24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalNetWorthZil24hAgo('1234.52', '22');

            // Assert
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '1234.52');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '22');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalNetWorthZil24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), 'asdf');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalNetWorthZil()', function () {

        beforeEach(function () {
            assert.strictEqual($('#net_worth_zil').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalNetWorthZil('1234.52');

            // Assert
            assert.strictEqual($('#net_worth_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalNetWorthZil('asdf');

            // Assert
            assert.strictEqual($('#net_worth_zil').text(), 'asdf');
        });
    });


    describe('#bindViewTotalNetWorthFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalNetWorthFiat24hAgo('1234.52', '41');

            // Assert
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '1234.52');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '41');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalNetWorthFiat24hAgo('asdf', 'rewq');

            // Assert
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), 'rewq');
        });
    });

    describe('#bindViewTotalNetWorthFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#net_worth_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalNetWorthFiat('1234.52');

            // Assert
            assert.strictEqual($('#net_worth_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalNetWorthFiat('asdf');

            // Assert
            assert.strictEqual($('#net_worth_fiat').text(), 'asdf');
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

function assertDefaultStateMainContent() {
    // bindViewCoinPriceInFiat(): Exception, no need refresh
    // bindViewCoinPriceInZil(): Exception, no need refresh

    // bindViewZilBalance()
    assert.strictEqual($('#zil_balance').text(), 'Loading...');

    // bindViewZrcTokenPriceInZil24hAgo(): Exception, no need refresh
    // bindViewZrcTokenPriceInZil(): Exception, no need refresh

    // bindViewZrcTokenPriceInFiat(): Exception, no need refresh

    // bindViewZrcTokenWalletBalance()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_balance').text(), 'Loading...');
        assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');
    }

    // bindViewZrcTokenLpTotalPoolBalance(): Exception, no need refresh


    // bindViewZrcTokenLpBalance24hAgo()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), '');
    }

    // bindViewZrcTokenLpBalance()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'Loading...');
        assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
    }
    assert.strictEqual($('#lp_container').css('display'), 'none');

    // bindViewZilStakingBalance()
    for (let ssnAddress in Constants.ssnListMap) {
        assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), 'Loading...');
        assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');
    }
    assert.strictEqual($('#staking_container').css('display'), 'none');

    // bindViewZilStakingWithdrawalPendingBalance()
    assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(), 'Loading...');
    assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'none');
    assert.strictEqual($('#staking_container').css('display'), 'none');

    // bindViewCarbonStakingBalance()
    assert.strictEqual($('#carbon_staking_balance').text(), 'Loading...');
    assert.strictEqual($('#carbon_staking_container').css('display'), 'none');
    assert.strictEqual($('#staking_container').css('display'), 'none');

    // bindViewTotalTradeVolumeZil(): Exception, no need refresh
    // bindViewTotalTradeVolumeFiat(): Exception, no need refresh

    // bindViewZwapRewardLp()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
    }

    // bindViewTotalRewardAllLpZwap()
    assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
    assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
    assert.strictEqual($('#lp_container').css('display'), 'none');

    // bindViewPrevTotalRewardAllLpZwap()
    assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'Loading...');

    // bindViewLpNextEpochCounter(): Exception, no need refresh

    // bindViewZilBalanceFiat24hAgo()
    assert.strictEqual($('#zil_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), '');

    // bindViewZilBalanceFiat()
    assert.strictEqual($('#zil_balance_fiat').text(), 'Loading...');

    // bindViewZrcTokenWalletBalanceZil24hAgo()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), '');
    }

    // bindViewZrcTokenWalletBalanceZil()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'Loading...');
    }

    // bindViewZrcTokenWalletBalanceFiat24hAgo()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), '');
    }

    // bindViewZrcTokenWalletBalanceFiat()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_balance_fiat').text(), 'Loading...');
    }
    // bindViewTotalWalletBalanceZil24hAgo()
    assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '');
    assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '');

    // bindViewTotalWalletBalanceZil()
    assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');

    // bindViewTotalWalletBalanceFiat24hAgo()
    assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '');

    // bindViewTotalWalletBalanceFiat()
    assert.strictEqual($('#wallet_balance_fiat').text(), 'Loading...');

    // bindViewZrcTokenLpTotalPoolBalanceFiat(): Exception, no need refresh

    // bindViewZrcTokenLpBalanceFiat24hAgo()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), '');
    }

    // bindViewZrcTokenLpBalanceFiat()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), 'Loading...');
    }

    // bindViewTotalLpBalanceZil24hAgo()
    assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '');
    assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '');

    // bindViewTotalLpBalanceZil()
    assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');

    // bindViewTotalLpBalanceFiat24hAgo()
    assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '');

    // bindViewTotalLpBalanceFiat()
    assert.strictEqual($('#lp_balance_fiat').text(), 'Loading...');

    // bindViewZilStakingBalanceFiat24hAgo()
    for (let ssnAddress in Constants.ssnListMap) {
        assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_24h').text(), '');
    }

    // bindViewZilStakingBalanceFiat()
    for (let ssnAddress in Constants.ssnListMap) {
        assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), 'Loading...');
    }

    // bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo()
    assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), '');

    // bindViewZilStakingWithdrawalPendingBalanceFiat()
    assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), 'Loading...');

    // bindViewCarbonStakingBalanceZil24hAgo()
    assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '');
    assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '');

    // bindViewCarbonStakingBalanceZil()
    assert.strictEqual($('#carbon_staking_balance_zil').text(), 'Loading...');

    // bindViewCarbonStakingBalanceFiat24hAgo()
    assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '');

    // bindViewCarbonStakingBalanceFiat()
    assert.strictEqual($('#carbon_staking_balance_fiat').text(), 'Loading...');

    // bindViewTotalStakingBalanceZil24hAgo()
    assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '');
    assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '');

    // bindViewTotalStakingBalanceZil()
    assert.strictEqual($('#staking_balance_zil').text(), 'Loading...');

    // bindViewTotalStakingBalanceFiat24hAgo()
    assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '');

    // bindViewTotalStakingBalanceFiat()
    assert.strictEqual($('#staking_balance_fiat').text(), 'Loading...');

    // bindViewTotalNetWorthZil24hAgo()
    assert.strictEqual($('#net_worth_zil_24h_ago').text(), '');
    assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '');

    // bindViewTotalNetWorthZil()
    assert.strictEqual($('#net_worth_zil').text(), 'Loading...');

    // bindViewTotalNetWorthFiat24hAgo()
    assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '');
    assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '');

    // bindViewTotalNetWorthFiat()
    assert.strictEqual($('#net_worth_fiat').text(), 'Loading...');

    // bindViewTotalRewardAllLpFiat()
    assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), 'Loading...');

    // bindViewPrevTotalRewardAllLpFiat()
    assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'Loading...');
}