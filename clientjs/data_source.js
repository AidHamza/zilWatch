
const MAX_RETRY = 5;
const AJAX_TIMEOUT_MS = 30000; // 30s
const ZILLIQA_API_URL = "https://api.zilliqa.com/";

/**
 * ===============================================================================
 */

/**
 * Wrapper to GET query via ajax.
 * @param {string} method the string to pass to the "method" in the POST query
 * @param {array} params the params to pass to the "params" in the POST query
 * @param {function?} successCallback optional function to execute upon success. function is in the form of successCallback(data);
 * @param {function?} errorCallback optional function to execute upon failure. function is in the form of errorCallback();
 */
async function queryUrlGetAjax(urlToGet, successCallback, errorCallback) {
    $.ajax({
        type: "GET",
        url: urlToGet,
        retryLimit: MAX_RETRY,
        success: function (data) {
            successCallback(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Failed query! ", urlToGet, xhr.responseText, textStatus, errorThrown);

            if (this.retryLimit--) {
                console.log("Retrying..." + "(" + this.retryLimit + ")");
                // Try again
                $.ajax(this);
                return;
            }
            console.log("No retries left!");

            errorCallback();
        },
        timeout: AJAX_TIMEOUT_MS
    });
}

/**
 * Wrapper to query Zilliqa API via ajax.
 * @param {string} method the string to pass to the "method" in the POST query
 * @param {array} params the params to pass to the "params" in the POST query
 * @param {function?} successCallback optional function to execute upon success. function is in the form of successCallback(data);
 * @param {function?} errorCallback optional function to execute upon failure. function is in the form of errorCallback();
 */
async function queryZilliqaApiAjax(method, params, successCallback, errorCallback) {
    $.ajax({
        type: "POST",
        url: ZILLIQA_API_URL,
        data: JSON.stringify({
            "id": "1",
            "jsonrpc": "2.0",
            "method": method,
            "params": params
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        retryLimit: MAX_RETRY,
        success: function (data) {
            successCallback(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Failed query! ", method, xhr.responseText, textStatus, errorThrown);

            if (this.retryLimit--) {
                console.log("Retrying..." + "(" + this.retryLimit + ")");
                // Try again
                $.ajax(this);
                return;
            }
            console.log("No retries left!");

            errorCallback();
        },
        timeout: AJAX_TIMEOUT_MS
    });
}

/**
 * ===============================================================================
 */

function computeTotalLpRewardNextEpoch(walletAddressBech32, onLpRewardNextEpochLoaded) {
    queryUrlGetAjax(
        /* urlToGet= */
        "https://stats.zilswap.org/distribution/current/" + walletAddressBech32,
        /* successCallback= */
        function (data) {
            onLpRewardNextEpochLoaded(data);
        },
        /* errorCallback= */
        function () {});
}

function computeTotalLpRewardPastEpoch(walletAddressBech32, onLpRewardPastEpochLoaded) {
    queryUrlGetAjax(
        /* urlToGet= */
        "https://stats.zilswap.org/distribution/data/" + walletAddressBech32,
        /* successCallback= */
        function (data) {
            onLpRewardPastEpochLoaded(data);
        },
        /* errorCallback= */
        function () {});
}

function computeLpEpochInfo(onLpCurrentEpochInfoLoaded) {
    if (zilswapDexEpochInfoData) {
        // Use cache if available.
        onLpCurrentEpochInfoLoaded(zilswapDexEpochInfoData);
        return;
    }

    queryUrlGetAjax(
        /* urlToGet= */
        "https://stats.zilswap.org/epoch/info",
        /* successCallback= */
        function (data) {
            onLpCurrentEpochInfoLoaded(data);
        },
        /* errorCallback= */
        function () {});
}