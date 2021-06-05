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

    $('#wallet_balance_zil_24h_ago').text('');
    $('#wallet_balance_zil_percent_change_24h').text('');
    $('#wallet_balance_fiat_24h_ago').text('');
    $('#wallet_balance_fiat_percent_change_24h').text('');
    $('#wallet_balance_zil').text('Loading...');
    $('#wallet_balance_fiat').text('Loading...');

    $('#lp_balance_zil_24h_ago').text('');
    $('#lp_balance_zil_percent_change_24h').text('');
    $('#lp_balance_fiat_24h_ago').text('');
    $('#lp_balance_fiat_percent_change_24h').text('');
    $('#lp_balance_zil').text('Loading...');
    $('#lp_balance_fiat').text('Loading...');

    $('#staking_balance_zil_24h_ago').text('');
    $('#staking_balance_zil_percent_change_24h').text('');
    $('#staking_balance_fiat_24h_ago').text('');
    $('#staking_balance_fiat_percent_change_24h').text('');
    $('#staking_balance_zil').text('Loading...');
    $('#staking_balance_fiat').text('Loading...');

    $('#net_worth_zil_24h_ago').text('');
    $('#net_worth_zil_percent_change_24h').text('');
    $('#net_worth_fiat_24h_ago').text('');
    $('#net_worth_fiat_percent_change_24h').text('');
    $('#net_worth_zil').text('Loading...');
    $('#net_worth_fiat').text('Loading...');

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

// Exception, no need reset
function bindViewTotalTradeVolumeZil(totalVolumeZil, ticker) {
    $('#' + ticker + '_lp_total_volume_zil').text(totalVolumeZil);
}

// Exception, no need reset
function bindViewTotalTradeVolumeFiat(totalVolumeFiat, ticker) {
    $('#' + ticker + '_lp_total_volume_fiat').text(totalVolumeFiat);
}

function bindViewZwapRewardLp(zwapRewardString, ticker) {
    $('#' + ticker + '_lp_pool_reward_zwap').text(zwapRewardString);
    $('#' + ticker + '_lp_pool_reward_zwap_unit').text('ZWAP');
}

// Exception, no need reset
function bindViewZrcTokenCirculatingSupply(zrcTokenCirculatingSupply, ticker) {
    $('#' + ticker + '_circulating_supply_zrc').text(zrcTokenCirculatingSupply);
}

// Exception, no need reset
function bindViewZrcTokenCirculatingSupplyFiat(zrcTokenCirculatingSupplyFiat, ticker) {
    $('#' + ticker + '_circulating_supply_fiat').text(zrcTokenCirculatingSupplyFiat);
}

// Exception, no need reset
function bindViewZrcTokenTotalSupply(zrcTokenTotalSupply, ticker) {
    $('#' + ticker + '_total_supply_zrc').text(zrcTokenTotalSupply);
}

// Exception, no need reset
function bindViewZrcTokenTotalSupplyFiat(zrcTokenTotalSupplyFiat, ticker) {
    $('#' + ticker + '_total_supply_fiat').text(zrcTokenTotalSupplyFiat);
}

/**
 * 3 --------------------------------------------------------------------------------
 */

function bindViewTotalWalletBalanceZil24hAgo(totalWalletBalanceZil24hAgo, totalWalletBalanceZilPercentChange24h) {
    $('#wallet_balance_zil_24h_ago').text(totalWalletBalanceZil24hAgo);
    $('#wallet_balance_zil_percent_change_24h').text(totalWalletBalanceZilPercentChange24h);
    bindViewPercentChangeColorContainer('#wallet_balance_zil_percent_change_24h_container', totalWalletBalanceZilPercentChange24h);
}

function bindViewTotalWalletBalanceZil(totalWalletBalanceZil) {
    $('#wallet_balance_zil').text(totalWalletBalanceZil);
}

