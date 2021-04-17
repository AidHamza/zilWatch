const ZilSwapDexAddress = "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w";
const ZilpayStatus = Object.freeze({ "not_installed": 1, "locked": 2, "not_mainnet": 3, 'success': 4 });

/** Returns a Promise. */
function connectZilpayService() {
    return window.zilPay.wallet.connect();
}

/** Void function. invokes onCompleteCallback(string balance) function after computation is done. */
function computeZilBalance(account, onCompleteCallback) {
    window.zilPay.blockchain.getBalance(account.bech32).then(function (data) {
        var userFriendlyZilBalance = convertQaToUserFriendlyZil(data.result.balance, 12);
        onCompleteCallback(userFriendlyZilBalance);
    });
}


/** Void function. invokes onCompleteCallback(string balance, string ticker) function after computation is done. */
function computeZrcTokensPrice(zrcTokensPropertiesMap, onCompleteCallback) {

    window.zilPay.blockchain.getSmartContractState(ZilSwapDexAddress)
        .then(function (data) {
            for (const key in zrcTokensPropertiesMap) {
                try {
                    let zrcTokenProperties = zrcTokensPropertiesMap[key];
                    let zrcTokenAddress = window.zilPay.crypto.fromBech32Address(zrcTokenProperties.address).toLowerCase();

                    let zilPoolReserveQa = data.result.pools[zrcTokenAddress].arguments[0];
                    let tokenPoolReserveQa = data.result.pools[zrcTokenAddress].arguments[1];

                    var zilAmount = zilPoolReserveQa / Math.pow(10, 12);
                    var zrcTokenAmount = tokenPoolReserveQa / Math.pow(10, zrcTokenProperties.decimals);

                    // ZIL amount per 1 ZRC-2 token
                    let zrcTokenPriceInZil = (zilAmount / zrcTokenAmount).toFixed(3);

                    onCompleteCallback(zrcTokenPriceInZil, zrcTokenProperties.ticker);
                }
                catch (err) {
                    console.log(err);
                }
            }
        })
        .catch(function () {
            onCompleteCallback(null, "");
        });
}

/** Void function. invokes onCompleteCallback(string balance, string ticker) function after computation is done. */
function computeZrcTokensBalance(account, zrcTokensPropertiesMap, onCompleteCallback) {
    for (const key in zrcTokensPropertiesMap) {
        const zrcTokenProperties = zrcTokensPropertiesMap[key];
        window.zilPay.blockchain.getSmartContractState(zrcTokenProperties.address)
            .then(function (data) {
                var zrcTokenBalance = null;
                if (data.result.balances) {
                    const zrcTokenBalanceQa = data.result.balances[account.base16.toLowerCase()];
                    if (zrcTokenBalanceQa) {
                        zrcTokenBalance = convertQaToUserFriendlyZil(zrcTokenBalanceQa, zrcTokenProperties.decimals);
                    }
                }
                onCompleteCallback(zrcTokenBalance, zrcTokenProperties.ticker);
            })
            .catch(function () {
                onCompleteCallback("Error!", zrcTokenProperties.ticker);
            })
    }
}

/** Void function. invokes onCompleteCallback(string balance, string ticker) function after computation is done. */
function computeZrcTokensZilSwapLpBalance(account, zrcTokensPropertiesMap, onCompleteCallback) {

    window.zilPay.blockchain.getSmartContractState(ZilSwapDexAddress)
        .then(function (data) {
            for (const key in zrcTokensPropertiesMap) {
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

                    var ourZilShare = (ourShareRatio * zilPoolReserveQa / Math.pow(10, 12)).toFixed(3);
                    var ourTokenShare = (ourShareRatio * tokenPoolReserveQa / Math.pow(10, zrcTokenProperties.decimals)).toFixed(3);

                    onCompleteCallback(ourShareRatio, ourZilShare, ourTokenShare, zrcTokenProperties.ticker);
                }
                catch (err) {
                    console.log(err);
                }
            }
        })
        .catch(function () {
            onCompleteCallback(null, 0, 0, "");
        });
}

/** Returns an enum. */
function getZilpayStatus() {
    if (!window.zilPay) {
        return ZilpayStatus.not_installed;
    } else if (!window.zilPay.wallet.isEnable) {
        return ZilpayStatus.locked;
    } else if (zilPay.wallet.net !== 'mainnet') {
        return ZilpayStatus.not_mainnet;
    }
    return ZilpayStatus.success;
}

/* Returns string. */
function shortBech32Address(bech32Address) {
    var lastFive = bech32Address.substr(bech32Address.length - 5);
    var firstFive = bech32Address.substr(0, 5);
    return firstFive.concat("...", lastFive);
}

/* Returns string. multiplier is 6 for li (gas), 12 ZIL, and 15 for ZRC. */
function convertQaToUserFriendlyZil(balanceQa, multiplier) {
    const stringBalanceQa = balanceQa.toString();
    const stringBalanceQaLength = stringBalanceQa.length;
    var exponent = stringBalanceQa.substring(0, stringBalanceQaLength - multiplier);
    if (exponent === "") {
        exponent = "0";
    }
    var mantissa = stringBalanceQa.substring(stringBalanceQaLength - multiplier, stringBalanceQaLength - multiplier + 3);
    return exponent.concat('.').concat(mantissa);
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}