// bind_view.js
// No dependencies

function bindViewLoggedInButton(walletAddress) {
    $('#wallet_connect').hide();
    $('#wallet_address').text(walletAddress);
    $('#wallet_address').show();
    $('#wallet_refresh').show();
}

if (typeof exports !== 'undefined') {
    var $ = global.jQuery = require( 'jquery' );
    
    exports.bindViewLoggedInButton = bindViewLoggedInButton;
}
