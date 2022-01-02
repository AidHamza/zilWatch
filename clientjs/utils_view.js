MAX_WIDTH_SMALL_SCREEN = 576;

function isSmallScreen() {
    if ($(document).width() < MAX_WIDTH_SMALL_SCREEN) {
        return true;
    }
    return false;
}

function getRewardLpHtmlTemplate(isFirstElement, rewardAmountString, rewardTicker, rewardTokenLogoUrl) {
    let elementString = "";
    if (!isFirstElement) {
        elementString += "<span class='ml-1 mr-1'>+</span>";
    }
    return elementString + "<span class='mr-1'>" + rewardAmountString + "</span>" +
        "<img height='16' src='" + rewardTokenLogoUrl + "' alt='" + rewardTicker + " logo' loading='lazy'/>";
}

if (typeof exports !== 'undefined') {
    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }
    exports.isSmallScreen = isSmallScreen;
    exports.getRewardLpHtmlTemplate = getRewardLpHtmlTemplate;
}
