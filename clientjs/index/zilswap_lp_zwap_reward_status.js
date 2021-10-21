/** A class to represent Zilswap LP ZWAP reward status.  */
class ZilswapLpZwapRewardStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexStatus, /* nullable= */ walletAddressBech32, /* nullable= */ epochInfoData, /* nullable= */ contractAddressToRewardMapData, /* nullable= */ pastRewardListData, /* nullable= */ unclaimedRewardListData) {

        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;

        this.defaultEpochInfoData_ = {
            'epoch_period':  604800,
            'next_epoch_start': 1629878400,
        }
        this.epochInfoData_ = this.defaultEpochInfoData_;

        this.walletAddressBech32_ = walletAddressBech32;
        if (epochInfoData) {
            this.epochInfoData_ = epochInfoData;
        }
        this.contractAddressToRewardMapData_ = contractAddressToRewardMapData;
        this.pastRewardListData_ = pastRewardListData;
        this.unclaimedRewardListData_ = unclaimedRewardListData;

        this.totalZwapRewardNextEpoch_ = 0;
        this.totalZwapRewardPrevEpoch_ = 0;
        this.totalZwapRewardPastEpoch_ = {};
        this.totalZwapRewardUnclaimed_ = 0;
    }

    onCoinPriceStatusChange() {
        this.refreshTotalLpRewardFiat();
        this.refreshPrevTotalLpRewardFiat();
        this.refreshPastTotalLpRewardFiat();
        this.refreshUnclaimedTotalLprewardFiat();
    }

    onZilswapDexStatusChange() {
        this.refreshTotalLpRewardFiat();
        this.refreshPrevTotalLpRewardFiat();
        this.refreshPastTotalLpRewardFiat();
        this.refreshUnclaimedTotalLprewardFiat();
    }

    setWalletAddressBech32(walletAddressBech32) {
        this.walletAddressBech32_ = walletAddressBech32;
        this.reset();
    }

    reset() {
        this.resetView();
        this.totalZwapRewardNextEpoch_ = 0;
        this.totalZwapRewardPrevEpoch_ = 0;
        this.totalZwapRewardPastEpoch_ = {};
        this.totalZwapRewardUnclaimed_ = 0;
    }

    computeLpRewardNextEpochLoaded() {
        if (!this.contractAddressToRewardMapData_) {
            return;
        }
        let contractAddressToRewardMap = this.contractAddressToRewardMapData_[CONST_ZILSWAP_REWARD_DISTRIBUTOR_ADDRESS_BASE16];
        if (!contractAddressToRewardMap) {
            return;
        }
        // Sum of the rewards from all pools.
        let totalZwapRewardQa = 0;

        // Loop all individuals ZRC token LP and show ZWAP reward per ZRC LP.
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let zrcTokenAddress = this.zrcTokenPropertiesListMap_[ticker].address;

            if (zrcTokenAddress in contractAddressToRewardMap) {
                let zwapRewardQa = parseInt(contractAddressToRewardMap[zrcTokenAddress]);
                if (zwapRewardQa) {
                    totalZwapRewardQa += zwapRewardQa;

                    let zwapRewardString = convertNumberQaToDecimalString(zwapRewardQa, this.zrcTokenPropertiesListMap_['ZWAP'].decimals);
                    if (zwapRewardString) {
                        this.bindViewZwapRewardLp(zwapRewardString, ticker);
                    }
                }
            } else {
                this.bindViewZwapRewardLp('No reward', ticker);
            }
        }

        // Total reward from all pools
        let totalRewardZwap = 1.0 * totalZwapRewardQa / Math.pow(10, this.zrcTokenPropertiesListMap_['ZWAP'].decimals);
        if (!totalRewardZwap) {
            return;
        }
        this.totalZwapRewardNextEpoch_ = totalRewardZwap;

        let totalRewardZwapString = convertNumberQaToDecimalString(totalRewardZwap, /* decimals= */ 0);
        if (!totalRewardZwapString) {
            return;
        }
        this.bindViewTotalRewardAllLpZwap(totalRewardZwapString);
        this.refreshTotalLpRewardFiat();
    }

    computeLpRewardPastEpochLoaded() {
        let pastRewardList = this.pastRewardListData_;
        if (!pastRewardList || pastRewardList.length < 1) {
            // If there is no data, it means user has no past reward, show 0 to user
            this.bindViewPrevTotalRewardAllLpZwap('-', '0');
            this.bindViewPrevTotalRewardAllLpFiat('0');
            return;
        }

        let pastRewardListLastIndex = pastRewardList.length - 1;
        let prevRewardMap = pastRewardList[pastRewardListLastIndex];
        let prevZwapRewardQa = parseInt(prevRewardMap.amount);
        if (!prevZwapRewardQa) {
            this.bindViewPrevTotalRewardAllLpZwap(prevRewardMap.epoch_number, '0');
            this.bindViewPrevTotalRewardAllLpFiat('0');
            return;
        }

        let prevZwapReward = 1.0 * prevZwapRewardQa / Math.pow(10, this.zrcTokenPropertiesListMap_['ZWAP'].decimals);
        if (!prevZwapReward) {
            this.bindViewPrevTotalRewardAllLpZwap(prevRewardMap.epoch_number, '0');
            this.bindViewPrevTotalRewardAllLpFiat('0');
            return;
        }
        this.totalZwapRewardPrevEpoch_ = prevZwapReward;

        let prevTotalZwapRewardString = convertNumberQaToDecimalString(prevZwapReward, /* decimals= */ 0);
        if (!prevTotalZwapRewardString) {
            return;
        }
        this.bindViewPrevTotalRewardAllLpZwap(prevRewardMap.epoch_number, prevTotalZwapRewardString);
        this.refreshPrevTotalLpRewardFiat();

        // Check if we have more past rewards from ZWAP, If there are no past rewards, return.
        let pastRewardListIndex = pastRewardListLastIndex - 1;
        if (pastRewardListIndex < 0) {
            return;
        }

        // If we have more past rewards, show them
        this.enableTooltipPastTotalRewardAllLpZwap();
        this.clearViewPastTotalRewardAllLpZwap();
        while (pastRewardListIndex >= 0) {
            // Need to decrement the counter immediately to prevent infinite loop.
            let currRewardMap = pastRewardList[pastRewardListIndex--];
            let currZwapRewardQa = parseInt(currRewardMap.amount);
            if (!currZwapRewardQa) {
                continue;
            }

            let currZwapReward = 1.0 * currZwapRewardQa / Math.pow(10, this.zrcTokenPropertiesListMap_['ZWAP'].decimals);
            if (!currZwapReward) {
                continue;
            }

            this.pastRewardListData_[currRewardMap.epoch_number] = currZwapReward;

            let currZwapRewardString = convertNumberQaToDecimalString(currZwapReward, /* decimals= */ 0);
            if (!currZwapRewardString) {
                continue;
            }
            let viewElement = this.getViewPastTotalRewardAllLpZwap(currRewardMap.epoch_number, currZwapRewardString, this.coinPriceStatus_.getCurrentActiveDollarSymbol());
            this.addViewPastTotalRewardAllLpZwap(viewElement);
        }
        this.refreshPastTotalLpRewardFiat();
    }

    computeLpUnclaimedRewardLoaded() {
        let unclaimedRewardList = this.unclaimedRewardListData_;
        if (!unclaimedRewardList || unclaimedRewardList.length < 1) {
            // If there is no data, it means user has no unclaimed reward, show 0 to user
            this.bindViewTotalUnclaimedRewardAllLpZwap('0');
            this.bindViewTotalUnclaimedRewardAllLpFiat('0');
            return;
        }
        let totalUnclaimedZwapQa = 0;
        for (let i = 0; i < unclaimedRewardList.length; i++) {
            let currUnclaimedReward = unclaimedRewardList[i];
            if (!currUnclaimedReward.distributor_address) {
                continue;
            }
            // If it's not ZWAP reward
            if (currUnclaimedReward.distributor_address != CONST_ZILSWAP_REWARD_DISTRIBUTOR_ADDRESS_BASE16) {
                continue;
            }
            let currUnclaimedZwapQa = parseInt(currUnclaimedReward.amount)
            if (!currUnclaimedZwapQa) {
                continue;
            }
            totalUnclaimedZwapQa += currUnclaimedZwapQa;
        }

        let totalUnclaimedZwap = 1.0 * totalUnclaimedZwapQa / Math.pow(10, this.zrcTokenPropertiesListMap_['ZWAP'].decimals);
        if (!totalUnclaimedZwap) {
            this.bindViewTotalUnclaimedRewardAllLpZwap('0');
            this.bindViewTotalUnclaimedRewardAllLpFiat('0');
            return;
        }
        this.totalZwapRewardUnclaimed_ = totalUnclaimedZwap;

        let totalUnclaimedZwapString = convertNumberQaToDecimalString(totalUnclaimedZwap, /* decimals= */ 0);
        if (!totalUnclaimedZwapString) {
            return;
        }

        this.bindViewTotalUnclaimedRewardAllLpZwap(totalUnclaimedZwapString);
        this.refreshUnclaimedTotalLprewardFiat();
    }

    computeLpCurrentEpochInfoLoaded() {
        let epochInfoData = this.epochInfoData_;
        let epochPeriod = parseInt(epochInfoData.epoch_period);
        let nextEpochStartSeconds = parseInt(epochInfoData.next_epoch_start);
        if (!nextEpochStartSeconds) {
            return;
        }
        let currentDate = new Date();
        let currentTimeSeconds = currentDate.getTime() / 1000;

        // Fallback if the epoch start seconds is not updated
        while (nextEpochStartSeconds < currentTimeSeconds) {
            nextEpochStartSeconds += epochPeriod;
        }
        let timeDiffSeconds = nextEpochStartSeconds - currentTimeSeconds;
        let timeDiffDuration = new Duration(timeDiffSeconds);

        this.bindViewLpNextEpochCounter(timeDiffDuration.getUserFriendlyString());
    }

    refreshTotalLpRewardFiat() {
        if (!this.coinPriceStatus_ || !this.zilswapDexStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        let zrcTokenPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil('ZWAP');
        if (!zrcTokenPriceInZil) {
            return;
        }

        if (!this.totalZwapRewardNextEpoch_) {
            return;
        }
        let rewardBalanceFiat = (zilPriceInFiatFloat * zrcTokenPriceInZil * this.totalZwapRewardNextEpoch_);
        let totalAllLpRewardFiat = commafyNumberToString(rewardBalanceFiat, decimals);
        this.bindViewTotalRewardAllLpFiat(totalAllLpRewardFiat);
    }

    refreshPrevTotalLpRewardFiat() {
        if (!this.coinPriceStatus_ || !this.zilswapDexStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        let zrcTokenPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil('ZWAP');
        if (!zrcTokenPriceInZil) {
            return;
        }

        if (!this.totalZwapRewardPrevEpoch_) {
            return;
        }

        let rewardBalanceFiat = (zilPriceInFiatFloat * zrcTokenPriceInZil * this.totalZwapRewardPrevEpoch_);
        let prevTotalAllLpRewardFiat = commafyNumberToString(rewardBalanceFiat, decimals);
        this.bindViewPrevTotalRewardAllLpFiat(prevTotalAllLpRewardFiat);
    }

    refreshPastTotalLpRewardFiat() {
        if (!this.coinPriceStatus_ || !this.zilswapDexStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        let zrcTokenPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil('ZWAP');
        if (!zrcTokenPriceInZil) {
            return;
        }

        if (!this.pastRewardListData_) {
            return;
        }
        for (let epochNumber in this.pastRewardListData_) {
            let currZwapReward = this.pastRewardListData_[epochNumber];

            let rewardBalanceFiat = (zilPriceInFiatFloat * zrcTokenPriceInZil * currZwapReward);
            let rewardBalanceFiatString = commafyNumberToString(rewardBalanceFiat, decimals);
            this.bindViewPastTotalRewardAllLpFiat(epochNumber, rewardBalanceFiatString);
        }
    }

    refreshUnclaimedTotalLprewardFiat() {
        if (!this.coinPriceStatus_ || !this.zilswapDexStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        let zrcTokenPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil('ZWAP');
        if (!zrcTokenPriceInZil) {
            return;
        }

        if (!this.totalZwapRewardUnclaimed_) {
            return;
        }
        let unclaimedRewardFiat = (zilPriceInFiatFloat * zrcTokenPriceInZil * this.totalZwapRewardUnclaimed_);
        let unclaimedRewardFiatString = commafyNumberToString(unclaimedRewardFiat, decimals);
        this.bindViewTotalUnclaimedRewardAllLpFiat(unclaimedRewardFiatString);
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        // This is now hardcoded because the value are static to reduce RPC.
        this.epochInfoData_ = this.defaultEpochInfoData_;
        this.computeLpCurrentEpochInfoLoaded();

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
                self.computeLpRewardNextEpochLoaded();

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
                self.pastRewardListData_ = data;
                self.computeLpRewardPastEpochLoaded();

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
                self.unclaimedRewardListData_ = data;
                self.computeLpUnclaimedRewardLoaded();

                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    bindViewZwapRewardLp(zwapRewardString, ticker) {
        $('#' + ticker + '_lp_pool_reward_zwap').text(zwapRewardString);
        $('#' + ticker + '_lp_pool_reward_zwap_unit').text('ZWAP');
    }

    bindViewTotalRewardAllLpZwap(totalRewardZwapString) {
        $('#total_all_lp_reward_next_epoch_zwap').text(totalRewardZwapString);
        $('#total_all_lp_reward_next_epoch_container').show();
        $('#lp_container').show();
    }

    bindViewTotalRewardAllLpFiat(totalAllLpRewardFiat) {
        $('#total_all_lp_reward_next_epoch_fiat').text(totalAllLpRewardFiat);
    }

    bindViewPrevTotalRewardAllLpZwap(prevEpochNumber, prevTotalRewardZwapString) {
        $('#total_all_lp_reward_prev_epoch_number').text(prevEpochNumber);
        $('#total_all_lp_reward_prev_epoch_zwap').text(prevTotalRewardZwapString);
    }

    bindViewPrevTotalRewardAllLpFiat(prevTotalAllLpRewardFiat) {
        $('#total_all_lp_reward_prev_epoch_fiat').text(prevTotalAllLpRewardFiat);
    }

    bindViewTotalUnclaimedRewardAllLpZwap(totalUnclaimedRewardZwapString) {
        $('#total_all_lp_reward_unclaimed_zwap').text(totalUnclaimedRewardZwapString);
    }

    bindViewTotalUnclaimedRewardAllLpFiat(totalUnclaimedRewardFiat) {
        $('#total_all_lp_reward_unclaimed_fiat').text(totalUnclaimedRewardFiat);
    }

    disableTooltipPastTotalRewardAllLpZwap() {
        $('#total_all_lp_reward_past_epoch_container').removeClass('hover-effect');
        $('#total_all_lp_reward_past_epoch_container').removeClass('tooltip-container');
        $('#total_all_lp_reward_past_epoch_container').off('touchstart');
        $('#total_all_lp_reward_past_epoch_container').off('mouseover');
    }

    enableTooltipPastTotalRewardAllLpZwap() {
        $('#total_all_lp_reward_past_epoch_container').addClass('tooltip-container');
        $('#total_all_lp_reward_past_epoch_container').on('touchstart mouseover', onTouchStartOrMouseOverTooltipFunction);
    }

    clearViewPastTotalRewardAllLpZwap() {
        $('#total_all_lp_reward_past_epoch_tooltip_content').hide();
        $('#total_all_lp_reward_past_epoch_tooltip_content').empty();
    }

    addViewPastTotalRewardAllLpZwap(element) {
        $('#total_all_lp_reward_past_epoch_tooltip_content').append(element);
    }

    bindViewPastTotalRewardAllLpFiat(epochNumber, fiatAmount) {
        $('#total_all_lp_reward_epoch_' + epochNumber + '_fiat').text(fiatAmount);
    }

    // Exception, no need reset
    bindViewLpNextEpochCounter(timeDurationString) {
        $('#lp_reward_next_epoch_duration_counter').text(timeDurationString);
    }

    getViewPastTotalRewardAllLpZwap(epochNumber, pastTotalRewardZwapString, currentActiveDollarSymbol) {
        return "<tr>" +
            "<td colspan='2' style='text-align: left; white-space: nowrap;' >" +
            "<span>Epoch " + epochNumber + "</span>" +
            "</td>" +
            "<td class='text-secondary' style='text-align: right; white-space:'>" +
            "<span id='total_all_lp_reward_epoch_" + epochNumber + "_zwap' class='ml-1'>" + pastTotalRewardZwapString + "</span>" +
            "<span class='ml-1'>ZWAP</span>" +
            "</td>" +
            "<td class='text-secondary' style='text-align: right; white-space: nowrap;'>" +
            "<span class='currency_symbol mr-1'>" + currentActiveDollarSymbol + "</span>" +
            "<span id='total_all_lp_reward_epoch_" + epochNumber + "_fiat' class='past_lp_reward_fiat'/>" +
            "</td>" +
            "</tr>";
    }

    resetView() {
        $('#lp_container').hide();
        $('#total_all_lp_reward_next_epoch_container').hide();

        for (let ticker in zrcTokenPropertiesListMap) {
            $('#' + ticker + '_lp_pool_reward_zwap').text('');
            $('#' + ticker + '_lp_pool_reward_zwap_unit').text('');
        }

        $('#total_all_lp_reward_next_epoch_zwap').text('Loading...');
        $('#total_all_lp_reward_next_epoch_fiat').text('Loading...');
        $('#total_all_lp_reward_prev_epoch_zwap').text('Loading...');
        $('#total_all_lp_reward_prev_epoch_fiat').text('Loading...');
        $('#total_all_lp_reward_prev_epoch_number').text('');
        $('#total_all_lp_reward_unclaimed_zwap').text('Loading...');
        $('#total_all_lp_reward_unclaimed_fiat').text('Loading...');

        $('#total_all_lp_reward_past_epoch_container').removeClass('hover-effect');
        this.disableTooltipPastTotalRewardAllLpZwap();
        this.clearViewPastTotalRewardAllLpZwap();
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
    if (typeof CONST_ZILSWAP_REWARD_DISTRIBUTOR_ADDRESS_BASE16  === 'undefined') {
        UtilsConstants = require('../utils_constants.js');
        CONST_ZILSWAP_REWARD_DISTRIBUTOR_ADDRESS_BASE16 = UtilsConstants.CONST_ZILSWAP_REWARD_DISTRIBUTOR_ADDRESS_BASE16;
    }
    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }
    exports.ZilswapLpZwapRewardStatus = ZilswapLpZwapRewardStatus;
}