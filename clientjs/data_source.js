const ZilSwapDexAddress = "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w";
const ZilSwapDexAddressBase16 = "Ba11eB7bCc0a02e947ACF03Cc651Bfaf19C9EC00";
const ZilSeedNodeStakingImplementationAddress = "zil15lr86jwg937urdeayvtypvhy6pnp6d7p8n5z09"; // v 1.1
const ZilSeedNodeStakingImplementationAddressBase16 = "a7C67D49C82c7dc1B73D231640B2e4d0661D37c1"; // v 1.1

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

/** Void function. invokes onZilWalletBalanceLoaded(string balance) function after computation is done. */
function computeZilBalance(walletAddressBase16, onZilWalletBalanceLoaded) {
    incrementShowSpinnerWalletBalance();

    queryZilliqaApiAjax(
        /* method= */
        "GetBalance",
        /* params= */
        [walletAddressBase16.substring(2)],
        /* successCallback= */
        function (data) {
            onZilWalletBalanceLoaded(data);
            decrementShowSpinnerWalletBalance();
        },
        /* errorCallback= */
        function () {
            decrementShowSpinnerWalletBalance();
        });
}

/**
 * --------------------------------------------------------------------------------
 */

function computeZrcTokensPriceAndZilswapLpBalance(onZilswapDexStatusLoaded, walletAddressBase16) {
    if (zilswapDexSmartContractStateData) {
        // Use cache if available.
        if (zilswapDexSmartContractStateData.result.balances) {
            onZilswapDexStatusLoaded(zilswapDexSmartContractStateData, walletAddressBase16);
            return;
        }
        incrementShowSpinnerLpBalance();

        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractSubState",
            /* params= */
            [ZilSwapDexAddressBase16, "balances", []],
            /* successCallback= */
            function (data) {
                if (data.result.balances) {
                    zilswapDexSmartContractStateData.result.balances = data.result.balances;
                    onZilswapDexStatusLoaded(zilswapDexSmartContractStateData, walletAddressBase16);
                }
                decrementShowSpinnerLpBalance();
            },
            /* errorCallback= */
            function () {
                decrementShowSpinnerLpBalance();
            });

    } else {
        incrementShowSpinnerLpBalance();

        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractState",
            /* params= */
            [ZilSwapDexAddressBase16],
            /* successCallback= */
            function (data) {
                zilswapDexSmartContractStateData = data;
                onZilswapDexStatusLoaded(zilswapDexSmartContractStateData, walletAddressBase16);
                decrementShowSpinnerLpBalance();
            },
            /* errorCallback= */
            function () {
                decrementShowSpinnerLpBalance();
            });
    }
}

/**
 * --------------------------------------------------------------------------------
 */

/** Void function. invokes onZrcTokenWalletBalanceLoaded(number zrcBalanceQa, string ticker) function after computation is done. */
function computeZrcTokensBalance(walletAddressBase16, zrcTokenPropertiesListMap, onZrcTokenWalletBalanceLoaded) {
    for (const key in zrcTokenPropertiesListMap) {
        let zrcTokenProperties = zrcTokenPropertiesListMap[key];

        // Ignore Promise result, not important.
        computeSingleZrcTokenBalance(zrcTokenProperties, walletAddressBase16, onZrcTokenWalletBalanceLoaded);
    }
}

/** Private function, to compute a single zrcToken. */
function computeSingleZrcTokenBalance(zrcTokenProperties, walletAddressBase16, onZrcTokenWalletBalanceLoaded) {
    incrementShowSpinnerWalletBalance();

    queryZilliqaApiAjax(
        /* method= */
        "GetSmartContractSubState",
        /* params= */
        [zrcTokenProperties.address_base16.substring(2), "balances", [walletAddressBase16]],
        /* successCallback= */
        function (data) {
            let zrcTokenBalanceNumberQa = parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(data, walletAddressBase16);
            onZrcTokenWalletBalanceLoaded(zrcTokenBalanceNumberQa, zrcTokenProperties);
            decrementShowSpinnerWalletBalance();
        },
        /* errorCallback= */
        function () {
            decrementShowSpinnerWalletBalance();
        });
}

/**
 * --------------------------------------------------------------------------------
 */

