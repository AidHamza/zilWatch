// formatting_utils.js
// No dependencies

/**
 * Parse data returned by Zilliqa API call getSmartContractSubState() and return the ZRC token balance
 * for the given walletAddressBase16. 
 * 
 * If the given wallet has a balance, it will return the balance in number type.
 * 
 * If the balance for the address is not found or there are any other illegal states, return null.
 *
 * @param {Object} dataObject required The data object returned by the getSmartContractSubState(zrcAddress, "balances", walletAddressBase16)
 * @param {string} walletAddressBase16 required The wallet address to obtain the balance from
 * @returns {number} The number representation of the balance owned by the wallet address in QA unit
 */
function parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(dataObject, walletAddressBase16) {
    if (dataObject === null || typeof dataObject !== 'object') {
        return null;
    }
    if (typeof walletAddressBase16 !== 'string') {
        return null;
    }

    if (dataObject && dataObject.result && dataObject.result.balances) {
        let zrcTokenBalanceQa = dataObject.result.balances[walletAddressBase16.toLowerCase()];
        let zrcTokenBalanceNumberQa = parseInt(zrcTokenBalanceQa);
        // Only return if integer is successfully parsed.
        if (zrcTokenBalanceNumberQa) {
            return zrcTokenBalanceNumberQa;
        }
    }
    return null;
}

/**
 * Parse data returned by ZIL API call getSmartContractState() for Zilswap DEX and return the price
 * of ZRC token in ZIL for the ZRC token defined in zrcTokenAddressBase16.
 * 
 * If the pool is found and there are no error state, return the price in ZIL in number type, else return null.
 *
 * @param {Object} dataObject required The data object returned by the getSmartContractState(ZilswapDexAddress)
 * @param {string} zrcTokenAddressBase16 required The ZRC token contract address in base16
 * @param {number} zrcTokenDecimals required The decimals of the ZRC token
 *
 * @returns {number} The number representation of price of ZRC token in terms of ZIL
 */
function getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, zrcTokenDecimals) {
    if (dataObject === null || typeof dataObject !== 'object') {
        return null;
    }
    if (typeof zrcTokenAddressBase16 !== 'string') {
        return null;
    }
    if (typeof zrcTokenDecimals !== 'number' && typeof zrcTokenDecimals !== 'bigint') {
        return null;
    }

    if (dataObject && dataObject.result && dataObject.result.pools) {
        let zrcTokenPools = dataObject.result.pools[zrcTokenAddressBase16.toLowerCase()];
        if (zrcTokenPools) {
            let zilPoolReserveQa = zrcTokenPools.arguments[0];
            let zrcTokenPoolReserveQa = zrcTokenPools.arguments[1];

            let zilPoolReserveNumberQa = parseInt(zilPoolReserveQa);
            let zrcTokenPoolReserveNumberQa = parseInt(zrcTokenPoolReserveQa);
            if (zilPoolReserveNumberQa && zrcTokenPoolReserveNumberQa) {
                let totalPoolZilAmount = 1.0 * zilPoolReserveNumberQa / Math.pow(10, 12);
                let totalPoolZrcTokenAmount = 1.0 * zrcTokenPoolReserveNumberQa / Math.pow(10, zrcTokenDecimals);
                return new ZilswapSinglePairPublicStatus(totalPoolZilAmount, totalPoolZrcTokenAmount);
            }
        }
    }
    return null;
}

/**
 * Parse data returned by ZIL API call getSmartContractState() for Zilswap DEX and return the
 * given wallet's share ratio of liquidity pool.
 * 
 * If the pool is found and there are no error state, return the share ratio, else return null.
 *
 * @param {Object} dataObject required The data object returned by the getSmartContractState() Zilliqa API call for Zilswap DEX
 * @param {string} zrcTokenAddressBase16 required The ZRC token contract address in base16
 * @param {number} zrcTokenDecimals required The decimals of the ZRC token
 * @param {string} walletAddressBase16 required The wallet address to obtain the share from
 *
 * @returns {number} a floating point representation of the share ratio
 */
function getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16) {
    if (dataObject === null || typeof dataObject !== 'object') {
        return null;
    }
    if (typeof zrcTokenAddressBase16 !== 'string') {
        return null;
    }
    if (typeof walletAddressBase16 !== 'string') {
        return null;
    }
    zrcTokenAddressBase16 = zrcTokenAddressBase16.toLowerCase();
    walletAddressBase16 = walletAddressBase16.toLowerCase();

    if (dataObject && dataObject.result && dataObject.result.balances && dataObject.result.total_contributions) {
        let zrcTokenLiquidityMap = dataObject.result.balances[zrcTokenAddressBase16];
        if (!zrcTokenLiquidityMap) {
            return null;
        }
        let walletLiquidity = zrcTokenLiquidityMap[walletAddressBase16];
        let walletLiquidityNumber = parseInt(walletLiquidity);

        let poolTotalLiquidity = dataObject.result.total_contributions[zrcTokenAddressBase16];
        if (!poolTotalLiquidity) {
            return null;
        }
        let poolTotalLiquidityNumber = parseInt(poolTotalLiquidity);

        return 1.0 * walletLiquidityNumber / poolTotalLiquidityNumber;
    }
    return null;
}

/**
 * Compute percentage change given current balance vs past balance.
 * 
 * For example, currentBalance = 120, pastBalance = 100, it will return 20.0 (%)
 * if currentBalance = 80, pastBalance = 100, it will return -20.0 (%)
 *
 * @param {number} currentBalance required The current balance
 * @param {number} pastBalance required The past balance as baseline
 *
 * @returns {number} a floating point representation of the increase or decrease in percentage
 */
function getPercentChange(currentBalance, pastBalance) {
    if (typeof currentBalance !== 'number' && typeof currentBalance !== 'bigint') {
        return null;
    }
    if (typeof pastBalance !== 'number' && typeof pastBalance !== 'bigint') {
        return null;
    }
    if (currentBalance === 0 && pastBalance === 0) {
        return 0;
    }
    let balanceDiff = currentBalance - pastBalance;
    return 100.0 * balanceDiff / pastBalance;
}

/** A class to represent a single token pair in Zilswap LP.  */
class ZilswapSinglePairPublicStatus {
    constructor(totalPoolZilAmount, totalPoolZrcTokenAmount) {
        this.totalPoolZilAmount = totalPoolZilAmount;
        this.totalPoolZrcTokenAmount = totalPoolZrcTokenAmount;
        this.zrcTokenPriceInZil = totalPoolZilAmount / totalPoolZrcTokenAmount;
    }
}

/** A class to represent a single token pair in Zilswap LP.  */
class ZilswapSinglePairPersonalStatus {
    constructor(shareRatio, zilswapSingleTokenPublicStatus) {
        this.shareRatio = shareRatio;
        this.zilAmount = zilswapSingleTokenPublicStatus.totalPoolZilAmount * shareRatio;
        this.zrcTokenAmount = zilswapSingleTokenPublicStatus.totalPoolZrcTokenAmount * shareRatio;
    }
}

function getZilswapSinglePairPersonalStatus(shareRatio, zilswapSingleTokenPublicStatus) {
    return new ZilswapSinglePairPersonalStatus(shareRatio, zilswapSingleTokenPublicStatus);
}

if (typeof exports !== 'undefined') {
    exports.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState = parseZrcTokenBalanceNumberQaFromGetSmartContractSubState;
    exports.getZilswapSinglePairPublicStatusFromDexState = getZilswapSinglePairPublicStatusFromDexState;
    exports.getZilswapSinglePairShareRatio = getZilswapSinglePairShareRatio;
    exports.getPercentChange = getPercentChange;
    exports.ZilswapSinglePairPublicStatus = ZilswapSinglePairPublicStatus;
    exports.ZilswapSinglePairPersonalStatus = ZilswapSinglePairPersonalStatus;
    exports.getZilswapSinglePairPersonalStatus = getZilswapSinglePairPersonalStatus;
}