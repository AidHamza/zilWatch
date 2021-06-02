// Setup code for mocha testing requiring UI components (jsdom and jquery)
// To use this code, just declare the following in your test:
// ```
// var indexJsdom = require('../index.jsdom.js');
// var $ = indexJsdom.$;
// ```
// And all the $ jQuery methods will work

var Constants = require('../constants.js');

var indexHtml = null;

var path = require('path');
var express = require('express');
var app = express();
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.render('index', {
    title: Constants.title,
    description: Constants.description,
    coinMap: Constants.coinMap,
    currencyMap: Constants.currencyMap,
    zrcTokenPropertiesListMap: Constants.zrcTokenPropertiesListMap,
    ssnListMap: Constants.ssnListMap,
    zrcTokensTotalSupply: Constants.emptyZrcTokensSupply,
    zrcTokensCirculatingSupply: Constants.emptyZrcTokensSupply
}, function (err, html) {
    // Deep copy and keep html result;
    indexHtml = html.slice();

    let {
        JSDOM
    } = require('jsdom');
    let {
        window
    } = new JSDOM(html);
    let {
        document
    } = window;
    global.window = window;
    global.document = document;
});

// This requires indexHtml and document to be already set up.
function innerResetHtmlView() {
    let html = indexHtml.slice();

    var newDoc = document.open("text/html", "replace");
    newDoc.write(html);
    newDoc.close();
}

// This method is to be called in beforeEach() method in the mocha test js to reset the html state to original.
// done is a function to call when the reset is done.
function resetHtmlView(done) {
    if (indexHtml) {
        innerResetHtmlView();
        done();
    } else {
        // indexHtml is not set yet, means the pug conversion to html string is not done yet.
        // We wait for 1 second hoping the setup above is completed. (this is a hack).
        setTimeout(function () {
            innerResetHtmlView();
            done();
        }, 1000);
    }
}

const $ = require('jquery');
var assert = require('assert');

