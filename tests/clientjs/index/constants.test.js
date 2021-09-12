var Constants = require('../../../constants.js');
var assert = require('assert');

describe('Constants', function () {

    describe('emptyZrcTokensSupply keys equivalent to zrcTokenPropertiesListMap keys', function () {

        it('equal key', function () {
            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                let element = JSON.stringify(Constants.emptyZrcTokensSupply[ticker]);

                // Assert not empty
                assert.notStrictEqual(element, '');
            }
            for (let ticker in Constants.emptyZrcTokensSupply) {
                let element = JSON.stringify(Constants.zrcTokenPropertiesListMap[ticker]);

                // Assert not empty
                assert.notStrictEqual(element, '');
            }
        });
    });
});