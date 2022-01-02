/** A class to represent Zilswap LP ZWAP reward status.  */
class ZilswapLpZwapRewardStatus {

    constructor(zrcTokenPropertiesListMap,
        supportedDexToBaseTokenMap,
        /* nullable= */ coinPriceStatus,
        /* nullable= */ zilswapDexStatus,
        /* nullable= */ zilswapDistributorToTickerMap,
        /* nullable= */ xcadDistributorToTickerMap) {

        // Private variable
        this.supportedDexToBaseTokenMap_ = supportedDexToBaseTokenMap;
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;
        this.distributorToTickerMap_ = {
            'zilswap' : zilswapDistributorToTickerMap,
            'xcaddex' : xcadDistributorToTickerMap,
        }

        this.epochInfoData_ = {
            'zilswap' : {
                'epoch_period': 604800,
                'distribution_start_time': 1629878400,
            }, 
            'xcaddex' : {
                'epoch_period': 86400,
                'distribution_start_time': 1640894400,
            }
        }

        this.walletAddressBech32_ = null;
        this.contractAddressToRewardMapData_ = {};
        for (let dexName in supportedDexToBaseTokenMap) {
            this.contractAddressToRewardMapData_[dexName] = null;
        }

        this.totalRewardNextEpoch_ = {};
        this.totalRewardUnclaimed_ = {};
        this.totalRewardPrevEpoch_ = {};
    }

    onCoinPriceStatusChange() {
        this.refreshLpRewardFiat('zilswap', this.totalRewardNextEpoch_, this.bindViewNextEpochAllLpFiat);
        this.refreshLpRewardFiat('zilswap', this.totalRewardUnclaimed_, this.bindViewUnclaimedAllLpFiat);
        this.refreshLpRewardFiat('zilswap', this.totalRewardPrevEpoch_, this.bindViewPrevEpochAllLpFiat);
        this.refreshLpRewardFiat('xcaddex', this.totalRewardNextEpoch_, this.bindViewNextEpochAllLpFiat);
        this.refreshLpRewardFiat('xcaddex', this.totalRewardUnclaimed_, this.bindViewUnclaimedAllLpFiat);
    }

    onZilswapDexStatusChange() {
        this.refreshLpRewardFiat('zilswap', this.totalRewardNextEpoch_, this.bindViewNextEpochAllLpFiat);
        this.refreshLpRewardFiat('zilswap', this.totalRewardUnclaimed_, this.bindViewUnclaimedAllLpFiat);
        this.refreshLpRewardFiat('zilswap', this.totalRewardPrevEpoch_, this.bindViewPrevEpochAllLpFiat);
        this.refreshLpRewardFiat('xcaddex', this.totalRewardNextEpoch_, this.bindViewNextEpochAllLpFiat);
        this.refreshLpRewardFiat('xcaddex', this.totalRewardUnclaimed_, this.bindViewUnclaimedAllLpFiat);
    }

    setWalletAddressBech32(walletAddressBech32) {
        this.walletAddressBech32_ = walletAddressBech32;
        this.reset();
    }

    reset() {
        this.resetView();
        this.totalRewardNextEpoch_ = {};
        this.totalRewardUnclaimed_ = {};
        this.totalRewardPrevEpoch_ = {};
    }

    computeEpochInfoLoaded(dexName) {
        if (!(dexName in this.epochInfoData_)) {
            return;
        }
        let epochInfoData = this.epochInfoData_[dexName];

        let epochPeriod = parseInt(epochInfoData.epoch_period);
        let distributionStartTimeSeconds = parseInt(epochInfoData.distribution_start_time);
        let nextEpochStartSeconds = distributionStartTimeSeconds + epochPeriod;

        let currentDate = new Date();
        let currentTimeSeconds = currentDate.getTime() / 1000;

        // Fallback if the epoch start seconds is not updated
        while (nextEpochStartSeconds < currentTimeSeconds) {
            nextEpochStartSeconds += epochPeriod;
        }
        let timeDiffSeconds = nextEpochStartSeconds - currentTimeSeconds;
        let timeDiffDuration = new Duration(timeDiffSeconds);

        this.bindViewNextEpochCountdownCounter(dexName, timeDiffDuration.getUserFriendlyString());
    }

