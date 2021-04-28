// zilpay_utils.js
// Depend on injected Zilpay in window.zilPay

const ZilpayStatus = Object.freeze({
    "not_installed": 1,
    "locked": 2,
    "not_connected": 3,
    "not_mainnet": 4,
    'connected': 5
});

/** Returns an enum. */
function checkZilpayStatus() {
    if (!window.zilPay) {
        return ZilpayStatus.not_installed;
    } else if (!window.zilPay.wallet.isEnable) {
        return ZilpayStatus.locked;
    } else if (!window.zilPay.wallet.isConnect) {
        return ZilpayStatus.not_connected;
    } else if (window.zilPay.wallet.net !== 'mainnet') {
        return ZilpayStatus.not_mainnet;
    }
    return ZilpayStatus.connected;
}

if (typeof exports !== 'undefined') {
    exports.ZilpayStatus = ZilpayStatus;
}