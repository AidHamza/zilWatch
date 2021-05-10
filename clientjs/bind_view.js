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
    let contentInNumber = parseFloatFromCommafiedNumberString(viewContent);
    if (!contentInNumber) {
        return null;
    }
    return contentInNumber;
}

/**
 * --------------------------------------------------------------------------------
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
    $('#staking_container').hide();
    $('#total_all_lp_reward_next_epoch_container').hide();

    $('#zil_balance').text('Loading...');
    $('#zil_balance_fiat').text('');

    for (let ticker in zrcTokenPropertiesListMap) {
        $('#' + ticker + '_container').hide();
        $('#' + ticker + '_price_zil').text('Loading...');
        $('#' + ticker + '_price_fiat').text('Loading...');
        $('#' + ticker + '_balance').text('Loading...');

        $('#public_' + ticker + '_price_zil').text('Loading...');
        $('#' + ticker + '_lp_total_pool_zil').text('Loading...');
        $('#' + ticker + '_lp_total_pool_zrc').text('Loading...');
        $('#' + ticker + '_lp_total_pool_fiat').text('Loading...');

        $('#' + ticker + '_lp_container').hide();
        $('#' + ticker + '_lp_pool_share_percent').text('Loading...');
        $('#' + ticker + '_lp_zil_balance').text('');
        $('#' + ticker + '_lp_token_balance').text('');
        $('#' + ticker + '_lp_pool_reward_zwap').text('');
        $('#' + ticker + '_lp_pool_reward_zwap_unit').text('');
        $('#' + ticker + '_balance_zil').text('Loading...');
        $('#' + ticker + '_balance_fiat').text('Loading...');
        $('#' + ticker + '_lp_balance_fiat').text('Loading...');
    }

    $('#zil_staking_withdrawal_pending_container').hide();
    $('#carbon_staking_container').hide();
    for (let ssnAddress in ssnListMap) {
        $('#' + ssnAddress + '_zil_staking_container').hide();
        $('#' + ssnAddress + '_zil_staking_balance').text('Loading...');
        $('#' + ssnAddress + '_zil_staking_balance_fiat').text('Loading...');
    }
    $('#zil_staking_withdrawal_pending_balance').text('Loading...');
    $('#zil_staking_withdrawal_pending_balance_fiat').text('Loading...');
    $('#carbon_staking_balance').text('Loading...');
    $('#carbon_staking_balance_zil').text('Loading...');
    $('#carbon_staking_balance_fiat').text('Loading...');

    $('#lp_reward_next_epoch_duration_counter').text('');
    $('#total_all_lp_reward_next_epoch_zwap').text('Loading...');
    $('#total_all_lp_reward_next_epoch_fiat').text('Loading...');

    $('#wallet_balance_zil').text('Loading...');
    $('#wallet_balance_fiat').text('Loading...');

    $('#lp_balance_zil').text('Loading...');
    $('#lp_balance_fiat').text('Loading...');

    $('#staking_balance_zil').text('Loading...');
    $('#staking_balance_fiat').text('Loading...');

    $('#net_worth_zil').text('Loading...');
    $('#net_worth_fiat').text('Loading...');
}

/**
 * --------------------------------------------------------------------------------
 */

// Exception, no need to reset
function bindViewZilPriceInFiat(currencySymbol, zilPriceInFiat) {
    $(".zil_price_fiat").text(zilPriceInFiat);
    $(".currency_symbol").text(currencySymbol);
}

function bindViewZilBalance(zilBalance) {
    $('#zil_balance').text(zilBalance);
}

function bindViewZrcTokenPriceInZil(publicZrcTokenPriceInZil, zrcTokenPriceInZil, ticker) {
    $('#public_' + ticker + '_price_zil').text(publicZrcTokenPriceInZil);
    $('#' + ticker + '_price_zil').text(zrcTokenPriceInZil);
}

function bindViewZrcTokenPriceInFiat(zrcTokenPriceInFiat, ticker) {
    $('#' + ticker + '_price_fiat').text(zrcTokenPriceInFiat);
}

function bindViewZrcTokenWalletBalance(zrcTokenBalance, ticker) {
    $('#' + ticker + '_balance').text(zrcTokenBalance);
    $('#' + ticker + '_container').show();
}

