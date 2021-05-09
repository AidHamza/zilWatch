// formatting_utils.js
// No dependencies

/**
 * Converts user-friendly commafied number string, into number data type by removing
 * the 3-digit comma separator.
 * 
 * Returns null if parameter is not string.
 * 
 * @param {string} commafiedNumberStringVar required The commafied number representation in string (e.g., "1,543,423.43")
 * @returns {number} The floating point number representation.
 */
function parseFloatFromCommafiedNumberString(commafiedNumberStringVar) {
    if (typeof commafiedNumberStringVar !== 'string') {
        return null;
    }
    return parseFloat(commafiedNumberStringVar.replace(/,/g, ''));
}

/**
 * Converts a number into a user-friendly string format. (e.g., 1553424.34 => 1,553,424.34)
 * 
 * Returns null if the given parameter is not a number.
 * 
 * @param {number} numberVar required The number representation of the value
 * @param {number=} decimalPlace optional The number of decimal point to retain. Defaults to 2.
 * @returns {?string} The user-friendly string representation.
 */
function commafyNumberToString(numberVar, decimalPlace = 2) {
    if (typeof numberVar !== 'number' && typeof numberVar !== 'bigint') {
        return null;
    }
    if (typeof decimalPlace !== 'number' && typeof decimalPlace !== 'bigint') {
        return null;
    }
    if (decimalPlace < 0) {
        return null;
    }

    if (numberVar < 0.00001) {
        // Do nothing, use default decimalPlace.
    } else if (numberVar < 0.0001) {
        decimalPlace = Math.max(decimalPlace, 5);
    } else if (numberVar < 0.001) {
        decimalPlace = Math.max(decimalPlace, 4);
    } else if (numberVar < 0.01) {
        decimalPlace = Math.max(decimalPlace, 3);
    }

    let stringVar = numberVar.toFixed(decimalPlace);
    if (numberVar >= 1000) {
        return stringVar.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return stringVar;
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
 * @param {boolean=} isCommafied optional Commafy the exponents if this is true. Defaults to false.
 * @returns {?string} The user-friendly string representation or null if the number is smaller than 10^6.
 */
function convertNumberQaToDecimalString(numberQa, decimals, isCommafied = true) {
    if (typeof numberQa !== 'number' && typeof numberQa !== 'bigint') {
        return null;
    }
    if (typeof decimals !== 'number' && typeof decimals !== 'bigint') {
        return null;
    }

    let numberDecimal = (1.0 * numberQa / Math.pow(10, decimals));
    if (numberDecimal > 1000) {
        if (isCommafied) {
            return commafyNumberToString(numberDecimal, /* decimalPlace= */ 0);
        }
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
 * Converts a bech32 Zilliqa address into a censored version with the first 5 and last 5 character,
 * connected by a "..." in the middle.
 * 
 * For example, "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w" => "zil1h...zpv2w"
 * 
 * Returns null if parameter is not string, or string length is shorter than 11.
 * 
 * @param {string} bech32Address required The string representation of bech32 zilliqa address
 * @returns {number} The floating point number representation.
 */
function censorBech32Address(bech32Address) {
    if (typeof bech32Address !== 'string') {
        return null;
    }
    let addressLength = bech32Address.length;
    if (addressLength < 11) {
        return null;
    }
    let lastFive = bech32Address.substr(addressLength - 5);
    let firstFive = bech32Address.substr(0, 5);
    return firstFive + "..." + lastFive;
}

if (typeof exports !== 'undefined') {
    exports.parseFloatFromCommafiedNumberString = parseFloatFromCommafiedNumberString;
    exports.commafyNumberToString = commafyNumberToString;
    exports.convertNumberQaToDecimalString = convertNumberQaToDecimalString;
    exports.censorBech32Address = censorBech32Address;
}