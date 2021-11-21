// bind_view.js
// No dependencies

/**
 * Obtain the contents of a view, parse it into a number, and return the number.
 * 
 * If the view is not parseable as a number, return null.
 * 
 * @returns {?number} The number reprentation of the view content, otherwise null.
 */
function getNumberFromView(viewId) {
    let viewContent = $(viewId + ":first").text();
    return parseFloatFromCommafiedNumberString(viewContent);
}

/**
 * 1 --------------------------------------------------------------------------------
 */

function bindViewLoggedInButton(walletCensoredAddress) {
    $('#topbar_wallet_connect_button').hide();
    $('#topbar_wallet_address').text(walletCensoredAddress);
    $('#topbar_wallet_address_container').show();
}

function bindViewFullWalletAddress(walletFullAddress, walletCensoredAddress) {
    $('#wallet_full_address').text(walletFullAddress);
    $('#wallet_censored_address').text(walletCensoredAddress);
    $('#wallet_full_address').hide();
    $('#wallet_censored_address').show();
    $('.wallet-viewblock-anchor').attr('href', "https://viewblock.io/zilliqa/address/" + walletFullAddress);
    hideFullWalletAddress();
}

function showFullWalletAddress() {
    $('#wallet_censor_icon').removeClass("fa-eye");
    $('#wallet_censor_icon').addClass("fa-eye-slash");
    $('#wallet_full_address').show();
    $('#wallet_censored_address').hide();
}

function hideFullWalletAddress() {
    $('#wallet_censor_icon').removeClass("fa-eye-slash");
    $('#wallet_censor_icon').addClass("fa-eye");
    $('#wallet_full_address').hide();
    $('#wallet_censored_address').show();
}

/**
 * --------------------------------------------------------------------------------
 */

function bindViewMainContainer(zilpayStatus) {
    if (ZilpayStatus.connected === zilpayStatus) {
        $('#main_content_container').show();
        $('#wallet_nft_content_container').show();
        $('.error_wallet_connect_button').hide();
        $('.error_download_zilpay_button').hide();
        $('.error_message_container').hide();
        return;
    } else if (ZilpayStatus.not_installed === zilpayStatus) {
        $('#main_content_container').hide();
        $('#wallet_nft_content_container').hide();
        $('.error_message').html('ZilPay wallet not installed!');
        $('.error_wallet_connect_button').hide();
        $('.error_download_zilpay_button').show();
        $('.error_message_container').show();
        return;
    } else if (ZilpayStatus.locked === zilpayStatus || ZilpayStatus.not_connected === zilpayStatus) {
        $('#main_content_container').hide();
        $('#wallet_nft_content_container').hide();
        $('.error_message').html('ZilPay wallet not connected!');
        $('.error_wallet_connect_button').show();
        $('.error_download_zilpay_button').hide();
        $('.error_message_container').show();
        return;
    } else if (ZilpayStatus.not_mainnet === zilpayStatus) {
        $('#main_content_container').hide();
        $('#wallet_nft_content_container').hide();
        $('.error_message').html('Please switch to mainnet!');
        $('.error_wallet_connect_button').hide();
        $('.error_download_zilpay_button').hide();
        $('.error_message_container').show();
        return;
    }
    // Should not reach here.
    $('#main_content_container').hide();
    $('#wallet_nft_content_container').hide();
    $('.error_message').html('Unknown Error! Please contact zilWatch team on <a href="https://t.me/zilWatch_community">Telegram</a>!');
    $('.error_message_container').show();
}

function resetMainContainerContent() {
    $('.tooltip-container').removeClass('hover-effect');

    // Spinner
    $('.wallet-balance-spinner').hide();
    $('.lp-balance-spinner').hide();
    $('.staking-balance-spinner').hide();
    $('.net-worth-spinner').hide();

    walletBalanceProcessingCounter = 0;
    lpBalanceProcessingCounter = 0;
    stakingBalanceProcessingCounter = 0;
    netWorthProcessingCounter = 0;
}

/**
 * --------------------------------------------------------------------------------
 */

function bindViewPercentChangeColorContainer(containerId, percentChangeValue) {
    let isZeroResult = isStringZero(percentChangeValue);
    if (isZeroResult === null || isZeroResult === true) {
        $(containerId).removeClass('positive-green negative-red');
        $(containerId).addClass('text-secondary');
    } else if (isStartsWithNegative(percentChangeValue)) {
        $(containerId).removeClass('text-secondary positive-green');
        $(containerId).addClass('negative-red');
    } else {
        $(containerId).removeClass('text-secondary negative-red');
        $(containerId).addClass('positive-green');
    }
}

/**
 * 5 ----------------------------------------------------------------------------- 5
 */

// Global cache spinner counter 
var walletBalanceProcessingCounter = 0;
var lpBalanceProcessingCounter = 0;
var stakingBalanceProcessingCounter = 0;
var netWorthProcessingCounter = 0;
var fullPriceChartProcessingCounter = 0;

