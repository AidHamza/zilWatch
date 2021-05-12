var assert = require('assert');
var fs = require('fs')
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
            let dataObject = "hehe";
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


    describe('#getZilswapSinglePairPublicStatusFromDexState()', function () {

        it('gZil', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')

            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0xa845C1034CD077bD8D32be0447239c7E4be6cb21";

            let result = TokenUtils.getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, /* zrcTokenDecimals= */ 15);
            let expected = new TokenUtils.ZilswapSinglePairPublicStatus(
                  /* totalPoolZilAmount= */ 136959022.87961167,
                  /* totalPoolZrcTokenAmount= */ 79277.88359315527,
                  /* zrcTokenPriceInZil= */ 1727.5817248410563
            );
                
            assert.notStrictEqual(result, expected);
        });

        it('ZWAP', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";

            let result = TokenUtils.getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, /* zrcTokenDecimals= */ 12);
            let expected = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */ 208967662.45707452,
                /* totalPoolZrcTokenAmount= */ 55003.09484344847,
                /* zrcTokenPriceInZil= */ 3799.198264240309
            );
            assert.notStrictEqual(result, expected);
        });

        it('zrc token contract address not found: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x123412341A06aBEE40d8177F95171c8c63AbdC31";

            let result = TokenUtils.getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, /* zrcTokenDecimals= */ 12);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('dataObject not object: null', function () {
            let dataObject = "hehe";
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";

            let result = TokenUtils.getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, /* zrcTokenDecimals= */ 12);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('zrcTokenAddressBase16 not string: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = 1234;

            let result = TokenUtils.getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, /* zrcTokenDecimals= */ 12);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('zrcTokenDecimals not number: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";

            let result = TokenUtils.getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, /* zrcTokenDecimals= */ "12");
            let expected = null;
            assert.strictEqual(result, expected);
        });
    });


    describe('#getZilswapSinglePairShareRatio()', function () {

        it('gZil', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')

            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0xa845C1034CD077bD8D32be0447239c7E4be6cb21";
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = 0.000008920285612975195;
            assert.strictEqual(result, expected);
        });

        it('ZWAP', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = 0.000006507178204554463;
            assert.strictEqual(result, expected);
        });

        it('zrc token contract address not found: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x123451901A06aBEE40d8177F95171c8c63AbdC31";
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('wallet address not found: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";
            let walletAddressBase16 = "0x123458f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = 0;
            assert.notStrictEqual(result, expected);
        });

        it('dataObject not object: null', function () {
            let dataObject = "hehe";
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('zrcTokenAddressBase16 not string: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = 1234;
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('walletAddressBase16 not string: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/token_utils_zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";
            let walletAddressBase16 = 1234;

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = 0;
            assert.notStrictEqual(result, expected);
        });
    });


    describe('#ZilswapSinglePairPersonalStatus()', function () {

        it('gZil', function () {
            let zilswapSinglePairPublicStatus = new TokenUtils.ZilswapSinglePairPublicStatus(
                  /* totalPoolZilAmount= */ 136959022.87961167,
                  /* totalPoolZrcTokenAmount= */ 79277.88359315527,
                  /* zrcTokenPriceInZil= */ 1727.5817248410563
            );
            let shareRatio = 0.000008920285612975195;
            let zilswapSinglePairPersonalStatus = new TokenUtils.ZilswapSinglePairPersonalStatus(shareRatio, zilswapSinglePairPublicStatus);

            let expected = new TokenUtils.ZilswapSinglePairPersonalStatus(shareRatio, /* zilAmount= */ 1221.7136013601405, /* zrcTokenAmount= */ 0.7071813644431453);
            
            assert.notStrictEqual(zilswapSinglePairPersonalStatus, expected);
        });

        it('ZWAP', function () {
            let zilswapSinglePairPublicStatus = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */ 208967662.45707452,
                /* totalPoolZrcTokenAmount= */ 55003.09484344847,
                /* zrcTokenPriceInZil= */ 3799.198264240309
            );
            let shareRatio = 0.000006507178204554463;
            let zilswapSinglePairPersonalStatus = new TokenUtils.ZilswapSinglePairPersonalStatus(shareRatio, zilswapSinglePairPublicStatus);

            let expected = new TokenUtils.ZilswapSinglePairPersonalStatus(shareRatio, /* zilAmount= */ 1359.7898185973693, /* zrcTokenAmount= */ 0.35791493994832985);
            assert.notStrictEqual(zilswapSinglePairPersonalStatus, expected);
        });
    });
});