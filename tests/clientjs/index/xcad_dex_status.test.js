var indexJsdom = require('../../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var XcadDexStatus = require('../../../clientjs/index/xcad_dex_status.js');
var TokenUtils = require('../../../clientjs/index/token_utils.js');
var Constants = require('../../../constants.js');


describe('XcadDexStatus', function () {

    describe('#constructor()', function () {

        it('create plain object', function () {
            let xcadDexStatus = new XcadDexStatus.XcadDexStatus(Constants.zrcTokenPropertiesListMap, /* walletAddressBase16= */ null, /* xcadDexSmartContractStateData= */ null, /* xcadDexSmartContractState24hAgoData= */ null);

            assert.strictEqual(xcadDexStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(xcadDexStatus.walletAddressBase16_, null);
            assert.strictEqual(xcadDexStatus.xcadDexSmartContractStateData_, null);
            assert.strictEqual(xcadDexStatus.xcadDexSmartContractState24hAgoData_, null);
            assert.deepStrictEqual(xcadDexStatus.xcadPairPublicStatusMap_, {});
            assert.deepStrictEqual(xcadDexStatus.xcadPairPublicStatus24hAgoMap_, {});
            assert.deepStrictEqual(xcadDexStatus.xcadPairPersonalStatusMap_, {});
            assert.deepStrictEqual(xcadDexStatus.xcadPairPersonalStatus24hAgoMap_, {});
        });
    });

    describe('#methods()', function () {

        it('set basic: without 24h ago ', function () {
            let xcadSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/xcaddex_contractstate_20220102.txt', 'utf8'));

            let xcadDexStatus = new XcadDexStatus.XcadDexStatus(Constants.zrcTokenPropertiesListMap, /* walletAddressBase16= */ null, xcadSmartContractStateData, /* xcadDexSmartContractState24hAgoData= */ null);

            // Assert
            let xcadSinglePairPublicStatusCarb = new TokenUtils.XcadSinglePairPublicStatus(
                /* totalPoolXcadAmount= */
                102807.30537674339,
                /* totalPoolZrcTokenAmount= */
                346350.84724058
            );

            assert.deepStrictEqual(xcadDexStatus.getXcadPairPublicStatus('CARB'), xcadSinglePairPublicStatusCarb);
            assert.strictEqual(xcadDexStatus.getZrcPriceInXcad('CARB'), 0.29682995204377843);
            assert.strictEqual(xcadDexStatus.getXcadPairPublicStatus('random'), undefined);

            assert.strictEqual(xcadDexStatus.getXcadPairPublicStatus24hAgo('CARB'), undefined);
            assert.strictEqual(xcadDexStatus.getZrcPriceInXcad24hAgo('CARB'), null);
            assert.strictEqual(xcadDexStatus.getXcadPairPublicStatus24hAgo('random'), undefined);

            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus('CARB'), undefined);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus('random'), undefined);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus24hAgo('CARB'), undefined);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus24hAgo('random'), undefined);
        });

        it('set basic personal: without 24h ago ', function () {
            let xcadSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/xcaddex_contractstate_20220102.txt', 'utf8'));
            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let xcadDexStatus = new XcadDexStatus.XcadDexStatus(Constants.zrcTokenPropertiesListMap, /* walletAddressBase16= */ null, xcadSmartContractStateData, /* xcadDexSmartContractState24hAgoData= */ null);
            xcadDexStatus.setWalletAddressBase16(walletAddressBase16);
            xcadDexStatus.computeXcadPairPublicPersonalStatusMap();

            // Assert
            let xcadSinglePairPublicStatusCarb = new TokenUtils.XcadSinglePairPublicStatus(
                /* totalPoolXcadAmount= */
                102807.30537674339,
                /* totalPoolZrcTokenAmount= */
                346350.84724058
            );

            assert.deepStrictEqual(xcadDexStatus.getXcadPairPublicStatus('CARB'), xcadSinglePairPublicStatusCarb);
            assert.strictEqual(xcadDexStatus.getZrcPriceInXcad('CARB'), 0.29682995204377843);
            assert.strictEqual(xcadDexStatus.getXcadPairPublicStatus('random'), undefined);

            assert.strictEqual(xcadDexStatus.getXcadPairPublicStatus24hAgo('CARB'), undefined);
            assert.strictEqual(xcadDexStatus.getZrcPriceInXcad24hAgo('CARB'), null);
            assert.strictEqual(xcadDexStatus.getXcadPairPublicStatus24hAgo('random'), undefined);

            let xcadSinglePairPersonalStatusCarb = new TokenUtils.getXcadSinglePairPersonalStatus(0.000046037119373176207, xcadSinglePairPublicStatusCarb);

            assert.deepStrictEqual(xcadDexStatus.getXcadPairPersonalStatus('CARB'), xcadSinglePairPersonalStatusCarb);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus('random'), undefined);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus24hAgo('CARB'), undefined);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus24hAgo('random'), undefined);
        });

        it('set basic: with 24h ago ', function () {
            let xcadSmartContractState24hAgoData = JSON.parse(fs.readFileSync('./tests/testdata/xcaddex_contractstate_pools_20220102.txt', 'utf8'));
            let xcadSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/xcaddex_contractstate_20220102.txt', 'utf8'));

            let xcadDexStatus = new XcadDexStatus.XcadDexStatus(Constants.zrcTokenPropertiesListMap, /* walletAddressBase16= */ null, xcadSmartContractStateData, xcadSmartContractState24hAgoData);

            // Assert
            let xcadSinglePairPublicStatusCarb = new TokenUtils.XcadSinglePairPublicStatus(
                /* totalPoolXcadAmount= */
                102807.30537674339,
                /* totalPoolZrcTokenAmount= */
                346350.84724058
            );

            let xcadSinglePairPublicStatusCarb24hAgo = new TokenUtils.XcadSinglePairPublicStatus(
                /* totalPoolXcadAmount= */
                101633.75703125623,
                /* totalPoolZrcTokenAmount= */
                343560.19642704
            );

            assert.deepStrictEqual(xcadDexStatus.getXcadPairPublicStatus('CARB'), xcadSinglePairPublicStatusCarb);
            assert.strictEqual(xcadDexStatus.getZrcPriceInXcad('CARB'), 0.29682995204377843);
            assert.strictEqual(xcadDexStatus.getXcadPairPublicStatus('random'), undefined);

            assert.deepStrictEqual(xcadDexStatus.getXcadPairPublicStatus24hAgo('CARB'), xcadSinglePairPublicStatusCarb24hAgo);
            assert.strictEqual(xcadDexStatus.getZrcPriceInXcad24hAgo('CARB'), 0.2958251802398176);
            assert.strictEqual(xcadDexStatus.getXcadPairPublicStatus24hAgo('random'), undefined);

            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus('CARB'), undefined);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus('random'), undefined);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus24hAgo('CARB'), undefined);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus24hAgo('random'), undefined);
        });

        it('set basic personal: with 24h ago ', function () {
            let xcadSmartContractState24hAgoData = JSON.parse(fs.readFileSync('./tests/testdata/xcaddex_contractstate_pools_20220102.txt', 'utf8'));
            let xcadSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/xcaddex_contractstate_20220102.txt', 'utf8'));
            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let xcadDexStatus = new XcadDexStatus.XcadDexStatus(Constants.zrcTokenPropertiesListMap, /* walletAddressBase16= */ null, xcadSmartContractStateData, xcadSmartContractState24hAgoData);
            xcadDexStatus.setWalletAddressBase16(walletAddressBase16);
            xcadDexStatus.computeXcadPairPublicPersonalStatusMap();

            // Assert
            let xcadSinglePairPublicStatusCarb = new TokenUtils.XcadSinglePairPublicStatus(
                /* totalPoolXcadAmount= */
                102807.30537674339,
                /* totalPoolZrcTokenAmount= */
                346350.84724058
            );
            let xcadSinglePairPublicStatusCarb24hAgo = new TokenUtils.XcadSinglePairPublicStatus(
                /* totalPoolXcadAmount= */
                101633.75703125623,
                /* totalPoolZrcTokenAmount= */
                343560.19642704
            );

            assert.deepStrictEqual(xcadDexStatus.getXcadPairPublicStatus('CARB'), xcadSinglePairPublicStatusCarb);
            assert.strictEqual(xcadDexStatus.getZrcPriceInXcad('CARB'), 0.29682995204377843);
            assert.strictEqual(xcadDexStatus.getXcadPairPublicStatus('random'), undefined);

            assert.deepStrictEqual(xcadDexStatus.getXcadPairPublicStatus24hAgo('CARB'), xcadSinglePairPublicStatusCarb24hAgo);
            assert.strictEqual(xcadDexStatus.getZrcPriceInXcad24hAgo('CARB'), 0.2958251802398176);
            assert.strictEqual(xcadDexStatus.getXcadPairPublicStatus24hAgo('random'), undefined);


            let xcadSinglePairPersonalStatusCarb = new TokenUtils.getXcadSinglePairPersonalStatus(0.000046037119373176207, xcadSinglePairPublicStatusCarb);
            let xcadSinglePairPersonalStatusCarb24hAgo = new TokenUtils.getXcadSinglePairPersonalStatus(0.00004648904089121552, xcadSinglePairPublicStatusCarb24hAgo);

            assert.deepStrictEqual(xcadDexStatus.getXcadPairPersonalStatus('CARB'), xcadSinglePairPersonalStatusCarb);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus('random'), undefined);
            assert.deepStrictEqual(xcadDexStatus.getXcadPairPersonalStatus24hAgo('CARB'), xcadSinglePairPersonalStatusCarb24hAgo);
            assert.strictEqual(xcadDexStatus.getXcadPairPersonalStatus24hAgo('random'), undefined);
        });
    });
});