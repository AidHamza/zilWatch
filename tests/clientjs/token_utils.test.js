var assert = require('assert');
var fs = require('fs')
var TokenUtils = require('../../clientjs/token_utils.js');

describe('TokenUtils', function () {

    describe('#getZilswapSinglePairPublicStatusFromDexState()', function () {

        it('gZil', function () {
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')

            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0xa845C1034CD077bD8D32be0447239c7E4be6cb21";

            let result = TokenUtils.getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, /* zrcTokenDecimals= */ 15);
            let expected = new TokenUtils.ZilswapSinglePairPublicStatus(
                  /* totalPoolZilAmount= */ 136959022.87961167,
                  /* totalPoolZrcTokenAmount= */ 79277.88359315527,
                  /* zrcTokenPriceInZil= */ 1727.5817248410563
            );
                
            assert.deepStrictEqual(result, expected);
        });

        it('ZWAP', function () {
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";

            let result = TokenUtils.getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, /* zrcTokenDecimals= */ 12);
            let expected = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */ 208967662.45707452,
                /* totalPoolZrcTokenAmount= */ 55003.09484344847,
                /* zrcTokenPriceInZil= */ 3799.198264240309
            );
            assert.deepStrictEqual(result, expected);
        });

        it('zrc token contract address not found: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')
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
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = 1234;

            let result = TokenUtils.getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, /* zrcTokenDecimals= */ 12);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('zrcTokenDecimals not number: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";

            let result = TokenUtils.getZilswapSinglePairPublicStatusFromDexState(dataObject, zrcTokenAddressBase16, /* zrcTokenDecimals= */ "12");
            let expected = null;
            assert.strictEqual(result, expected);
        });
    });


    describe('#getZilswapSinglePairShareRatio()', function () {

        it('gZil', function () {
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')

            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0xa845C1034CD077bD8D32be0447239c7E4be6cb21";
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = 0.000008920285612975195;
            assert.strictEqual(result, expected);
        });

        it('ZWAP', function () {
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = 0.000006507178204554463;
            assert.strictEqual(result, expected);
        });

        it('zrc token contract address not found: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x123451901A06aBEE40d8177F95171c8c63AbdC31";
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('wallet address not found: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";
            let walletAddressBase16 = "0x123458f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = NaN;
            assert.deepStrictEqual(result, expected);
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
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = 1234;
            let walletAddressBase16 = "0x278598f13a4cb142e44dde38aba8d8c0190bcb85";

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
        });

        it('walletAddressBase16 not string: null', function () {
            let dataString = fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210422.txt', 'utf8')
            let dataObject = JSON.parse(dataString);
            let zrcTokenAddressBase16 = "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31";
            let walletAddressBase16 = 1234;

            let result = TokenUtils.getZilswapSinglePairShareRatio(dataObject, zrcTokenAddressBase16, walletAddressBase16);
            let expected = null;
            assert.strictEqual(result, expected);
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

            let expectedShareRatio = shareRatio;
            let expectedZilAmount = 1221.7136013601405;
            let expectedZrcTokenAmount = 0.7071813644431453;
            assert.strictEqual(zilswapSinglePairPersonalStatus.shareRatio, expectedShareRatio);
            assert.strictEqual(zilswapSinglePairPersonalStatus.zilAmount, expectedZilAmount);
            assert.strictEqual(zilswapSinglePairPersonalStatus.zrcTokenAmount, expectedZrcTokenAmount);
        });

        it('ZWAP', function () {
            let zilswapSinglePairPublicStatus = new TokenUtils.ZilswapSinglePairPublicStatus(
                /* totalPoolZilAmount= */ 208967662.45707452,
                /* totalPoolZrcTokenAmount= */ 55003.09484344847,
                /* zrcTokenPriceInZil= */ 3799.198264240309
            );
            let shareRatio = 0.000006507178204554463;
            let zilswapSinglePairPersonalStatus = new TokenUtils.ZilswapSinglePairPersonalStatus(shareRatio, zilswapSinglePairPublicStatus);

            let expectedShareRatio = shareRatio;
            let expectedZilAmount = 1359.7898185973693;
            let expectedZrcTokenAmount = 0.35791493994832985;
            assert.strictEqual(zilswapSinglePairPersonalStatus.shareRatio, expectedShareRatio);
            assert.strictEqual(zilswapSinglePairPersonalStatus.zilAmount, expectedZilAmount);
            assert.strictEqual(zilswapSinglePairPersonalStatus.zrcTokenAmount, expectedZrcTokenAmount);
        });
    });


    describe('#getPercentChange()', function () {

        it('0% change', function () {
            let percentChange = TokenUtils.getPercentChange(/* currentBalance= */ 100, /* pastBalance= */ 100);
            let expected = 0;
            
            assert.strictEqual(percentChange, expected);
        });

        it('20% change', function () {
            
            let percentChange = TokenUtils.getPercentChange(/* currentBalance= */ 120, /* pastBalance= */ 100);
            let expected = 20;
            
            assert.strictEqual(percentChange, expected);
        });

        it('-20% change', function () {
            
            let percentChange = TokenUtils.getPercentChange(/* currentBalance= */ 80, /* pastBalance= */ 100);
            let expected = -20;
            
            assert.strictEqual(percentChange, expected);
        });

        it('100% change', function () {
            
            let percentChange = TokenUtils.getPercentChange(/* currentBalance= */ 100.0, /* pastBalance= */ 50.0);
            let expected = 100;
            
            assert.strictEqual(percentChange, expected);
        });

        it('300% change', function () {
            
            let percentChange = TokenUtils.getPercentChange(/* currentBalance= */ 200.0, /* pastBalance= */ 50.0);
            let expected = 300;
            
            assert.strictEqual(percentChange, expected);
        });

        it('-90% change', function () {
            
            let percentChange = TokenUtils.getPercentChange(/* currentBalance= */ 10.0, /* pastBalance= */ 100.0);
            let expected = -90;
            
            assert.strictEqual(percentChange, expected);
        });

        it('-44.44% change', function () {
            
            let percentChange = TokenUtils.getPercentChange(/* currentBalance= */ 55.56, /* pastBalance= */ 100.0);
            let expected = -44.44;
            
            assert.strictEqual(percentChange, expected);
        });

        it('133.33% change', function () {
            
            let percentChange = TokenUtils.getPercentChange(/* currentBalance= */ 233.33, /* pastBalance= */ 100.0);
            let expected = 133.33;
            
            assert.strictEqual(percentChange, expected);
        });

        it('argument not number, returns null', function () {
            
            let percentChange = TokenUtils.getPercentChange(/* currentBalance= */ 'asf', /* pastBalance= */ 100.0);
            let expected = null;
            
            assert.strictEqual(percentChange, expected);
        });
    });
});