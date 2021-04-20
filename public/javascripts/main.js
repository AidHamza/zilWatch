const ZilSwapDexAddress = "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w";
const ZilpayStatus = Object.freeze({ "not_installed": 1, "locked": 2, "not_connected": 3, "not_mainnet": 4, 'connected': 5 });
const MAX_RETRY = 5;
const RETRY_INTERVAL_MS = 1500;

/** Returns a Promise. */
function connectZilpayService() {
    return window.zilPay.wallet.connect();
}

/** Void function. invokes onCompleteCallback(string balance) function after computation is done. */
async function computeZilBalance(account, onCompleteCallback) {

    let retryCounter = MAX_RETRY;
    while (retryCounter--) {

        window.zilPay.blockchain.getBalance(account.bech32)
            .then(function (data) {
                retryCounter = 0; // Successful
                var userFriendlyZilBalance = convertQaToDecimalString(data.result.balance, /* decimals= */ 12);
                onCompleteCallback(userFriendlyZilBalance);
            })
            .catch(function () {
                console.log("computeZilBalance failed!");
            });

        await sleep(RETRY_INTERVAL_MS);
    }
}


/** Void function. invokes onCompleteCallback(string balance, string ticker) function after computation is done. */
async function computeZrcTokensPrice(zrcTokensPropertiesMap, onCompleteCallback) {

    let retryCounter = MAX_RETRY;
    while (retryCounter--) {

        window.zilPay.blockchain.getSmartContractState(ZilSwapDexAddress)
            .then(function (data) {
                retryCounter = 0; // Successful

                for (const key in zrcTokensPropertiesMap) {
                    let retryCounterLocal = MAX_RETRY;
                    while (retryCounterLocal--) {
                        try {
                            let zrcTokenProperties = zrcTokensPropertiesMap[key];
                            let zrcTokenAddress = window.zilPay.crypto.fromBech32Address(zrcTokenProperties.address).toLowerCase();

                            let zilPoolReserveQa = data.result.pools[zrcTokenAddress].arguments[0];
                            let tokenPoolReserveQa = data.result.pools[zrcTokenAddress].arguments[1];

                            let zilAmount = zilPoolReserveQa / Math.pow(10, 12);
                            let zrcTokenAmount = tokenPoolReserveQa / Math.pow(10, zrcTokenProperties.decimals);

                            // ZIL amount per 1 ZRC-2 token
                            let zrcTokenPriceInZil = convertNumberQaToDecimalString(zilAmount / zrcTokenAmount, /* decimals= */ 0);

                            retryCounterLocal = 0; // Successful
                            onCompleteCallback(zrcTokenPriceInZil, zrcTokenProperties.ticker);
                        }
                        catch (err) {
                            console.log("computeZrcTokensPrice(%s) failed! %s", key, err);
                        }
                    }
                }
            })
            .catch(function () {
                console.log("computeZrcTokensPrice failed!");
            });

        await sleep(RETRY_INTERVAL_MS);
    }
}

/** Void function. invokes onCompleteCallback(string balance, string ticker) function after computation is done. */
async function computeZrcTokensBalance(account, zrcTokensPropertiesMap, onCompleteCallback) {
    for (const key in zrcTokensPropertiesMap) {
        let zrcTokenProperties = zrcTokensPropertiesMap[key];
        let walletAddressBase16 = account.base16.toLowerCase();

        // Ignore Promise result, not important.
        computeZrcTokenBalance(zrcTokenProperties, walletAddressBase16, onCompleteCallback);
    }
}

/** Private async function, to compute a single zrcToken. */
async function computeZrcTokenBalance(zrcTokenProperties, walletAddressBase16, onCompleteCallback) {
    let retryCounter = MAX_RETRY;
    while (retryCounter--) {

        window.zilPay.blockchain.getSmartContractSubState(zrcTokenProperties.address, "balances", [walletAddressBase16])
            .then(function (data) {
                retryCounter = 0; // Successful
                
                let zrcTokenBalance = null;
                if (data.result && data.result.balances) {
                    const zrcTokenBalanceQa = data.result.balances[walletAddressBase16];
                    if (zrcTokenBalanceQa) {
                        zrcTokenBalance = convertQaToDecimalString(zrcTokenBalanceQa, zrcTokenProperties.decimals);
                    }
                }
                onCompleteCallback(zrcTokenBalance, zrcTokenProperties.ticker);
            })
            .catch(function () {
                console.log("computeZrcTokensBalance(%s) failed!", zrcTokenProperties.ticker);
            });

        await sleep(RETRY_INTERVAL_MS);
    }
}

