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
    zrcTokenPropertiesListMap: Constants.zrcTokenPropertiesListMap,
    ssnListMap: Constants.ssnListMap
}, function (err, html) {
    // Deep copy and keep html result;
    indexHtml = html.slice();
    
    let { JSDOM } = require( 'jsdom' );
    let { window } = new JSDOM( html );
    let { document } = window;
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
        setTimeout(function() {
            innerResetHtmlView();
            done();
        }, 1000);
    }
}

const $ = require( 'jquery' );

module.exports = {
    $: $,
    resetHtmlView: resetHtmlView,
};