function incrementShowSpinnerWalletBalance() {
    walletBalanceProcessingCounter++;
    if (walletBalanceProcessingCounter > 0) {
        $('.wallet-balance-spinner').show();
    }
    incrementShowSpinnerNetWorth();
}

function decrementShowSpinnerWalletBalance() {
    walletBalanceProcessingCounter--;
    if (walletBalanceProcessingCounter <= 0) {
        walletBalanceProcessingCounter = 0;
        $('.wallet-balance-spinner').hide();
    }
    decrementShowSpinnerNetWorth();
}

function incrementShowSpinnerLpBalance() {
    lpBalanceProcessingCounter++;
    if (lpBalanceProcessingCounter > 0) {
        $('.lp-balance-spinner').show();
    }
    incrementShowSpinnerNetWorth();
}

function decrementShowSpinnerLpBalance() {
    lpBalanceProcessingCounter--;
    if (lpBalanceProcessingCounter <= 0) {
        lpBalanceProcessingCounter = 0;
        $('.lp-balance-spinner').hide();
    }
    decrementShowSpinnerNetWorth();
}

function incrementShowSpinnerStakingBalance() {
    stakingBalanceProcessingCounter++;
    if (stakingBalanceProcessingCounter > 0) {
        $('.staking-balance-spinner').show();
    }
    incrementShowSpinnerNetWorth();
}

function decrementShowSpinnerStakingBalance() {
    stakingBalanceProcessingCounter--;
    if (stakingBalanceProcessingCounter <= 0) {
        stakingBalanceProcessingCounter = 0;
        $('.staking-balance-spinner').hide();
    }
    decrementShowSpinnerNetWorth();
}

function incrementShowSpinnerNetWorth() {
    netWorthProcessingCounter++;
    if (netWorthProcessingCounter > 0) {
        $('.net-worth-spinner').show();
    }
}

function decrementShowSpinnerNetWorth() {
    netWorthProcessingCounter--;
    if (netWorthProcessingCounter <= 0) {
        netWorthProcessingCounter = 0;
        $('.net-worth-spinner').hide();
    }
}

function incrementShowSpinnerFullPriceChart() {
    fullPriceChartProcessingCounter++;
    if (fullPriceChartProcessingCounter > 0) {
        $('.full-price-chart-spinner').show();
    }
}

function decrementShowSpinnerFullPriceChart() {
    fullPriceChartProcessingCounter--;
    if (fullPriceChartProcessingCounter <= 0) {
        fullPriceChartProcessingCounter = 0;
        $('.full-price-chart-spinner').hide();
    }
}

/**
 * --------------------------------------------------------------------------------
 */


if (typeof exports !== 'undefined') {

    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }

    if (typeof ZilpayStatus === 'undefined') {
        ZilpayUtils = require('./zilpay_utils.js');
        ZilpayStatus = ZilpayUtils.ZilpayStatus;
    }

    if (typeof zrcTokenPropertiesListMap === 'undefined') {
        Constants = require('../../constants.js');
        zrcTokenPropertiesListMap = Constants.zrcTokenPropertiesListMap;
    }

    if (typeof ssnListMap === 'undefined') {
        Constants = require('../../constants.js');
        ssnListMap = Constants.ssnListMap;
    }

    if (typeof parseFloatFromCommafiedNumberString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        parseFloatFromCommafiedNumberString = FormattingUtils.parseFloatFromCommafiedNumberString;
        isStringZero = FormattingUtils.isStringZero;
        isStartsWithNegative = FormattingUtils.isStartsWithNegative;
    }

    if (typeof onTouchStartOrMouseOverTooltipFunction === 'undefined') {
        TooltipTouchHover = require('./tooltip_touch_hover.js');
        onTouchStartOrMouseOverTooltipFunction = TooltipTouchHover.onTouchStartOrMouseOverTooltipFunction;
    }

    // 1
    exports.getNumberFromView = getNumberFromView;

    exports.bindViewLoggedInButton = bindViewLoggedInButton;
    exports.bindViewFullWalletAddress = bindViewFullWalletAddress;
    exports.showFullWalletAddress = showFullWalletAddress;
    exports.hideFullWalletAddress = hideFullWalletAddress;

    exports.bindViewMainContainer = bindViewMainContainer;
    exports.resetMainContainerContent = resetMainContainerContent;

    // 4
    exports.bindViewPercentChangeColorContainer = bindViewPercentChangeColorContainer;

    // 5
    exports.incrementShowSpinnerWalletBalance = incrementShowSpinnerWalletBalance;
    exports.decrementShowSpinnerWalletBalance = decrementShowSpinnerWalletBalance;
    exports.incrementShowSpinnerLpBalance = incrementShowSpinnerLpBalance;
    exports.decrementShowSpinnerLpBalance = decrementShowSpinnerLpBalance;
    exports.incrementShowSpinnerStakingBalance = incrementShowSpinnerStakingBalance;
    exports.decrementShowSpinnerStakingBalance = decrementShowSpinnerStakingBalance;
    exports.incrementShowSpinnerNetWorth = incrementShowSpinnerNetWorth;
    exports.decrementShowSpinnerNetWorth = decrementShowSpinnerNetWorth;
}