function bindViewTotalWalletBalanceFiat24hAgo(totalWalletBalanceFiat24hAgo, totalWalletBalanceFiatPercentChange24h) {
    $('#wallet_balance_fiat_24h_ago').text(totalWalletBalanceFiat24hAgo);
    $('#wallet_balance_fiat_percent_change_24h').text(totalWalletBalanceFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#wallet_balance_fiat_percent_change_24h_container', totalWalletBalanceFiatPercentChange24h);
}

function bindViewTotalWalletBalanceFiat(totalWalletBalanceFiat) {
    $('#wallet_balance_fiat').text(totalWalletBalanceFiat);
}

function bindViewTotalLpBalanceZil24hAgo(totalLpBalanceZil24hAgo, totalLpBalanceZilPercentChange24h) {
    $('#lp_balance_zil_24h_ago').text(totalLpBalanceZil24hAgo);
    $('#lp_balance_zil_percent_change_24h').text(totalLpBalanceZilPercentChange24h);
    bindViewPercentChangeColorContainer('#lp_balance_zil_percent_change_24h_container', totalLpBalanceZilPercentChange24h);
}

function bindViewTotalLpBalanceZil(totalLpBalanceZil) {
    $('#lp_balance_zil').text(totalLpBalanceZil);
}

function bindViewTotalLpBalanceFiat24hAgo(totalLpBalanceFiat24hAgo, totalLpBalanceFiatPercentChange24h) {
    $('#lp_balance_fiat_24h_ago').text(totalLpBalanceFiat24hAgo);
    $('#lp_balance_fiat_percent_change_24h').text(totalLpBalanceFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#lp_balance_fiat_percent_change_24h_container', totalLpBalanceFiatPercentChange24h);
}

function bindViewTotalLpBalanceFiat(totalLpBalanceFiat) {
    $('#lp_balance_fiat').text(totalLpBalanceFiat);
}

function bindViewTotalStakingBalanceZil24hAgo(totalStakingBalanceZil24hAgo, totalStakingBalanceZilPercentChange24h) {
    $('#staking_balance_zil_24h_ago').text(totalStakingBalanceZil24hAgo);
    $('#staking_balance_zil_percent_change_24h').text(totalStakingBalanceZilPercentChange24h);
    bindViewPercentChangeColorContainer('#staking_balance_zil_percent_change_24h_container', totalStakingBalanceZilPercentChange24h);
}

function bindViewTotalStakingBalanceZil(totalStakingBalanceZil) {
    $('#staking_balance_zil').text(totalStakingBalanceZil);
}

function bindViewTotalStakingBalanceFiat24hAgo(totalStakingBalanceFiat24hAgo, totalStakingBalanceFiatPercentChange24h) {
    $('#staking_balance_fiat_24h_ago').text(totalStakingBalanceFiat24hAgo);
    $('#staking_balance_fiat_percent_change_24h').text(totalStakingBalanceFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#staking_balance_fiat_percent_change_24h_container', totalStakingBalanceFiatPercentChange24h);
}

function bindViewTotalStakingBalanceFiat(totalStakingBalanceFiat) {
    $('#staking_balance_fiat').text(totalStakingBalanceFiat);
}

function bindViewTotalNetWorthZil24hAgo(totalNetWorthZil24hAgo, totalNetWorthZilPercentChange24h) {
    $('#net_worth_zil_24h_ago').text(totalNetWorthZil24hAgo);
    $('#net_worth_zil_percent_change_24h').text(totalNetWorthZilPercentChange24h);
    bindViewPercentChangeColorContainer('#net_worth_zil_percent_change_24h_container', totalNetWorthZilPercentChange24h);
}

function bindViewTotalNetWorthZil(totalNetWorthZil) {
    $('#net_worth_zil').text(totalNetWorthZil);
}

function bindViewTotalNetWorthFiat24hAgo(totalNetWorthFiat24hAgo, totalNetWorthFiatPercentChange24h) {
    $('#net_worth_fiat_24h_ago').text(totalNetWorthFiat24hAgo);
    $('#net_worth_fiat_percent_change_24h').text(totalNetWorthFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#net_worth_fiat_percent_change_24h_container', totalNetWorthFiatPercentChange24h);
}

function bindViewTotalNetWorthFiat(totalNetWorthFiat) {
    $('#net_worth_fiat').text(totalNetWorthFiat);
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
    exports.bindViewTotalTradeVolumeZil = bindViewTotalTradeVolumeZil;
    exports.bindViewTotalTradeVolumeFiat = bindViewTotalTradeVolumeFiat;

    exports.bindViewZwapRewardLp = bindViewZwapRewardLp;

    exports.bindViewZrcTokenCirculatingSupply = bindViewZrcTokenCirculatingSupply;
    exports.bindViewZrcTokenCirculatingSupplyFiat = bindViewZrcTokenCirculatingSupplyFiat;
    exports.bindViewZrcTokenTotalSupply = bindViewZrcTokenTotalSupply;
    exports.bindViewZrcTokenTotalSupplyFiat = bindViewZrcTokenTotalSupplyFiat;

    // 3
    exports.bindViewTotalWalletBalanceZil24hAgo = bindViewTotalWalletBalanceZil24hAgo;
    exports.bindViewTotalWalletBalanceZil = bindViewTotalWalletBalanceZil;
    exports.bindViewTotalWalletBalanceFiat24hAgo = bindViewTotalWalletBalanceFiat24hAgo;
    exports.bindViewTotalWalletBalanceFiat = bindViewTotalWalletBalanceFiat;
    exports.bindViewTotalLpBalanceZil24hAgo = bindViewTotalLpBalanceZil24hAgo;
    exports.bindViewTotalLpBalanceZil = bindViewTotalLpBalanceZil;
    exports.bindViewTotalLpBalanceFiat24hAgo = bindViewTotalLpBalanceFiat24hAgo;
    exports.bindViewTotalLpBalanceFiat = bindViewTotalLpBalanceFiat;
    exports.bindViewTotalStakingBalanceZil24hAgo = bindViewTotalStakingBalanceZil24hAgo;
    exports.bindViewTotalStakingBalanceZil = bindViewTotalStakingBalanceZil;
    exports.bindViewTotalStakingBalanceFiat24hAgo = bindViewTotalStakingBalanceFiat24hAgo;
    exports.bindViewTotalStakingBalanceFiat = bindViewTotalStakingBalanceFiat;
    exports.bindViewTotalNetWorthZil24hAgo = bindViewTotalNetWorthZil24hAgo;
    exports.bindViewTotalNetWorthZil = bindViewTotalNetWorthZil;
    exports.bindViewTotalNetWorthFiat24hAgo = bindViewTotalNetWorthFiat24hAgo;
    exports.bindViewTotalNetWorthFiat = bindViewTotalNetWorthFiat;

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