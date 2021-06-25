/**
 * To use this MockLocalStorage class, import mock local storage and initialize localStorage
 * if it's undefined.
 * 
 * e.g., add this at the bottom of your js file.
 * 
 * ```
 * if (typeof exports !== 'undefined') {
 *    if (typeof localStorage === 'undefined') {
 *       MockLocalStorage = require('./mock_localstorage.js');
 *       localStorage = new MockLocalStorage.MockLocalStorage();
 *    }
 * }
 * ```
 */

class MockLocalStorage {

    constructor() {
        this.localStorageMap_ = {};
    }

    getItem(key) {
        return this.localStorageMap_[key];
    }

    setItem(key, value) {
        return this.localStorageMap_[key] = value;
    }

    clear() {
        this.localStorageMap_ = {};
    }
}

if (typeof exports !== 'undefined') {
    exports.MockLocalStorage = MockLocalStorage;
}