    computeNextEpochLoaded(dexName) {
        if (!(dexName in this.contractAddressToRewardMapData_)) {
            return;
        }
        if (!(dexName in this.distributorToTickerMap_)) {
            return;
        }
        let currContractAddressToRewardMap = this.contractAddressToRewardMapData_[dexName];
        let distributorToTickerMap = this.distributorToTickerMap_[dexName];

        let tickerToTotalRewardsQa = {}

        for (let distributor_address in currContractAddressToRewardMap) {
            let rewardTokenTicker = distributorToTickerMap[distributor_address.toLowerCase()];
            let contractAddressToRewardMap = currContractAddressToRewardMap[distributor_address];
            // This should be optimized using a lookup in the dictionary instead of a linear search
            // Loop all individuals ZRC token LP and show ZWAP reward per ZRC LP.
            for (let poolTicker in this.zrcTokenPropertiesListMap_) {
                // zilswap use bech32 address as key
                let poolKey = this.zrcTokenPropertiesListMap_[poolTicker].address;
                if (dexName === 'xcaddex') {
                    // xcaddex use base16 address pair (xcad,token) as key
                    let xcadAddress = this.zrcTokenPropertiesListMap_['XCAD'].address_base16.toLowerCase();
                    let zrcAddress = this.zrcTokenPropertiesListMap_[poolTicker].address_base16.toLowerCase();
                    poolKey = xcadAddress + ',' + zrcAddress;
                }

                if (poolKey in contractAddressToRewardMap) {
                    let rewardAmountQa = parseInt(contractAddressToRewardMap[poolKey]);
                    if (rewardAmountQa) {
                        // Sum and cumulate the rewards from different distributors for the summary view
                        let cumulativeRewardAmountQa = rewardAmountQa;
                        if (rewardTokenTicker in tickerToTotalRewardsQa) {
                            cumulativeRewardAmountQa += tickerToTotalRewardsQa[rewardTokenTicker];
                        }
                        tickerToTotalRewardsQa[rewardTokenTicker] = cumulativeRewardAmountQa;

                        if (rewardTokenTicker in this.zrcTokenPropertiesListMap_) {
                            let rewardAmountString = convertNumberQaToDecimalString(rewardAmountQa, this.zrcTokenPropertiesListMap_[rewardTokenTicker].decimals);
                            if (rewardAmountString) {
                                let rewardTokenLogoUrl = this.zrcTokenPropertiesListMap_[rewardTokenTicker].logo_url;
                                this.appendViewNextEpochSingleRewardSingleLp(dexName, poolTicker, rewardAmountString, rewardTokenTicker, rewardTokenLogoUrl);
                            }
                        } else if (rewardTokenTicker.toLowerCase() === 'zil') {
                            let rewardAmountString = convertNumberQaToDecimalString(rewardAmountQa, 12);
                            if (rewardAmountString) {
                                this.appendViewNextEpochSingleRewardSingleLp(dexName, poolTicker, rewardAmountString, rewardTokenTicker, CONST_ZIL_LOGO_URL);
                            }
                        }
                    }
                }
            }
        }

        let tickerToTotalRewardsAmount = {};
        // Calculate total reward from all LP
        for (let ticker in tickerToTotalRewardsQa) {
            let totalRewardQa = tickerToTotalRewardsQa[ticker];

            let rewardTokenLogoUrl = CONST_ZIL_LOGO_URL;
            let decimals = 12; // default for ZIL
            if (ticker in this.zrcTokenPropertiesListMap_) {
                decimals = this.zrcTokenPropertiesListMap_[ticker].decimals;
                rewardTokenLogoUrl = this.zrcTokenPropertiesListMap_[ticker].logo_url;
            }

            let totalRewardAmount = 1.0 * totalRewardQa / Math.pow(10, decimals);
            if (!totalRewardAmount) {
                continue;
            }
            tickerToTotalRewardsAmount[ticker] = totalRewardAmount;

            let totalRewardString = convertNumberQaToDecimalString(totalRewardAmount, /* decimals= */ 0);
            if (!totalRewardString) {
                continue;
            }
            this.appendViewNextEpochSingleRewardAllLp(dexName, totalRewardString, ticker, rewardTokenLogoUrl);
        }
        this.totalRewardNextEpoch_[dexName] = tickerToTotalRewardsAmount;
        this.refreshLpRewardFiat(dexName, this.totalRewardNextEpoch_, this.bindViewNextEpochAllLpFiat);
    }

