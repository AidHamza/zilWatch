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

    if (dataObject.result && dataObject.result.balances) {
        let zrcTokenBalanceQa = dataObject.result.balances[walletAddressBase16.toLowerCase()];
        let zrcTokenBalanceNumberQa = parseInt(zrcTokenBalanceQa);
        // Only return if integer is successfully parsed.
        if (zrcTokenBalanceNumberQa) {
            return zrcTokenBalanceNumberQa;
        }
    }
    return null;
}

if (typeof exports !== 'undefined') {
    exports.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState = parseZrcTokenBalanceNumberQaFromGetSmartContractSubState;
}