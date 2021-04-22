var assert = require('assert');
var TokenUtils = require('../../clientjs/token_utils.js');

describe('TokenUtils', function () {

    describe('#parseZrcTokenBalanceNumberQaFromGetSmartContractSubState()', function () {

        it('gZil', function () {
            let dataString = '{"id":1,"jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"1499999999999999"}},"req":{"url":"https://api.zilliqa.com","payload":{"id":1,"jsonrpc":"2.0","method":"GetSmartContractSubState","params":["a845c1034cd077bd8d32be0447239c7e4be6cb21","balances",["0x278598f13a4cb142e44dde38aba8d8c0190bcb85"]]}}}';
            let dataObject = JSON.parse(dataString);
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(dataObject, walletAddressBase16);
            let expected = 1499999999999999;
            assert.strictEqual(result, expected);
        });

        it('ZWAP', function () {
            let dataString = '{"id":1,"jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"76859808631"}},"req":{"url":"https://api.zilliqa.com","payload":{"id":1,"jsonrpc":"2.0","method":"GetSmartContractSubState","params":["0d21c1901a06abee40d8177f95171c8c63abdc31","balances",["0x278598f13a4cb142e44dde38aba8d8c0190bcb85"]]}}}';
            let dataObject = JSON.parse(dataString);
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(dataObject, walletAddressBase16);
            let expected = 76859808631;
            assert.strictEqual(result, expected);
        });

        it('balance not parseable as integer: null', function () {
            let dataString = '{"id":1,"jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"aa76859808631"}},"req":{"url":"https://api.zilliqa.com","payload":{"id":1,"jsonrpc":"2.0","method":"GetSmartContractSubState","params":["0d21c1901a06abee40d8177f95171c8c63abdc31","balances",["0x278598f13a4cb142e44dde38aba8d8c0190bcb85"]]}}}';
            let dataObject = JSON.parse(dataString);
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(dataObject, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('wallet address not found: null', function () {
            let dataString = '{"id":1,"jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"76859808631"}},"req":{"url":"https://api.zilliqa.com","payload":{"id":1,"jsonrpc":"2.0","method":"GetSmartContractSubState","params":["0d21c1901a06abee40d8177f95171c8c63abdc31","balances",["0x278598f13a4cb142e44dde38aba8d8c0190bcb85"]]}}}';
            let dataObject = JSON.parse(dataString);
            let walletAddressBase16 = "0x378598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(dataObject, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('dataObject wrong structure: null', function () {
            let dataString = '{"id":1,"jsonrpc":"2.0","wrong_result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"76859808631"}},"req":{"url":"https://api.zilliqa.com","payload":{"id":1,"jsonrpc":"2.0","method":"GetSmartContractSubState","params":["0d21c1901a06abee40d8177f95171c8c63abdc31","balances",["0x278598f13a4cb142e44dde38aba8d8c0190bcb85"]]}}}';
            let dataObject = JSON.parse(dataString);
            let walletAddressBase16 = "0x378598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(dataObject, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('dataObject not object: null', function () {
            let dataObject =  "hehe";
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(dataObject, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('walletAddressBase16 not string: null', function () {
            let dataString = '{"id":1,"jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"76859808631"}},"req":{"url":"https://api.zilliqa.com","payload":{"id":1,"jsonrpc":"2.0","method":"GetSmartContractSubState","params":["0d21c1901a06abee40d8177f95171c8c63abdc31","balances",["0x278598f13a4cb142e44dde38aba8d8c0190bcb85"]]}}}';
            let dataObject = JSON.parse(dataString);
            let walletAddressBase16 = 123456;
            let zrcTokenDecimals = 12;

            let result = TokenUtils.parseZrcTokenBalanceNumberQaFromGetSmartContractSubState(dataObject, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
        });
    });
});
