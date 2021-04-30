const ZilSwapDexAddress = "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w";
const ZilSeedNodeStakingImplementationAddress = "zil1k7qwsz2m3w595u29je0dvv4nka62c5wwrp8r8p";
const MAX_RETRY = 5;

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

async function computeZrcTokensPriceAndZilswapLpBalance(zrcTokensPropertiesMap, onZrcTokenPriceInZilLoaded, account, onZrcTokenLpBalanceLoaded) {
    computeZrcTokensPriceAndZilswapLpBalanceWithRetry(zrcTokensPropertiesMap, onZrcTokenPriceInZilLoaded, account, onZrcTokenLpBalanceLoaded, MAX_RETRY);
}

function computeZrcTokensPriceAndZilswapLpBalanceWithRetry(zrcTokensPropertiesMap, onZrcTokenPriceInZilLoaded, account, onZrcTokenLpBalanceLoaded, retryRemaining) {
    if (retryRemaining <= 0) {
        console.log("computeZrcTokensPriceAndZilswapLpBalanceWithRetry failed! Out of retries!");
        return;
    }
    window.zilPay.blockchain.getSmartContractState(ZilSwapDexAddress)
        .then(function (data) {
            for (const key in zrcTokensPropertiesMap) {
                let zrcTokenProperties = zrcTokensPropertiesMap[key];
                let zrcTokenAddressBase16 = window.zilPay.crypto.fromBech32Address(zrcTokenProperties.address).toLowerCase();

                // To get ZrcTokensPrice in ZIL, already in decimal.
                let zrcTokenPriceInZilNumber = getZrcTokenPriceInZilFromZilswapDexState(data, zrcTokenAddressBase16, zrcTokenProperties.decimals);

                onZrcTokenPriceInZilLoaded(zrcTokenPriceInZilNumber, zrcTokenProperties.ticker);

                // To get ZilswapLp balance.
                let walletPoolStatus = getSingleTokenLpStatusFromZilswapDexState(data, zrcTokenAddressBase16, zrcTokenProperties.decimals, account.base16.toLowerCase());
                onZrcTokenLpBalanceLoaded(walletPoolStatus, zrcTokenProperties.ticker);
            }
        })
        .catch(function () {
            console.log("computeZrcTokensPriceAndZilswapLpBalanceWithRetry failed! %s", retryRemaining);
            computeZrcTokensPriceAndZilswapLpBalanceWithRetry(zrcTokensPropertiesMap, onZrcTokenPriceInZilLoaded, account, onZrcTokenLpBalanceLoaded, retryRemaining - 1);
        });
}

/**
 * --------------------------------------------------------------------------------
 */

/** Void function. invokes onZrcTokenWalletBalanceLoaded(number zrcBalanceQa, string ticker) function after computation is done. */
async function computeZrcTokensBalance(account, zrcTokensPropertiesMap, onZrcTokenWalletBalanceLoaded) {
    for (const key in zrcTokensPropertiesMap) {
        let zrcTokenProperties = zrcTokensPropertiesMap[key];
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
async function computeZilStakingBalance(account, onCompleteCallback) {
    computeZilStakingBalanceWithRetry(account, onCompleteCallback, MAX_RETRY);
}

function computeZilStakingBalanceWithRetry(account, onCompleteCallback, retryRemaining) {
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
                        onCompleteCallback(ssnToBalanceMap[ssnAddress], ssnAddress);
                    }
                }
            }
        })
        .catch(function () {
            console.log("computeZilStakingBalanceWithRetry failed! %s",retryRemaining);
            computeZilStakingBalanceWithRetry(account, onCompleteCallback, retryRemaining - 1);
        });
}

/**
 * ===============================================================================
 */

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
            onCompleteCallback(contractAddressToRewardMap);
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

async function computeLpNextEpochStart(onCompleteCallback) {
    $.ajax({
        type: "GET",
        url: "https://stats.zilswap.org/epoch/info",
        retryLimit: MAX_RETRY,
        success: function (epochInfoData) {
            if (epochInfoData.next_epoch_start) {
                onCompleteCallback(epochInfoData.next_epoch_start);
            }
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
