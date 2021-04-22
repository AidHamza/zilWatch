const ZilSwapDexAddress = "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w";
const ZilpayStatus = Object.freeze({
    "not_installed": 1,
    "locked": 2,
    "not_connected": 3,
    "not_mainnet": 4,
    'connected': 5
});
const MAX_RETRY = 5;

/** Returns a Promise. */
function connectZilpayService() {
    return window.zilPay.wallet.connect();
}

/** Void function. invokes onCompleteCallback(string balance) function after computation is done. */
async function computeZilBalance(account, onCompleteCallback) {
    computeZilBalanceWithRetry(account, onCompleteCallback, MAX_RETRY);
}

function computeZilBalanceWithRetry(account, onCompleteCallback, retryRemaining) {
    if (retryRemaining <= 0) {
        console.log("computeZilBalanceWithRetry failed! Out of retries!");
        return;
    }
    window.zilPay.blockchain.getBalance(account.bech32)
        .then(function (data) {
            retryCounter = 0; // Successful
            var userFriendlyZilBalance = convertNumberQaToDecimalString(parseInt(data.result.balance), /* decimals= */ 12);
            onCompleteCallback(userFriendlyZilBalance);
        })
        .catch(function () {
            console.log("computeZilBalanceWithRetry failed!");
            computeZilBalanceWithRetry(account, onCompleteCallback, retryRemaining - 1)
        });
}

/** Void function. invokes onCompleteCallback(string balance, string ticker) function after computation is done. */
async function computeZrcTokensPrice(zrcTokensPropertiesMap, onCompleteCallback) {
    computeZrcTokensPriceWithRetry(zrcTokensPropertiesMap, onCompleteCallback, MAX_RETRY);
}

function computeZrcTokensPriceWithRetry(zrcTokensPropertiesMap, onCompleteCallback, retryRemaining) {
    if (retryRemaining <= 0) {
        console.log("computeZrcTokensPriceWithRetry failed! Out of retries!");
        return;
    }
    window.zilPay.blockchain.getSmartContractState(ZilSwapDexAddress)
        .then(function (data) {
            retryCounter = 0; // Successful
            for (const key in zrcTokensPropertiesMap) {
                let zrcTokenProperties = zrcTokensPropertiesMap[key];
                let zrcTokenAddressBase16 = window.zilPay.crypto.fromBech32Address(zrcTokenProperties.address).toLowerCase();

                let zrcTokenPriceInZilNumber = getZrcTokenPriceInZilFromZilswapDexState(data, zrcTokenAddressBase16, zrcTokenProperties.decimals);
                let zrcTokenPriceInZil = convertNumberQaToDecimalString(zrcTokenPriceInZilNumber, /* decimals= */ 0);

                retryCounterLocal = 0; // Successful
                onCompleteCallback(zrcTokenPriceInZil, zrcTokenProperties.ticker);
            }
        })
        .catch(function () {
            console.log("computeZrcTokensPriceWithRetry failed!");
            computeZrcTokensPriceWithRetry(zrcTokensPropertiesMap, onCompleteCallback, retryRemaining - 1)
        });
}

/** Void function. invokes onCompleteCallback(string balance, string ticker) function after computation is done. */
async function computeZrcTokensBalance(account, zrcTokensPropertiesMap, onCompleteCallback) {
    for (const key in zrcTokensPropertiesMap) {
        let zrcTokenProperties = zrcTokensPropertiesMap[key];
        let walletAddressBase16 = account.base16.toLowerCase();

        // Ignore Promise result, not important.
        computeSingleZrcTokenBalance(zrcTokenProperties, walletAddressBase16, onCompleteCallback);
    }
}

/** Private async function, to compute a single zrcToken. */
async function computeSingleZrcTokenBalance(zrcTokenProperties, walletAddressBase16, onCompleteCallback) {
    computeSingleZrcTokenBalanceWithRetry(zrcTokenProperties, walletAddressBase16, onCompleteCallback, MAX_RETRY);
}