    /** Generic function to compute all types of reward except next epoch (e.g., unclaimed, prev) */
    computeUnclaimedOrPrevEpochLoaded(dexName, unclaimedOrPrevRewardList, appendViewSingleRewardAllLpFunction, bindViewAllLpFiatFunction) {
        if (!(dexName in this.distributorToTickerMap_)) {
            return;
        }
        let rewardList = unclaimedOrPrevRewardList;
        if (!rewardList || rewardList.length < 1) {
            // If there is no data, it means user has no unclaimed or prev reward, show 0 to user
            bindViewAllLpFiatFunction(dexName, '0');
            return;
        }
        let tickerToTotalQa = {}
        for (let i = 0; i < rewardList.length; i++) {
            let currReward = rewardList[i];
            if (!currReward.distributor_address) {
                continue;
            }

            let currDistributorAddress = currReward.distributor_address;
            let rewardTokenTicker = this.distributorToTickerMap_[dexName][currDistributorAddress.toLowerCase()];

            let currQa = parseInt(currReward.amount)
            if (!currQa) {
                continue;
            }

            // Sum and cumulate the rewards from different distributors for the summary view
            let cumulativeRewardAmountQa = currQa;
            if (rewardTokenTicker in tickerToTotalQa) {
                cumulativeRewardAmountQa += tickerToTotalQa[rewardTokenTicker];
            }
            tickerToTotalQa[rewardTokenTicker] = cumulativeRewardAmountQa;
        }

        let tickerToTotalAmount = {};
        // Calculate total reward from all LP
        for (let ticker in tickerToTotalQa) {
            let totalQa = tickerToTotalQa[ticker];

            let rewardTokenLogoUrl = CONST_ZIL_LOGO_URL;
            let decimals = 12; // default for ZIL
            if (ticker in this.zrcTokenPropertiesListMap_) {
                decimals = this.zrcTokenPropertiesListMap_[ticker].decimals;
                rewardTokenLogoUrl = this.zrcTokenPropertiesListMap_[ticker].logo_url;
            }

            let totalAmount = 1.0 * totalQa / Math.pow(10, decimals);
            if (!totalAmount) {
                continue;
            }
            tickerToTotalAmount[ticker] = totalAmount;

            let totalString = convertNumberQaToDecimalString(totalAmount, /* decimals= */ 0);
            if (!totalString) {
                continue;
            }
            appendViewSingleRewardAllLpFunction(dexName, totalString, ticker, rewardTokenLogoUrl);
        }

        let totalRewardMap = {};
        totalRewardMap[dexName] = tickerToTotalAmount;

        this.refreshLpRewardFiat(dexName, totalRewardMap, bindViewAllLpFiatFunction);
        return tickerToTotalAmount;
    }

