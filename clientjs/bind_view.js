// bind_view.js
// No dependencies

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

/**
 * --------------------------------------------------------------------------------
 */

function bindViewZilPriceInUsd(zilPriceInUsd) {
    $("#zil_price").text(zilPriceInUsd);
}

function bindViewZilBalance(zilBalance) {
    $('#zil_balance').text(zilBalance);
}

function bindViewZrcTokenPriceInZil(zrcTokenPriceInZil, ticker) {
    $('#' + ticker + '_price').text(zrcTokenPriceInZil);
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
}

function bindViewZilStakingBalance(zilStakingBalance, ssnAddress) {
    $('#' + ssnAddress + '_zil_staking_balance').text(zilStakingBalance);
    $('#' + ssnAddress + '_zil_staking_container').show();
}

function bindViewZwapRewardLp(zwapRewardString, ticker) {
    $('#' + ticker + '_lp_pool_reward_zwap').text(zwapRewardString);
    $('#' + ticker + '_lp_pool_reward_zwap_unit').text('ZWAP');
}

function bindViewTotalRewardAllLpZwap(totalRewardZwapString) {
    $('#total_all_lp_reward_next_epoch_zwap').text(totalRewardZwapString);
    $('#total_all_lp_reward_next_epoch_container').show();
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

function bindViewTotalStakingBalanceZil(totalStakingBalanceZil) {
    $('#zil_staking_balance_zil').text(totalStakingBalanceZil);
}

function bindViewTotalStakingBalanceUsd(totalStakingBalanceUsd) {
    $('#zil_staking_balance_usd').text(totalStakingBalanceUsd);
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

    exports.bindViewLoggedInButton = bindViewLoggedInButton;
    exports.bindViewMainContainer = bindViewMainContainer;

    exports.bindViewZilPriceInUsd = bindViewZilPriceInUsd;
    exports.bindViewZilBalance = bindViewZilBalance;
    exports.bindViewZrcTokenPriceInZil = bindViewZrcTokenPriceInZil;
    exports.bindViewZrcTokenWalletBalance = bindViewZrcTokenWalletBalance;
    exports.bindViewZrcTokenLpBalance = bindViewZrcTokenLpBalance;
    exports.bindViewZilStakingBalance = bindViewZilStakingBalance;
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
    exports.bindViewTotalStakingBalanceZil = bindViewTotalStakingBalanceZil;
    exports.bindViewTotalStakingBalanceUsd = bindViewTotalStakingBalanceUsd;
    exports.bindViewTotalNetWorthZil = bindViewTotalNetWorthZil;
    exports.bindViewTotalNetWorthUsd = bindViewTotalNetWorthUsd;
    exports.bindViewTotalRewardAllLpUsd = bindViewTotalRewardAllLpUsd;
}