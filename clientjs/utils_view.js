MAX_WIDTH_SMALL_SCREEN = 576;

function isSmallScreen() {
    if ($(document).width() < MAX_WIDTH_SMALL_SCREEN) {
        return true;
    }
    return false;
}

if (typeof exports !== 'undefined') {
    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }
    exports.isSmallScreen = isSmallScreen;
}