/** Void function. invokes onCompleteCallback(string balance, string ticker) function after computation is done. */
async function computeZrcTokensZilSwapLpBalance(account, zrcTokensPropertiesMap, onCompleteCallback) {

    let retryCounter = MAX_RETRY;
    while (retryCounter--) {

        window.zilPay.blockchain.getSmartContractState(ZilSwapDexAddress)
            .then(function (data) {
                retryCounter = 0; // Successful

                for (const key in zrcTokensPropertiesMap) {

                    let retryCounterLocal = MAX_RETRY;
                    while (retryCounterLocal--) {
                        try {
                            let zrcTokenProperties = zrcTokensPropertiesMap[key];
                            let zrcTokenAddress = window.zilPay.crypto.fromBech32Address(zrcTokenProperties.address).toLowerCase();

                            let ourLiqudity = data.result.balances[zrcTokenAddress][account.base16.toLowerCase()];

                            // If we don't have liqudity in this LP, skip and go to the next one.
                            if (!ourLiqudity) {
                                onCompleteCallback(/* ourShareRatio= */ null, 0, 0, zrcTokenProperties.ticker);
                                continue;
                            }
                            let zilPoolReserveQa = data.result.pools[zrcTokenAddress].arguments[0];
                            let tokenPoolReserveQa = data.result.pools[zrcTokenAddress].arguments[1];
                            let poolLiquidity = data.result.total_contributions[zrcTokenAddress];

                            let ourShareRatio = ourLiqudity / poolLiquidity;

                            let ourZilShare = convertNumberQaToDecimalString(ourShareRatio * zilPoolReserveQa, /* decimals= */ 12);
                            let ourTokenShare = convertNumberQaToDecimalString(ourShareRatio * tokenPoolReserveQa, zrcTokenProperties.decimals);

                            retryCounterLocal = 0; // Successful
                            onCompleteCallback(ourShareRatio, ourZilShare, ourTokenShare, zrcTokenProperties.ticker);
                        }
                        catch (err) {
                            console.log("computeZrcTokensZilSwapLpBalance(%s) failed! %s", key, err);
                        }
                    }
                }
            })
            .catch(function () {
                console.log("computeZrcTokensZilSwapLpBalance failed!");
            });

        await sleep(RETRY_INTERVAL_MS);
    }
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
            let totalRewardZwap = convertQaToDecimalString(totalRewardQa, /* decimals= */ 12)
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

/* Returns string. */
function shortBech32Address(bech32Address) {
    var lastFive = bech32Address.substr(bech32Address.length - 5);
    var firstFive = bech32Address.substr(0, 5);
    return firstFive.concat("...", lastFive);
}

/**
 * Returns string. decimals is 6 for li (gas), 12 for ZIL, variable decimals on ZRC tokens.
 * 
 * balanceQa = 123456789
 * len = 9
 * decimals = 5
 * decimalIndex =  9 - 5 = 4
 * exponent = substring(0, 4)= 1234
 * mantissa = substring(4, 4+3) = 567
 * result = "1234.567"
 * 
 * balanceQa = 12345
 * len = 5
 * decimals = 5
 * decimalIndex = 5 - 5 = 0
 * exponent = 0
 * mantissa = substring(0, 0+3) = 123
 * result = "0.123"
 * 
 * balanceQa = 12345
 * len = 5
 * decimals = 6
 * decimalIndex = 5 - 6 = -1
 * exponent = 0
 * mantissa = substring(0, 0+3) = 123 // Need to append "0", decimalIndex times, "0123"
 * result = "0.0123"
 */
function convertQaToDecimalString(balanceQa, decimals) {
    let stringBalanceQa = balanceQa.toString();
    let stringBalanceQaLength = stringBalanceQa.length;
    if (stringBalanceQaLength === 0) {
        return null;
    }

    let decimalIndex = stringBalanceQaLength - decimals;
    // Compute exponent (the number before the decimal '.')
    let exponent = "0";
    if (decimalIndex > 0) {
        exponent = stringBalanceQa.substring(0, decimalIndex);
    }

    // Adjust decimal place based on exponent
    let decimalPlace = Math.max(4 - exponent.length, 0);
    if (exponent === "0") {
        decimalPlace = 4;
    }
    if (decimalPlace == 0) {
        return exponent;
    }

    // Compute mantissa (the number after the decimal '.')
    let mantissa = "";
    if (decimalIndex >= 0) {
        mantissa = stringBalanceQa.substring(decimalIndex, decimalIndex + decimalPlace);
    } else {
        mantissa = stringBalanceQa.substring(0, decimalPlace);
        // decimalIndex is negative;
        let i;
        for (i = decimalIndex; i < 0; i++) {
            mantissa = "0".concat(mantissa);
        }
    }

    // If exponent has no value and mantissa is undefined, return.
    if (exponent === "0" || exponent === "") {
        if (mantissa === "" || isAllZeroes(mantissa)) {
            return null;
        }
    }
    return exponent.concat('.').concat(mantissa);
}

/** Returns true if the string given only contains zeroes. */
function isAllZeroes(stringVar) {
    if (stringVar.match(/^0+$/)) {
        return true;
    }
    return false;
}

const currencyFractionDigits = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
}).resolvedOptions().maximumFractionDigits;

/**
 * Given a float of USD value, return USD formatted string. e.g. "123,543.43".
 */
function formatUsd(usdValue) {
    return usdValue.toLocaleString('en-US', { maximumFractionDigits: currencyFractionDigits });
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
