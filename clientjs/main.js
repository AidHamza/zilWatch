const ZilSwapDexAddress = "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w";
const ZilpayStatus = Object.freeze({
    "not_installed": 1,
    "locked": 2,
    "not_connected": 3,
    "not_mainnet": 4,
    'connected': 5
});
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
                var userFriendlyZilBalance = convertNumberQaToDecimalString(parseInt(data.result.balance), /* decimals= */ 12);
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
                        } catch (err) {
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
                let zrcTokenBalanceNumberQa = parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(data, walletAddressBase16);
                let zrcTokenBalanceString = convertNumberQaToDecimalString(zrcTokenBalanceNumberQa, zrcTokenProperties.decimals);
                onCompleteCallback(zrcTokenBalanceString, zrcTokenProperties.ticker);
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
                                onCompleteCallback( /* ourShareRatio= */ null, 0, 0, zrcTokenProperties.ticker);
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
                        } catch (err) {
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
            let totalRewardZwap = convertNumberQaToDecimalString(totalRewardQa, /* decimals= */ 12)
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