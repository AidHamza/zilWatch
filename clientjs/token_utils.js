// formatting_utils.js
// dep = ['formatting_utils.js']

/**
 * Parse data returned by Zilliqa API call getSmartContractSubState() and return the ZRC token balance
 * for the given walletAddressBase16. 
 * 
 * If the given wallet has a balance, it will return the balance in number type.
 * 
 * If the balance for the address is not found or there are any other illegal states, return null.
 *
 * @param {Object} dataObject required The data object returned by the getSmartContractSubState() Zilliqa API call
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
 * @param {Object} dataObject required The data object returned by the getSmartContractState() Zilliqa API call for Zilswap DEX
 * @param {string} zrcTokenAddressBase16 required The ZRC token contract address in base16
 * @param {number} zrcTokenDecimals required The decimals of the ZRC token
 *
 * @returns {number} The number representation of price of ZRC token in terms of ZIL
 */
function getZrcTokenPriceInZilFromZilswapDexState(dataObject, zrcTokenAddressBase16, zrcTokenDecimals) {
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
                let zilAmount = 1.0 * zilPoolReserveNumberQa / Math.pow(10, 12);
                let zrcTokenAmount = 1.0 * zrcTokenPoolReserveNumberQa / Math.pow(10, zrcTokenDecimals);
                return zilAmount / zrcTokenAmount;
            }
        }
    }
    return null;
}


/** A class to represent a single token pair in Zilswap LP.  */
class ZilswapSingleTokenLpStatus {
    constructor(shareRatio, zilAmount, zrcTokenAmount) {
        this.shareRatio = shareRatio;
        this.zilAmount = zilAmount;
        this.zrcTokenAmount = zrcTokenAmount;
    }
}

/**
 * Parse data returned by ZIL API call getSmartContractState() for Zilswap DEX and return the
 * given wallet's share of liquidity pool.
 * 
 * If the pool is found and there are no error state, return the ZilswapSingleTokenLpStatus, else return null.
 *
 * @param {Object} dataObject required The data object returned by the getSmartContractState() Zilliqa API call for Zilswap DEX
 * @param {string} zrcTokenAddressBase16 required The ZRC token contract address in base16
 * @param {number} zrcTokenDecimals required The decimals of the ZRC token
 * @param {string} walletAddressBase16 required The wallet address to obtain the share from
 *
 * @returns {object} The ZilswapSingleTokenLpStatus object representation of shareRatio, zilAmount, and zrcTokenAmount
 */
function getSingleTokenLpStatusFromZilswapDexState(dataObject, zrcTokenAddressBase16, zrcTokenDecimals, walletAddressBase16) {
    if (dataObject === null || typeof dataObject !== 'object') {
        return null;
    }
    if (typeof zrcTokenAddressBase16 !== 'string') {
        return null;
    }
    if (typeof zrcTokenDecimals !== 'number' && typeof zrcTokenDecimals !== 'bigint') {
        return null;
    }
    if (typeof walletAddressBase16 !== 'string') {
        return null;
    }
    zrcTokenAddressBase16 = zrcTokenAddressBase16.toLowerCase();
    walletAddressBase16 = walletAddressBase16.toLowerCase();

    if (dataObject && dataObject.result && dataObject.result.pools && dataObject.result.balances) {
        let zrcTokenLiquidityMap = dataObject.result.balances[zrcTokenAddressBase16];
        if (!zrcTokenLiquidityMap) {
            return null;
        }

        let walletLiquidity = zrcTokenLiquidityMap[walletAddressBase16];
        if (!walletLiquidity) {
            return null;
        }

        let zrcTokenPools = dataObject.result.pools[zrcTokenAddressBase16];
        let poolTotalLiquidity = dataObject.result.total_contributions[zrcTokenAddressBase16];

        if (zrcTokenPools && poolTotalLiquidity) {
            let zilPoolReserveQa = zrcTokenPools.arguments[0];
            let zrcTokenPoolReserveQa = zrcTokenPools.arguments[1];

            let zilPoolReserveNumberQa = parseInt(zilPoolReserveQa);
            let zrcTokenPoolReserveNumberQa = parseInt(zrcTokenPoolReserveQa);

            let walletLiquidityNumber = parseInt(walletLiquidity);
            let poolTotalLiquidityNumber = parseInt(poolTotalLiquidity);

            if (zilPoolReserveNumberQa && zrcTokenPoolReserveNumberQa && walletLiquidityNumber && poolTotalLiquidityNumber) {

                let walletShare = 1.0 * walletLiquidityNumber / poolTotalLiquidityNumber;
                let zilAmount = (1.0 * zilPoolReserveNumberQa / Math.pow(10, 12)) * walletShare;
                let zrcTokenAmount = (1.0 * zrcTokenPoolReserveNumberQa / Math.pow(10, zrcTokenDecimals)) * walletShare;
                return new ZilswapSingleTokenLpStatus(walletShare, zilAmount, zrcTokenAmount);
            }
        }
    }
    return null;
}

if (typeof exports !== 'undefined') {
    exports.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState = parseZrcTokenBalanceNumberQaFromGetSmartContractSubState;
    exports.getZrcTokenPriceInZilFromZilswapDexState = getZrcTokenPriceInZilFromZilswapDexState;
    exports.ZilswapSingleTokenLpStatus = ZilswapSingleTokenLpStatus;
    exports.getSingleTokenLpStatusFromZilswapDexState = getSingleTokenLpStatusFromZilswapDexState;
}