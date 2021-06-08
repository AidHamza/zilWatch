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

function setThemeLightMode() {
    $("html").removeClass("dark-mode");
    $("#toggle_theme_icon").removeClass("fa-sun-o");
    $("#toggle_theme_icon").addClass("fa-moon-o");
    $("img").each(function () {
        let imgSrc = this.src;
        if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
            let darkQueryIndex = imgSrc.indexOf("?t=dark");
            if (darkQueryIndex !== -1) {
                this.src = imgSrc.substr(0, darkQueryIndex);
            }
        } else if (imgSrc.indexOf("viewblock-dark") !== -1) {
            this.src = imgSrc.replace("viewblock-dark.png", "viewblock-light.png");
        }
    });
}

function setThemeDarkMode() {
    $("html").addClass("dark-mode");
    $("#toggle_theme_icon").removeClass("fa-moon-o");
    $("#toggle_theme_icon").addClass("fa-sun-o");
    $("img").each(function () {
        let imgSrc = this.src;
        if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
            this.src = imgSrc + "?t=dark";
        } else if (imgSrc.indexOf("viewblock-light.png") !== -1) {
            this.src = imgSrc.replace("viewblock-light.png", "viewblock-dark.png");
        }
    });
}

/**
 * --------------------------------------------------------------------------------
 */

function bindViewLoggedInButton(walletAddress) {
    $('#wallet_connect').hide();
    $('#wallet_address').text(walletAddress);
    $('#wallet_address').show();
    $('#wallet_refresh').show();
}

function bindViewMainContainer(zilpayStatus) {
    if (ZilpayStatus.connected === zilpayStatus) {
        $('#main_content_container').show();
        $('#error_message_container').hide();
        return;
    } else if (ZilpayStatus.not_installed === zilpayStatus) {
        $('#main_content_container').hide();
        $('#error_message').html('ZilPay not installed! <a href="https://zilpay.io">Download here</a>');
        $('#error_message_container').show();
        return;
    } else if (ZilpayStatus.locked === zilpayStatus || ZilpayStatus.not_connected === zilpayStatus) {
        $('#main_content_container').hide();
        $('#error_message').html('Please connect to ZilPay! (top right button)');
        $('#error_message_container').show();
        return;
    } else if (ZilpayStatus.not_mainnet === zilpayStatus) {
        $('#main_content_container').hide();
        $('#error_message').html('Please switch to mainnet!');
        $('#error_message_container').show();
        return;
    }
    // Should not reach here.
    $('#main_content_container').hide();
    $('#error_message').html('Unknown Error! Please contact zilWatch team on <a href="https://t.me/zilWatch_community">Telegram</a>!');
    $('#error_message_container').show();
}