function computeSingleZrcTokenBalanceWithRetry(zrcTokenProperties, walletAddressBase16, onCompleteCallback, retryRemaining) {
    if (retryRemaining <= 0) {
        console.log("computeSingleZrcTokenBalanceWithRetry failed! Out of retries!");
        return;
    }
    window.zilPay.blockchain.getSmartContractSubState(zrcTokenProperties.address, "balances", [walletAddressBase16])
        .then(function (data) {
            retryCounter = 0; // Successful
            let zrcTokenBalanceNumberQa = parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(data, walletAddressBase16);
            let zrcTokenBalanceString = convertNumberQaToDecimalString(zrcTokenBalanceNumberQa, zrcTokenProperties.decimals);
            onCompleteCallback(zrcTokenBalanceString, zrcTokenProperties.ticker);
        })
        .catch(function () {
            console.log("computeSingleZrcTokenBalanceWithRetry(%s) failed!", zrcTokenProperties.ticker);
            computeSingleZrcTokenBalanceWithRetry(zrcTokenProperties, walletAddressBase16, onCompleteCallback, retryRemaining - 1)
        });
}

/** Void function. invokes onCompleteCallback(string balance, string ticker) function after computation is done. */
async function computeZrcTokensZilSwapLpBalance(account, zrcTokensPropertiesMap, onCompleteCallback) {
    computeZrcTokensZilSwapLpBalanceWithRetry(account, zrcTokensPropertiesMap, onCompleteCallback, MAX_RETRY);
}

function computeZrcTokensZilSwapLpBalanceWithRetry(account, zrcTokensPropertiesMap, onCompleteCallback, retryRemaining) {
    if (retryRemaining <= 0) {
        console.log("computeZrcTokensZilSwapLpBalanceWithRetry failed! Out of retries!");
        return;
    }
    window.zilPay.blockchain.getSmartContractState(ZilSwapDexAddress)
        .then(function (data) {
            retryCounter = 0; // Successful

            for (const key in zrcTokensPropertiesMap) {
                let zrcTokenProperties = zrcTokensPropertiesMap[key];
                let zrcTokenAddressBase16 = window.zilPay.crypto.fromBech32Address(zrcTokenProperties.address).toLowerCase();

                let walletPoolStatus = getSingleTokenLpStatusFromZilswapDexState(data, zrcTokenAddressBase16, zrcTokenProperties.decimals, account.base16.toLowerCase());

                if (walletPoolStatus) {
                    let poolSharePercent = parseFloat((walletPoolStatus.shareRatio) * 100).toPrecision(3);
                    let ourZilShare = convertNumberQaToDecimalString(walletPoolStatus.zilAmount, /* decimals= */ 0);
                    let ourTokenShare = convertNumberQaToDecimalString(walletPoolStatus.zrcTokenAmount, /* decimals= */ 0);
                    onCompleteCallback(poolSharePercent, ourZilShare, ourTokenShare, zrcTokenProperties.ticker);
                }
            }
        })
        .catch(function () {
            console.log("computeZrcTokensZilSwapLpBalanceWithRetry failed!");
            computeZrcTokensZilSwapLpBalanceWithRetry(account, zrcTokensPropertiesMap, onCompleteCallback, retryRemaining - 1);
        });
}

async function computeZilPriceInUsd(onCompleteCallback) {
    $.ajax({
        type: "GET",
        url: "https://api.coingecko.com/api/v3/simple/price?ids=zilliqa&vs_currencies=usd",
        retryLimit: MAX_RETRY,
        success: function (data) {
            onCompleteCallback(data.zilliqa.usd);
        },
        error: function (xhr, textStatus, errorThrown) {
            if (this.retryLimit--) {
                // Try again
                $.ajax(this);
                return;
            }
        }
    });
}

async function computeTotalLpRewardNextEpoch(account, onCompleteCallback) {
    $.ajax({
        type: "GET",
        url: "https://stats.zilswap.org/distribution/current/" + account.bech32,
        retryLimit: MAX_RETRY,
        success: function (contractAddressToRewardMap) {
            // Sum all the rewards from all pools
            let totalRewardQa = 0;
            for (let addressKey in contractAddressToRewardMap) {
                totalRewardQa += parseInt(contractAddressToRewardMap[addressKey]);
            }
            let totalRewardZwap = convertNumberQaToDecimalString(totalRewardQa, zrcTokensPropertiesMap['ZWAP'].decimals)
            onCompleteCallback(totalRewardZwap);
        },
        error: function (xhr, textStatus, errorThrown) {
            if (this.retryLimit--) {
                // Try again
                $.ajax(this);
                return;
            }
        }
    });
}

/** Returns an enum. */
function getZilpayStatus() {
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

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}