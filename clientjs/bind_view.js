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
    $('#zil_balance_fiat').text('Loading...');
    $('#zil_balance_fiat_24h_ago').text('');
    $('#zil_balance_fiat_percent_change_24h').text('');

    for (let ticker in zrcTokenPropertiesListMap) {
        $('#' + ticker + '_container').hide();
        $('#' + ticker + '_balance').text('Loading...');

        $('#' + ticker + '_lp_container').hide();
        $('#' + ticker + '_lp_pool_share_percent').text('Loading...');
        $('#' + ticker + '_lp_zil_balance').text('');
        $('#' + ticker + '_lp_token_balance').text('');
        $('#' + ticker + '_lp_pool_reward_zwap').text('');
        $('#' + ticker + '_lp_pool_reward_zwap_unit').text('');
        $('#' + ticker + '_balance_zil').text('Loading...');
        $('#' + ticker + '_balance_fiat').text('Loading...');
        $('#' + ticker + '_lp_balance_zil').text('');
        $('#' + ticker + '_lp_balance_fiat').text('Loading...');

        $('#' + ticker + '_lp_pool_share_percent_24h_ago').text('');
        $('#' + ticker + '_lp_zil_balance_24h_ago').text('');
        $('#' + ticker + '_lp_token_balance_24h_ago').text('');
        $('#' + ticker + '_lp_balance_zil_24h_ago').text('');

        $('#' + ticker + '_balance_zil_24h_ago').text('');
        $('#' + ticker + '_balance_zil_percent_change_24h').text('');
        $('#' + ticker + '_balance_fiat_24h_ago').text('');
        $('#' + ticker + '_balance_fiat_percent_change_24h').text('');
        $('#' + ticker + '_lp_balance_fiat_24h_ago').text('');
        $('#' + ticker + '_lp_balance_fiat_percent_change_24h').text('');
    }

    $('#zil_staking_withdrawal_pending_container').hide();
    $('#carbon_staking_container').hide();
    for (let ssnAddress in ssnListMap) {
        $('#' + ssnAddress + '_zil_staking_container').hide();
        $('#' + ssnAddress + '_zil_staking_balance').text('Loading...');
        $('#' + ssnAddress + '_zil_staking_balance_fiat').text('Loading...');
        $('#' + ssnAddress + '_zil_staking_balance_fiat_24h_ago').text('');
        $('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_24h').text('');
    }

    $('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text('');
    $('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text('');
    $('#zil_staking_withdrawal_pending_balance').text('Loading...');
    $('#zil_staking_withdrawal_pending_balance_fiat').text('Loading...');

    $('#carbon_staking_balance_zil_24h_ago').text('');
    $('#carbon_staking_balance_zil_percent_change_24h').text('');
    $('#carbon_staking_balance_fiat_24h_ago').text('');
    $('#carbon_staking_balance_fiat_percent_change_24h').text('');
    $('#carbon_staking_balance').text('Loading...');
    $('#carbon_staking_balance_zil').text('Loading...');
    $('#carbon_staking_balance_fiat').text('Loading...');

    $('#total_all_lp_reward_next_epoch_zwap').text('Loading...');
    $('#total_all_lp_reward_next_epoch_fiat').text('Loading...');
    $('#total_all_lp_reward_prev_epoch_zwap').text('Loading...');
    $('#total_all_lp_reward_prev_epoch_fiat').text('Loading...');

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
}

/**
 * --------------------------------------------------------------------------------
 */

// Exception, no need to reset
function bindViewCoinPriceInFiat24hAgo(coinPriceInFiatPercentChange24h, coinTicker) {
    $("#public_" + coinTicker + "_price_fiat_percent_change_24h").text(coinPriceInFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#public_' + coinTicker + '_price_fiat_percent_change_24h_container', coinPriceInFiatPercentChange24h);
}

// Exception, no need to reset
function bindViewCoinPriceInFiat(currencySymbol, coinPriceInFiat, coinTicker) {
    $("." + coinTicker + "_price_fiat").text(coinPriceInFiat);
    $(".currency_symbol").text(currencySymbol);
}

// Exception, no need to reset
function bindViewCoinPriceInZil24hAgo(coinPriceInZilPercentChange24h, coinTicker) {
    $("#public_" + coinTicker + "_price_zil_percent_change_24h").text(coinPriceInZilPercentChange24h);
    bindViewPercentChangeColorContainer('#public_' + coinTicker + '_price_zil_percent_change_24h_container', coinPriceInZilPercentChange24h);
}

// Exception, no need to reset
function bindViewCoinPriceInZil(coinPriceInZil, coinTicker) {
    $("." + coinTicker + "_price_zil").text(coinPriceInZil);
}

function bindViewZilBalance(zilBalance) {
    $('#zil_balance').text(zilBalance);
}

// Exception, no need to reset
function bindViewZrcTokenPriceInZil24hAgo(zrcTokenPriceInZil24hAgo, publicZrcTokenPriceInZil24hAgo, publicZrcTokenPriceInZilPercentChange24h, ticker) {
    $('.' + ticker + '_price_zil_24h_ago').text(zrcTokenPriceInZil24hAgo);
    $('#public_' + ticker + '_price_zil_24h_ago').text(publicZrcTokenPriceInZil24hAgo);
    $('#public_' + ticker + '_price_zil_percent_change_24h').text(publicZrcTokenPriceInZilPercentChange24h);
    bindViewPercentChangeColorContainer('#public_' + ticker + '_price_zil_percent_change_24h_container', publicZrcTokenPriceInZilPercentChange24h);
}

// Exception, no need to reset
function bindViewZrcTokenPriceInZil(zrcTokenPriceInZil, publicZrcTokenPriceInZil, ticker) {
    $('.' + ticker + '_price_zil').text(zrcTokenPriceInZil);
    $('#public_' + ticker + '_price_zil').text(publicZrcTokenPriceInZil);
}

// Exception, no need to reset
function bindViewZrcTokenPriceInFiat24hAgo(zrcTokenPriceInFiat24hAgo, zrcTokenPriceInFiatPercentChange24h, ticker) {
    $('#public_' + ticker + '_price_fiat_24h_ago').text(zrcTokenPriceInFiat24hAgo);
    $('#public_' + ticker + '_price_fiat_percent_change_24h').text(zrcTokenPriceInFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#public_' + ticker + '_price_fiat_percent_change_24h_container', zrcTokenPriceInFiatPercentChange24h);
}

// Exception, no need to reset
function bindViewZrcTokenPriceInFiat(zrcTokenPriceInFiat, ticker) {
    $('#public_' + ticker + '_price_fiat').text(zrcTokenPriceInFiat);
}

function bindViewZrcTokenWalletBalance(zrcTokenBalance, ticker) {
    $('#' + ticker + '_balance').text(zrcTokenBalance);
    $('#' + ticker + '_container').show();
}

// Exception, no need to reset
function bindViewZrcTokenLpTotalPoolBalance(totalPoolZilBalance, totalPoolZrcBalance, ticker) {
    $('#' + ticker + '_lp_total_pool_zil').text(totalPoolZilBalance);
    $('#' + ticker + '_lp_total_pool_zrc').text(totalPoolZrcBalance);
}

function bindViewZrcTokenLpBalance24hAgo(poolSharePercent24hAgo, zilBalance24hAgo, zrcBalance24hAgo, balanceInZil24hAgo, balanceInZilPercentChange24h, ticker) {
    $('#' + ticker + '_lp_pool_share_percent_24h_ago').text(poolSharePercent24hAgo);
    $('#' + ticker + '_lp_zil_balance_24h_ago').text(zilBalance24hAgo);
    $('#' + ticker + '_lp_token_balance_24h_ago').text(zrcBalance24hAgo);
    $('#' + ticker + '_lp_balance_zil_24h_ago').text(balanceInZil24hAgo);
    $('#' + ticker + '_lp_balance_zil_percent_change_24h').text(balanceInZilPercentChange24h);
    bindViewPercentChangeColorContainer('#' + ticker + '_lp_balance_zil_percent_change_24h_container', balanceInZilPercentChange24h);
}

function bindViewZrcTokenLpBalance(poolSharePercent, zilBalance, zrcBalance, balanceInZil, ticker) {
    $('#' + ticker + '_lp_pool_share_percent').text(poolSharePercent);
    $('#' + ticker + '_lp_zil_balance').text(zilBalance);
    $('#' + ticker + '_lp_token_balance').text(zrcBalance);
    $('#' + ticker + '_lp_balance_zil').text(balanceInZil);
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

function bindViewPrevTotalRewardAllLpZwap(prevTotalRewardZwapString) {
    $('#total_all_lp_reward_prev_epoch_zwap').text(prevTotalRewardZwapString);
}

// Exception, no need reset
function bindViewLpNextEpochCounter(timeDurationString) {
    $('#lp_reward_next_epoch_duration_counter').text(timeDurationString);
}

/**
 * --------------------------------------------------------------------------------
 */


 function bindViewZilBalanceFiat24hAgo(zilBalanceFiat24hAgo, zilBalanceFiatPercentChange24h) {
    $('#zil_balance_fiat_24h_ago').text(zilBalanceFiat24hAgo);
    $('#zil_balance_fiat_percent_change_24h').text(zilBalanceFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#zil_balance_fiat_percent_change_24h_container', zilBalanceFiatPercentChange24h);
}

function bindViewZilBalanceFiat(zilBalanceFiat) {
    $('#zil_balance_fiat').text(zilBalanceFiat);
}

function bindViewZrcTokenWalletBalanceZil24hAgo(zrcBalanceZil24hAgo, zrcBalanceZilPercentChange24h, ticker) {
    $('#' + ticker + '_balance_zil_24h_ago').text(zrcBalanceZil24hAgo);
    $('#' + ticker + '_balance_zil_percent_change_24h').text(zrcBalanceZilPercentChange24h);
    bindViewPercentChangeColorContainer('#' + ticker + '_balance_zil_percent_change_24h_container', zrcBalanceZilPercentChange24h);
}

function bindViewZrcTokenWalletBalanceZil(zrcBalanceZil, ticker) {
    $('#' + ticker + '_balance_zil').text(zrcBalanceZil);
}

function bindViewZrcTokenWalletBalanceFiat24hAgo(zrcBalanceFiat24hAgo, zrcBalanceFiatPercentChange24h, ticker) {
    $('#' + ticker + '_balance_fiat_24h_ago').text(zrcBalanceFiat24hAgo);
    $('#' + ticker + '_balance_fiat_percent_change_24h').text(zrcBalanceFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#' + ticker + '_balance_fiat_percent_change_24h_container', zrcBalanceFiatPercentChange24h);
}

function bindViewZrcTokenWalletBalanceFiat(zrcBalanceFiat, ticker) {
    $('#' + ticker + '_balance_fiat').text(zrcBalanceFiat);
}

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

// Exception, no need to reset
function bindViewZrcTokenLpTotalPoolBalanceFiat(lpTotalPoolBalanceFiat, ticker) {
    $('#' + ticker + '_lp_total_pool_fiat').text(lpTotalPoolBalanceFiat);
}

function bindViewZrcTokenLpBalanceFiat24hAgo(lpBalanceFiat24hAgo, lpBalanceFiatPercentChange24h, ticker) {
    $('#' + ticker + '_lp_balance_fiat_24h_ago').text(lpBalanceFiat24hAgo);
    $('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(lpBalanceFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#' + ticker + '_lp_balance_fiat_percent_change_24h_container', lpBalanceFiatPercentChange24h);
}

function bindViewZrcTokenLpBalanceFiat(lpBalanceFiat, ticker) {
    $('#' + ticker + '_lp_balance_fiat').text(lpBalanceFiat);
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

function bindViewZilStakingBalanceFiat24hAgo(zilStakingBalanceFiat24hAgo, zilStakingBalanceFiatPercentChange24h, ssnAddress) {
    $('#' + ssnAddress + '_zil_staking_balance_fiat_24h_ago').text(zilStakingBalanceFiat24hAgo);
    $('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_24h').text(zilStakingBalanceFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_24h_container', zilStakingBalanceFiatPercentChange24h);
}

function bindViewZilStakingBalanceFiat(zilStakingBalanceFiat, ssnAddress) {
    $('#' + ssnAddress + '_zil_staking_balance_fiat').text(zilStakingBalanceFiat);
}

function bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo(zilStakingWithdrawalBalanceFiat24hAgo, zilStakingWithdrawalBalanceFiatPercentChange24h) {
    $('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(zilStakingWithdrawalBalanceFiat24hAgo);
    $('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(zilStakingWithdrawalBalanceFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h_container', zilStakingWithdrawalBalanceFiatPercentChange24h);
}

function bindViewZilStakingWithdrawalPendingBalanceFiat(zilStakingWithdrawalBalanceFiat) {
    $('#zil_staking_withdrawal_pending_balance_fiat').text(zilStakingWithdrawalBalanceFiat);
}

function bindViewCarbonStakingBalanceZil24hAgo(carbonStakingBalanceZil24hAgo, carbonStakingBalanceZilPercentChange24h) {
    $('#carbon_staking_balance_zil_24h_ago').text(carbonStakingBalanceZil24hAgo);
    $('#carbon_staking_balance_zil_percent_change_24h').text(carbonStakingBalanceZilPercentChange24h);
    bindViewPercentChangeColorContainer('#carbon_staking_balance_zil_percent_change_24h_container', carbonStakingBalanceZilPercentChange24h);
}

function bindViewCarbonStakingBalanceZil(carbonStakingBalanceZil) {
    $('#carbon_staking_balance_zil').text(carbonStakingBalanceZil);
}

function bindViewCarbonStakingBalanceFiat24hAgo(carbonStakingBalanceFiat24hAgo, carbonStakingBalanceFiatPercentChange24h) {
    $('#carbon_staking_balance_fiat_24h_ago').text(carbonStakingBalanceFiat24hAgo);
    $('#carbon_staking_balance_fiat_percent_change_24h').text(carbonStakingBalanceFiatPercentChange24h);
    bindViewPercentChangeColorContainer('#carbon_staking_balance_fiat_percent_change_24h_container', carbonStakingBalanceFiatPercentChange24h);
}

function bindViewCarbonStakingBalanceFiat(carbonStakingBalanceFiat) {
    $('#carbon_staking_balance_fiat').text(carbonStakingBalanceFiat);
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

function bindViewTotalRewardAllLpFiat(totalAllLpRewardFiat) {
    $('#total_all_lp_reward_next_epoch_fiat').text(totalAllLpRewardFiat);
}

function bindViewPrevTotalRewardAllLpFiat(prevTotalAllLpRewardFiat) {
    $('#total_all_lp_reward_prev_epoch_fiat').text(prevTotalAllLpRewardFiat);
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

    exports.getNumberFromView = getNumberFromView;

    exports.setThemeLightMode = setThemeLightMode;
    exports.setThemeDarkMode = setThemeDarkMode;

    exports.bindViewLoggedInButton = bindViewLoggedInButton;
    exports.bindViewMainContainer = bindViewMainContainer;
    exports.resetMainContainerContent = resetMainContainerContent;

    exports.bindViewCoinPriceInFiat24hAgo = bindViewCoinPriceInFiat24hAgo;
    exports.bindViewCoinPriceInFiat = bindViewCoinPriceInFiat;
    exports.bindViewCoinPriceInZil24hAgo = bindViewCoinPriceInZil24hAgo;
    exports.bindViewCoinPriceInZil = bindViewCoinPriceInZil;
    exports.bindViewZilBalance = bindViewZilBalance;
    exports.bindViewZrcTokenPriceInZil24hAgo = bindViewZrcTokenPriceInZil24hAgo;
    exports.bindViewZrcTokenPriceInZil = bindViewZrcTokenPriceInZil;
    exports.bindViewZrcTokenPriceInFiat24hAgo = bindViewZrcTokenPriceInFiat24hAgo;
    exports.bindViewZrcTokenPriceInFiat = bindViewZrcTokenPriceInFiat;
    exports.bindViewZrcTokenWalletBalance = bindViewZrcTokenWalletBalance;
    exports.bindViewZrcTokenLpTotalPoolBalance = bindViewZrcTokenLpTotalPoolBalance;
    exports.bindViewZrcTokenLpBalance24hAgo = bindViewZrcTokenLpBalance24hAgo;
    exports.bindViewZrcTokenLpBalance = bindViewZrcTokenLpBalance;
    exports.bindViewZilStakingBalance = bindViewZilStakingBalance;
    exports.bindViewZilStakingWithdrawalPendingBalance = bindViewZilStakingWithdrawalPendingBalance;
    exports.bindViewCarbonStakingBalance = bindViewCarbonStakingBalance;

    exports.bindViewTotalTradeVolumeZil = bindViewTotalTradeVolumeZil;
    exports.bindViewTotalTradeVolumeFiat = bindViewTotalTradeVolumeFiat;

    exports.bindViewZwapRewardLp = bindViewZwapRewardLp;
    exports.bindViewTotalRewardAllLpZwap = bindViewTotalRewardAllLpZwap;
    exports.bindViewPrevTotalRewardAllLpZwap = bindViewPrevTotalRewardAllLpZwap;
    exports.bindViewLpNextEpochCounter = bindViewLpNextEpochCounter;


    exports.bindViewZilBalanceFiat24hAgo = bindViewZilBalanceFiat24hAgo;
    exports.bindViewZilBalanceFiat = bindViewZilBalanceFiat;
    exports.bindViewZrcTokenWalletBalanceZil24hAgo = bindViewZrcTokenWalletBalanceZil24hAgo;
    exports.bindViewZrcTokenWalletBalanceZil = bindViewZrcTokenWalletBalanceZil;
    exports.bindViewZrcTokenWalletBalanceFiat = bindViewZrcTokenWalletBalanceFiat;
    exports.bindViewZrcTokenWalletBalanceFiat24hAgo = bindViewZrcTokenWalletBalanceFiat24hAgo;
    exports.bindViewTotalWalletBalanceZil24hAgo = bindViewTotalWalletBalanceZil24hAgo;
    exports.bindViewTotalWalletBalanceZil = bindViewTotalWalletBalanceZil;
    exports.bindViewTotalWalletBalanceFiat24hAgo = bindViewTotalWalletBalanceFiat24hAgo;
    exports.bindViewTotalWalletBalanceFiat = bindViewTotalWalletBalanceFiat;
    exports.bindViewZrcTokenLpTotalPoolBalanceFiat = bindViewZrcTokenLpTotalPoolBalanceFiat;
    exports.bindViewZrcTokenLpBalanceFiat24hAgo = bindViewZrcTokenLpBalanceFiat24hAgo;
    exports.bindViewZrcTokenLpBalanceFiat = bindViewZrcTokenLpBalanceFiat;
    exports.bindViewTotalLpBalanceZil24hAgo = bindViewTotalLpBalanceZil24hAgo;
    exports.bindViewTotalLpBalanceZil = bindViewTotalLpBalanceZil;
    exports.bindViewTotalLpBalanceFiat24hAgo = bindViewTotalLpBalanceFiat24hAgo;
    exports.bindViewTotalLpBalanceFiat = bindViewTotalLpBalanceFiat;
    exports.bindViewZilStakingBalanceFiat24hAgo = bindViewZilStakingBalanceFiat24hAgo;
    exports.bindViewZilStakingBalanceFiat = bindViewZilStakingBalanceFiat;
    exports.bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo = bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo;
    exports.bindViewZilStakingWithdrawalPendingBalanceFiat = bindViewZilStakingWithdrawalPendingBalanceFiat;
    exports.bindViewCarbonStakingBalanceZil24hAgo = bindViewCarbonStakingBalanceZil24hAgo;
    exports.bindViewCarbonStakingBalanceZil = bindViewCarbonStakingBalanceZil;
    exports.bindViewCarbonStakingBalanceFiat24hAgo = bindViewCarbonStakingBalanceFiat24hAgo;
    exports.bindViewCarbonStakingBalanceFiat = bindViewCarbonStakingBalanceFiat;
    exports.bindViewTotalStakingBalanceZil24hAgo = bindViewTotalStakingBalanceZil24hAgo;
    exports.bindViewTotalStakingBalanceZil = bindViewTotalStakingBalanceZil;
    exports.bindViewTotalStakingBalanceFiat24hAgo = bindViewTotalStakingBalanceFiat24hAgo;
    exports.bindViewTotalStakingBalanceFiat = bindViewTotalStakingBalanceFiat;
    exports.bindViewTotalNetWorthZil24hAgo = bindViewTotalNetWorthZil24hAgo;
    exports.bindViewTotalNetWorthZil = bindViewTotalNetWorthZil;
    exports.bindViewTotalNetWorthFiat24hAgo = bindViewTotalNetWorthFiat24hAgo;
    exports.bindViewTotalNetWorthFiat = bindViewTotalNetWorthFiat;
    exports.bindViewTotalRewardAllLpFiat = bindViewTotalRewardAllLpFiat;
    exports.bindViewPrevTotalRewardAllLpFiat = bindViewPrevTotalRewardAllLpFiat;

    exports.bindViewPercentChangeColorContainer = bindViewPercentChangeColorContainer;
}