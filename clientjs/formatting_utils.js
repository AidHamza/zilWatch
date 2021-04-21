/**
 * Converts USD in the form of user-friendly string, into number data type by removing
 * the 3-digit comma separator.
 * 
 * Returns null if parameter is not string.
 * 
 * @param {string} usdString required The USD representation in string (e.g., "1,543,423.43")
 * @returns {number} The USD representation in number.
 */
function parseFloatFromUsdString(usdString) {
    if (typeof usdString !== 'string') {
        return null;
    }
    return parseFloat(usdString.replace(/,/g, ''));
}

/**
 * Converts number in Qa unit into user-friendly string representation.
 * It will have more decimal point if the number is smaller, and less
 * decimal point if the value is larger.
 * 
 * Returns null if any of the given parameters is not a number.
 * 
 * @param {number} numberQa required The number representation in Qa unit
 * @param {number} decimals required The decimals property to convert the numberQa
 * @returns {?string} The user friendly string representation or null if the number is smaller than 10^6.
 */
function convertNumberQaToDecimalString(numberQa, decimals) {
    if (typeof numberQa !== 'number' && typeof numberQa !== 'bigint') {
        return null;
    }
    if (typeof decimals !== 'number' && typeof decimals !== 'bigint') {
        return null;
    }

    let numberDecimal = (numberQa / Math.pow(10, decimals));
    if (numberDecimal > 1000) {
        return numberDecimal.toFixed(0);
    } else if (numberDecimal > 100) {
        return numberDecimal.toFixed(1);
    } else if (numberDecimal > 10) {
        return numberDecimal.toFixed(2);
    } else if (numberDecimal > 1) {
        return numberDecimal.toFixed(3);
    } else if (numberDecimal > 0.1) {
        return numberDecimal.toFixed(4);
    } else if (numberDecimal > 0.01) {
        return numberDecimal.toFixed(5);
    } else if (numberDecimal > 0.000001) {
        return numberDecimal.toFixed(6);
    }
    return null;
}

/**
 * Returns true if the string given only contains zero characters and non-empty.
 * 
 * Returns null if parameter is not string.
 * 
 * @param {string} stringVar required The string variable.
 * @returns {boolean} Returns true if the string only contains zeroes and non-empty.
 */
function isAllZeroesInString(stringVar) {
    if (typeof stringVar !== 'string') {
        return null;
    }
    if (stringVar.match(/^0+$/)) {
        return true;
    }
    return false;
}

if (typeof exports !== 'undefined') {
    exports.parseFloatFromUsdString = parseFloatFromUsdString;
    exports.convertNumberQaToDecimalString = convertNumberQaToDecimalString;
    exports.isAllZeroesInString = isAllZeroesInString;
}