    /** Generic function to refresh fiat for all types of of reward (e.g., next epoch, unclaimed, prev) */
    refreshLpRewardFiat(dexName, totalRewardMap, bindViewFunction) {
        if (!this.coinPriceStatus_ || !this.zilswapDexStatus_) {
            return;
        }
        if (!(dexName in totalRewardMap)) {
            return;
        }
        let currTotalRewardMap = totalRewardMap[dexName];

        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        let totalRewardFiat = 0.0;
        for (let ticker in currTotalRewardMap) {
            if (ticker.toLowerCase() === 'zil') {
                totalRewardFiat += zilPriceInFiatFloat * currTotalRewardMap[ticker];
            } else {
                let zrcTokenPriceInZil = this.zilswapDexStatus_.getZrcPriceInZilWithFallback(ticker);
                if (!zrcTokenPriceInZil) {
                    continue;
                }
                totalRewardFiat += (zilPriceInFiatFloat * zrcTokenPriceInZil * currTotalRewardMap[ticker]);
            }
        }
        let totalAllLpRewardFiat = commafyNumberToString(totalRewardFiat, decimals);
        bindViewFunction(dexName, totalAllLpRewardFiat);
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        // This is now hardcoded because the value are static to reduce RPC.
        for (let dexName in this.supportedDexToBaseTokenMap_) {
            this.computeEpochInfoLoaded(dexName);
        }

        if (!this.walletAddressBech32_) {
            return;
        }

        let self = this;
        beforeRpcCallback();
        queryUrlGetAjax(
            /* urlToGet= */
            CONST_STATS_ZILSWAP_ROOT_URL + "/distribution/estimated_amounts/" + self.walletAddressBech32_,
            /* successCallback= */
            function (data) {
                self.contractAddressToRewardMapData_['zilswap'] = data;
                self.computeNextEpochLoaded('zilswap');

                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });

        // Retrieved from our own API after processing zilswap's distribution data API.
        beforeRpcCallback();
        queryUrlGetAjax(
            /* urlToGet= */
            CONST_ZILWATCH_ROOT_URL + "/api/reward/prevepoch?token_symbol=ZWAP&wallet_address=" + self.walletAddressBech32_ + "&requester=zilwatch_dashboard",
            /* successCallback= */
            function (data) {
                self.totalRewardPrevEpoch_['zilswap']  = self.computeUnclaimedOrPrevEpochLoaded('zilswap', data, self.appendViewPrevEpochSingleRewardAllLp, self.bindViewPrevEpochAllLpFiat);
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });

        beforeRpcCallback();
        queryUrlGetAjax(
            /* urlToGet= */
            CONST_STATS_ZILSWAP_ROOT_URL + "/distribution/claimable_data/" + self.walletAddressBech32_,
            /* successCallback= */
            function (data) {
                self.totalRewardUnclaimed_['zilswap'] = self.computeUnclaimedOrPrevEpochLoaded('zilswap', data, self.appendViewUnclaimedSingleRewardAllLp, self.bindViewUnclaimedAllLpFiat);
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
        
        // XCAD from here
        beforeRpcCallback();
        queryUrlGetAjax(
            /* urlToGet= */
            CONST_STATS_XCAD_DEX_ROOT_URL + "/distribution/estimated_amounts/" + self.walletAddressBech32_,
            /* successCallback= */
            function (data) {
                self.contractAddressToRewardMapData_['xcaddex'] = data;
                self.computeNextEpochLoaded('xcaddex');

                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });


        beforeRpcCallback();
        queryUrlGetAjax(
            /* urlToGet= */
            CONST_STATS_XCAD_DEX_ROOT_URL + "/distribution/claimable_data/" + self.walletAddressBech32_,
            /* successCallback= */
            function (data) {
                self.totalRewardUnclaimed_['xcaddex']  = self.computeUnclaimedOrPrevEpochLoaded('xcaddex', data, self.appendViewUnclaimedSingleRewardAllLp, self.bindViewUnclaimedAllLpFiat);
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    // Exception, no need reset
    bindViewNextEpochCountdownCounter(dexName, timeDurationString) {
        $('#' + dexName + '_lp_reward_next_epoch_duration_counter').text(timeDurationString);
    }

    appendViewNextEpochSingleRewardSingleLp(dexName, poolTicker, rewardAmountString, rewardTicker, rewardTokenLogoUrl) {
        let isElementEmpty = $('#' + dexName + '_' + poolTicker + '_lp_pool_reward').is(':empty');
        $('#' + dexName + '_' + poolTicker + '_lp_pool_reward').append(getRewardLpHtmlTemplate(isElementEmpty, rewardAmountString, rewardTicker, rewardTokenLogoUrl));
    }

    appendViewNextEpochSingleRewardAllLp(dexName, rewardAmountString, rewardTicker, rewardTokenLogoUrl) {
        let isElementEmpty = $('#' + dexName + '_total_all_lp_reward_next_epoch').is(':empty');
        $('#' + dexName + '_total_all_lp_reward_next_epoch').append(getRewardLpHtmlTemplate(isElementEmpty, rewardAmountString, rewardTicker, rewardTokenLogoUrl));
        $('#' + dexName + '_total_all_lp_reward_next_epoch_container').show();
        $('#lp_container').show();
    }

    bindViewNextEpochAllLpFiat(dexName, totalAllLpRewardFiat) {
        $('#' + dexName + '_total_all_lp_reward_next_epoch_fiat').text(totalAllLpRewardFiat);
    }

    appendViewPrevEpochSingleRewardAllLp(dexName, rewardAmountString, rewardTicker, rewardTokenLogoUrl) {
        let isElementEmpty = $('#' + dexName + '_total_all_lp_reward_prev_epoch').is(':empty');
        $('#' + dexName + '_total_all_lp_reward_prev_epoch').append(getRewardLpHtmlTemplate(isElementEmpty, rewardAmountString, rewardTicker, rewardTokenLogoUrl));
    }

    bindViewPrevEpochAllLpFiat(dexName, prevTotalAllLpRewardFiat) {
        $('#' + dexName + '_total_all_lp_reward_prev_epoch_fiat').text(prevTotalAllLpRewardFiat);
        $('#' + dexName + '_total_all_lp_reward_past_epoch_container').show();
    }

    appendViewUnclaimedSingleRewardAllLp(dexName, rewardAmountString, rewardTicker, rewardTokenLogoUrl) {
        let isElementEmpty = $('#' + dexName + '_total_all_lp_reward_unclaimed').is(':empty');
        $('#' + dexName + '_total_all_lp_reward_unclaimed').append(getRewardLpHtmlTemplate(isElementEmpty, rewardAmountString, rewardTicker, rewardTokenLogoUrl));
    }

    bindViewUnclaimedAllLpFiat(dexName, totalUnclaimedRewardFiat) {
        $('#' + dexName + '_total_all_lp_reward_unclaimed_fiat').text(totalUnclaimedRewardFiat);
    }

    resetView() {
        $('#lp_container').hide();

        for (let dexName in this.supportedDexToBaseTokenMap_) {
            $('#' + dexName + '_total_all_lp_reward_next_epoch_container').hide();

            $('#' + dexName + '_total_all_lp_reward_next_epoch').empty();
            $('#' + dexName + '_total_all_lp_reward_unclaimed').empty();
            $('#' + dexName + '_total_all_lp_reward_prev_epoch').empty();

            for (let ticker in this.zrcTokenPropertiesListMap_) {
                let length = this.zrcTokenPropertiesListMap_[ticker].supported_dex.length;
                for (let i = 0; i < length; i++) {
                    let dexName = this.zrcTokenPropertiesListMap_[ticker].supported_dex[i];
                    $('#' + dexName + '_' + ticker + '_lp_pool_reward').empty();
                }
            }
            $('#' + dexName + '_total_all_lp_reward_past_epoch_container').hide();

            $('#' + dexName + '_total_all_lp_reward_next_epoch_fiat').text('Loading...');
            $('#' + dexName + '_total_all_lp_reward_prev_epoch_fiat').text('Loading...');
            $('#' + dexName + '_total_all_lp_reward_unclaimed_fiat').text('Loading...');
        }
    }
}

if (typeof exports !== 'undefined') {
    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
        commafyNumberToString = FormattingUtils.commafyNumberToString;
    }
    if (typeof Duration === 'undefined') {
        UtilsDuration = require('./utils_duration.js');
        Duration = UtilsDuration.Duration;
    }
    if (typeof getRewardLpHtmlTemplate === 'undefined') {
        UtilsView = require('../utils_view.js');
        getRewardLpHtmlTemplate = UtilsView.getRewardLpHtmlTemplate;
    }
    if (typeof CONST_ZIL_LOGO_URL  === 'undefined') {
        UtilsConstants = require('../utils_constants.js');
        CONST_ZIL_LOGO_URL = UtilsConstants.CONST_ZIL_LOGO_URL;
    }
    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }
    exports.ZilswapLpZwapRewardStatus = ZilswapLpZwapRewardStatus;
}