/** Private function, to compute ZIL staking balance */
function computeZilStakingBalance(walletAddressBase16, onZilStakingBalanceLoaded) {
    incrementShowSpinnerStakingBalance();

    queryZilliqaApiAjax(
        /* method= */
        "GetSmartContractSubState",
        /* params= */
        [ZilSeedNodeStakingImplementationAddressBase16, "deposit_amt_deleg", [walletAddressBase16]],
        /* successCallback= */
        function (data) {
            if (data.result && data.result.deposit_amt_deleg) {
                let ssnToBalanceMap = data.result.deposit_amt_deleg[walletAddressBase16];
                if (ssnToBalanceMap) {
                    for (let ssnAddress in ssnToBalanceMap) {
                        onZilStakingBalanceLoaded(ssnToBalanceMap[ssnAddress], ssnAddress);
                    }
                }
            }
            decrementShowSpinnerStakingBalance();
        },
        /* errorCallback= */
        function () {
            decrementShowSpinnerStakingBalance();
        });
}

/** Private function, to compute ZIL pending withdrawal balance */
function computeZilStakingWithdrawalPendingBalance(walletAddressBase16, onZilStakingWithdrawalPendingBalanceLoaded) {
    incrementShowSpinnerStakingBalance();

    queryZilliqaApiAjax(
        /* method= */
        "GetSmartContractSubState",
        /* params= */
        [ZilSeedNodeStakingImplementationAddressBase16, "withdrawal_pending", [walletAddressBase16]],
        /* successCallback= */
        function (data) {
            if (data.result && data.result.withdrawal_pending) {
                let blockNumberToBalanceMap = data.result.withdrawal_pending[walletAddressBase16];
                if (blockNumberToBalanceMap) {
                    onZilStakingWithdrawalPendingBalanceLoaded(blockNumberToBalanceMap);
                }
            }
            decrementShowSpinnerStakingBalance();
        },
        /* errorCallback= */
        function () {
            decrementShowSpinnerStakingBalance();
        });
}

/**
 * ===============================================================================
 */

function computeCoinPriceInFiat(currencyCode, onCoinFiatPriceLoaded) {
    // Update cache for computation
    if (coinPriceCoingecko24hAgoData && coinPriceCoingecko24hAgoData.zilliqa && coinPriceCoingecko24hAgoData.zilliqa[currencyCode]) {
        zilPriceInFiat24hAgoFloat = parseFloat(coinPriceCoingecko24hAgoData.zilliqa[currencyCode]);
    }
    if (coinPriceCoingeckoData && coinPriceCoingeckoData.zilliqa && coinPriceCoingeckoData.zilliqa[currencyCode]) {
        zilPriceInFiatFloat = parseFloat(coinPriceCoingeckoData.zilliqa[currencyCode]);
    }

    if (coinPriceCoingeckoData) {
        // Use cache if available
        onCoinFiatPriceLoaded(currencyCode, coinPriceCoingeckoData);
        return;
    }

    let allCurrenciesCode = 'usd';
    for (let code in currencyMap) {
        allCurrenciesCode += ',' + code;
    }

    let allCoinsCode = 'zilliqa';
    for (let coinCode in coinMap) {
        allCoinsCode += ',' + coinMap[coinCode].coingecko_id;
    }

    queryUrlGetAjax(
        /* urlToGet= */
        "https://api.coingecko.com/api/v3/simple/price?ids=" + allCoinsCode + "&vs_currencies=" + allCurrenciesCode,
        /* successCallback= */
        function (data) {
            if (data.zilliqa && data.zilliqa[currencyCode]) {
                zilPriceInFiatFloat = parseFloat(data.zilliqa[currencyCode]);
            }
            onCoinFiatPriceLoaded(currencyCode, data);
        },
        /* errorCallback= */
        function () {});
}

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

function compute24hLpTradeVolume(onLpTradeVolumeLoaded) {
    if (zilswapDex24hTradeVolumeData) {
        // Use cache if available.
        onLpTradeVolumeLoaded(zilswapDex24hTradeVolumeData);
        return;
    }

    let currentDate = new Date();
    let currentTimeSeconds = currentDate.getTime() / 1000;
    let oneDayAgoSeconds = currentTimeSeconds - (60 * 60 * 24);

    queryUrlGetAjax(
        /* urlToGet= */
        "https://stats.zilswap.org/volume?from=" + oneDayAgoSeconds.toFixed(0),
        /* successCallback= */
        function (data) {
            onLpTradeVolumeLoaded(data);
        },
        /* errorCallback= */
        function () {});
}

function computeZrcTokensPriceInZil(onZilswapDexStatusLoaded) {
    if (zilswapDexSmartContractStateData) {
        // Use cache if available.
        onZilswapDexStatusLoaded(zilswapDexSmartContractStateData);
        return;
    }
    queryZilliqaApiAjax(
        /* method= */
        "GetSmartContractSubState",
        /* params= */
        [ZilSwapDexAddressBase16, "pools", []],
        /* successCallback= */
        function (data) {
            onZilswapDexStatusLoaded(data);
        },
        /* errorCallback= */
        function () {});
}