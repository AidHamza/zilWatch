
/**
 * Converts USD in the form of user-friendly string, into number data type by removing
 * the 3-digit comma separator.
 * 
 * @param {string} usdString required The USD representation in string (e.g., "1,543,423.43")
 * @returns {number} The USD representation in number.
 */
function parseFloatFromUsd(usdString) {
    return parseFloat(usdString.replace(/,/g, ''));
}

if (typeof exports !== 'undefined') {
    exports.parseFloatFromUsd = parseFloatFromUsd;
}