function resetMainContainerContent() {
    $('#lp_container').hide();
    $('#total_all_lp_reward_next_epoch_container').hide();

    for (let ticker in zrcTokenPropertiesListMap) {
        $('#' + ticker + '_lp_pool_reward_zwap').text('');
        $('#' + ticker + '_lp_pool_reward_zwap_unit').text('');
    }

    $('#total_all_lp_reward_next_epoch_zwap').text('Loading...');
    $('#total_all_lp_reward_next_epoch_fiat').text('Loading...');
    $('#total_all_lp_reward_prev_epoch_zwap').text('Loading...');
    $('#total_all_lp_reward_prev_epoch_fiat').text('Loading...');
    $('#total_all_lp_reward_prev_epoch_number').text('');

    $('.tooltip-container').removeClass('hover-effect');
    $('#total_all_lp_reward_past_epoch_container').removeClass('hover-effect');
    disableTooltipPastTotalRewardAllLpZwap();
    clearViewPastTotalRewardAllLpZwap();

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
 * 2 --------------------------------------------------------------------------------
 */

function bindViewZwapRewardLp(zwapRewardString, ticker) {
    $('#' + ticker + '_lp_pool_reward_zwap').text(zwapRewardString);
    $('#' + ticker + '_lp_pool_reward_zwap_unit').text('ZWAP');
}

/**
 * 4 --------------------------------------------------------------------------------
 * This is mainly total ZWAP LP reward card
 */

function bindViewTotalRewardAllLpZwap(totalRewardZwapString) {
    $('#total_all_lp_reward_next_epoch_zwap').text(totalRewardZwapString);
    $('#total_all_lp_reward_next_epoch_container').show();
    $('#lp_container').show();
}

function bindViewTotalRewardAllLpFiat(totalAllLpRewardFiat) {
    $('#total_all_lp_reward_next_epoch_fiat').text(totalAllLpRewardFiat);
}

function bindViewPrevTotalRewardAllLpZwap(prevEpochNumber, prevTotalRewardZwapString) {
    $('#total_all_lp_reward_prev_epoch_number').text(prevEpochNumber);
    $('#total_all_lp_reward_prev_epoch_zwap').text(prevTotalRewardZwapString);
}

function bindViewPrevTotalRewardAllLpFiat(prevTotalAllLpRewardFiat) {
    $('#total_all_lp_reward_prev_epoch_fiat').text(prevTotalAllLpRewardFiat);
}

function disableTooltipPastTotalRewardAllLpZwap() {
    $('#total_all_lp_reward_past_epoch_container').removeClass('hover-effect');
    $('#total_all_lp_reward_past_epoch_container').removeClass('tooltip-container');
    $('#total_all_lp_reward_past_epoch_container').off('touchstart');
    $('#total_all_lp_reward_past_epoch_container').off('mouseover');
}

function enableTooltipPastTotalRewardAllLpZwap() {
    $('#total_all_lp_reward_past_epoch_container').addClass('tooltip-container');
    $('#total_all_lp_reward_past_epoch_container').on('touchstart mouseover', onTouchStartOrMouseOverTooltipFunction);
}

function clearViewPastTotalRewardAllLpZwap() {
    $('#total_all_lp_reward_past_epoch_tooltip_content').hide();
    $('#total_all_lp_reward_past_epoch_tooltip_content').empty();
}

function addViewPastTotalRewardAllLpZwap(element) {
    $('#total_all_lp_reward_past_epoch_tooltip_content').append(element);
}

function bindViewPastTotalRewardAllLpFiat(functionComputeRewardBalance) {
    $('.past_lp_reward_fiat').each(function () {
        let currentId = $(this).attr('id');
        let zwapAmountId = currentId.replace("fiat", "zwap");

        let rewardBalance = getNumberFromView('#' + zwapAmountId);
        if (!rewardBalance) {
            return;
        }

        let rewardBalanceFiatString = functionComputeRewardBalance(rewardBalance);
        $(this).text(rewardBalanceFiatString);
    });
}

// Exception, no need reset
function bindViewLpNextEpochCounter(timeDurationString) {
    $('#lp_reward_next_epoch_duration_counter').text(timeDurationString);
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
        Constants = require('../constants.js');
        zrcTokenPropertiesListMap = Constants.zrcTokenPropertiesListMap;
    }

    if (typeof ssnListMap === 'undefined') {
        Constants = require('../constants.js');
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

    exports.setThemeLightMode = setThemeLightMode;
    exports.setThemeDarkMode = setThemeDarkMode;

    exports.bindViewLoggedInButton = bindViewLoggedInButton;
    exports.bindViewMainContainer = bindViewMainContainer;
    exports.resetMainContainerContent = resetMainContainerContent;

    // 2
    exports.bindViewZwapRewardLp = bindViewZwapRewardLp;

    // 4
    exports.bindViewTotalRewardAllLpZwap = bindViewTotalRewardAllLpZwap;
    exports.bindViewTotalRewardAllLpFiat = bindViewTotalRewardAllLpFiat;

    exports.bindViewPrevTotalRewardAllLpZwap = bindViewPrevTotalRewardAllLpZwap;
    exports.bindViewPrevTotalRewardAllLpFiat = bindViewPrevTotalRewardAllLpFiat;

    exports.enableTooltipPastTotalRewardAllLpZwap = enableTooltipPastTotalRewardAllLpZwap;
    exports.disableTooltipPastTotalRewardAllLpZwap = disableTooltipPastTotalRewardAllLpZwap;
    exports.clearViewPastTotalRewardAllLpZwap = clearViewPastTotalRewardAllLpZwap;
    exports.addViewPastTotalRewardAllLpZwap = addViewPastTotalRewardAllLpZwap;
    exports.bindViewPastTotalRewardAllLpFiat = bindViewPastTotalRewardAllLpFiat;

    exports.bindViewLpNextEpochCounter = bindViewLpNextEpochCounter;

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