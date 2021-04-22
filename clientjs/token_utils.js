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

if (typeof exports !== 'undefined') {
    exports.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState = parseZrcTokenBalanceNumberQaFromGetSmartContractSubState;
    exports.getZrcTokenPriceInZilFromZilswapDexState = getZrcTokenPriceInZilFromZilswapDexState;
}