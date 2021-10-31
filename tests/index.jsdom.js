// Setup code for mocha testing requiring UI components (jsdom and jquery)
// To use this code, just declare the following in your test:
// ```
// var indexJsdom = require('../../index.jsdom.js');
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
    nftTokenPropertiesListMap: Constants.nftTokenPropertiesListMap,
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
// This is to simulate bootstrap pill tabbing.
$.fn.tab = function () {
    // Do nothing
    return this;
};
var assert = require('assert');

function assertDefaultStateMainContent() {
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