function bindViewZrcTokenLpTotalPoolBalance(totalPoolZilBalance, totalPoolZrcBalance, ticker) {
    $('#' + ticker + '_lp_total_pool_zil').text(totalPoolZilBalance);
    $('#' + ticker + '_lp_total_pool_zrc').text(totalPoolZrcBalance);
}

function bindViewZrcTokenLpBalance(poolSharePercent, zilBalance, zrcBalance, ticker) {
    $('#' + ticker + '_lp_pool_share_percent').text(poolSharePercent);
    $('#' + ticker + '_lp_zil_balance').text(zilBalance);
    $('#' + ticker + '_lp_token_balance').text(zrcBalance);
    $('#' + ticker + '_lp_container').show();
    $('#lp_container').show();
}

function bindViewZilStakingBalance(zilStakingBalance, ssnAddress) {
    $('#' + ssnAddress + '_zil_staking_balance').text(zilStakingBalance);
    $('#' + ssnAddress + '_zil_staking_container').show();
    $('#staking_container').show();
}

function bindViewZilStakingWithdrawalPendingBalance(zilStakingWithdrawalBalance) {
    $('#zil_staking_withdrawal_pending_balance').text(zilStakingWithdrawalBalance);
    $('#zil_staking_withdrawal_pending_container').show();
    $('#staking_container').show();
}

function bindViewCarbonStakingBalance(carbonStakingBalance) {
    $('#carbon_staking_balance').text(carbonStakingBalance);
    $('#carbon_staking_container').show();
    $('#staking_container').show();
}

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

function bindViewTotalRewardAllLpZwap(totalRewardZwapString) {
    $('#total_all_lp_reward_next_epoch_zwap').text(totalRewardZwapString);
    $('#total_all_lp_reward_next_epoch_container').show();
    $('#lp_container').show();
}

function bindViewLpNextEpochCounter(timeDurationString) {
    $('#lp_reward_next_epoch_duration_counter').text(timeDurationString);
}

/**
 * --------------------------------------------------------------------------------
 */

function bindViewZilBalanceFiat(zilBalanceFiat) {
    $('#zil_balance_fiat').text(zilBalanceFiat);
}

function bindViewZrcTokenWalletBalanceZil(zrcBalanceZil, ticker) {
    $('#' + ticker + '_balance_zil').text(zrcBalanceZil);
}

function bindViewZrcTokenWalletBalanceFiat(zrcBalanceFiat, ticker) {
    $('#' + ticker + '_balance_fiat').text(zrcBalanceFiat);
}

function bindViewTotalWalletBalanceZil(totalWalletBalanceZil) {
    $('#wallet_balance_zil').text(totalWalletBalanceZil);
}

function bindViewTotalWalletBalanceFiat(totalWalletBalanceFiat) {
    $('#wallet_balance_fiat').text(totalWalletBalanceFiat);
}

function bindViewZrcTokenLpTotalPoolBalanceFiat(lpTotalPoolBalanceFiat, ticker) {
    $('#' + ticker + '_lp_total_pool_fiat').text(lpTotalPoolBalanceFiat);
}

function bindViewZrcTokenLpBalanceFiat(lpBalanceFiat, ticker) {
    $('#' + ticker + '_lp_balance_fiat').text(lpBalanceFiat);
}

function bindViewTotalLpBalanceZil(totalLpBalanceZil) {
    $('#lp_balance_zil').text(totalLpBalanceZil);
}

function bindViewTotalLpBalanceFiat(totalLpBalanceFiat) {
    $('#lp_balance_fiat').text(totalLpBalanceFiat);
}

function bindViewZilStakingBalanceFiat(zilStakingBalanceFiat, ssnAddress) {
    $('#' + ssnAddress + '_zil_staking_balance_fiat').text(zilStakingBalanceFiat);
}

function bindViewZilStakingWithdrawalPendingBalanceFiat(zilStakingWithdrawalBalanceFiat) {
    $('#zil_staking_withdrawal_pending_balance_fiat').text(zilStakingWithdrawalBalanceFiat);
}

function bindViewCarbonStakingBalanceZil(carbonStakingBalanceZil) {
    $('#carbon_staking_balance_zil').text(carbonStakingBalanceZil);
}

function bindViewCarbonStakingBalanceFiat(carbonStakingBalanceFiat) {
    $('#carbon_staking_balance_fiat').text(carbonStakingBalanceFiat);
}

function bindViewTotalStakingBalanceZil(totalStakingBalanceZil) {
    $('#staking_balance_zil').text(totalStakingBalanceZil);
}

