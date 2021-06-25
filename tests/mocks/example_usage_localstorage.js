function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function addValueLocalStorage(key, value) {
    let currLocalStorageValue = localStorage.getItem(key);
    if (!currLocalStorageValue) {
        currLocalStorageValue = "";
    }
    currLocalStorageValue += value;
    localStorage.setItem(key, currLocalStorageValue);
}

function getLocalStorage(key) {
    return localStorage.getItem(key);
}

function clearLocalStorage() {
    return localStorage.clear();
}

if (typeof exports !== 'undefined') {
    if (typeof localStorage === 'undefined') {
        MockLocalStorage = require('./mock_localstorage.js');
        localStorage = new MockLocalStorage.MockLocalStorage();
    }

    exports.setLocalStorage = setLocalStorage;
    exports.addValueLocalStorage = addValueLocalStorage;
    exports.getLocalStorage = getLocalStorage;
    exports.clearLocalStorage = clearLocalStorage;
}
