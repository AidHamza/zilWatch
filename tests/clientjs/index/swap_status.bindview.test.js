var indexJsdom = require('../../index.jsdom.js');
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../../clientjs/index//zilswap_dex_status.js');
var CoinPriceStatus = require('../../../clientjs/index//coin_price_status.js');
var WalletBalanceStatus = require('../../../clientjs/index//wallet_balance_status.js');
var SwapStatus = require('../../../clientjs/index//swap_status.js');
var Constants = require('../../../constants.js');

describe('SwapStatusBindView', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#bindView()', function () {
        var swapStatus;

        beforeEach(function () {
            swapStatus = new SwapStatus.SwapStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexStatus= */ null, /* walletBalanceStatus= */ null);
        });

        describe('#bindViewDisableSelectedTokenListRow()', function () {

            beforeEach(function () {
                assert.strictEqual($('#ZIL_token_list_row').hasClass('disabled'), false);
                for (let ticker in Constants.zrcTokenPropertiesListMap_) {
                    assert.strictEqual($('#' + ticker + '_token_list_row').hasClass('disabled'), false);
                }
            });

            it('bind view all null, no change', function () {
                // Act
                swapStatus.bindViewDisableSelectedTokenListRow(null, null);

                // Assert
                assert.strictEqual($('#ZIL_token_list_row').hasClass('disabled'), false);
                for (let ticker in Constants.zrcTokenPropertiesListMap_) {
                    assert.strictEqual($('#' + ticker + '_token_list_row').hasClass('disabled'), false);
                }
            });

            it('bind view single 1', function () {
                // Act
                swapStatus.bindViewDisableSelectedTokenListRow('ZWAP', null);

                // Assert
                assert.strictEqual($('#ZIL_token_list_row').hasClass('disabled'), false);
                for (let ticker in Constants.zrcTokenPropertiesListMap_) {
                    if (ticker === 'ZWAP') {
                        assert.strictEqual($('#' + ticker + '_token_list_row').hasClass('disabled'), true);
                    } else {
                        assert.strictEqual($('#' + ticker + '_token_list_row').hasClass('disabled'), false);
                    }
                }
            });

            it('bind view single 2', function () {
                // Act
                swapStatus.bindViewDisableSelectedTokenListRow(null, 'gZIL');

                // Assert
                assert.strictEqual($('#ZIL_token_list_row').hasClass('disabled'), false);
                for (let ticker in Constants.zrcTokenPropertiesListMap_) {
                    if (ticker === 'gZIL') {
                        assert.strictEqual($('#' + ticker + '_token_list_row').hasClass('disabled'), true);
                    } else {
                        assert.strictEqual($('#' + ticker + '_token_list_row').hasClass('disabled'), false);
                    }
                }
            });

            it('bind view dual 1', function () {
                // Act
                swapStatus.bindViewDisableSelectedTokenListRow('ZIL', 'gZIL');

                // Assert
                assert.strictEqual($('#ZIL_token_list_row').hasClass('disabled'), true);
                for (let ticker in Constants.zrcTokenPropertiesListMap_) {
                    if (ticker === 'gZIL') {
                        assert.strictEqual($('#' + ticker + '_token_list_row').hasClass('disabled'), true);
                    } else {
                        assert.strictEqual($('#' + ticker + '_token_list_row').hasClass('disabled'), false);
                    }
                }
            });

            it('bind view dual 2', function () {
                // Act
                swapStatus.bindViewDisableSelectedTokenListRow('ZLP', 'gZIL');

                // Assert
                assert.strictEqual($('#ZIL_token_list_row').hasClass('disabled'), false);
                for (let ticker in Constants.zrcTokenPropertiesListMap_) {
                    if (ticker === 'gZIL' || ticker === 'ZLP') {
                        assert.strictEqual($('#' + ticker + '_token_list_row').hasClass('disabled'), true);
                    } else {
                        assert.strictEqual($('#' + ticker + '_token_list_row').hasClass('disabled'), false);
                    }
                }
            });
        });

        describe('#bindView-FromToken', function () {

            describe('#bindViewFromToken() and #resetViewFromToken()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#swap_select_token_from_img').attr('src'), '');
                    assert.strictEqual($('#swap_select_token_from_img').css('display'), 'none');
                    assert.strictEqual($('#swap_select_token_from_ticker').text(), SwapStatus.SELECT_TOKEN_STRING);
                });

                it('bind view', function () {
                    // Act
                    swapStatus.bindViewFromToken('https://abcd.com', 'ZWAP');

                    // Assert
                    assert.strictEqual($('#swap_select_token_from_img').attr('src'), 'https://abcd.com');
                    assert.strictEqual($('#swap_select_token_from_img').css('display'), '');
                    assert.strictEqual($('#swap_select_token_from_ticker').text(), 'ZWAP');
                });


                it('bind view and then reset', function () {
                    swapStatus.bindViewFromToken('https://abcd.com', 'ZWAP');

                    // Act
                    swapStatus.resetViewFromToken();

                    // Assert
                    assert.strictEqual($('#swap_select_token_from_img').attr('src'), '');
                    assert.strictEqual($('#swap_select_token_from_img').css('display'), 'none');
                    assert.strictEqual($('#swap_select_token_from_ticker').text(), SwapStatus.SELECT_TOKEN_STRING);
                });
            });

            describe('#bindViewFromTokenBalance()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#swap_token_from_balance').text(), '0');
                    assert.strictEqual($('#swap_token_from_balance_container').css('visibility'), 'hidden');
                });

                it('bind view', function () {
                    // Act
                    swapStatus.bindViewFromTokenBalance('1234');

                    // Assert
                    assert.strictEqual($('#swap_token_from_balance').text(), '1234');
                    assert.strictEqual($('#swap_token_from_balance_container').css('visibility'), 'visible');
                });
            });

            describe('#bindViewFromTokenAmount()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#swap_token_from_amount').val(), '');
                });

                it('bind view', function () {
                    // Act
                    swapStatus.bindViewFromTokenAmount('1234');

                    // Assert
                    assert.strictEqual($('#swap_token_from_amount').val(), '1234');
                });
            });

            describe('#bindViewFromTokenAmountFiat()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#swap_token_from_amount_fiat').text(), '');
                    assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'hidden');
                });

                it('bind view', function () {
                    // Act
                    swapStatus.bindViewFromTokenAmountFiat('1234');

                    // Assert
                    assert.strictEqual($('#swap_token_from_amount_fiat').text(), '1234');
                    assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');
                });
            });
        });


        describe('#bindView-ToToken', function () {

            describe('#bindViewToToken() and #resetViewToToken()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#swap_select_token_to_img').attr('src'), '');
                    assert.strictEqual($('#swap_select_token_to_img').css('display'), 'none');
                    assert.strictEqual($('#swap_select_token_to_ticker').text(), SwapStatus.SELECT_TOKEN_STRING);
                });

                it('bind view', function () {
                    // Act
                    swapStatus.bindViewToToken('https://abcd.com', 'ZWAP');

                    // Assert
                    assert.strictEqual($('#swap_select_token_to_img').attr('src'), 'https://abcd.com');
                    assert.strictEqual($('#swap_select_token_to_img').css('display'), '');
                    assert.strictEqual($('#swap_select_token_to_ticker').text(), 'ZWAP');
                });


                it('bind view and then reset', function () {
                    swapStatus.bindViewToToken('https://abcd.com', 'ZWAP');

                    // Act
                    swapStatus.resetViewToToken();

                    // Assert
                    assert.strictEqual($('#swap_select_token_to_img').attr('src'), '');
                    assert.strictEqual($('#swap_select_token_to_img').css('display'), 'none');
                    assert.strictEqual($('#swap_select_token_to_ticker').text(), SwapStatus.SELECT_TOKEN_STRING);
                });
            });

            describe('#bindViewToTokenBalance()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#swap_token_to_balance').text(), '0');
                    assert.strictEqual($('#swap_token_to_balance_container').css('visibility'), 'hidden');
                });

                it('bind view', function () {
                    // Act
                    swapStatus.bindViewToTokenBalance('1234');

                    // Assert
                    assert.strictEqual($('#swap_token_to_balance').text(), '1234');
                    assert.strictEqual($('#swap_token_to_balance_container').css('visibility'), 'visible');
                });
            });

            describe('#bindViewToTokenAmount()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#swap_token_to_amount').val(), '');
                });

                it('bind view', function () {
                    // Act
                    swapStatus.bindViewToTokenAmount('1234');

                    // Assert
                    assert.strictEqual($('#swap_token_to_amount').val(), '1234');
                });
            });
        });


        describe('#tokenPriceInfo', function () {

            describe('#bindViewTokenPriceFinal(), #toggleViewTokenPriceFinal(), #resetViewTokenPriceFinal()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#swap_token_final_rate').text(), '');
                    assert.strictEqual($('#swap_token_final_rate_inverse').text(), '');

                    assert.strictEqual($('#swap_token_final_rate').css('display'), '');
                    assert.strictEqual($('#swap_token_final_rate_inverse').css('display'), 'none');
                    assert.strictEqual($('#swap_token_final_rate_inverse_button').css('display'), 'none');
                });

                it('bind view', function () {
                    let rateString = '1 ZWAP = 2,351 ZIL';
                    let rateStringInverse = '1 ZIL = 0.00042535 ZWAP';

                    // Act
                    swapStatus.bindViewTokenPriceFinal(rateString, rateStringInverse);

                    // Assert
                    assert.strictEqual($('#swap_token_final_rate').text(), rateString);
                    assert.strictEqual($('#swap_token_final_rate_inverse').text(), rateStringInverse);

                    assert.strictEqual($('#swap_token_final_rate').css('display'), '');
                    assert.strictEqual($('#swap_token_final_rate_inverse').css('display'), 'none');
                    assert.strictEqual($('#swap_token_final_rate_inverse_button').css('display'), '');
                });

                it('bind view and toggle', function () {
                    let rateString = '1 ZWAP = 2,351 ZIL';
                    let rateStringInverse = '1 ZIL = 0.00042535 ZWAP';
                    swapStatus.bindViewTokenPriceFinal(rateString, rateStringInverse);

                    // Act
                    swapStatus.toggleViewTokenPriceFinal();

                    // Assert
                    assert.strictEqual($('#swap_token_final_rate').text(), rateString);
                    assert.strictEqual($('#swap_token_final_rate_inverse').text(), rateStringInverse);

                    assert.strictEqual($('#swap_token_final_rate').css('display'), 'none');
                    assert.strictEqual($('#swap_token_final_rate_inverse').css('display'), '');
                    assert.strictEqual($('#swap_token_final_rate_inverse_button').css('display'), '');
                });

                it('bind view and then reset', function () {
                    let rateString = '1 ZWAP = 2,351 ZIL';
                    let rateStringInverse = '1 ZIL = 0.00042535 ZWAP';
                    swapStatus.bindViewTokenPriceFinal(rateString, rateStringInverse);

                    // Act
                    swapStatus.resetViewTokenPriceFinal();

                    // Assert
                    assert.strictEqual($('#swap_token_final_rate').text(), '');
                    assert.strictEqual($('#swap_token_final_rate_inverse').text(), '');

                    assert.strictEqual($('#swap_token_final_rate').css('display'), '');
                    assert.strictEqual($('#swap_token_final_rate_inverse').css('display'), 'none');
                    assert.strictEqual($('#swap_token_final_rate_inverse_button').css('display'), 'none');
                });

                it('bind view, toggle, then reset', function () {
                    let rateString = '1 ZWAP = 2,351 ZIL';
                    let rateStringInverse = '1 ZIL = 0.00042535 ZWAP';
                    swapStatus.bindViewTokenPriceFinal(rateString, rateStringInverse);
                    swapStatus.toggleViewTokenPriceFinal();

                    // Act
                    swapStatus.resetViewTokenPriceFinal();

                    // Assert
                    assert.strictEqual($('#swap_token_final_rate').text(), '');
                    assert.strictEqual($('#swap_token_final_rate_inverse').text(), '');

                    assert.strictEqual($('#swap_token_final_rate').css('display'), '');
                    assert.strictEqual($('#swap_token_final_rate_inverse').css('display'), 'none');
                    assert.strictEqual($('#swap_token_final_rate_inverse_button').css('display'), 'none');
                });
            });
        });


        describe('#popoverInformation', function () {

            describe('#bindViewPopOverInformation(), #resetViewPopOverInformation()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#popover_minimum_received_amount').text(), 'N.A.');
                    assert.strictEqual($('#popover_slippage_tolerance_percent').text(), 'N.A.');
                    assert.strictEqual($('#popover_price_impact_percent').text(), 'N.A.');
                    assert.strictEqual($('#popover_liquidity_provider_fee_amount').text(), 'N.A.');
                });

                it('bind view', function () {
                    let minimumReceivedAmount = '0.146436';
                    let slippageTolerancePercent = '2.4';
                    let priceImpactPercent = '63.4';
                    let liqudityProviderFeeAmount = '0.24 ZWAP + 12 ZIL';

                    // Act
                    swapStatus.bindViewPopOverInformation(minimumReceivedAmount, slippageTolerancePercent, priceImpactPercent, liqudityProviderFeeAmount);

                    // Assert
                    assert.strictEqual($('#popover_minimum_received_amount').text(), minimumReceivedAmount);
                    assert.strictEqual($('#popover_slippage_tolerance_percent').text(), slippageTolerancePercent);
                    assert.strictEqual($('#popover_price_impact_percent').text(), priceImpactPercent);
                    assert.strictEqual($('#popover_liquidity_provider_fee_amount').text(), liqudityProviderFeeAmount);
                });

                it('bind view and then reset', function () {
                    let minimumReceivedAmount = '0.146436';
                    let slippageTolerancePercent = '2.4';
                    let priceImpactPercent = '63.4';
                    let liqudityProviderFeeAmount = '0.24 ZWAP + 12 ZIL';
                    swapStatus.bindViewPopOverInformation(minimumReceivedAmount, slippageTolerancePercent, priceImpactPercent, liqudityProviderFeeAmount);

                    // Act
                    swapStatus.resetViewPopOverInformation();

                    // Assert
                    assert.strictEqual($('#popover_minimum_received_amount').text(), 'N.A.');
                    assert.strictEqual($('#popover_slippage_tolerance_percent').text(), 'N.A.');
                    assert.strictEqual($('#popover_price_impact_percent').text(), 'N.A.');
                    assert.strictEqual($('#popover_liquidity_provider_fee_amount').text(), 'N.A.');
                });
            });
        });


        describe('#errorState-FromAndToAmount', function () {

            describe('#bindViewFrom(To)TokenErrorState(), #resetViewTokenErrorState()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#swap_token_from_amount').attr('aria-invalid'), undefined);
                    assert.strictEqual($('#swap_token_to_amount').attr('aria-invalid'), undefined);
                    assert.strictEqual($('#swap_error_message_container').css('display'), 'none');
                    assert.strictEqual($('#swap_error_message').text(), '');
                });

                it('bind view from', function () {
                    let errorMessage = "Error message!!!";
                    // Act
                    swapStatus.bindViewFromTokenErrorState(errorMessage);

                    // Assert
                    assert.strictEqual($('#swap_token_from_amount').attr('aria-invalid'), 'true');
                    assert.strictEqual($('#swap_token_to_amount').attr('aria-invalid'), undefined);
                    assert.strictEqual($('#swap_error_message_container').css('display'), 'block');
                    assert.strictEqual($('#swap_error_message').text(), errorMessage);
                });

                it('bind view to', function () {
                    let errorMessage = "Error message!!!";
                    // Act
                    swapStatus.bindViewToTokenErrorState(errorMessage);

                    // Assert
                    assert.strictEqual($('#swap_token_from_amount').attr('aria-invalid'), undefined);
                    assert.strictEqual($('#swap_token_to_amount').attr('aria-invalid'), 'true');
                    assert.strictEqual($('#swap_error_message_container').css('display'), 'block');
                    assert.strictEqual($('#swap_error_message').text(), errorMessage);
                });

                it('bind view from and to, override', function () {
                    let errorMessage = "Error message!!!";
                    // Act
                    swapStatus.bindViewFromTokenErrorState("first");
                    swapStatus.bindViewToTokenErrorState(errorMessage);

                    // Assert
                    assert.strictEqual($('#swap_token_from_amount').attr('aria-invalid'), 'true');
                    assert.strictEqual($('#swap_token_to_amount').attr('aria-invalid'), 'true');
                    assert.strictEqual($('#swap_error_message_container').css('display'), 'block');
                    assert.strictEqual($('#swap_error_message').text(), errorMessage);
                });


                it('bind view from and then reset', function () {
                    let errorMessage = "Error message!!!";
                    swapStatus.bindViewFromTokenErrorState(errorMessage);

                    // Act
                    swapStatus.resetViewTokenErrorState();

                    // Assert
                    assert.strictEqual($('#swap_token_from_amount').attr('aria-invalid'), undefined);
                    assert.strictEqual($('#swap_token_to_amount').attr('aria-invalid'), undefined);
                    assert.strictEqual($('#swap_error_message_container').css('display'), 'none');
                    assert.strictEqual($('#swap_error_message').text(), '');
                });

                it('bind view to and then reset', function () {
                    let errorMessage = "Error message!!!";
                    swapStatus.bindViewToTokenErrorState(errorMessage);

                    // Act
                    swapStatus.resetViewTokenErrorState();

                    // Assert
                    assert.strictEqual($('#swap_token_from_amount').attr('aria-invalid'), undefined);
                    assert.strictEqual($('#swap_token_to_amount').attr('aria-invalid'), undefined);
                    assert.strictEqual($('#swap_error_message_container').css('display'), 'none');
                    assert.strictEqual($('#swap_error_message').text(), '');
                });

            });
        });


        describe('#swapConfirmationModal', function () {

            describe('#bindViewConfirmationModal()', function () {

                beforeEach(function () {
                    assert.strictEqual($('#swap_token_confirmation_send_amount').text(), '');
                    assert.strictEqual($('#swap_token_confirmation_receive_amount').text(), '');
                    assert.strictEqual($('#swap_token_confirmation_min_receive_amount').text(), '');
                    assert.strictEqual($('#swap_token_confirmation_transaction_deadline').text(), '');
                    assert.strictEqual($('#swap_token_confirmation_gas_limit').text(), '');

                    assert.strictEqual($('#swap_token_confirmation_confirm_button').hasClass('disabled'), true);
                    assert.strictEqual($('#swap_token_confirmation_container').css('display'), 'none');

                    assert.strictEqual($('#swap_token_confirmation_error_message_container').css('display'), 'none');
                    assert.strictEqual($('#swap_token_confirmation_error_message').text(), '');
                });

                it('bind view', function () {
                    let sendAmount = "532.343";
                    let receiveAmount = "5473.27123";
                    let minReceiveAmount = "5445.3462";
                    let transactionDeadline = " ~3 mins (7 blocks)";
                    let gasLimit = "53 ZIL";

                    // Act
                    swapStatus.bindViewConfirmationModal(sendAmount, receiveAmount, minReceiveAmount, transactionDeadline, gasLimit);

                    // Assert
                    assert.strictEqual($('#swap_token_confirmation_send_amount').text(), sendAmount);
                    assert.strictEqual($('#swap_token_confirmation_receive_amount').text(), receiveAmount);
                    assert.strictEqual($('#swap_token_confirmation_min_receive_amount').text(), minReceiveAmount);
                    assert.strictEqual($('#swap_token_confirmation_transaction_deadline').text(), transactionDeadline);
                    assert.strictEqual($('#swap_token_confirmation_gas_limit').text(), gasLimit);

                    assert.strictEqual($('#swap_token_confirmation_confirm_button').hasClass('disabled'), false);
                    assert.strictEqual($('#swap_token_confirmation_container').css('display'), 'table');

                    assert.strictEqual($('#swap_token_confirmation_error_message_container').css('display'), 'none');
                    assert.strictEqual($('#swap_token_confirmation_error_message').text(), '');
                });

                it('bind view error', function () {
                    let errorMessage = "Error!!!";

                    // Act
                    swapStatus.bindViewErrorConfirmationModal(errorMessage);

                    // Assert
                    assert.strictEqual($('#swap_token_confirmation_send_amount').text(), '');
                    assert.strictEqual($('#swap_token_confirmation_receive_amount').text(), '');
                    assert.strictEqual($('#swap_token_confirmation_min_receive_amount').text(), '');
                    assert.strictEqual($('#swap_token_confirmation_transaction_deadline').text(), '');
                    assert.strictEqual($('#swap_token_confirmation_gas_limit').text(), '');

                    assert.strictEqual($('#swap_token_confirmation_confirm_button').hasClass('disabled'), true);
                    assert.strictEqual($('#swap_token_confirmation_container').css('display'), 'none');

                    assert.strictEqual($('#swap_token_confirmation_error_message_container').css('display'), 'block');
                    assert.strictEqual($('#swap_token_confirmation_error_message').text(), errorMessage);
                });

                it('bind view normal and then error', function () {
                    let sendAmount = "532.343";
                    let receiveAmount = "5473.27123";
                    let minReceiveAmount = "5445.3462";
                    let transactionDeadline = " ~3 mins (7 blocks)";
                    let gasLimit = "53 ZIL";
                    swapStatus.bindViewConfirmationModal(sendAmount, receiveAmount, minReceiveAmount, transactionDeadline, gasLimit);

                    // Act
                    let errorMessage = "Error!!!";
                    swapStatus.bindViewErrorConfirmationModal(errorMessage);

                    // Assert
                    assert.strictEqual($('#swap_token_confirmation_confirm_button').hasClass('disabled'), true);
                    assert.strictEqual($('#swap_token_confirmation_container').css('display'), 'none');

                    assert.strictEqual($('#swap_token_confirmation_error_message_container').css('display'), 'block');
                    assert.strictEqual($('#swap_token_confirmation_error_message').text(), errorMessage);
                });
            });
        });

        describe('#bindViewSwapSettings', function () {

            beforeEach(function () {
                assert.strictEqual($('#slippage_tolerance_input').attr('aria-invalid'), undefined);
                assert.strictEqual($('#transaction_deadline_input').attr('aria-invalid'), undefined);
                assert.strictEqual($('#gas_limit_input').attr('aria-invalid'), undefined);


                assert.strictEqual($('#slippage_tolerance_input').val(), swapStatus.defaultSlippageTolerancePercent_.toString());
                assert.strictEqual($('#transaction_deadline_input').val(), swapStatus.defaultTransactionDeadlineMins_.toString());
                assert.strictEqual($('#gas_limit_input').val(), swapStatus.defaultGasLimitZil_.toString());

            });

            it('bind view', function () {
                let slippageTolerancePercent = "32.343";
                let transactionDeadlineMins = "3.3";
                let gasLimitZil = "23";

                // Act
                swapStatus.bindViewSwapSettings(slippageTolerancePercent, transactionDeadlineMins, gasLimitZil);

                // Assert
                assert.strictEqual($('#slippage_tolerance_input').attr('aria-invalid'), undefined);
                assert.strictEqual($('#transaction_deadline_input').attr('aria-invalid'), undefined);
                assert.strictEqual($('#gas_limit_input').attr('aria-invalid'), undefined);

                assert.strictEqual($('#slippage_tolerance_input').val(), slippageTolerancePercent);
                assert.strictEqual($('#transaction_deadline_input').val(), transactionDeadlineMins);
                assert.strictEqual($('#gas_limit_input').val(), gasLimitZil);
            });
        });

        describe('#checkValidityBindViewSwapButton', function () {

            beforeEach(function () {
                assert.strictEqual($('#swap_error_message_2').text(), '');
                assert.strictEqual($('#swap_error_message_2_container').css('display'), 'none');

                assert.strictEqual($('#swap_button').css('display'), 'inline-block');
                assert.strictEqual($('#swap_button').hasClass('disabled'), true);

                assert.strictEqual($('#approve_button').css('display'), 'none');
                assert.strictEqual($('#approve_button').hasClass('disabled'), true);
            });

            describe('#checkValidityBindViewSwapButton simple cases', function () {

                it('bind view invalid condition, buttons remain disabled', function () {
                    // Act
                    swapStatus.checkValidityBindViewSwapButton();

                    // Assert
                    assert.strictEqual($('#swap_error_message_2').text(), '');
                    assert.strictEqual($('#swap_error_message_2_container').css('display'), 'none');

                    assert.strictEqual($('#swap_button').css('display'), 'inline-block');
                    assert.strictEqual($('#swap_button').hasClass('disabled'), true);

                    assert.strictEqual($('#approve_button').css('display'), 'none');
                    assert.strictEqual($('#approve_button').hasClass('disabled'), true);
                });



                it('bind view, wallet is not set', function () {
                    swapStatus.fromTokenTicker_ = 'ZWAP';
                    swapStatus.toTokenTicker_ = 'gZIL';
                    swapStatus.fromTokenAmount_ = 23;
                    swapStatus.toTokenAmount_ = 234;

                    // Act
                    swapStatus.checkValidityBindViewSwapButton();

                    // Assert
                    assert.strictEqual($('#swap_error_message_2').text(), SwapStatus.WALLET_IS_NOT_CONNECTED_STRING);
                    assert.strictEqual($('#swap_error_message_2_container').css('display'), 'block');

                    assert.strictEqual($('#swap_button').css('display'), 'inline-block');
                    assert.strictEqual($('#swap_button').hasClass('disabled'), true);

                    assert.strictEqual($('#approve_button').css('display'), 'none');
                    assert.strictEqual($('#approve_button').hasClass('disabled'), true);
                });
            });

            describe('#checkValidityBindViewSwapButton more complex cases', function () {

                beforeEach(function () {
                    let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
                    let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
                    let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* xcadDexStatus= */ null, walletAddressBase16, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);

                    let zilBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balance":"7476589135982234","nonce":46}}');

                    let duckBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"4231"}}}');
                    let zrcBalanceData = {
                        'DUCK': duckBalanceData,
                    }
                    let duckAllowanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"allowances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85": {"0x459cb2d3baf7e61cfbd5fe362f289ae92b2babb0" : "4851423"}}}}');
                    let zrcAllowanceData = {
                        'DUCK': duckAllowanceData,
                    }

                    let walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletAddressBase16, zilBalanceData, zrcBalanceData, zrcAllowanceData);
                    walletBalanceStatus.computeTokenAllowanceZilswapDexMap('DUCK');
                    walletBalanceStatus.computeTokenBalanceMap('DUCK');

                    swapStatus = new SwapStatus.SwapStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletBalanceStatus);
                });

                it('bind view, zilswap dex not approved', function () {
                    swapStatus.fromTokenTicker_ = 'ZWAP';
                    swapStatus.toTokenTicker_ = 'gZIL';
                    swapStatus.fromTokenAmount_ = 123;
                    swapStatus.toTokenAmount_ = 234;

                    // Act
                    swapStatus.checkValidityBindViewSwapButton();

                    // Assert
                    assert.strictEqual($('#swap_error_message_2').text(), 'Please approve Zilswap DEX to spend your ZWAP.');
                    assert.strictEqual($('#swap_error_message_2_container').css('display'), 'block');

                    assert.strictEqual($('#swap_button').css('display'), 'none');
                    assert.strictEqual($('#swap_button').hasClass('disabled'), true);

                    assert.strictEqual($('#approve_button').css('display'), 'inline-block');
                    assert.strictEqual($('#approve_button').hasClass('disabled'), false);
                });

                it('bind view, zilswap dex not enough allowance', function () {
                    swapStatus.fromTokenTicker_ = 'DUCK';
                    swapStatus.toTokenTicker_ = 'gZIL';
                    swapStatus.fromTokenAmount_ = 1221367781378263123786231983;
                    swapStatus.toTokenAmount_ = 234;

                    // Act
                    swapStatus.checkValidityBindViewSwapButton();

                    // Assert
                    assert.strictEqual($('#swap_error_message_2').text(), 'Not enough allowance for Zilswap DEX to spend your DUCK.');
                    assert.strictEqual($('#swap_error_message_2_container').css('display'), 'block');

                    assert.strictEqual($('#swap_button').css('display'), 'inline-block');
                    assert.strictEqual($('#swap_button').hasClass('disabled'), true);

                    assert.strictEqual($('#approve_button').css('display'), 'none');
                    assert.strictEqual($('#approve_button').hasClass('disabled'), true);
                });

                it('bind view, zilswap dex not enough balance', function () {
                    swapStatus.fromTokenTicker_ = 'DUCK';
                    swapStatus.toTokenTicker_ = 'gZIL';
                    swapStatus.fromTokenAmount_ = 42.32;
                    swapStatus.toTokenAmount_ = 234;
                    swapStatus.fromTokenWalletBalance_ = 42.31;

                    // Act
                    swapStatus.checkValidityBindViewSwapButton();

                    // Assert
                    assert.strictEqual($('#swap_error_message_2').text(), 'Insufficient DUCK balance.');
                    assert.strictEqual($('#swap_error_message_2_container').css('display'), 'block');

                    assert.strictEqual($('#swap_button').css('display'), 'inline-block');
                    assert.strictEqual($('#swap_button').hasClass('disabled'), true);

                    assert.strictEqual($('#approve_button').css('display'), 'none');
                    assert.strictEqual($('#approve_button').hasClass('disabled'), true);
                });


                it('bind view, exact balance', function () {
                    swapStatus.fromTokenTicker_ = 'DUCK';
                    swapStatus.toTokenTicker_ = 'gZIL';
                    swapStatus.fromTokenAmount_ = 42.31;
                    swapStatus.toTokenAmount_ = 234;
                    swapStatus.fromTokenWalletBalance_ = 42.31;

                    // Act
                    swapStatus.checkValidityBindViewSwapButton();

                    // Assert
                    assert.strictEqual($('#swap_error_message_2').text(), '');
                    assert.strictEqual($('#swap_error_message_2_container').css('display'), 'none');

                    assert.strictEqual($('#swap_button').css('display'), 'inline-block');
                    assert.strictEqual($('#swap_button').hasClass('disabled'), false);

                    assert.strictEqual($('#approve_button').css('display'), 'none');
                    assert.strictEqual($('#approve_button').hasClass('disabled'), true);
                });
            });
        });


        describe('#submittedTxnList', function () {

            beforeEach(function () {
                assert.strictEqual($('#transaction_table_container').css('display'), 'none');
                assert.strictEqual($('#transaction_table_list').html(), '');
            });

            it('#getSubmittedTransactionElement()', function () {
                let txnHash = 'abcde';
                let txnDescription = 'abcd → zxcvb';

                // Act
                let elementString = swapStatus.getSubmittedTransactionElement(txnHash, txnDescription);

                // Assert
                assert.strictEqual(elementString.includes("id='" + txnHash + "_spinner'"), true);
                assert.strictEqual(elementString.includes(txnDescription), true);
                assert.strictEqual(elementString.includes("href='https://viewblock.io/zilliqa/tx/0x" + txnHash + "'"), true);
            });

            it('#bindViewAddSubmittedTransaction()', function () {
                let txnHash = 'abcdefghijk';
                let txnDescription = 'abcd → zxcvb';

                let txnHash2 = 'uyefhwgbjgeugh';
                let txnDescription2 = 'gZIL → ZWAP';

                // Act
                swapStatus.bindViewAddSubmittedTransaction(txnHash, txnDescription);

                // Assert
                assert.strictEqual($('#' + txnHash + '_spinner').length, 1);
                assert.strictEqual($('#' + txnHash + '_spinner').html().includes('spinner'), true);
                assert.strictEqual($('#transaction_table_list').html().includes(txnDescription), true);
                assert.strictEqual($('#transaction_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash), true);
                assert.strictEqual($('#transaction_table_list tr').length, 1);
                assert.strictEqual($('#transaction_table_container').css('display'), 'block');

                // Act
                swapStatus.bindViewAddSubmittedTransaction(txnHash2, txnDescription2);
                assert.strictEqual($('#' + txnHash + '_spinner').length, 1);
                assert.strictEqual($('#' + txnHash + '_spinner').html().includes('spinner'), true);
                assert.strictEqual($('#' + txnHash2 + '_spinner').length, 1);
                assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('spinner'), true);
                assert.strictEqual($('#transaction_table_list tr').length, 2);
                assert.strictEqual($('#transaction_table_container').css('display'), 'block');
            });

            it('#bindViewCompletedTransaction()', function () {
                let txnHash = 'abcdefghijk';
                let txnDescription = 'abcd → zxcvb';

                let txnHash2 = 'uyefhwgbjgeugh';
                let txnDescription2 = 'gZIL → ZWAP';

                swapStatus.bindViewAddSubmittedTransaction(txnHash, txnDescription);
                swapStatus.bindViewAddSubmittedTransaction(txnHash2, txnDescription2);

                // Act
                swapStatus.bindViewCompletedTransaction(txnHash2);

                // Assert
                assert.strictEqual($('#' + txnHash + '_spinner').html().includes('spinner'), true);
                assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('spinner'), false);
                assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('fa-check'), true);
                assert.strictEqual($('#transaction_table_list tr').length, 2);
                assert.strictEqual($('#transaction_table_container').css('display'), 'block');

                // Act
                swapStatus.bindViewCompletedTransaction(txnHash);

                assert.strictEqual($('#' + txnHash + '_spinner').html().includes('spinner'), false);
                assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('spinner'), false);
                assert.strictEqual($('#' + txnHash + '_spinner').html().includes('fa-check'), true);
                assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('fa-check'), true);
                assert.strictEqual($('#transaction_table_list tr').length, 2);
                assert.strictEqual($('#transaction_table_container').css('display'), 'block');
            });


            it('#resetViewSubmittedTransaction()', function () {
                let txnHash = 'abcdefghijk';
                let txnDescription = 'abcd → zxcvb';

                let txnHash2 = 'uyefhwgbjgeugh';
                let txnDescription2 = 'gZIL → ZWAP';

                swapStatus.bindViewAddSubmittedTransaction(txnHash, txnDescription);
                swapStatus.bindViewAddSubmittedTransaction(txnHash2, txnDescription2);
                swapStatus.bindViewCompletedTransaction(txnHash2);

                // Act
                swapStatus.resetViewSubmittedTransaction();

                // Act
                assert.strictEqual($('#' + txnHash + '_spinner').length, 0);
                assert.strictEqual($('#' + txnHash2 + '_spinner').length, 0);
                assert.strictEqual($('#transaction_table_list tr').length, 0);
                assert.strictEqual($('#transaction_table_container').css('display'), 'none');
            });
        });


        describe('#swapHistorymodal', function () {

            beforeEach(function () {
                assert.strictEqual($('#swap_history_placeholder').css('display'), 'table-row-group');
                assert.strictEqual($('#swap_history_table_list').html(), '');
            });

            it('placeholder no txn', function () {
                // Assert
                assert.strictEqual($('#swap_history_placeholder').html().includes("No transaction history"), true);
                assert.strictEqual($('#swap_history_placeholder').css('display'), 'table-row-group');
            });

            it('#getSwapHistoryTransactionElement()', function () {
                let txnHash = 'abcdefghijk';
                let txnDescription = 'abcd → zxcvb';
                let txnTimestamp = '5/12/2021 15:32';

                // Act
                let elementString = swapStatus.getSwapHistoryTransactionElement(txnHash, txnDescription, txnTimestamp);

                // Assert
                assert.strictEqual(elementString.includes(txnTimestamp), true);
                assert.strictEqual(elementString.includes(txnDescription), true);
                assert.strictEqual(elementString.includes("href='https://viewblock.io/zilliqa/tx/0x" + txnHash + "'"), true);
            });

            it('#bindViewAddSwapHistory()', function () {
                let txnHash = 'abcdefghijk';
                let txnDescription = 'abcd → zxcvb';
                let txnTimestamp = '5/12/2021 15:32';


                let txnHash2 = 'afgadfgdfgad23rhsfg';
                let txnDescription2 = 'ZWAP → ZLP';
                let txnTimestamp2 = '30/6/2021 17:32';

                // Act
                swapStatus.bindViewAddSwapHistory(txnHash, txnDescription, txnTimestamp);

                // Assert
                assert.strictEqual($('#swap_history_table_list').html().includes(txnTimestamp), true);
                assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription), true);
                assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash), true);
                assert.strictEqual($('#swap_history_table_list tr').length, 1);
                assert.strictEqual($('#swap_history_table_list').css('display'), 'table-row-group');
                assert.strictEqual($('#swap_history_placeholder').css('display'), 'none');

                // Act
                swapStatus.bindViewAddSwapHistory(txnHash2, txnDescription2, txnTimestamp2);

                assert.strictEqual($('#swap_history_table_list').html().includes(txnTimestamp2), true);
                assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription2), true);
                assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), true);
                assert.strictEqual($('#swap_history_table_list tr').length, 2);
                assert.strictEqual($('#swap_history_table_list').css('display'), 'table-row-group');
                assert.strictEqual($('#swap_history_placeholder').css('display'), 'none');
            });

            it('#bindViewAddSwapHistory()', function () {
                let txnHash = 'abcdefghijk';
                let txnDescription = 'abcd → zxcvb';
                let txnTimestamp = '5/12/2021 15:32';

                let txnHash2 = 'afgadfgdfgad23rhsfg';
                let txnDescription2 = 'ZWAP → ZLP';
                let txnTimestamp2 = '30/6/2021 17:32';

                swapStatus.bindViewAddSwapHistory(txnHash, txnDescription, txnTimestamp);
                swapStatus.bindViewAddSwapHistory(txnHash2, txnDescription2, txnTimestamp2);

                // Act
                swapStatus.resetViewSwapHistory();

                // Assert
                assert.strictEqual($('#swap_history_placeholder').css('display'), 'table-row-group');
                assert.strictEqual($('#swap_history_table_list').html(), '');
            });
        });
    });
});