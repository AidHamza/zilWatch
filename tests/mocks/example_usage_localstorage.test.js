var assert = require('assert');
var DummyLocalStorage = require('./example_usage_localstorage.js');

describe('MockLocalStorage', function () {

    describe('mixed actions', function () {

        beforeEach(function () {
            localStorage.clear();
        });

        it('get storage, undefined', function () {
            assert.strictEqual(DummyLocalStorage.getLocalStorage('hehe'), undefined);
        });

        it('set storage, succesful', function () {
            let value = 'haha';
            DummyLocalStorage.setLocalStorage('hehe', value);

            // Assert
            assert.strictEqual(DummyLocalStorage.getLocalStorage('hehe'), value);
        });
    
        it('add storage, succesful', function () {
            let value = 'haha';
            let value2 = 'hihi';
            DummyLocalStorage.addValueLocalStorage('hehe', value);

            // Assert
            assert.strictEqual(DummyLocalStorage.getLocalStorage('hehe'), value);

            DummyLocalStorage.addValueLocalStorage('hehe', value2);
            // Assert
            assert.strictEqual(DummyLocalStorage.getLocalStorage('hehe'), value + value2);
        });

        it('add storage, diff key, succesful', function () {
            let value = 'haha';
            let value2 = 'hihi';
            DummyLocalStorage.addValueLocalStorage('hehe1', value);
            DummyLocalStorage.addValueLocalStorage('hehe2', value2);

            // Assert
            assert.strictEqual(DummyLocalStorage.getLocalStorage('hehe1'), value);
            assert.strictEqual(DummyLocalStorage.getLocalStorage('hehe2'), value2);
        });
    });
});
