// bind_view.js
// No dependencies

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

    $('.zil_price_usd').text('Loading...');
    $('#zil_balance').text('Loading...');
    $('#zil_balance_usd').text('');

    for (let ticker in zrcTokenPropertiesListMap) {
        $('#' + ticker + '_container').hide();
        $('#' + ticker + '_price_zil').text('Loading...');
        $('#' + ticker + '_price_usd').text('Loading...');
        $('#public_' + ticker + '_price_zil').text('Loading...');
        $('#' + ticker + '_balance').text('Loading...');

        $('#' + ticker + '_lp_container').hide();
        $('#' + ticker + '_lp_pool_share_percent').text('Loading...');
        $('#' + ticker + '_lp_zil_balance').text('');
        $('#' + ticker + '_lp_token_balance').text('');
        $('#' + ticker + '_lp_pool_reward_zwap').text('');
        $('#' + ticker + '_lp_pool_reward_zwap_unit').text('');
        $('#' + ticker + '_balance_zil').text('Loading...');
        $('#' + ticker + '_balance_usd').text('Loading...');
        $('#' + ticker + '_lp_balance_usd').text('Loading...');
    }

    $('#zil_staking_withdrawal_pending_container').hide();
    $('#carbon_staking_container').hide();
    for (let ssnAddress in ssnListMap) {
        $('#' + ssnAddress + '_zil_staking_container').hide();
        $('#' + ssnAddress + '_zil_staking_balance').text('Loading...');
        $('#' + ssnAddress + '_zil_staking_balance_usd').text('Loading...');
    }
    $('#zil_staking_withdrawal_pending_balance').text('Loading...');
    $('#zil_staking_withdrawal_pending_balance_usd').text('Loading...');
    $('#carbon_staking_balance').text('Loading...');
    $('#carbon_staking_balance_zil').text('Loading...');
    $('#carbon_staking_balance_usd').text('Loading...');

    $('#lp_reward_next_epoch_duration_counter').text('');
    $('#total_all_lp_reward_next_epoch_zwap').text('Loading...');
    $('#total_all_lp_reward_next_epoch_usd').text('Loading...');

    $('#wallet_balance_zil').text('Loading...');
    $('#wallet_balance_usd').text('Loading...');

    $('#lp_balance_zil').text('Loading...');
    $('#lp_balance_usd').text('Loading...');

    $('#staking_balance_zil').text('Loading...');
    $('#staking_balance_usd').text('Loading...');

    $('#net_worth_zil').text('Loading...');
    $('#net_worth_usd').text('Loading...');
}

/**
 * --------------------------------------------------------------------------------
 */

function bindViewZilPriceInUsd(zilPriceInUsd) {
    $(".zil_price_usd").text(zilPriceInUsd);
}

function bindViewZilBalance(zilBalance) {
    $('#zil_balance').text(zilBalance);
}

function bindViewZrcTokenPriceInZil(publicZrcTokenPriceInZil, zrcTokenPriceInZil, ticker) {
    $('#public_' + ticker + '_price_zil').text(publicZrcTokenPriceInZil);
    $('#' + ticker + '_price_zil').text(zrcTokenPriceInZil);
}

function bindViewZrcTokenPriceInUsd(zrcTokenPriceInUsd, ticker) {
    $('#' + ticker + '_price_usd').text(zrcTokenPriceInUsd);
}