function assertDefaultStateMainContent() {
    // 2 --------------------------------------------------- 2

    // bindViewZilBalance()
    assert.strictEqual($('#zil_balance').text(), 'Loading...');

    // bindViewZrcTokenWalletBalance()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_balance').text(), 'Loading...');
        assert.strictEqual($('#' + ticker + '_container').css('display'), 'none');
    }

    // bindViewZrcTokenLpBalance24hAgo()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_lp_pool_share_percent_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_zil_balance_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_token_balance_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_balance_zil_24h_ago').text(), '');
    }

    // bindViewZrcTokenLpBalance()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_lp_pool_share_percent').text(), 'Loading...');
        assert.strictEqual($('#' + ticker + '_lp_zil_balance').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_token_balance').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_balance_zil').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_container').css('display'), 'none');
    }
    assert.strictEqual($('#lp_container').css('display'), 'none');

    // bindViewZilStakingBalance()
    for (let ssnAddress in Constants.ssnListMap) {
        assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance').text(), 'Loading...');
        assert.strictEqual($('#' + ssnAddress + '_zil_staking_container').css('display'), 'none');
    }
    assert.strictEqual($('#staking_container').css('display'), 'none');

    // bindViewZilStakingWithdrawalPendingBalance()
    assert.strictEqual($('#zil_staking_withdrawal_pending_balance').text(), 'Loading...');
    assert.strictEqual($('#zil_staking_withdrawal_pending_container').css('display'), 'none');
    assert.strictEqual($('#staking_container').css('display'), 'none');

    // bindViewCarbonStakingBalance()
    assert.strictEqual($('#carbon_staking_balance').text(), 'Loading...');
    assert.strictEqual($('#carbon_staking_container').css('display'), 'none');
    assert.strictEqual($('#staking_container').css('display'), 'none');

    // bindViewTotalTradeVolumeZil(): Exception, no need refresh
    // bindViewTotalTradeVolumeFiat(): Exception, no need refresh

    // bindViewZwapRewardLp()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
    }

    // bindViewZrcTokenCirculatingSupply(): Exception, no need refresh
    // bindViewZrcTokenCirculatingSupplyFiat(): Exception, no need refresh
    // bindViewZrcTokenTotalSupply(): Exception, no need refresh
    // bindViewZrcTokenTotalSupplyFiat(): Exception, no need refresh

    // 3 --------------------------------------- 3

    // bindViewZilBalanceFiat24hAgo()
    assert.strictEqual($('#zil_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#zil_balance_fiat_percent_change_24h').text(), '');

    // bindViewZilBalanceFiat()
    assert.strictEqual($('#zil_balance_fiat').text(), 'Loading...');

    // bindViewZrcTokenWalletBalanceZil24hAgo()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_balance_zil_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_balance_zil_percent_change_24h').text(), '');
    }

    // bindViewZrcTokenWalletBalanceZil()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_balance_zil').text(), 'Loading...');
    }

    // bindViewZrcTokenWalletBalanceFiat24hAgo()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_balance_fiat_percent_change_24h').text(), '');
    }

    // bindViewZrcTokenWalletBalanceFiat()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_balance_fiat').text(), 'Loading...');
    }
    // bindViewTotalWalletBalanceZil24hAgo()
    assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '');
    assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '');

    // bindViewTotalWalletBalanceZil()
    assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');

    // bindViewTotalWalletBalanceFiat24hAgo()
    assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '');

    // bindViewTotalWalletBalanceFiat()
    assert.strictEqual($('#wallet_balance_fiat').text(), 'Loading...');

    // bindViewZrcTokenLpBalanceFiat24hAgo()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_lp_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(), '');
    }

    // bindViewZrcTokenLpBalanceFiat()
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        assert.strictEqual($('#' + ticker + '_lp_balance_fiat').text(), 'Loading...');
    }

    // bindViewTotalLpBalanceZil24hAgo()
    assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '');
    assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '');

    // bindViewTotalLpBalanceZil()
    assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');

    // bindViewTotalLpBalanceFiat24hAgo()
    assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '');

    // bindViewTotalLpBalanceFiat()
    assert.strictEqual($('#lp_balance_fiat').text(), 'Loading...');

    // bindViewZilStakingBalanceFiat24hAgo()
    for (let ssnAddress in Constants.ssnListMap) {
        assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_24h_ago').text(), '');
        assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_24h').text(), '');
    }

    // bindViewZilStakingBalanceFiat()
    for (let ssnAddress in Constants.ssnListMap) {
        assert.strictEqual($('#' + ssnAddress + '_zil_staking_balance_fiat').text(), 'Loading...');
    }

    // bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo()
    assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat_percent_change_24h').text(), '');

    // bindViewZilStakingWithdrawalPendingBalanceFiat()
    assert.strictEqual($('#zil_staking_withdrawal_pending_balance_fiat').text(), 'Loading...');

    // bindViewCarbonStakingBalanceZil24hAgo()
    assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '');
    assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '');

    // bindViewCarbonStakingBalanceZil()
    assert.strictEqual($('#carbon_staking_balance_zil').text(), 'Loading...');

    // bindViewCarbonStakingBalanceFiat24hAgo()
    assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '');

    // bindViewCarbonStakingBalanceFiat()
    assert.strictEqual($('#carbon_staking_balance_fiat').text(), 'Loading...');

    // bindViewTotalStakingBalanceZil24hAgo()
    assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '');
    assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '');

    // bindViewTotalStakingBalanceZil()
    assert.strictEqual($('#staking_balance_zil').text(), 'Loading...');

    // bindViewTotalStakingBalanceFiat24hAgo()
    assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '');
    assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '');

    // bindViewTotalStakingBalanceFiat()
    assert.strictEqual($('#staking_balance_fiat').text(), 'Loading...');

    // bindViewTotalNetWorthZil24hAgo()
    assert.strictEqual($('#net_worth_zil_24h_ago').text(), '');
    assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '');

    // bindViewTotalNetWorthZil()
    assert.strictEqual($('#net_worth_zil').text(), 'Loading...');

    // bindViewTotalNetWorthFiat24hAgo()
    assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '');
    assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '');

    // bindViewTotalNetWorthFiat()
    assert.strictEqual($('#net_worth_fiat').text(), 'Loading...');

    // 4 -------------------------------------------------- 4

    // bindViewTotalRewardAllLpZwap()
    assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
    assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
    assert.strictEqual($('#lp_container').css('display'), 'none');

    // bindViewTotalRewardAllLpFiat()
    assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), 'Loading...');

    // bindViewPrevTotalRewardAllLpZwap()
    assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), '');
    assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'Loading...');

    // bindViewPrevTotalRewardAllLpFiat()
    assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'Loading...');

    // enableTooltipPastTotalRewardAllLpZwap()
    // disableTooltipPastTotalRewardAllLpZwap()
    assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), false);
    assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
    assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
    $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');
    assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
    assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

    // clearViewPastTotalRewardAllLpZwap()
    // addViewPastTotalRewardAllLpZwap()
    assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
    assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

    // bindViewLpNextEpochCounter(): Exception, no need refresh

    // 5 -------------------------------------------------- 5

    // decrementShowSpinnerWalletBalance()
    // incrementShowSpinnerWalletBalance()
    $('.wallet-balance-spinner').each(function () {
        assert.strictEqual($(this).css('display'), 'none');
    });

    // decrementShowSpinnerLpBalance()
    // incrementShowSpinnerLpBalance()
    $('.lp-balance-spinner').each(function () {
        assert.strictEqual($(this).css('display'), 'none');
    });

    // decrementShowSpinnerStakingBalance()
    // incrementShowSpinnerStakingBalance()
    $('.staking-balance-spinner').each(function () {
        assert.strictEqual($(this).css('display'), 'none');
    });

    // incrementShowSpinnerNetWorth()
    // decrementShowSpinnerNetWorth()
    $('.net-worth-spinner').each(function () {
        assert.strictEqual($(this).css('display'), 'none');
    });
}

module.exports = {
    $: $,
    resetHtmlView: resetHtmlView,
    assertDefaultStateMainContent: assertDefaultStateMainContent,
};