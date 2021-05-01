var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var constants = require('../../constants.js');

var BindView = require('../../clientjs/bind_view.js');
var ZilpayUtils = require('../../clientjs/zilpay_utils.js');
var assert = require('assert');

describe('BindView', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#bindViewLoggedInButton()', function () {

        it('bind view random string', function () {
            assert.strictEqual($('#wallet_address').text(), '');
            assert.strictEqual($('#wallet_address').css('display'), 'none');
            assert.strictEqual($('#wallet_refresh').css('display'), 'none');
            assert.strictEqual($('#wallet_connect').css('display'), 'inline-block');

            // Act
            BindView.bindViewLoggedInButton('abcd');

            // Assert
            assert.strictEqual($('#wallet_address').text(), 'abcd');
            assert.strictEqual($('#wallet_address').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_refresh').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_connect').css('display'), 'none');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#wallet_address').text(), '');
            assert.strictEqual($('#wallet_address').css('display'), 'none');
            assert.strictEqual($('#wallet_refresh').css('display'), 'none');
            assert.strictEqual($('#wallet_connect').css('display'), 'inline-block');

            // Act
            BindView.bindViewLoggedInButton('');

            // Assert
            assert.strictEqual($('#wallet_address').text(), '');
            assert.strictEqual($('#wallet_address').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_refresh').css('display'), 'inline-block');
            assert.strictEqual($('#wallet_connect').css('display'), 'none');
        });

        it('bind view null', function () {
            assert.strictEqual($('#wallet_address').text(), '');
            assert.strictEqual($('#wallet_address').css('display'), 'none');
            assert.strictEqual($('#wallet_refresh').css('display'), 'none');
            assert.strictEqual($('#wallet_connect').css('display'), 'inline-block');

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

        it('bindView ZilpayStatus.connected', function () {
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');

            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.connected);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'block');
            assert.strictEqual($('#error_message_container').css('display'), 'none');
        });

        it('bindView ZilpayStatus.not_installed', function () {
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');

            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.not_installed);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
            assert.strictEqual($('#error_message').html(), 'ZilPay not installed! <a href="https://zilpay.io">Download here</a>');
        });

        it('bindView ZilpayStatus.locked', function () {
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');

            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.locked);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
            assert.strictEqual($('#error_message').html(), 'Please connect to ZilPay! (top right button)');
        });

        it('bindView ZilpayStatus.not_connected', function () {
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');

            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.not_connected);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
            assert.strictEqual($('#error_message').html(), 'Please connect to ZilPay! (top right button)');
        });

        it('bindView ZilpayStatus.not_mainnet', function () {
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');

            // Act
            BindView.bindViewMainContainer(ZilpayUtils.ZilpayStatus.not_mainnet);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
            assert.strictEqual($('#error_message').html(), 'Please switch to mainnet!');
        });

        it('bindView ZilpayStatus illegal enum', function () {
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');

            // Act
            BindView.bindViewMainContainer(6);

            // Assert
            assert.strictEqual($('#main_content_container').css('display'), 'none');
            assert.strictEqual($('#error_message_container').css('display'), 'block');
            assert.strictEqual($('#error_message').html(), 'Unknown Error! Please contact zilWatch team on <a href="https://t.me/zilWatch_community">Telegram</a>!');
        });
    });

    describe('#bindViewZilPriceInUsd()', function () {

        it('bind view price in usd', function () {
            assert.strictEqual($('#zil_price').text(), 'Loading...');

            // Act
            BindView.bindViewZilPriceInUsd('0.123');

            // Assert
            assert.strictEqual($('#zil_price').text(), '0.123');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#zil_price').text(), 'Loading...');

            // Act
            BindView.bindViewZilPriceInUsd('asdf');

            // Assert
            assert.strictEqual($('#zil_price').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#zil_price').text(), 'Loading...');

            // Act
            BindView.bindViewZilPriceInUsd('');

            // Assert
            assert.strictEqual($('#zil_price').text(), '');
        });
    });

    describe('#bindViewZilBalance()', function () {

        it('bind view legit balance', function () {
            assert.strictEqual($('#zil_balance').text(), 'Loading...');

            // Act
            BindView.bindViewZilBalance('1234.4');

            // Assert
            assert.strictEqual($('#zil_balance').text(), '1234.4');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#zil_balance').text(), 'Loading...');

            // Act
            BindView.bindViewZilBalance('asdf');

            // Assert
            assert.strictEqual($('#zil_balance').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#zil_balance').text(), 'Loading...');

            // Act
            BindView.bindViewZilBalance('');

            // Assert
            assert.strictEqual($('#zil_balance').text(), '');
        });
    });

    describe('#bindViewZrcTokenPriceInZil()', function () {

        it('bind view happy case', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_price').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenPriceInZil('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_price').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_price').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenPriceInZil('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_price').text(), 'asdf');
            }
        });

        it('bind view empty string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_price').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenPriceInZil('', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_price').text(), '');
            }
        });
    });

    describe('#bindViewZrcTokenWalletBalance()', function () {

        it('bind view happy case', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');

                // Act
                BindView.bindViewZrcTokenWalletBalance('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_container').css('display'), 'block');
            }
        });

        it('bind view random string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');

                // Act
                BindView.bindViewZrcTokenWalletBalance('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance').text(), 'asdf');
                assert.strictEqual($('#' + ticker + '_container').css('display'), 'block');
            }
        });

        it('bind view empty string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');

                // Act
                BindView.bindViewZrcTokenWalletBalance('', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_container').css('display'), 'block');
            }
        });
    });

    describe('#bindViewZrcTokenLpBalance()', function () {

        it('bind view happy case', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');

                // Act
                BindView.bindViewZrcTokenLpBalance( /* poolSharePercent= */ '0.0012', /* zilBalance= */ '1234.4', /* zrcBalance = */ '54.43', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), '0.0012');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '54.43');
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
            }
        });

        it('bind view random string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');

                // Act
                BindView.bindViewZrcTokenLpBalance( /* poolSharePercent= */ 'asdf', /* zilBalance= */ 'hjkl', /* zrcBalance = */ 'qwer', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'asdf');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), 'hjkl');
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), 'qwer');
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
            }
        });

        it('bind view empty string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'Loading...');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');

                // Act
                BindView.bindViewZrcTokenLpBalance( /* poolSharePercent= */ '', /* zilBalance= */ '', /* zrcBalance = */ '', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'block');
            }
        });
    });

    describe('#bindViewZilStakingBalance()', function () {

        it('bind view happy case', function () {
            for (let ssnAddress in constants.ssnListMap) {
                assert.strictEqual($( $('#' + ssnAddress + '_zil_staking_balance')).text(), 'Loading...');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');

                // Act
                BindView.bindViewZilStakingBalance('1234.4', ssnAddress);

                // Assert

                assert.strictEqual($( $('#' + ssnAddress + '_zil_staking_balance')).text(), '1234.4');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'block');
            }
        });

        it('bind view random string', function () {
            for (let ssnAddress in constants.ssnListMap) {
                assert.strictEqual($( $('#' + ssnAddress + '_zil_staking_balance')).text(), 'Loading...');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');

                // Act
                BindView.bindViewZilStakingBalance('asdf', ssnAddress);

                // Assert
                assert.strictEqual($( $('#' + ssnAddress + '_zil_staking_balance')).text(), 'asdf');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'block');
            }
        });

        it('bind view empty string', function () {
            for (let ssnAddress in constants.ssnListMap) {
                assert.strictEqual($( $('#' + ssnAddress + '_zil_staking_balance')).text(), 'Loading...');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');

                // Act
                BindView.bindViewZilStakingBalance('', ssnAddress);

                // Assert
                assert.strictEqual($( $('#' + ssnAddress + '_zil_staking_balance')).text(), '');
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'block');
            }
        });
    });

    
    describe('#bindViewZwapRewardLp()', function () {

        it('bind view happy case', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');

                // Act
                BindView.bindViewZwapRewardLp('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '1234.4');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
            }
        });

        it('bind view random string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');

                // Act
                BindView.bindViewZwapRewardLp('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), 'asdf');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
            }
        });

        it('bind view empty string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');

                // Act
                BindView.bindViewZwapRewardLp('', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
            }
        });
    });


    describe('#bindViewTotalRewardAllLpZwap()', function () {

        it('bind view legit balance', function () {
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');

            // Act
            BindView.bindViewTotalRewardAllLpZwap('1234.4');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), '1234.4');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');

            // Act
            BindView.bindViewTotalRewardAllLpZwap('asdf');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'asdf');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');

            // Act
            BindView.bindViewTotalRewardAllLpZwap('');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), '');
            assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
        });
    });

    describe('#bindViewLpNextEpochCounter()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');

            // Act
            BindView.bindViewLpNextEpochCounter('4d 5h 12m');

            // Assert
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '4d 5h 12m');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');

            // Act
            BindView.bindViewLpNextEpochCounter('asdf');

            // Assert
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');

            // Act
            BindView.bindViewLpNextEpochCounter('');

            // Assert
            assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
        });
    });

    describe('#bindViewZilBalanceUsd()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#zil_balance_usd').text(), '');

            // Act
            BindView.bindViewZilBalanceUsd('1234.52');

            // Assert
            assert.strictEqual($('#zil_balance_usd').text(), '1234.52');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#zil_balance_usd').text(), '');

            // Act
            BindView.bindViewZilBalanceUsd('asdf');

            // Assert
            assert.strictEqual($('#zil_balance_usd').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#zil_balance_usd').text(), '');

            // Act
            BindView.bindViewZilBalanceUsd('');

            // Assert
            assert.strictEqual($('#zil_balance_usd').text(), '');
        });
    });

    describe('#bindViewZrcTokenWalletBalanceZil()', function () {

        it('bind view happy case', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenWalletBalanceZil('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenWalletBalanceZil('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'asdf');
            }
        });

        it('bind view empty string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenWalletBalanceZil('', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_zil').text(), '');
            }
        });
    });

    describe('#bindViewZrcTokenWalletBalanceUsd()', function () {

        it('bind view happy case', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance_usd').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenWalletBalanceUsd('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_usd').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance_usd').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenWalletBalanceUsd('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_usd').text(), 'asdf');
            }
        });

        it('bind view empty string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_balance_usd').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenWalletBalanceUsd('', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_balance_usd').text(), '');
            }
        });
    });

    describe('#bindViewTotalWalletBalanceZil()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalWalletBalanceZil('1234.52');

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalWalletBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalWalletBalanceZil('');

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), '');
        });
    });

    describe('#bindViewTotalWalletBalanceUsd()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#wallet_balance_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalWalletBalanceUsd('1234.52');

            // Assert
            assert.strictEqual($('#wallet_balance_usd').text(), '1234.52');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#wallet_balance_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalWalletBalanceUsd('asdf');

            // Assert
            assert.strictEqual($('#wallet_balance_usd').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#wallet_balance_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalWalletBalanceUsd('');

            // Assert
            assert.strictEqual($('#wallet_balance_usd').text(), '');
        });
    });

    describe('#bindViewZrcTokenLpBalanceUsd()', function () {

        it('bind view happy case', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_balance_usd').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenLpBalanceUsd('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_balance_usd').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_balance_usd').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenLpBalanceUsd('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_balance_usd').text(), 'asdf');
            }
        });

        it('bind view empty string', function () {
            for (let ticker in constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_lp_balance_usd').text(), 'Loading...');

                // Act
                BindView.bindViewZrcTokenLpBalanceUsd('', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_lp_balance_usd').text(), '');
            }
        });
    });

    describe('#bindViewTotalLpBalanceZil()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalLpBalanceZil('1234.52');

            // Assert
            assert.strictEqual($('#lp_balance_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalLpBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#lp_balance_zil').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalLpBalanceZil('');

            // Assert
            assert.strictEqual($('#lp_balance_zil').text(), '');
        });
    });

    describe('#bindViewTotalLpBalanceUsd()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#lp_balance_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalLpBalanceUsd('1234.52');

            // Assert
            assert.strictEqual($('#lp_balance_usd').text(), '1234.52');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#lp_balance_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalLpBalanceUsd('asdf');

            // Assert
            assert.strictEqual($('#lp_balance_usd').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#lp_balance_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalLpBalanceUsd('');

            // Assert
            assert.strictEqual($('#lp_balance_usd').text(), '');
        });
    });

    describe('#bindViewZilStakingBalanceUsd()', function () {

        it('bind view happy case', function () {
            for (let ssnAddress in constants.ssnListMap) {
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_usd').text(), 'Loading...');

                // Act
                BindView.bindViewZilStakingBalanceUsd('1234.4', ssnAddress);

                // Assert
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_usd').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ssnAddress in constants.ssnListMap) {
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_usd').text(), 'Loading...');

                // Act
                BindView.bindViewZilStakingBalanceUsd('asdf', ssnAddress);

                // Assert
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_usd').text(), 'asdf');
            }
        });

        it('bind view empty string', function () {
            for (let ssnAddress in constants.ssnListMap) {
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_usd').text(), 'Loading...');

                // Act
                BindView.bindViewZilStakingBalanceUsd('', ssnAddress);

                // Assert
                assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_usd').text(), '');
            }
        });
    });

    describe('#bindViewTotalStakingBalanceZil()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#zil_staking_balance_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalStakingBalanceZil('1234.52');

            // Assert
            assert.strictEqual($('#zil_staking_balance_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#zil_staking_balance_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalStakingBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#zil_staking_balance_zil').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#zil_staking_balance_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalStakingBalanceZil('');

            // Assert
            assert.strictEqual($('#zil_staking_balance_zil').text(), '');
        });
    });

    describe('#bindViewTotalStakingBalanceUsd()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#zil_staking_balance_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalStakingBalanceUsd('1234.52');

            // Assert
            assert.strictEqual($('#zil_staking_balance_usd').text(), '1234.52');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#zil_staking_balance_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalStakingBalanceUsd('asdf');

            // Assert
            assert.strictEqual($('#zil_staking_balance_usd').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#zil_staking_balance_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalStakingBalanceUsd('');

            // Assert
            assert.strictEqual($('#zil_staking_balance_usd').text(), '');
        });
    });

    describe('#bindViewTotalNetWorthZil()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#net_worth_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalNetWorthZil('1234.52');

            // Assert
            assert.strictEqual($('#net_worth_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#net_worth_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalNetWorthZil('asdf');

            // Assert
            assert.strictEqual($('#net_worth_zil').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#net_worth_zil').text(), 'Loading...');

            // Act
            BindView.bindViewTotalNetWorthZil('');

            // Assert
            assert.strictEqual($('#net_worth_zil').text(), '');
        });
    });

    describe('#bindViewTotalNetWorthUsd()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#net_worth_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalNetWorthUsd('1234.52');

            // Assert
            assert.strictEqual($('#net_worth_usd').text(), '1234.52');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#net_worth_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalNetWorthUsd('asdf');

            // Assert
            assert.strictEqual($('#net_worth_usd').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#net_worth_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalNetWorthUsd('');

            // Assert
            assert.strictEqual($('#net_worth_usd').text(), '');
        });
    });

    describe('#bindViewTotalRewardAllLpUsd()', function () {

        it('bind view happy case', function () {
            assert.strictEqual($('#total_all_lp_reward_next_epoch_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalRewardAllLpUsd('1234.52');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_next_epoch_usd').text(), '1234.52');
        });

        it('bind view random string', function () {
            assert.strictEqual($('#total_all_lp_reward_next_epoch_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalRewardAllLpUsd('asdf');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_next_epoch_usd').text(), 'asdf');
        });

        it('bind view empty string', function () {
            assert.strictEqual($('#total_all_lp_reward_next_epoch_usd').text(), 'Loading...');

            // Act
            BindView.bindViewTotalRewardAllLpUsd('');

            // Assert
            assert.strictEqual($('#total_all_lp_reward_next_epoch_usd').text(), '');
        });
    });
});