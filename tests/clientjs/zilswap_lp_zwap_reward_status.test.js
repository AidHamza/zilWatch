var indexJsdom = require('../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../clientjs/zilswap_dex_status.js');
var CoinPriceStatus = require('../../clientjs/coin_price_status.js');
var ZilswapLpZwapRewardStatus = require('../../clientjs/zilswap_lp_zwap_reward_status.js');
var Constants = require('../../constants.js');
var sinon = require('sinon');

describe('ZilswapLpZwapRewardStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(
            function () {
                // bindViewZwapRewardLp()
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
                }

                // bindViewTotalRewardAllLpZwap()
                assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
                assert.strictEqual($('#lp_container').css('display'), 'none');

                // bindViewTotalRewardAllLpFiat()
                assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), 'Loading...');

                // bindViewPrevTotalRewardAllLpZwap()
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), '');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'Loading...');

                // bindViewPrevTotalRewardAllLpFiat()
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'Loading...');

                // enableTooltipPastTotalRewardAllLpZwap()
                // disableTooltipPastTotalRewardAllLpZwap()
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
                $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

                // clearViewPastTotalRewardAllLpZwap()
                // addViewPastTotalRewardAllLpZwap()
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

                // bindViewLpNextEpochCounter(): Exception, no need refresh

                done();
            }
        );
    });

    describe('#constructor()', function () {

        it('create empty object', function () {
            let zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexStatus= */ null, /* walletAddressBech32= */ null, /* epochInfoData= */ null, /* contractAddressToRewardMapData= */ null, /* pastRewardListData= */ null);

            assert.strictEqual(zilswapLpZwapRewardStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(zilswapLpZwapRewardStatus.totalZwapRewardNextEpoch_, 0);
            assert.strictEqual(zilswapLpZwapRewardStatus.totalZwapRewardPrevEpoch_, 0);
            assert.deepStrictEqual(zilswapLpZwapRewardStatus.totalZwapRewardPastEpoch_, {});
        });
    });

    describe('#methods()', function () {

        var coinPriceStatus;
        var zilswapDexStatus;
        var zilswapLpZwapRewardStatus;

        beforeEach(function () {
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/clientjs/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);
            
            zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, /* epochInfoData= */ null, /* contractAddressToRewardMapData= */ null, /* pastRewardListData= */ null);
        });

        describe('#computeLpRewardNextEpochLoaded()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
                }
                assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
            });

            it('LP reward loaded happy case', function () {
                // Arrange
                let contractAddressToRewardMap = {
                    "zil1p5suryq6q647usxczale29cu3336hhp376c627": "12710374110",
                    "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "26977710437",
                    "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "12548281867",
                    "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4": "15783071977"
                };
                let newApiContractAddressToRewardMap = {
                    "0xe5e274f59482759c1a0c13682ff3ec3efeb22d2a": contractAddressToRewardMap,
                };
                let contractAddressToUserFriendlyRewardString = {
                    "zil1p5suryq6q647usxczale29cu3336hhp376c627": "0.01271",
                    "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "0.02698",
                    "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "0.01255",
                    "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4": "0.01578"
                };

                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, /* epochInfoData= */ null, newApiContractAddressToRewardMap, /* pastRewardListData= */ null);

                // Act
                zilswapLpZwapRewardStatus.computeLpRewardNextEpochLoaded();

                // Assert
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    let currAddress = Constants.zrcTokenPropertiesListMap[ticker].address;
                    if (!contractAddressToRewardMap[currAddress]) {
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), 'No reward');
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
                    } else {
                        let expectedRewardString = contractAddressToUserFriendlyRewardString[currAddress];
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), expectedRewardString);
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
                    }
                }
                assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), '0.06802');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
            });

            it('LP reward loaded amount too small, no show', function () {
                // Arrange
                let contractAddressToRewardMap = {
                    "zil1p5suryq6q647usxczale29cu3336hhp376c627": "286",
                    "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "187",
                    "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "1287",
                    "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4": "124"
                };
                let newApiContractAddressToRewardMap = {
                    "0xe5e274f59482759c1a0c13682ff3ec3efeb22d2a": contractAddressToRewardMap,
                };
                
                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, /* epochInfoData= */ null, newApiContractAddressToRewardMap, /* pastRewardListData= */ null);

                // Act
                zilswapLpZwapRewardStatus.computeLpRewardNextEpochLoaded();

                // Assert
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    let currAddress = Constants.zrcTokenPropertiesListMap[ticker].address;
                    if (!contractAddressToRewardMap[currAddress]) {
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), 'No reward');
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
                    } else {
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
                    }
                }
                assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
            });

            it('LP reward data not a number, no show', function () {
                // Arrange
                let contractAddressToRewardMap = {
                    "zil1p5suryq6q647usxczale29cu3336hhp376c627": "asdf",
                    "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "asdf",
                    "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "fds",
                };
                let newApiContractAddressToRewardMap = {
                    "0xe5e274f59482759c1a0c13682ff3ec3efeb22d2a": contractAddressToRewardMap,
                };

                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, /* epochInfoData= */ null, newApiContractAddressToRewardMap, /* pastRewardListData= */ null);

                // Act
                zilswapLpZwapRewardStatus.computeLpRewardNextEpochLoaded();

                // Assert
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    let currAddress = Constants.zrcTokenPropertiesListMap[ticker].address;
                    if (!contractAddressToRewardMap[currAddress]) {
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), 'No reward');
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
                    } else {
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
                    }
                }
                assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
            });

            it('LP reward data not a map', function () {
                // Arrange
                let contractAddressToRewardMap = "asdffds";
                
                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, /* epochInfoData= */ null, contractAddressToRewardMap, /* pastRewardListData= */ null);

                // Act
                zilswapLpZwapRewardStatus.computeLpRewardNextEpochLoaded();

                // Assert
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
                }
                assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
            });
        });

        describe('#computeLpRewardPastEpochLoaded()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'Loading...');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'Loading...');
            });

            it('Past LP reward loaded happy case', function () {
                // Arrange
                let dataString = fs.readFileSync('./tests/clientjs/stats_zilswap_distribution_data_20210516.txt', 'utf8')
                let pastRewardList = JSON.parse(dataString);

                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, /* epochInfoData= */ null, /* contractAddressToRewardMapData= */ null, pastRewardList);

                // Act
                zilswapLpZwapRewardStatus.computeLpRewardPastEpochLoaded();
                $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), '0.09727');
                assert.strictEqual($('#total_all_lp_reward_epoch_14_zwap').text(), '0.06738');
                assert.strictEqual($('#total_all_lp_reward_epoch_13_zwap').text(), '0.06741');
                assert.strictEqual($('#total_all_lp_reward_epoch_12_zwap').text(), '0.04986');
                assert.strictEqual($('#total_all_lp_reward_epoch_11_zwap').text(), '0.007002');
                assert.strictEqual($('#total_all_lp_reward_epoch_10_zwap').length, 0);
                assert.strictEqual($('.past_lp_reward_fiat').length, 4);

                // Assert tooltip shown and displayed
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), true);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), true);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'table-row-group');
            });

            it('No Past LP reward, show 0', function () {
                // Arrange
                let dataString = "[]";
                let pastRewardList = JSON.parse(dataString);

                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, /* epochInfoData= */ null, /* contractAddressToRewardMapData= */ null, pastRewardList);

                // Act
                zilswapLpZwapRewardStatus.computeLpRewardPastEpochLoaded();

                // Assert
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), '-');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), '0');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), '0');
            });

            it('Null Past LP reward, show 0', function () {
                // Arrange
                let pastRewardList = null;

                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, /* epochInfoData= */ null, /* contractAddressToRewardMapData= */ null, pastRewardList);

                // Act
                zilswapLpZwapRewardStatus.computeLpRewardPastEpochLoaded();

                // Assert
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), '-');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), '0');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), '0');
            });
        });

        describe('#computeLpCurrentEpochInfoLoaded()', function () {

            beforeEach(function () {
                // 2021 May 01, 2.34pm UTC
                clock = sinon.useFakeTimers(new Date(Date.UTC(2021, 04, 1, 2, 34)).getTime());

                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
            });

            it('LP epoch info loaded happy case', function () {
                // Arrange
                let epochInfoData = {
                    "epoch_period": 604800,
                    "tokens_per_epoch": 6250,
                    "first_epoch_start": 1612339200,
                    "next_epoch_start": 1620201600,
                    "total_epoch": 153,
                    "current_epoch": 14
                };
                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, epochInfoData, /* contractAddressToRewardMapData= */ null, /* pastRewardListData */ null);

                // Act
                zilswapLpZwapRewardStatus.computeLpCurrentEpochInfoLoaded();

                // Assert
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '4d 5h 26m');
            });

            it('LP epoch info not number', function () {
                // Arrange
                let epochInfoData = {
                    "epoch_period": 604800,
                    "tokens_per_epoch": 6250,
                    "first_epoch_start": 1612339200,
                    "next_epoch_start": "asdfasdf",
                    "total_epoch": 153,
                    "current_epoch": 14
                };
                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, epochInfoData, /* contractAddressToRewardMapData= */ null, /* pastRewardListData */ null);

                // Act
                zilswapLpZwapRewardStatus.computeLpCurrentEpochInfoLoaded();

                // Assert
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
            });


            it('LP epoch info invalid data', function () {
                // Arrange
                let epochInfoData = "asdf";
                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBech32= */ null, epochInfoData, /* contractAddressToRewardMapData= */ null, /* pastRewardListData */ null);

                // Act
                zilswapLpZwapRewardStatus.computeLpCurrentEpochInfoLoaded();

                // Assert
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
            });

            afterEach(function () {
                clock.restore();
            });
        });
    });

    describe('bindView', function () {
        var zilswapLpZwapRewardStatus;

        beforeEach(function () {
            zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexStatus= */ null, /* walletAddressBech32= */ null, /* epochInfoData= */ null, /* contractAddressToRewardMapData= */ null, /* pastRewardListData= */ null);
        });

        describe('#bindViewZwapRewardLp()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), '');
                }
            });

            it('bind view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapLpZwapRewardStatus.bindViewZwapRewardLp('1234.4', ticker);
                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), '1234.4');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
                }
            });

            it('bind view random string', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapLpZwapRewardStatus.bindViewZwapRewardLp('asdf', ticker);

                    // Assert
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap').text(), 'asdf');
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward_zwap_unit').text(), 'ZWAP');
                }
            });
        });

        describe('#bindViewTotalRewardAllLpZwap()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'Loading...');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
                assert.strictEqual($('#lp_container').css('display'), 'none');
            });

            it('bind view legit balance', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewTotalRewardAllLpZwap('1234.4');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), '1234.4');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
                assert.strictEqual($('#lp_container').css('display'), 'block');
            });

            it('bind view random string', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewTotalRewardAllLpZwap('asdf');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_next_epoch_zwap').text(), 'asdf');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
                assert.strictEqual($('#lp_container').css('display'), 'block');
            });
        });

        describe('#bindViewTotalRewardAllLpFiat()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), 'Loading...');
            });

            it('bind view happy case', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewTotalRewardAllLpFiat('1234.52');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), '1234.52');
            });

            it('bind view random string', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewTotalRewardAllLpFiat('asdf');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), 'asdf');
            });
        });

        describe('#bindViewPrevTotalRewardAllLpZwap()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), '');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'Loading...');
            });

            it('bind view legit balance', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewPrevTotalRewardAllLpZwap('15', '1234.4');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), '15');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), '1234.4');
            });

            it('bind view random string', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewPrevTotalRewardAllLpZwap('ss', 'asdf');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_number').text(), 'ss');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_zwap').text(), 'asdf');
            });
        });

        describe('#bindViewPrevTotalRewardAllLpFiat()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'Loading...');
            });

            it('bind view happy case', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewPrevTotalRewardAllLpFiat('1234.52');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), '1234.52');
            });

            it('bind view random string', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewPrevTotalRewardAllLpFiat('asdf');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'asdf');
            });
        });

        describe('#enable|disableTooltipPastTotalRewardAllLpZwap()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
            });

            it('default disable, mouseover or touchstart, nothing happens', function () {
                // Act
                $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

                // Act
                $('#total_all_lp_reward_past_epoch_container').trigger('touchstart');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
            });

            it('default disable, disable, mouseover or touchstart, nothing happens', function () {
                // Act
                zilswapLpZwapRewardStatus.disableTooltipPastTotalRewardAllLpZwap();

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

                // Act
                $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

                // Act
                $('#total_all_lp_reward_past_epoch_container').trigger('touchstart');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
            });

            it('default disable, enable, mouseover, activated', function () {
                // Act
                zilswapLpZwapRewardStatus.enableTooltipPastTotalRewardAllLpZwap();

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), true);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

                // Act
                $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), true);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'table-row-group');
            });

            it('default disable, enable, touchstart, activated', function () {
                // Act
                zilswapLpZwapRewardStatus.enableTooltipPastTotalRewardAllLpZwap();

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), true);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

                // Act
                $('#total_all_lp_reward_past_epoch_container').trigger('touchstart');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), true);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'table-row-group');
            });

            it('default disable, then enable, then disable, mouseover or touchstart, nothing happens', function () {
                // Act
                zilswapLpZwapRewardStatus.enableTooltipPastTotalRewardAllLpZwap();
                zilswapLpZwapRewardStatus.disableTooltipPastTotalRewardAllLpZwap();

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('tooltip-container'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

                // Act
                $('#total_all_lp_reward_past_epoch_container').trigger('mouseover');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');

                // Act
                $('#total_all_lp_reward_past_epoch_container').trigger('touchstart');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_container').hasClass('hover-effect'), false);
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
            });
        });

        describe('#clear|addViewPastTotalRewardAllLpZwap()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
            });

            it('addView, 2x, view appended', function () {
                let viewElement = "<div>hehe</div>";
                let viewElement2 = "<div>hihi</div>";
                let combinedElement = viewElement + viewElement2;

                // Act
                zilswapLpZwapRewardStatus.addViewPastTotalRewardAllLpZwap(viewElement);

                // Assert
                assert.notStrictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), viewElement);

                // Act
                zilswapLpZwapRewardStatus.addViewPastTotalRewardAllLpZwap(viewElement2);

                // Assert
                assert.notStrictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), combinedElement);
            });

            it('addView 2x, clearView, empty', function () {
                let viewElement = "<div>hehe</div>";
                let viewElement2 = "<div>hihi</div>";
                let combinedElement = viewElement + viewElement2;

                // Act
                zilswapLpZwapRewardStatus.addViewPastTotalRewardAllLpZwap(viewElement);
                zilswapLpZwapRewardStatus.addViewPastTotalRewardAllLpZwap(viewElement2);
                zilswapLpZwapRewardStatus.clearViewPastTotalRewardAllLpZwap();

                // Assert
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
            });
        });


        describe('#add|getViewPastTotalRewardAllLpZwap(), then update fiat', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').css('display'), 'none');
                assert.strictEqual($('#total_all_lp_reward_past_epoch_tooltip_content').html(), '');
            });

            it('#getViewPastTotalRewardAllLpZwap()', function () {
                let epochNumber = "134";
                let pastTotalRewardZwapString = "583.132";
                let currentActiveDollarSymbol = "$";
                let viewElement = zilswapLpZwapRewardStatus.getViewPastTotalRewardAllLpZwap(epochNumber, pastTotalRewardZwapString, currentActiveDollarSymbol);

                // Assert
                assert.strictEqual(viewElement.includes(epochNumber), true);
                assert.strictEqual(viewElement.includes(pastTotalRewardZwapString), true);
                assert.strictEqual(viewElement.includes(currentActiveDollarSymbol), true);
                assert.strictEqual(viewElement.includes("total_all_lp_reward_epoch_" + epochNumber + "_zwap"), true);
                assert.strictEqual(viewElement.includes("total_all_lp_reward_epoch_" + epochNumber + "_fiat"), true);
            });

            it('addView, 2x, view appended', function () {
                let epochNumber = "134";
                let pastTotalRewardZwapString = "583.132";
                let currentActiveDollarSymbol = "$";
                let viewElement = zilswapLpZwapRewardStatus.getViewPastTotalRewardAllLpZwap(epochNumber, pastTotalRewardZwapString, currentActiveDollarSymbol);

                let epochNumber2 = "123";
                let pastTotalRewardZwapString2 = "1843.132";
                let currentActiveDollarSymbol2 = "$";
                let viewElement2 = zilswapLpZwapRewardStatus.getViewPastTotalRewardAllLpZwap(epochNumber2, pastTotalRewardZwapString2, currentActiveDollarSymbol2);

                let combinedElement = viewElement + viewElement2;

                // Act
                zilswapLpZwapRewardStatus.addViewPastTotalRewardAllLpZwap(viewElement);
                zilswapLpZwapRewardStatus.addViewPastTotalRewardAllLpZwap(viewElement2);

                // Assert
                assert.strictEqual($("#total_all_lp_reward_epoch_" + epochNumber + "_fiat").text(), '');
                assert.strictEqual($("#total_all_lp_reward_epoch_" + epochNumber2 + "_fiat").text(), '');

                // Act & Assert
                zilswapLpZwapRewardStatus.bindViewPastTotalRewardAllLpFiat(epochNumber, '534');
                assert.strictEqual($("#total_all_lp_reward_epoch_" + epochNumber + "_fiat").text(), '534');
                assert.strictEqual($("#total_all_lp_reward_epoch_" + epochNumber2 + "_fiat").text(), '');

                // Act & Assert
                zilswapLpZwapRewardStatus.bindViewPastTotalRewardAllLpFiat(epochNumber2, '994');
                assert.strictEqual($("#total_all_lp_reward_epoch_" + epochNumber + "_fiat").text(), '534');
                assert.strictEqual($("#total_all_lp_reward_epoch_" + epochNumber2 + "_fiat").text(), '994');
            });
        });

        describe('#bindViewLpNextEpochCounter()', function () {

            beforeEach(function () {
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
            });

            it('bind view happy case', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewLpNextEpochCounter('4d 5h 12m');

                // Assert
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '4d 5h 12m');
            });

            it('bind view random string', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewLpNextEpochCounter('asdf');

                // Assert
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), 'asdf');
            });
        });

    });
});