/** For popover tooltips for swap related functions. */
$(function () {
    $("[data-toggle=popover]").popover({
        html: true,
        sanitize: false,
        content: function () {
            var content = $(this).attr("data-popover-content");
            return $(content).children(".popover-body").html();
        },
        title: function () {
            var title = $(this).attr("data-popover-content");
            return $(title).children(".popover-heading").html();
        }
    });
});

/** For swap related settings. */
$('#swap_token_settings_modal').on('hidden.bs.modal', function (e) {
    swapStatus.dismissSettingsWithoutSave();
});

$('#swap_token_settings_save').on('click', function () {
    let slippageTolerancePercent = $('#slippage_tolerance_input').val();
    let transactionDeadlineMins = $('#transaction_deadline_input').val();
    let gasLimitZil = $('#gas_limit_input').val();
    swapStatus.saveSettings(slippageTolerancePercent, transactionDeadlineMins, gasLimitZil);
    $('#swap_token_settings_modal').modal('hide');
});

$('#swap_token_settings_reset').on('click', function () {
    swapStatus.resetSettingsWithoutSave();
});

// Slippage tolerance quick button
$('.slippage-tolerance-quick-button').on('click', function () {
    let currValueString = $(this).text();
    // Remove the '%'
    let currValueNumber = currValueString.substr(0, currValueString.indexOf('%'));
    $('#slippage_tolerance_input').val(currValueNumber);
    $('#slippage_tolerance_input').trigger('input');
});
$('#slippage_tolerance_input').on('input', function () {
    let currValueNumber = parseFloat($(this).val());

    $('.slippage-tolerance-quick-button').each(function () {
        let quickButtonString = $(this).text();
        // Remove the '%'
        let quickButtonNumber = parseFloat(quickButtonString.substr(0, quickButtonString.indexOf('%')));
        if (quickButtonNumber === currValueNumber) {
            $(this).addClass('swap-mini-button-box-highlight');
        } else {
            $(this).removeClass('swap-mini-button-box-highlight')
        }
    });
});

// Transaction deadline quick button
$('.transaction-deadline-quick-button').on('click', function () {
    let quickButtonString = $(this).text();
    // Remove the ' mins'
    let currValueNumber = quickButtonString.substr(0, quickButtonString.indexOf(' '));
    $('#transaction_deadline_input').val(currValueNumber);
    $('#transaction_deadline_input').trigger('input');
});
$('#transaction_deadline_input').on('input', function () {
    let currValueNumber = parseFloat($(this).val());

    $('.transaction-deadline-quick-button').each(function () {
        let quickButtonString = $(this).text();
        // Remove the ' mins'
        let quickButtonNumber = parseFloat(quickButtonString.substr(0, quickButtonString.indexOf(' ')));
        if (quickButtonNumber === currValueNumber) {
            $(this).addClass('swap-mini-button-box-highlight');
        } else {
            $(this).removeClass('swap-mini-button-box-highlight')
        }
    });
});

// Gas limit quick button
$('.gas-limit-quick-button').on('click', function () {
    let quickButtonString = $(this).text();
    // Remove the ' ZIL'
    let currValueNumber = quickButtonString.substr(0, quickButtonString.indexOf(' '));
    $('#gas_limit_input').val(currValueNumber);
    $('#gas_limit_input').trigger('input');
});

$('#gas_limit_input').on('input', function () {
    let currValueNumber = parseFloat($(this).val());

    $('.gas-limit-quick-button').each(function () {
        let quickButtonString = $(this).text();
        // Remove the ' mins'
        let quickButtonNumber = parseFloat(quickButtonString.substr(0, quickButtonString.indexOf(' ')));
        if (quickButtonNumber === currValueNumber) {
            $(this).addClass('swap-mini-button-box-highlight');
        } else {
            $(this).removeClass('swap-mini-button-box-highlight')
        }
    });
});

/** For swap related token picker. */
$('#swap_select_token_from').on('click', function () {
    swapStatus.openFromTokenSelector();
    $('#swap_token_picker_modal').modal('show');
});

$('#swap_select_token_to').on('click', function () {
    swapStatus.openToTokenSelector();
    $('#swap_token_picker_modal').modal('show');
});

$('.token-list-row').on('click', function () {
    let ticker = $(this).attr('data-ticker');
    swapStatus.setTokenSelector(ticker);
    $('#swap_token_picker_modal').modal('hide');
});

$('#swap_token_picker_modal').on('hidden.bs.modal', function (e) {
    swapStatus.dismissTokenSelectorWithoutSave();
});

/** Swap related amount */
$('#swap_token_from_amount').on('input', function () {
    let invalid = instantValidation($(this));
    if (invalid) {
        return;
    }
    swapStatus.processFromTokenAmount($(this).val());
});

$('#swap_token_to_amount').on('input', function () {
    let invalid = instantValidation($(this));
    if (invalid) {
        return;
    }
    swapStatus.processToTokenAmount($(this).val());
});

$('#swap_arrow_down_toggle_direction').on('click', function () {
    swapStatus.toggleTokenDirection();
});

/** Swap from token max button */
$('#swap_token_from_max_balance_button').on('click', function () {
    swapStatus.setMaxWalletBalanceFromTokenAmount();
});

/** Inverse price button */
$('#swap_token_final_rate_inverse_button').on('click', function () {
    swapStatus.toggleViewTokenPriceFinal();
});

$('.swap-settings-input').on('input', function () {
    instantValidation($(this));
});

/** Swap button press */
$('#swap_button').on('click', function () {
    swapStatus.setConfirmationModal();
    $('#swap_token_confirmation_modal').modal('show');
});

$('#approve_button').on('click', function () {
    swapStatus.increaseAllowanceToZilswapDex();
});

$('#swap_token_confirmation_confirm_button').on('click', function () {
    swapStatus.executeSwap();
    $('#swap_token_confirmation_modal').modal('hide');
});

/** Swap history clear history button */
$('#swap_history_reset').on('click', function () {
    swapStatus.clearSwapHistoryFromLocalStorage();
});