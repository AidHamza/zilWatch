var indexJsdom = require('../../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../../clientjs/index/zilswap_dex_status.js');
var ZilswapZrcPrice24hLowHighStatus = require('../../../clientjs/index/zilswap_zrc_price_24h_low_high_status.js');
var Constants = require('../../../constants.js');

describe('ZilswapZrcPrice24hLowHighStatus', function () {

    let zrcTokenPrice24hLowData = {
        "AXT": 0.03729530323728581,
        "BOLT": 0.254312219348629,
        "CARB": 6.951811322272539,
        "DogZilliqa": 197.48189928646755,
        "DUCK": 3289.8890315245276,
        "ELONS": 15146.900633249266,
        "FLAT": 0.1,
        "GARY": 12294.779427723139,
        "gZIL": 999.39462618267,
        "MAMBO": 0.00032574899622760887,
        "MESSI": 0.05,
        "PORT": 30.887756264277186,
        "RECAP": 0.9003274033074263,
        "REDC": 15.008403215069968,
        "RWD": 2.692184069789986,
        "SCO": 1.4964404911430513,
        "SHARDS": 0.03571428571428571,
        "SHRK": 0.02577601941752855,
        "SPW": 0.05670325894785122,
        "SRV": 4.7162295149892275,
        "STREAM": 1.7532949810736842,
        "XPORT": 0.30887756264277186,
        "XSGD": 3.5935717444313506,
        "ZCH": 1.5083550659689346,
        "ZLF": 17.228129438646494,
        "ZLP": 6.07413934647738,
        "ZPAINT": 0.04815486573599467,
        "ZWALL": 2.1582661055768746,
        "ZWAP": 1126.7513259677646,
        "ZYRO": 0.11344330448746172
    };

    let zrcTokenPrice24hHighData = {
        "AXT": 1.4681564649936805,
        "BOLT": 0.6657911027679212,
        "CARB": 15.96995889627357,
        "DogZilliqa": 2877.299892173915,
        "DUCK": 11363.109295298736,
        "ELONS": 50264.03757565816,
        "FLAT": 6.272520624180173,
        "GARY": 96992.11063799482,
        "gZIL": 1652.692078690329,
        "MAMBO": 0.3768136347513247,
        "MESSI": 91.23991339176881,
        "PORT": 193.30571602007623,
        "RECAP": 9.527627755626273,
        "REDC": 26.16735503983831,
        "RWD": 10194.408140492067,
        "SCO": 7.880575919002242,
        "SHARDS": 17.49114664479935,
        "SHRK": 3.2961687324900724,
        "SPW": 0.24322441958135702,
        "SRV": 29.921824085963014,
        "STREAM": 5,
        "XPORT": 1.9330571602007623,
        "XSGD": 14.194888240622918,
        "ZCH": 40.20889708072873,
        "ZLF": 183.70053457061871,
        "ZLP": 25.301503929130018,
        "ZPAINT": 0.09982615011763003,
        "ZWALL": 208.5108818247797,
        "ZWAP": 2905.862363295076,
        "ZYRO": 0.17237287500712248
    };
    // If token not in the list, i.e., new token, we add default value into the list
    for (let ticker in Constants.zrcTokenPropertiesListMap) {
        if (!(ticker in zrcTokenPrice24hLowData)) {
            zrcTokenPrice24hLowData[ticker] = 0;
        }
        if (!(ticker in zrcTokenPrice24hHighData)) {
            zrcTokenPrice24hHighData[ticker] = 0;
        }
    }

    describe('#constructor()', function () {

        it('create empty object', function () {
            let zilswapZrcPrice24hLowHighStatus = new ZilswapZrcPrice24hLowHighStatus.ZilswapZrcPrice24hLowHighStatus(Constants.zrcTokenPropertiesListMap, /* zilswapDexStatus= */ null, /* zrcTokenPrice24hLowData= */ null, /* zrcTokenPrice24hHighData= */ null);

            assert.strictEqual(zilswapZrcPrice24hLowHighStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(zilswapZrcPrice24hLowHighStatus.zilswapDexStatus_, null);
            assert.deepStrictEqual(zilswapZrcPrice24hLowHighStatus.zrcTokenPrice24hLowMap_, {});
            assert.deepStrictEqual(zilswapZrcPrice24hLowHighStatus.zrcTokenPrice24hHighMap_, {});
        });

        it('create object without zilswapDexStatus', function () {
            let zilswapZrcPrice24hLowHighStatus = new ZilswapZrcPrice24hLowHighStatus.ZilswapZrcPrice24hLowHighStatus(Constants.zrcTokenPropertiesListMap, /* zilswapDexStatus= */ null, zrcTokenPrice24hLowData, zrcTokenPrice24hHighData);

            assert.strictEqual(zilswapZrcPrice24hLowHighStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(zilswapZrcPrice24hLowHighStatus.zilswapDexStatus_, null);
            assert.deepStrictEqual(zilswapZrcPrice24hLowHighStatus.zrcTokenPrice24hLowMap_, zrcTokenPrice24hLowData);
            assert.deepStrictEqual(zilswapZrcPrice24hLowHighStatus.zrcTokenPrice24hHighMap_, zrcTokenPrice24hHighData);
        });

        it('create complete object', function () {
            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);

            let zilswapZrcPrice24hLowHighStatus = new ZilswapZrcPrice24hLowHighStatus.ZilswapZrcPrice24hLowHighStatus(Constants.zrcTokenPropertiesListMap, zilswapDexStatus, zrcTokenPrice24hLowData, zrcTokenPrice24hHighData);

            assert.strictEqual(zilswapZrcPrice24hLowHighStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(zilswapZrcPrice24hLowHighStatus.zilswapDexStatus_, zilswapDexStatus);
            assert.deepStrictEqual(zilswapZrcPrice24hLowHighStatus.zrcTokenPrice24hLowMap_, zrcTokenPrice24hLowData);
            assert.deepStrictEqual(zilswapZrcPrice24hLowHighStatus.zrcTokenPrice24hHighMap_, zrcTokenPrice24hHighData);
        });
    });

    describe('#methods()', function () {

        let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
        let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);

        // console.log("'%s': ['%s', '%s', '%s', '%s'],",
        //     ticker,
        //     $('#' + ticker + '_price_past_range_low').text(),
        //     $('#' + ticker + '_price_past_range_high').text(),
        //     $('#' + ticker + '_price_past_range_low_high_progress').attr('aria-valuenow'),
        //     $('#' + ticker + '_price_past_range_low_high_progress').css('width')
        // );
        let expectedMap = {
            'BOLT': ['0.25', '0.67', '12.182022045813543', '12.182022045813543%'],
            'CARB': ['6.95', '15.97', '91.10339995045994', '91.10339995045994%'],
            'DogZilliqa': ['197.48', '2,877.30', '46.206437564886706', '46.206437564886706%'],
            'DUCK': ['3,289.89', '11,363.11', '50.09721057667441', '50.09721057667441%'],
            'ELONS': ['15,146.90', '50,264.04', '16.48986955445421', '16.48986955445421%'],
            'FLAT': ['0.10', '6.27', '82.9279354255686', '82.9279354255686%'],
            'GARY': ['12,294.78', '96,992.11', '61.733384421290964', '61.733384421290964%'],
            'gZIL': ['999.39', '1,652.69', '43.43792048527486', '43.43792048527486%'],
            'MAMBO': ['0.0003', '0.38', '3.039514738658868', '3.039514738658868%'],
            'MESSI': ['0.05', '91.24', '0', '0%'],
            'PORT': ['30.89', '193.31', '44.08220272912269', '44.08220272912269%'],
            'RECAP': ['0.90', '9.53', '42.499222595390975', '42.499222595390975%'],
            'REDC': ['15.01', '26.17', '54.391298782975525', '54.391298782975525%'],
            'SCO': ['1.50', '7.88', '91.8247785263488', '91.8247785263488%'],
            'SHARDS': ['0.04', '17.49', '0', '0%'],
            'SHRK': ['0.03', '3.30', '53.266391789327116', '53.266391789327116%'],
            'SPW': ['0.06', '0.24', '0', '0%'],
            'SRV': ['4.72', '29.92', '94.46902690267052', '94.46902690267052%'],
            'STREAM': ['1.75', '5.00', '0', '0%'],
            'XPORT': ['0.31', '1.93', '44.08220272912269', '44.08220272912269%'],
            'XSGD': ['3.59', '14.19', '22.50651355363852', '22.50651355363852%'],
            'ZCH': ['1.51', '40.21', '79.30615780151747', '79.30615780151747%'],
            'ZLF': ['17.23', '183.70', '85.27627493500935', '85.27627493500935%'],
            'ZLP': ['6.07', '25.30', '68.0896543951994', '68.0896543951994%'],
            'ZPAINT': ['0.05', '0.10', '0', '0%'],
            'ZWALL': ['2.16', '208.51', '0', '0%'],
            'ZWAP': ['1,126.75', '2,905.86', '84.01835791597416', '84.01835791597416%'],
            'ZYRO': ['0.11', '0.17', '51.64496920508281', '51.64496920508281%'],
        }
        // If token not in the list, i.e., new token, we add default value into the list
        for (let ticker in Constants.zrcTokenPropertiesListMap) {
            if (!(ticker in expectedMap)) {
                expectedMap[ticker] = ['', '', '0', '0%'];
            }
        }

        beforeEach(function (done) {
            indexJsdom.resetHtmlView(done);
        });

        it('data set, show to UI', function () {
            let zilswapZrcPrice24hLowHighStatus = new ZilswapZrcPrice24hLowHighStatus.ZilswapZrcPrice24hLowHighStatus(Constants.zrcTokenPropertiesListMap, zilswapDexStatus, zrcTokenPrice24hLowData, zrcTokenPrice24hHighData);

            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_price_past_range_low').text(), expectedMap[ticker][0]);
                assert.strictEqual($('#' + ticker + '_price_past_range_high').text(), expectedMap[ticker][1]);
                assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').attr('aria-valuenow'), expectedMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').css('width'), expectedMap[ticker][3]);
            }
        });

        it('data unset, UI not set, set data and compute, UI set.', function () {
            let zilswapZrcPrice24hLowHighStatus = new ZilswapZrcPrice24hLowHighStatus.ZilswapZrcPrice24hLowHighStatus(Constants.zrcTokenPropertiesListMap, zilswapDexStatus, /* zrcTokenPrice24hLowData= */ null, /* zrcTokenPrice24hHighData= */ null);

            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_price_past_range_low').text(), "");
                assert.strictEqual($('#' + ticker + '_price_past_range_high').text(), "");
                assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').attr('aria-valuenow'), "0");
                assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').css('width'), "0%");
            }

            zilswapZrcPrice24hLowHighStatus.zrcTokenPrice24hLowMap_ = zrcTokenPrice24hLowData;
            zilswapZrcPrice24hLowHighStatus.zrcTokenPrice24hHighMap_ = zrcTokenPrice24hHighData;
            zilswapZrcPrice24hLowHighStatus.bindViewZrcPrice24hLowHigh();

            for (let ticker in Constants.zrcTokenPropertiesListMap) {
                assert.strictEqual($('#' + ticker + '_price_past_range_low').text(), expectedMap[ticker][0]);
                assert.strictEqual($('#' + ticker + '_price_past_range_high').text(), expectedMap[ticker][1]);
                assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').attr('aria-valuenow'), expectedMap[ticker][2]);
                assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').css('width'), expectedMap[ticker][3]);
            }
        });
    });

    describe('bindView', function () {
        let zilswapZrcPrice24hLowHighStatus = new ZilswapZrcPrice24hLowHighStatus.ZilswapZrcPrice24hLowHighStatus(Constants.zrcTokenPropertiesListMap, /* zilswapDexStatus= */ null, /* zrcTokenPrice24hLowData= */ null, /* zrcTokenPrice24hHighData= */ null);

        beforeEach(function (done) {
            indexJsdom.resetHtmlView(done);
        });

        describe('#bindViewZrcPrice24hLow()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_price_past_range_low').text(), '');
                }
            });

            it('bind view', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    zilswapZrcPrice24hLowHighStatus.bindViewZrcPrice24hLow('0.123', ticker);

                    assert.strictEqual($('#' + ticker + '_price_past_range_low').text(), '0.123');
                }
            });
        });

        describe('#bindViewZrcPrice24hHigh()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_price_past_range_high').text(), '');
                }
            });

            it('bind view', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    zilswapZrcPrice24hLowHighStatus.bindViewZrcPrice24hHigh('0.123', ticker);

                    assert.strictEqual($('#' + ticker + '_price_past_range_high').text(), '0.123');
                }
            });
        });

        describe('#bindViewProgress24hPercent()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').attr('aria-valuenow'), "0");
                    assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').css('width'), "0%");
                }
            });

            it('bind view', function () {
                let currentPricePercent = 63.4654;
                let currentPricePercentString = '63.4654';
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    zilswapZrcPrice24hLowHighStatus.bindViewZrcPriceProgress24hPercent(currentPricePercent, ticker);

                    assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').attr('aria-valuenow'), currentPricePercentString);
                    assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').css('width'), currentPricePercentString + '%');
                }
            });

            it('bind view above 100, successful', function () {
                let currentPricePercent = 163.4654;
                let currentPricePercentString = '163.4654';
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    zilswapZrcPrice24hLowHighStatus.bindViewZrcPriceProgress24hPercent(currentPricePercent, ticker);

                    assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').attr('aria-valuenow'), currentPricePercentString);
                    assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').css('width'), currentPricePercentString + '%');
                }
            });


            it('bind view negative, successful, width 0%', function () {
                let currentPricePercent = -63.4654;
                let currentPricePercentString = '-63.4654';
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    zilswapZrcPrice24hLowHighStatus.bindViewZrcPriceProgress24hPercent(currentPricePercent, ticker);

                    assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').attr('aria-valuenow'), currentPricePercentString);
                    assert.strictEqual($('#' + ticker + '_price_past_range_low_high_progress').css('width'), '0%');
                }
            });
        });
    });
});