function bindViewTotalStakingBalanceFiat(totalStakingBalanceFiat) {
    $('#staking_balance_fiat').text(totalStakingBalanceFiat);
}

function bindViewTotalNetWorthZil(totalNetWorthZil) {
    $('#net_worth_zil').text(totalNetWorthZil);
}

function bindViewTotalNetWorthFiat(totalNetWorthFiat) {
    $('#net_worth_fiat').text(totalNetWorthFiat);
}

function bindViewTotalRewardAllLpFiat(totalAllLpRewardFiat) {
    $('#total_all_lp_reward_next_epoch_fiat').text(totalAllLpRewardFiat);
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
    }

    exports.getNumberFromView = getNumberFromView;

    exports.setThemeLightMode = setThemeLightMode;
    exports.setThemeDarkMode = setThemeDarkMode;

    exports.bindViewLoggedInButton = bindViewLoggedInButton;
    exports.bindViewMainContainer = bindViewMainContainer;
    exports.resetMainContainerContent = resetMainContainerContent;

    exports.bindViewZilPriceInFiat = bindViewZilPriceInFiat;
    exports.bindViewZilBalance = bindViewZilBalance;
    exports.bindViewZrcTokenPriceInZil = bindViewZrcTokenPriceInZil;
    exports.bindViewZrcTokenPriceInFiat = bindViewZrcTokenPriceInFiat;
    exports.bindViewZrcTokenWalletBalance = bindViewZrcTokenWalletBalance;
    exports.bindViewZrcTokenLpTotalPoolBalance = bindViewZrcTokenLpTotalPoolBalance;
    exports.bindViewZrcTokenLpBalance = bindViewZrcTokenLpBalance;
    exports.bindViewZilStakingBalance = bindViewZilStakingBalance;
    exports.bindViewZilStakingWithdrawalPendingBalance = bindViewZilStakingWithdrawalPendingBalance;
    exports.bindViewCarbonStakingBalance = bindViewCarbonStakingBalance;

    exports.bindViewTotalTradeVolumeZil = bindViewTotalTradeVolumeZil;
    exports.bindViewTotalTradeVolumeFiat = bindViewTotalTradeVolumeFiat;

    exports.bindViewZwapRewardLp = bindViewZwapRewardLp;
    exports.bindViewTotalRewardAllLpZwap = bindViewTotalRewardAllLpZwap;
    exports.bindViewLpNextEpochCounter = bindViewLpNextEpochCounter;


    exports.bindViewZilBalanceFiat = bindViewZilBalanceFiat;
    exports.bindViewZrcTokenWalletBalanceZil = bindViewZrcTokenWalletBalanceZil;
    exports.bindViewZrcTokenWalletBalanceFiat = bindViewZrcTokenWalletBalanceFiat;
    exports.bindViewTotalWalletBalanceZil = bindViewTotalWalletBalanceZil;
    exports.bindViewTotalWalletBalanceFiat = bindViewTotalWalletBalanceFiat;
    exports.bindViewZrcTokenLpTotalPoolBalanceFiat = bindViewZrcTokenLpTotalPoolBalanceFiat;
    exports.bindViewZrcTokenLpBalanceFiat = bindViewZrcTokenLpBalanceFiat;
    exports.bindViewTotalLpBalanceZil = bindViewTotalLpBalanceZil;
    exports.bindViewTotalLpBalanceFiat = bindViewTotalLpBalanceFiat;
    exports.bindViewZilStakingBalanceFiat = bindViewZilStakingBalanceFiat;
    exports.bindViewZilStakingWithdrawalPendingBalanceFiat = bindViewZilStakingWithdrawalPendingBalanceFiat;
    exports.bindViewCarbonStakingBalanceZil = bindViewCarbonStakingBalanceZil;
    exports.bindViewCarbonStakingBalanceFiat = bindViewCarbonStakingBalanceFiat;
    exports.bindViewTotalStakingBalanceZil = bindViewTotalStakingBalanceZil;
    exports.bindViewTotalStakingBalanceFiat = bindViewTotalStakingBalanceFiat;
    exports.bindViewTotalNetWorthZil = bindViewTotalNetWorthZil;
    exports.bindViewTotalNetWorthFiat = bindViewTotalNetWorthFiat;
    exports.bindViewTotalRewardAllLpFiat = bindViewTotalRewardAllLpFiat;
}