function bindViewZrcTokenWalletBalance(zrcTokenBalance, ticker) {
    $('#' + ticker + '_balance').text(zrcTokenBalance);
    $('#' + ticker + '_container').show();
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

function bindViewZilBalanceUsd(zilBalanceUsd) {
    $('#zil_balance_usd').text(zilBalanceUsd);
}

function bindViewZrcTokenWalletBalanceZil(zrcBalanceZil, ticker) {
    $('#' + ticker + '_balance_zil').text(zrcBalanceZil);
}

function bindViewZrcTokenWalletBalanceUsd(zrcBalanceUsd, ticker) {
    $('#' + ticker + '_balance_usd').text(zrcBalanceUsd);
}

function bindViewTotalWalletBalanceZil(totalWalletBalanceZil) {
    $('#wallet_balance_zil').text(totalWalletBalanceZil);
}

function bindViewTotalWalletBalanceUsd(totalWalletBalanceUsd) {
    $('#wallet_balance_usd').text(totalWalletBalanceUsd);
}

function bindViewZrcTokenLpBalanceUsd(lpBalanceUsd, ticker) {
    $('#' + ticker + '_lp_balance_usd').text(lpBalanceUsd);
}

function bindViewTotalLpBalanceZil(totalLpBalanceZil) {
    $('#lp_balance_zil').text(totalLpBalanceZil);
}

function bindViewTotalLpBalanceUsd(totalLpBalanceUsd) {
    $('#lp_balance_usd').text(totalLpBalanceUsd);
}

function bindViewZilStakingBalanceUsd(zilStakingBalanceUsd, ssnAddress) {
    $('#' + ssnAddress + '_zil_staking_balance_usd').text(zilStakingBalanceUsd);
}

function bindViewZilStakingWithdrawalPendingBalanceUsd(zilStakingWithdrawalBalanceUsd) {
    $('#zil_staking_withdrawal_pending_balance_usd').text(zilStakingWithdrawalBalanceUsd);
}

function bindViewCarbonStakingBalanceZil(carbonStakingBalanceZil) {
    $('#carbon_staking_balance_zil').text(carbonStakingBalanceZil);
}

function bindViewCarbonStakingBalanceUsd(carbonStakingBalanceUsd) {
    $('#carbon_staking_balance_usd').text(carbonStakingBalanceUsd);
}

function bindViewTotalStakingBalanceZil(totalStakingBalanceZil) {
    $('#staking_balance_zil').text(totalStakingBalanceZil);
}

function bindViewTotalStakingBalanceUsd(totalStakingBalanceUsd) {
    $('#staking_balance_usd').text(totalStakingBalanceUsd);
}

function bindViewTotalNetWorthZil(totalNetWorthZil) {
    $('#net_worth_zil').text(totalNetWorthZil);
}

function bindViewTotalNetWorthUsd(totalNetWorthUsd) {
    $('#net_worth_usd').text(totalNetWorthUsd);
}

function bindViewTotalRewardAllLpUsd(totalAllLpRewardUsd) {
    $('#total_all_lp_reward_next_epoch_usd').text(totalAllLpRewardUsd);
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

    exports.setThemeLightMode = setThemeLightMode;
    exports.setThemeDarkMode = setThemeDarkMode;

    exports.bindViewLoggedInButton = bindViewLoggedInButton;
    exports.bindViewMainContainer = bindViewMainContainer;
    exports.resetMainContainerContent = resetMainContainerContent;

    exports.bindViewZilPriceInUsd = bindViewZilPriceInUsd;
    exports.bindViewZilBalance = bindViewZilBalance;
    exports.bindViewZrcTokenPriceInZil = bindViewZrcTokenPriceInZil;
    exports.bindViewZrcTokenPriceInUsd = bindViewZrcTokenPriceInUsd;
    exports.bindViewZrcTokenWalletBalance = bindViewZrcTokenWalletBalance;
    exports.bindViewZrcTokenLpBalance = bindViewZrcTokenLpBalance;
    exports.bindViewZilStakingBalance = bindViewZilStakingBalance;
    exports.bindViewZilStakingWithdrawalPendingBalance = bindViewZilStakingWithdrawalPendingBalance;
    exports.bindViewCarbonStakingBalance = bindViewCarbonStakingBalance;
    exports.bindViewZwapRewardLp = bindViewZwapRewardLp;
    exports.bindViewTotalRewardAllLpZwap = bindViewTotalRewardAllLpZwap;
    exports.bindViewLpNextEpochCounter = bindViewLpNextEpochCounter;


    exports.bindViewZilBalanceUsd = bindViewZilBalanceUsd;
    exports.bindViewZrcTokenWalletBalanceZil = bindViewZrcTokenWalletBalanceZil;
    exports.bindViewZrcTokenWalletBalanceUsd = bindViewZrcTokenWalletBalanceUsd;
    exports.bindViewTotalWalletBalanceZil = bindViewTotalWalletBalanceZil;
    exports.bindViewTotalWalletBalanceUsd = bindViewTotalWalletBalanceUsd;
    exports.bindViewZrcTokenLpBalanceUsd = bindViewZrcTokenLpBalanceUsd;
    exports.bindViewTotalLpBalanceZil = bindViewTotalLpBalanceZil;
    exports.bindViewTotalLpBalanceUsd = bindViewTotalLpBalanceUsd;
    exports.bindViewZilStakingBalanceUsd = bindViewZilStakingBalanceUsd;
    exports.bindViewZilStakingWithdrawalPendingBalanceUsd = bindViewZilStakingWithdrawalPendingBalanceUsd;
    exports.bindViewCarbonStakingBalanceZil = bindViewCarbonStakingBalanceZil;
    exports.bindViewCarbonStakingBalanceUsd = bindViewCarbonStakingBalanceUsd;
    exports.bindViewTotalStakingBalanceZil = bindViewTotalStakingBalanceZil;
    exports.bindViewTotalStakingBalanceUsd = bindViewTotalStakingBalanceUsd;
    exports.bindViewTotalNetWorthZil = bindViewTotalNetWorthZil;
    exports.bindViewTotalNetWorthUsd = bindViewTotalNetWorthUsd;
    exports.bindViewTotalRewardAllLpUsd = bindViewTotalRewardAllLpUsd;
}