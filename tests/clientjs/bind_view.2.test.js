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

    describe('#bindViewCoinPriceInFiat24hAgo()', function () {

        it('bind view price in fiat', function () {
            for (let coinTicker in Constants.coinMap) {
                // Act
                BindView.bindViewCoinPriceInFiat24hAgo('0.123', coinTicker);

                // Assert
                assert.strictEqual($('#public_' + coinTicker + '_price_fiat_percent_change_24h').text(), '0.123');
            }
        });

        it('bind view random string', function () {
            for (let coinTicker in Constants.coinMap) {
                // Act
                BindView.bindViewCoinPriceInFiat24hAgo('asdf', coinTicker);

                // Assert
                assert.strictEqual($('#public_' + coinTicker + '_price_fiat_percent_change_24h').text(), 'asdf');
            }
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


    describe('#bindViewCoinPriceInZil24hAgo()', function () {

        it('bind view price in fiat', function () {
            for (let coinTicker in Constants.coinMap) {
                // Act
                BindView.bindViewCoinPriceInZil24hAgo('0.123', coinTicker);

                // Assert
                assert.strictEqual($('#public_' + coinTicker + '_price_zil_percent_change_24h').text(), '0.123');
            }
        });

        it('bind view random string', function () {
            for (let coinTicker in Constants.coinMap) {
                // Act
                BindView.bindViewCoinPriceInZil24hAgo('asdf', coinTicker);

                // Assert
                assert.strictEqual($('#public_' + coinTicker + '_price_zil_percent_change_24h').text(), 'asdf');
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
                $('.' + ticker + '_price_zil_24h_ago').each(function () {
                    assert.strictEqual($(this).text(), '');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil_24h_ago').text(), '');
                assert.strictEqual($('#public_' + ticker + '_price_zil_percent_change_24h').text(), '');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInZil24hAgo('1234.4', '123', '5.2', ticker);

                // Assert
                $('.' + ticker + '_price_zil_24h_ago').each(function () {
                    assert.strictEqual($(this).text(), '1234.4');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil_24h_ago').text(), '123');
                assert.strictEqual($('#public_' + ticker + '_price_zil_percent_change_24h').text(), '5.2');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInZil24hAgo('asdf', 'qwer', 'rfb', ticker);

                // Assert
                $('.' + ticker + '_price_zil_24h_ago').each(function () {
                    assert.strictEqual($(this).text(), 'asdf');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil_24h_ago').text(), 'qwer');
                assert.strictEqual($('#public_' + ticker + '_price_zil_percent_change_24h').text(), 'rfb');
            }
        });
    });

    describe('#bindViewZrcTokenPriceInZil()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), 'Loading...');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), 'Loading...');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInZil('1234.4', '12345.5', ticker);

                // Assert
                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), '1234.4');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), '12345.5');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInZil('asdf', 'qwer', ticker);

                // Assert
                $('.' + ticker + '_price_zil').each(function () {
                    assert.strictEqual($(this).text(), 'asdf');
                });
                assert.strictEqual($('#public_' + ticker + '_price_zil').text(), 'qwer');
            }
        });
    });

    describe('#bindViewZrcTokenPriceInFiat24hAgo()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#public_' + ticker + '_price_fiat_24h_ago').text(), '');
                assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), '');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInFiat24hAgo('1234.4', '4322', ticker);

                // Assert
                assert.strictEqual($('#public_' + ticker + '_price_fiat_24h_ago').text(), '1234.4');
                assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), '4322');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenPriceInFiat24hAgo('asdf', 'qwer', ticker);

                // Assert
                assert.strictEqual($('#public_' + ticker + '_price_fiat_24h_ago').text(), 'asdf');
                assert.strictEqual($('#public_' + ticker + '_price_fiat_percent_change_24h').text(), 'qwer');
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
                assert.strictEqual($('#' + ticker + '_lp_total_pool_zil').text(), '0');
                assert.strictEqual($('#' + ticker + '_lp_total_pool_zrc').text(), '0');
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

    describe('#bindViewZrcTokenCirculatingSupply()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_circulating_supply_zrc').text(), '0');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenCirculatingSupply('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_circulating_supply_zrc').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenCirculatingSupply('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_circulating_supply_zrc').text(), 'asdf');
            }
        });
    });

    describe('#bindViewZrcTokenCirculatingSupplyFiat()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_circulating_supply_fiat').text(), '0');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenCirculatingSupplyFiat('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_circulating_supply_fiat').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenCirculatingSupplyFiat('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_circulating_supply_fiat').text(), 'asdf');
            }
        });
    });

    describe('#bindViewZrcTokenTotalSupply()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_total_supply_zrc').text(), '0');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenTotalSupply('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_total_supply_zrc').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenTotalSupply('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_total_supply_zrc').text(), 'asdf');
            }
        });
    });

    describe('#bindViewZrcTokenTotalSupplyFiat()', function () {

        beforeEach(function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_total_supply_fiat').text(), '0');
            }
        });

        it('bind view happy case', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenTotalSupplyFiat('1234.4', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_total_supply_fiat').text(), '1234.4');
            }
        });

        it('bind view random string', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                // Act
                BindView.bindViewZrcTokenTotalSupplyFiat('asdf', ticker);

                // Assert
                assert.strictEqual($('#' + ticker + '_total_supply_fiat').text(), 'asdf');
            }
        });
    });
});
