var indexJsdom = require('../../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var ZilswapDexStatus = require('../../../clientjs/index/zilswap_dex_status.js');
var CoinPriceStatus = require('../../../clientjs/index/coin_price_status.js');
var ZilswapLpZwapRewardStatus = require('../../../clientjs/index/zilswap_lp_zwap_reward_status.js');
var Constants = require('../../../constants.js');
var sinon = require('sinon');

describe('ZilswapLpZwapRewardStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(
            function () {
                // bindViewZwapRewardLp()
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward').html(), '');
                }

                // bindViewTotalRewardAllLpZwap()
                assert.strictEqual($('#total_all_lp_reward_next_epoch').html(), '');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
                assert.strictEqual($('#lp_container').css('display'), 'none');

                // bindViewTotalRewardAllLpFiat()
                assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), 'Loading...');

                // bindViewPrevTotalRewardAllLpZwap()
                assert.strictEqual($('#total_all_lp_reward_prev_epoch').html(), '');

                // bindViewPrevTotalRewardAllLpFiat()
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'Loading...');

                // bindViewNextEpochCountdownCounter(): Exception, no need refresh
                done();
            }
        );
    });

    describe('#constructor()', function () {

        it('create empty object', function () {
            let zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexStatus= */ null, /* zilswapDistributorToTickerMap= */ null);

            assert.strictEqual(zilswapLpZwapRewardStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.deepStrictEqual(zilswapLpZwapRewardStatus.totalRewardNextEpoch_, {});
            assert.deepStrictEqual(zilswapLpZwapRewardStatus.totalRewardPrevEpoch_, {});
            assert.deepStrictEqual(zilswapLpZwapRewardStatus.totalRewardUnclaimed_, {});
        });
    });

    describe('#methods()', function () {

        var coinPriceStatus;
        var zilswapDexStatus;
        var zilswapLpZwapRewardStatus;

        let distributorToTickerMap = {
            "0xc6bacb210f0c096cf6e2aaad8bfd30061e127f12": "ZWAP",
            "0xea57c6b7b5475107688bc70aabefdd5352d0bed0": "ZWAP",
            "0xfb5c8383ffdfa79a655207eef45841f8c9881d22": "STREAM",
            "0x644590ca7de53c5275a1b5602099f3d65da4343f": "BLOX",
            "0x2c93f8482a199051f8662e4e7220d054c7b55239": "RECAP",
            "0xe43333dbad2c73107fca658507f0984e2cab1e1a": "DMZ",
            "0xd84c67723d4ef726ecc982b339c860a22117cba6": "ZIL",
            "0x41a9e637ae3c4a7f11743d1f9b739d077d1df230": "REDC",
            "0x7afe32bdd5baeecf35dc61c4ef333b0701f28f8b": "OKI",
            "0xc6402ce1397f3f1549853e6f519e21dad1bb006e": "XCAD"
        };

        beforeEach(function () {
            let dataObject = JSON.parse('{"zilliqa":{"usd":0.11819}}');
            coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ dataObject, /* coinPriceCoingecko24hAgoData= */ null);

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);

            zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, distributorToTickerMap);
        });

        describe('#computeEpochInfoLoaded()', function () {

            beforeEach(function () {

                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
            });

            it('LP epoch info', function () {
                // 2021 Nov 13, 04.02pm UTC
                clock = sinon.useFakeTimers(new Date(Date.UTC(2021, 10, 13, 16, 02)).getTime());

                // Act
                zilswapLpZwapRewardStatus.computeEpochInfoLoaded();

                // Assert
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '3d 15h 58m');

                clock.restore();
            });


            it('LP epoch info next week', function () {
                // 2021 Nov 13, 04.02pm UTC
                clock = sinon.useFakeTimers(new Date(Date.UTC(2021, 10, 20, 16, 02)).getTime());

                // Act
                zilswapLpZwapRewardStatus.computeEpochInfoLoaded();

                // Assert
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '3d 15h 58m');

                clock.restore();
            });
        });

        describe('#computeLpRewardNextEpochLoaded()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward').html(), '');
                }
                assert.strictEqual($('#total_all_lp_reward_next_epoch').html(), '');
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

                let newApiContractAddressToRewardMap = {}
                let distributorAddress = '0xea57c6b7b5475107688bc70aabefdd5352d0bed0';
                newApiContractAddressToRewardMap[distributorAddress] = contractAddressToRewardMap;

                zilswapLpZwapRewardStatus.contractAddressToRewardMapData_ = newApiContractAddressToRewardMap;

                let contractAddressToUserFriendlyRewardString = {
                    "zil1p5suryq6q647usxczale29cu3336hhp376c627": "0.01271",
                    "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "0.02698",
                    "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "0.01255",
                    "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4": "0.01578"
                };

                // Act
                zilswapLpZwapRewardStatus.computeNextEpochLoaded();

                // Assert
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    let currAddress = Constants.zrcTokenPropertiesListMap[ticker].address;
                    if (!contractAddressToRewardMap[currAddress]) {
                        assert.strictEqual($('#' + ticker + '_lp_pool_reward').html(), '');
                    } else {
                        let expectedRewardString = contractAddressToUserFriendlyRewardString[currAddress];
                        let htmlContent = $('#' + ticker + '_lp_pool_reward').html();
                        assert.strictEqual(htmlContent.includes(expectedRewardString), true);
                        assert.strictEqual(htmlContent.includes(distributorToTickerMap[distributorAddress]), true);
                    }
                }
                assert.strictEqual($('#total_all_lp_reward_next_epoch').html().includes('0.06802'), true);
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

                let newApiContractAddressToRewardMap = {}
                let distributorAddress = '0xea57c6b7b5475107688bc70aabefdd5352d0bed0';
                newApiContractAddressToRewardMap[distributorAddress] = contractAddressToRewardMap;

                zilswapLpZwapRewardStatus.contractAddressToRewardMapData_ = newApiContractAddressToRewardMap;

                // Act
                zilswapLpZwapRewardStatus.computeNextEpochLoaded();

                // Assert
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward').html(), '');
                }
                assert.strictEqual($('#total_all_lp_reward_next_epoch').html(), '');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
            });

            it('LP reward data not a number, no show', function () {
                // Arrange
                let contractAddressToRewardMap = {
                    "zil1p5suryq6q647usxczale29cu3336hhp376c627": "asdf",
                    "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t": "asdf",
                    "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e": "fds",
                };

                let newApiContractAddressToRewardMap = {}
                let distributorAddress = '0xea57c6b7b5475107688bc70aabefdd5352d0bed0';
                newApiContractAddressToRewardMap[distributorAddress] = contractAddressToRewardMap;

                zilswapLpZwapRewardStatus.contractAddressToRewardMapData_ = newApiContractAddressToRewardMap;

                // Act
                zilswapLpZwapRewardStatus.computeNextEpochLoaded();

                // Assert
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward').html(), '');
                }
                assert.strictEqual($('#total_all_lp_reward_next_epoch').html(), '');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
            });

            it('LP reward empty', function () {
                // Arrange
                zilswapLpZwapRewardStatus.contractAddressToRewardMapData_ = {};

                // Act
                zilswapLpZwapRewardStatus.computeNextEpochLoaded();

                // Assert
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward').html(), '');
                }
                assert.strictEqual($('#total_all_lp_reward_next_epoch').html(), '');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
            });
        });


        describe('#computeUnclaimedOrPrevEpochLoaded()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_unclaimed').html(), '');
                assert.strictEqual($('#total_all_lp_reward_unclaimed_fiat').text(), 'Loading...');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch').html(), '');
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'Loading...');
            });

            it('Unclaimed reward', function () {
                // Arrange
                let dataString = fs.readFileSync('./tests/testdata/stats_zilswap_distribution_claimable_data_20211114.txt', 'utf8')
                let unclaimedRewardData = JSON.parse(dataString);

                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, distributorToTickerMap);

                // Act
                zilswapLpZwapRewardStatus.computeUnclaimedOrPrevEpochLoaded(unclaimedRewardData, zilswapLpZwapRewardStatus.appendViewUnclaimedSingleRewardAllLp, zilswapLpZwapRewardStatus.bindViewUnclaimedAllLpFiat);

                // Assert
                let htmlContent = $('#total_all_lp_reward_unclaimed').html();
                assert.strictEqual(htmlContent.includes('40.38'), true);
                assert.strictEqual(htmlContent.includes('STREAM'), true);
                assert.strictEqual(htmlContent.includes('0.4471'), true);
                assert.strictEqual(htmlContent.includes('ZWAP'), true);
                assert.strictEqual($('#total_all_lp_reward_unclaimed_fiat').text(), '138.54');
            });

            it('Prev reward', function () {
                // Arrange
                let dataString = fs.readFileSync('./tests/testdata/stats_zilswap_distribution_claimable_data_20211114.txt', 'utf8')
                let unclaimedRewardData = JSON.parse(dataString);

                zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, distributorToTickerMap);

                // Act
                zilswapLpZwapRewardStatus.computeUnclaimedOrPrevEpochLoaded(unclaimedRewardData, zilswapLpZwapRewardStatus.appendViewPrevEpochSingleRewardAllLp, zilswapLpZwapRewardStatus.bindViewPrevEpochAllLpFiat);

                // Assert
                let htmlContent = $('#total_all_lp_reward_prev_epoch').html();
                assert.strictEqual(htmlContent.includes('40.38'), true);
                assert.strictEqual(htmlContent.includes('STREAM'), true);
                assert.strictEqual(htmlContent.includes('0.4471'), true);
                assert.strictEqual(htmlContent.includes('ZWAP'), true);
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), '138.54');
            });
        });

    });

    describe('bindView', function () {
        var zilswapLpZwapRewardStatus;

        beforeEach(function () {
            zilswapLpZwapRewardStatus = new ZilswapLpZwapRewardStatus.ZilswapLpZwapRewardStatus(Constants.zrcTokenPropertiesListMap, /* coinPriceStatus= */ null, /* zilswapDexStatus= */ null, /* zilswapDistributorToTickerMap= */ null);
        });

        describe('#bindViewNextEpochCountdownCounter()', function () {

            beforeEach(function () {
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '');
            });

            it('bind view happy case', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewNextEpochCountdownCounter('4d 5h 12m');

                // Assert
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), '4d 5h 12m');
            });

            it('bind view random string', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewNextEpochCountdownCounter('asdf');

                // Assert
                assert.strictEqual($('#lp_reward_next_epoch_duration_counter').text(), 'asdf');
            });
        });

        describe('#appendViewNextEpochSingleRewardSingleLp()', function () {

            beforeEach(function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    assert.strictEqual($('#' + ticker + '_lp_pool_reward').html(), '');
                }
            });

            it('append view happy case', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapLpZwapRewardStatus.appendViewNextEpochSingleRewardSingleLp(ticker, '1234.4', 'ZWAP', 'http://zilswap.io/');
                    // Assert
                    let htmlContent = $('#' + ticker + '_lp_pool_reward').html();
                    assert.strictEqual(htmlContent.includes('1234.4'), true);
                    assert.strictEqual(htmlContent.includes('ZWAP'), true);
                    assert.strictEqual(htmlContent.includes('src="http://zilswap.io/"'), true);
                    assert.strictEqual(htmlContent.includes('+'), false);
                }
            });

            it('append view twice', function () {
                for (let ticker in Constants.zrcTokenPropertiesListMap) {
                    // Act
                    zilswapLpZwapRewardStatus.appendViewNextEpochSingleRewardSingleLp(ticker, '1234.4', 'ZWAP', 'http://zilswap.io/');
                    zilswapLpZwapRewardStatus.appendViewNextEpochSingleRewardSingleLp(ticker, '456.7', 'ZIL', 'http://zilliqa.com/');
                    // Assert
                    let htmlContent = $('#' + ticker + '_lp_pool_reward').html();
                    assert.strictEqual(htmlContent.includes('1234.4'), true);
                    assert.strictEqual(htmlContent.includes('ZWAP'), true);
                    assert.strictEqual(htmlContent.includes('src="http://zilswap.io/"'), true);
                    assert.strictEqual(htmlContent.includes('456.7'), true);
                    assert.strictEqual(htmlContent.includes('ZIL'), true);
                    assert.strictEqual(htmlContent.includes('src="http://zilliqa.com/"'), true);
                    assert.strictEqual(htmlContent.includes('+'), true);
                }
            });
        });

        describe('#appendViewNextEpochSingleRewardAllLp()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_next_epoch').html(), '');
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'none');
                assert.strictEqual($('#lp_container').css('display'), 'none');
            });

            it('append view legit balance', function () {
                // Act
                zilswapLpZwapRewardStatus.appendViewNextEpochSingleRewardAllLp('1234.4', 'ZWAP', 'http://zilswap.io/');

                // Assert
                let htmlContent = $('#total_all_lp_reward_next_epoch').html();
                assert.strictEqual(htmlContent.includes('1234.4'), true);
                assert.strictEqual(htmlContent.includes('ZWAP'), true);
                assert.strictEqual(htmlContent.includes('src="http://zilswap.io/"'), true);
                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
                assert.strictEqual($('#lp_container').css('display'), 'block');
                assert.strictEqual(htmlContent.includes('+'), false);
            });

            it('append view twice', function () {
                // Act
                zilswapLpZwapRewardStatus.appendViewNextEpochSingleRewardAllLp('1234.4', 'ZWAP', 'http://zilswap.io/');
                zilswapLpZwapRewardStatus.appendViewNextEpochSingleRewardAllLp('456.7', 'ZIL', 'http://zilliqa.com/');

                // Assert

                let htmlContent = $('#total_all_lp_reward_next_epoch').html();
                assert.strictEqual(htmlContent.includes('1234.4'), true);
                assert.strictEqual(htmlContent.includes('ZWAP'), true);
                assert.strictEqual(htmlContent.includes('src="http://zilswap.io/"'), true);
                assert.strictEqual(htmlContent.includes('456.7'), true);
                assert.strictEqual(htmlContent.includes('ZIL'), true);
                assert.strictEqual(htmlContent.includes('src="http://zilliqa.com/"'), true);
                assert.strictEqual(htmlContent.includes('+'), true);

                assert.strictEqual($('#total_all_lp_reward_next_epoch_container').css('display'), 'block');
                assert.strictEqual($('#lp_container').css('display'), 'block');
            });
        });

        describe('#bindViewNextEpochAllLpFiat()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), 'Loading...');
            });

            it('bind view happy case', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewNextEpochAllLpFiat('1234.52');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), '1234.52');
            });

            it('bind view random string', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewNextEpochAllLpFiat('asdf');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_next_epoch_fiat').text(), 'asdf');
            });
        });

        describe('#appendViewPrevEpochSingleRewardAllLp()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_prev_epoch').html(), '');
            });

            it('append view legit balance', function () {
                // Act
                zilswapLpZwapRewardStatus.appendViewPrevEpochSingleRewardAllLp('1234.4', 'ZWAP', 'http://zilswap.io/');

                // Assert
                let htmlContent = $('#total_all_lp_reward_prev_epoch').html();
                assert.strictEqual(htmlContent.includes('1234.4'), true);
                assert.strictEqual(htmlContent.includes('ZWAP'), true);
                assert.strictEqual(htmlContent.includes('src="http://zilswap.io/"'), true);
                assert.strictEqual(htmlContent.includes('+'), false);
            });

            it('append view twice', function () {
                // Act
                zilswapLpZwapRewardStatus.appendViewPrevEpochSingleRewardAllLp('1234.4', 'ZWAP', 'http://zilswap.io/');
                zilswapLpZwapRewardStatus.appendViewPrevEpochSingleRewardAllLp('456.7', 'ZIL', 'http://zilliqa.com/');

                // Assert

                let htmlContent = $('#total_all_lp_reward_prev_epoch').html();
                assert.strictEqual(htmlContent.includes('1234.4'), true);
                assert.strictEqual(htmlContent.includes('ZWAP'), true);
                assert.strictEqual(htmlContent.includes('src="http://zilswap.io/"'), true);
                assert.strictEqual(htmlContent.includes('456.7'), true);
                assert.strictEqual(htmlContent.includes('ZIL'), true);
                assert.strictEqual(htmlContent.includes('src="http://zilliqa.com/"'), true);
                assert.strictEqual(htmlContent.includes('+'), true);
            });
        });

        describe('#bindViewPrevEpochAllLpFiat()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'Loading...');
            });

            it('bind view happy case', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewPrevEpochAllLpFiat('1234.52');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), '1234.52');
            });

            it('bind view random string', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewPrevEpochAllLpFiat('asdf');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_prev_epoch_fiat').text(), 'asdf');
            });
        });

        describe('#appendViewUnclaimedSingleRewardAllLp()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_unclaimed').html(), '');
            });

            it('append view legit balance', function () {
                // Act
                zilswapLpZwapRewardStatus.appendViewUnclaimedSingleRewardAllLp('1234.4', 'ZWAP', 'http://zilswap.io/');

                // Assert
                let htmlContent = $('#total_all_lp_reward_unclaimed').html();
                assert.strictEqual(htmlContent.includes('1234.4'), true);
                assert.strictEqual(htmlContent.includes('ZWAP'), true);
                assert.strictEqual(htmlContent.includes('src="http://zilswap.io/"'), true);
                assert.strictEqual(htmlContent.includes('+'), false);
            });

            it('append view twice', function () {
                // Act
                zilswapLpZwapRewardStatus.appendViewUnclaimedSingleRewardAllLp('1234.4', 'ZWAP', 'http://zilswap.io/');
                zilswapLpZwapRewardStatus.appendViewUnclaimedSingleRewardAllLp('456.7', 'ZIL', 'http://zilliqa.com/');

                // Assert

                let htmlContent = $('#total_all_lp_reward_unclaimed').html();
                assert.strictEqual(htmlContent.includes('1234.4'), true);
                assert.strictEqual(htmlContent.includes('ZWAP'), true);
                assert.strictEqual(htmlContent.includes('src="http://zilswap.io/"'), true);
                assert.strictEqual(htmlContent.includes('456.7'), true);
                assert.strictEqual(htmlContent.includes('ZIL'), true);
                assert.strictEqual(htmlContent.includes('src="http://zilliqa.com/"'), true);
                assert.strictEqual(htmlContent.includes('+'), true);
            });
        });

        describe('#bindViewUnclaimedAllLpFiat()', function () {

            beforeEach(function () {
                assert.strictEqual($('#total_all_lp_reward_unclaimed_fiat').text(), 'Loading...');
            });

            it('bind view happy case', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewUnclaimedAllLpFiat('1234.52');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_unclaimed_fiat').text(), '1234.52');
            });

            it('bind view random string', function () {
                // Act
                zilswapLpZwapRewardStatus.bindViewUnclaimedAllLpFiat('asdf');

                // Assert
                assert.strictEqual($('#total_all_lp_reward_unclaimed_fiat').text(), 'asdf');
            });
        });
    });
});