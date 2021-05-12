const ZilSwapDexAddress = "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w";
const ZilSwapDexAddressBase16 = "Ba11eB7bCc0a02e947ACF03Cc651Bfaf19C9EC00";
const ZilSeedNodeStakingImplementationAddress = "zil1k7qwsz2m3w595u29je0dvv4nka62c5wwrp8r8p";
const MAX_RETRY = 10;

/**
 * ===============================================================================
 */

/** Void function. invokes onZilWalletBalanceLoaded(string balance) function after computation is done. */
async function computeZilBalance(account, onZilWalletBalanceLoaded) {
    computeZilBalanceWithRetry(account, onZilWalletBalanceLoaded, MAX_RETRY);
}

function computeZilBalanceWithRetry(account, onZilWalletBalanceLoaded, retryRemaining) {
    if (retryRemaining <= 0) {
        console.log("computeZilBalanceWithRetry failed! Out of retries!");
        return;
    }
    window.zilPay.blockchain.getBalance(account.bech32)
        .then(function (data) {
            onZilWalletBalanceLoaded(data.result.balance);
        })
        .catch(function () {
            console.log("computeZilBalanceWithRetry failed! %s", retryRemaining);
            computeZilBalanceWithRetry(account, onZilWalletBalanceLoaded, retryRemaining - 1);
        });
}

/**
 * --------------------------------------------------------------------------------
 */

async function computeZrcTokensPriceAndZilswapLpBalance(onZilswapDexStatusLoaded, account) {
    computeZrcTokensPriceAndZilswapLpBalanceWithRetry(onZilswapDexStatusLoaded, account, MAX_RETRY);
}

function computeZrcTokensPriceAndZilswapLpBalanceWithRetry(onZilswapDexStatusLoaded, account, retryRemaining) {
    if (zilswapDexSmartContractStateData) {
        // Use cache if available.
        onZilswapDexStatusLoaded(zilswapDexSmartContractStateData, account);
        return;
    }
    if (retryRemaining <= 0) {
        console.log("computeZrcTokensPriceAndZilswapLpBalanceWithRetry failed! Out of retries!");
        return;
    }
    window.zilPay.blockchain.getSmartContractState(ZilSwapDexAddress)
        .then(function (data) {
            onZilswapDexStatusLoaded(data, account);
        })
        .catch(function () {
            console.log("computeZrcTokensPriceAndZilswapLpBalanceWithRetry failed! %s", retryRemaining);
            computeZrcTokensPriceAndZilswapLpBalanceWithRetry(onZilswapDexStatusLoaded, account, retryRemaining - 1);
        });
}

/**
 * --------------------------------------------------------------------------------
 */

/** Void function. invokes onZrcTokenWalletBalanceLoaded(number zrcBalanceQa, string ticker) function after computation is done. */
async function computeZrcTokensBalance(account, zrcTokenPropertiesListMap, onZrcTokenWalletBalanceLoaded) {
    for (const key in zrcTokenPropertiesListMap) {
        let zrcTokenProperties = zrcTokenPropertiesListMap[key];
        let walletAddressBase16 = account.base16.toLowerCase();

        // Ignore Promise result, not important.
        computeSingleZrcTokenBalance(zrcTokenProperties, walletAddressBase16, onZrcTokenWalletBalanceLoaded);
    }
}

/** Private async function, to compute a single zrcToken. */
async function computeSingleZrcTokenBalance(zrcTokenProperties, walletAddressBase16, onZrcTokenWalletBalanceLoaded) {
    computeSingleZrcTokenBalanceWithRetry(zrcTokenProperties, walletAddressBase16, onZrcTokenWalletBalanceLoaded, MAX_RETRY);
}

function computeSingleZrcTokenBalanceWithRetry(zrcTokenProperties, walletAddressBase16, onZrcTokenWalletBalanceLoaded, retryRemaining) {
    if (retryRemaining <= 0) {
        console.log("computeSingleZrcTokenBalanceWithRetry failed! Out of retries!");
        return;
    }
    window.zilPay.blockchain.getSmartContractSubState(zrcTokenProperties.address, "balances", [walletAddressBase16])
        .then(function (data) {
            let zrcTokenBalanceNumberQa = parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(data, walletAddressBase16);
            onZrcTokenWalletBalanceLoaded(zrcTokenBalanceNumberQa, zrcTokenProperties);
        })
        .catch(function () {
            console.log("computeSingleZrcTokenBalanceWithRetry(%s) failed! %s", zrcTokenProperties.ticker, retryRemaining);
            computeSingleZrcTokenBalanceWithRetry(zrcTokenProperties, walletAddressBase16, onZrcTokenWalletBalanceLoaded, retryRemaining - 1);
        });
}

/**
 * --------------------------------------------------------------------------------
 */

/** Private async function, to compute ZIL staking balance */
async function computeZilStakingBalance(account, onZilStakingBalanceLoaded) {
    computeZilStakingBalanceWithRetry(account, onZilStakingBalanceLoaded, MAX_RETRY);
}

