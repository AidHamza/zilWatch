function getRewardLpHtmlTemplate(isFirstElement, rewardAmountString, rewardTicker, rewardTokenLogoUrl) {
    let elementString = "";
    if (!isFirstElement) {
        elementString += "<span class='ml-1 mr-1'>+</span>";
    }
    return elementString + "<span class='mr-1'>" + rewardAmountString + "</span>" +
        "<img height='16' src='" + rewardTokenLogoUrl + "' alt='" + rewardTicker + " logo' loading='lazy'/>";
}

/** A class to represent Zilswap LP ZWAP reward status.  */
class ZilswapLpZwapRewardStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexStatus, /* nullable= */ zilswapDistributorToTickerMap) {

        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;
        this.zilswapDistributorToTickerMap_ = zilswapDistributorToTickerMap;

        this.epochInfoData_ = {
            'epoch_period': 604800,
            'distribution_start_time': 1629878400,
        }

        this.walletAddressBech32_ = null;
        this.contractAddressToRewardMapData_ = null;

        this.totalRewardNextEpoch_ = {};
        this.totalRewardUnclaimed_ = {};
        this.totalRewardPrevEpoch_ = {};
    }

    onCoinPriceStatusChange() {
        this.refreshLpRewardFiat(this.totalRewardNextEpoch_, this.bindViewNextEpochAllLpFiat);
        this.refreshLpRewardFiat(this.totalRewardUnclaimed_, this.bindViewUnclaimedAllLpFiat);
        this.refreshLpRewardFiat(this.totalRewardPrevEpoch_, this.bindViewPrevEpochAllLpFiat);
    }

    onZilswapDexStatusChange() {
        this.refreshLpRewardFiat(this.totalRewardNextEpoch_, this.bindViewNextEpochAllLpFiat);
        this.refreshLpRewardFiat(this.totalRewardUnclaimed_, this.bindViewUnclaimedAllLpFiat);
        this.refreshLpRewardFiat(this.totalRewardPrevEpoch_, this.bindViewPrevEpochAllLpFiat);
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

    computeEpochInfoLoaded() {
        let epochPeriod = parseInt(this.epochInfoData_.epoch_period);
        let distributionStartTimeSeconds = parseInt(this.epochInfoData_.distribution_start_time);
        let nextEpochStartSeconds = distributionStartTimeSeconds + epochPeriod;

        let currentDate = new Date();
        let currentTimeSeconds = currentDate.getTime() / 1000;

        // Fallback if the epoch start seconds is not updated
        while (nextEpochStartSeconds < currentTimeSeconds) {
            nextEpochStartSeconds += epochPeriod;
        }
        let timeDiffSeconds = nextEpochStartSeconds - currentTimeSeconds;
        let timeDiffDuration = new Duration(timeDiffSeconds);

        this.bindViewNextEpochCountdownCounter(timeDiffDuration.getUserFriendlyString());
    }

    computeNextEpochLoaded() {
        if (!this.contractAddressToRewardMapData_) {
            return;
        }
        if (!this.zilswapDistributorToTickerMap_) {
            return;
        }

        let tickerToTotalRewardsQa = {}

        for (let distributor_address in this.contractAddressToRewardMapData_) {
            let rewardTokenTicker = this.zilswapDistributorToTickerMap_[distributor_address.toLowerCase()];
            let contractAddressToRewardMap = this.contractAddressToRewardMapData_[distributor_address];

            // This should be optimized using a lookup in the dictionary instead of a linear search
            // Loop all individuals ZRC token LP and show ZWAP reward per ZRC LP.
            for (let poolTicker in this.zrcTokenPropertiesListMap_) {
                let zrcTokenAddress = this.zrcTokenPropertiesListMap_[poolTicker].address;

                if (zrcTokenAddress in contractAddressToRewardMap) {
                    let rewardAmountQa = parseInt(contractAddressToRewardMap[zrcTokenAddress]);
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
                                this.appendViewNextEpochSingleRewardSingleLp(poolTicker, rewardAmountString, rewardTokenTicker, rewardTokenLogoUrl);
                            }
                        } else if (rewardTokenTicker.toLowerCase() === 'zil') {
                            let rewardAmountString = convertNumberQaToDecimalString(rewardAmountQa, 12);
                            if (rewardAmountString) {
                                this.appendViewNextEpochSingleRewardSingleLp(poolTicker, rewardAmountString, rewardTokenTicker, CONST_ZIL_LOGO_URL);
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
            this.appendViewNextEpochSingleRewardAllLp(totalRewardString, ticker, rewardTokenLogoUrl);
        }
        this.totalRewardNextEpoch_ = tickerToTotalRewardsAmount;
        this.refreshLpRewardFiat(this.totalRewardNextEpoch_, this.bindViewNextEpochAllLpFiat);
    }

    /** Generic function to compute all types of reward except next epoch (e.g., unclaimed, prev) */
    computeUnclaimedOrPrevEpochLoaded(unclaimedOrPrevRewardList, appendViewSingleRewardAllLpFunction, bindViewAllLpFiatFunction) {
        if (!this.zilswapDistributorToTickerMap_) {
            return;
        }
        let rewardList = unclaimedOrPrevRewardList;
        if (!rewardList || rewardList.length < 1) {
            // If there is no data, it means user has no unclaimed or prev reward, show 0 to user
            bindViewAllLpFiatFunction('0');
            return;
        }
        let tickerToTotalQa = {}
        for (let i = 0; i < rewardList.length; i++) {
            let currReward = rewardList[i];
            if (!currReward.distributor_address) {
                continue;
            }

            let currDistributorAddress = currReward.distributor_address;
            let rewardTokenTicker = this.zilswapDistributorToTickerMap_[currDistributorAddress.toLowerCase()];

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
            appendViewSingleRewardAllLpFunction(totalString, ticker, rewardTokenLogoUrl);
        }

        this.refreshLpRewardFiat(tickerToTotalAmount, bindViewAllLpFiatFunction);
        return tickerToTotalAmount;
    }

    /** Generic function to refresh fiat for all types of of reward (e.g., next epoch, unclaimed, prev) */
    refreshLpRewardFiat(totalRewardMap, bindViewFunction) {
        if (!this.coinPriceStatus_ || !this.zilswapDexStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        let totalRewardFiat = 0.0;
        for (let ticker in totalRewardMap) {
            if (ticker.toLowerCase() === 'zil') {
                totalRewardFiat += zilPriceInFiatFloat * totalRewardMap[ticker];
            } else {
                let zrcTokenPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil(ticker);
                if (!zrcTokenPriceInZil) {
                    continue;
                }
                totalRewardFiat += (zilPriceInFiatFloat * zrcTokenPriceInZil * totalRewardMap[ticker]);
            }
        }
        let totalAllLpRewardFiat = commafyNumberToString(totalRewardFiat, decimals);
        bindViewFunction(totalAllLpRewardFiat);
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        // This is now hardcoded because the value are static to reduce RPC.
        this.computeEpochInfoLoaded();

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
                self.contractAddressToRewardMapData_ = data;
                self.computeNextEpochLoaded();

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
                self.totalRewardPrevEpoch_ = self.computeUnclaimedOrPrevEpochLoaded(data, self.appendViewPrevEpochSingleRewardAllLp, self.bindViewPrevEpochAllLpFiat);
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
                self.totalRewardUnclaimed_ = self.computeUnclaimedOrPrevEpochLoaded(data, self.appendViewUnclaimedSingleRewardAllLp, self.bindViewUnclaimedAllLpFiat);
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    // Exception, no need reset
    bindViewNextEpochCountdownCounter(timeDurationString) {
        $('#lp_reward_next_epoch_duration_counter').text(timeDurationString);
    }

    appendViewNextEpochSingleRewardSingleLp(poolTicker, rewardAmountString, rewardTicker, rewardTokenLogoUrl) {
        let isElementEmpty = $('#' + poolTicker + '_lp_pool_reward').is(':empty');
        $('#' + poolTicker + '_lp_pool_reward').append(getRewardLpHtmlTemplate(isElementEmpty, rewardAmountString, rewardTicker, rewardTokenLogoUrl));
    }

    appendViewNextEpochSingleRewardAllLp(rewardAmountString, rewardTicker, rewardTokenLogoUrl) {
        let isElementEmpty = $('#total_all_lp_reward_next_epoch').is(':empty');
        $('#total_all_lp_reward_next_epoch').append(getRewardLpHtmlTemplate(isElementEmpty, rewardAmountString, rewardTicker, rewardTokenLogoUrl));
        $('#total_all_lp_reward_next_epoch_container').show();
        $('#lp_container').show();
    }

    bindViewNextEpochAllLpFiat(totalAllLpRewardFiat) {
        $('#total_all_lp_reward_next_epoch_fiat').text(totalAllLpRewardFiat);
    }

    appendViewPrevEpochSingleRewardAllLp(rewardAmountString, rewardTicker, rewardTokenLogoUrl) {
        let isElementEmpty = $('#total_all_lp_reward_prev_epoch').is(':empty');
        $('#total_all_lp_reward_prev_epoch').append(getRewardLpHtmlTemplate(isElementEmpty, rewardAmountString, rewardTicker, rewardTokenLogoUrl));
    }

    bindViewPrevEpochAllLpFiat(prevTotalAllLpRewardFiat) {
        $('#total_all_lp_reward_prev_epoch_fiat').text(prevTotalAllLpRewardFiat);
    }

    appendViewUnclaimedSingleRewardAllLp(rewardAmountString, rewardTicker, rewardTokenLogoUrl) {
        let isElementEmpty = $('#total_all_lp_reward_unclaimed').is(':empty');
        $('#total_all_lp_reward_unclaimed').append(getRewardLpHtmlTemplate(isElementEmpty, rewardAmountString, rewardTicker, rewardTokenLogoUrl));
    }

    bindViewUnclaimedAllLpFiat(totalUnclaimedRewardFiat) {
        $('#total_all_lp_reward_unclaimed_fiat').text(totalUnclaimedRewardFiat);
    }

    resetView() {
        $('#lp_container').hide();
        $('#total_all_lp_reward_next_epoch_container').hide();

        $('#total_all_lp_reward_next_epoch').empty();
        $('#total_all_lp_reward_unclaimed').empty();
        $('#total_all_lp_reward_prev_epoch').empty();

        for (let ticker in zrcTokenPropertiesListMap) {
            $('#' + ticker + '_lp_pool_reward').empty();
        }

        $('#total_all_lp_reward_next_epoch_fiat').text('Loading...');
        $('#total_all_lp_reward_prev_epoch_fiat').text('Loading...');
        $('#total_all_lp_reward_unclaimed_fiat').text('Loading...');
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
    if (typeof CONST_ZIL_LOGO_URL  === 'undefined') {
        UtilsConstants = require('../utils_constants.js');
        CONST_ZIL_LOGO_URL = UtilsConstants.CONST_ZIL_LOGO_URL;
    }
    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }
    exports.ZilswapLpZwapRewardStatus = ZilswapLpZwapRewardStatus;
}