function computeZilStakingBalanceWithRetry(account, onZilStakingBalanceLoaded, retryRemaining) {
    if (retryRemaining <= 0) {
        console.log("computeZilStakingBalanceWithRetry failed! Out of retries!");
        return;
    }
    let walletAddressBase16 = account.base16.toLowerCase();

    window.zilPay.blockchain.getSmartContractSubState(ZilSeedNodeStakingImplementationAddress, "deposit_amt_deleg", [walletAddressBase16])
        .then(function (data) {
            if (data.result && data.result.deposit_amt_deleg) {
                let ssnToBalanceMap = data.result.deposit_amt_deleg[walletAddressBase16];
                if (ssnToBalanceMap) {
                    for (let ssnAddress in ssnToBalanceMap) {
                        onZilStakingBalanceLoaded(ssnToBalanceMap[ssnAddress], ssnAddress);
                    }
                }
            }
        })
        .catch(function () {
            console.log("computeZilStakingBalanceWithRetry failed! %s",retryRemaining);
            computeZilStakingBalanceWithRetry(account, onZilStakingBalanceLoaded, retryRemaining - 1);
        });
}

/** Private async function, to compute ZIL pending withdrawal balance */
async function computeZilStakingWithdrawalPendingBalance(account, onZilStakingWithdrawalPendingBalanceLoaded) {
    computeZilStakingWithdrawalPendingBalanceWithRetry(account, onZilStakingWithdrawalPendingBalanceLoaded, MAX_RETRY);
}

function computeZilStakingWithdrawalPendingBalanceWithRetry(account, onZilStakingWithdrawalPendingBalanceLoaded, retryRemaining) {
    if (retryRemaining <= 0) {
        console.log("computeZilStakingWithdrawalPendingBalanceWithRetry failed! Out of retries!");
        return;
    }
    let walletAddressBase16 = account.base16.toLowerCase();

    window.zilPay.blockchain.getSmartContractSubState(ZilSeedNodeStakingImplementationAddress, "withdrawal_pending", [walletAddressBase16])
        .then(function (data) {
            if (data.result && data.result.withdrawal_pending) {
                let blockNumberToBalanceMap = data.result.withdrawal_pending[walletAddressBase16];
                if (blockNumberToBalanceMap) {
                    onZilStakingWithdrawalPendingBalanceLoaded(blockNumberToBalanceMap);
                }
            }
        })
        .catch(function () {
            console.log("computeZilStakingWithdrawalPendingBalanceWithRetry failed! %s",retryRemaining);
            computeZilStakingWithdrawalPendingBalanceWithRetry(account, onZilStakingWithdrawalPendingBalanceLoaded, retryRemaining - 1);
        });
}

/**
 * ===============================================================================
 */

async function computeZilPriceInFiat(currencyCode, onZilFiatPriceLoaded) {
    if (zilPriceCoingeckoData) {
        // Use cache if available.
        onZilFiatPriceLoaded(currencyCode, zilPriceCoingeckoData);
        return;
    }

    let allCurrenciesCode = 'usd';
    for (let code in currencyMap) {
        allCurrenciesCode += ',' + code;
    }

    $.ajax({
        type: "GET",
        url: "https://api.coingecko.com/api/v3/simple/price?ids=zilliqa&vs_currencies=" + allCurrenciesCode,
        retryLimit: MAX_RETRY,
        success: function (data) {
            onZilFiatPriceLoaded(currencyCode, data);
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

async function computeTotalLpRewardNextEpoch(account, onLpRewardNextEpochLoaded) {
    $.ajax({
        type: "GET",
        url: "https://stats.zilswap.org/distribution/current/" + account.bech32,
        retryLimit: MAX_RETRY,
        success: function (contractAddressToRewardMap) {
            onLpRewardNextEpochLoaded(contractAddressToRewardMap);
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

async function computeLpEpochInfo(onLpCurrentEpochInfoLoaded) {
    if (zilswapDexEpochInfoData) {
        // Use cache if available.
        onLpCurrentEpochInfoLoaded(zilswapDexEpochInfoData);
        return;
    }

    $.ajax({
        type: "GET",
        url: "https://stats.zilswap.org/epoch/info",
        retryLimit: MAX_RETRY,
        success: function (epochInfoData) {
            onLpCurrentEpochInfoLoaded(epochInfoData);
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

async function compute24hLpTradeVolume(onLpTradeVolumeLoaded) {
    if (zilswapDex24hTradeVolumeData) {
        // Use cache if available.
        onLpTradeVolumeLoaded(zilswapDex24hTradeVolumeData);
        return;
    }

    let currentDate = new Date();
    let currentTimeSeconds = currentDate.getTime() / 1000;
    let oneDayAgoSeconds =  currentTimeSeconds - (60 * 60 * 24);

    $.ajax({
        type: "GET",
        url: "https://stats.zilswap.org/volume?from=" + oneDayAgoSeconds.toFixed(0),
        retryLimit: MAX_RETRY,
        success: function (data) {
            onLpTradeVolumeLoaded(data);
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

async function computeZrcTokensPriceInZil(onZilswapDexStatusLoaded) {
    if (zilswapDexSmartContractStateData) {
        // Use cache if available.
        onZilswapDexStatusLoaded(zilswapDexSmartContractStateData);
        return;
    }

    $.ajax({
        type: "POST",
        url: "https://api.zilliqa.com/",
        data: JSON.stringify({
            "id": "1",
            "jsonrpc": "2.0",
            "method": "GetSmartContractState",
            "params": [ZilSwapDexAddressBase16]
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        retryLimit: MAX_RETRY,
        success: function (data) {
            onZilswapDexStatusLoaded(data);
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
