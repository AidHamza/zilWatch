/** A class to represent Zilswap LP ZWAP reward status.  */
class ZilswapLpZwapRewardStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexStatus, /* nullable= */ walletAddressBech32, /* nullable= */ epochInfoData, /* nullable= */ contractAddressToRewardMapData, /* nullable= */ pastRewardListData) {
        this.zilswapRewardDistributorAddressBase16_ = "0xe5e274f59482759c1a0c13682ff3ec3efeb22d2a";
        
        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;

        this.walletAddressBech32_ = walletAddressBech32;
        this.epochInfoData_ = epochInfoData;
        this.contractAddressToRewardMapData_ = contractAddressToRewardMapData;
        this.pastRewardListData_ = pastRewardListData;

        this.totalZwapRewardNextEpoch_ = 0;
        this.totalZwapRewardPrevEpoch_ = 0;
        this.totalZwapRewardPastEpoch_ = {};
    }

    onCoinPriceStatusChange() {
        this.refreshTotalLpRewardFiat();
        this.refreshPrevTotalLpRewardFiat();
        this.refreshPastTotalLpRewardFiat();
    }

    onZilswapDexStatusChange() {
        this.refreshTotalLpRewardFiat();
        this.refreshPrevTotalLpRewardFiat();
        this.refreshPastTotalLpRewardFiat();
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
    }

    computeLpRewardNextEpochLoaded() {
        if (!this.contractAddressToRewardMapData_) {
            return;
        }
        let contractAddressToRewardMap = this.contractAddressToRewardMapData_[this.zilswapRewardDistributorAddressBase16_];
        if (!contractAddressToRewardMap) {
            return;
        }
        // Sum of the rewards from all pools.
        let totalZwapRewardQa = 0;

        // Loop all individuals ZRC token LP and show ZWAP reward per ZRC LP.
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let zrcTokenAddress = this.zrcTokenPropertiesListMap_[ticker].address;

            if (contractAddressToRewardMap[zrcTokenAddress]) {
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

    computeLpCurrentEpochInfoLoaded() {
        let epochInfoData = this.epochInfoData_;
        let nextEpochStartSeconds = parseInt(epochInfoData.next_epoch_start);
        if (!nextEpochStartSeconds) {
            return;
        }
        let currentDate = new Date();
        let currentTimeSeconds = currentDate.getTime() / 1000;
        let timeDiffSeconds = Math.max(0, nextEpochStartSeconds - currentTimeSeconds);
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

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        let self = this;

        beforeRpcCallback();
        queryUrlGetAjax(
            /* urlToGet= */
            "https://stats.zilswap.org/epoch/info",
            /* successCallback= */
            function (data) {
                self.epochInfoData_ = data;
                self.computeLpCurrentEpochInfoLoaded();

                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });

        if (!this.walletAddressBech32_) {
            return;
        }

        beforeRpcCallback();
        queryUrlGetAjax(
            /* urlToGet= */
            "https://stats.zilswap.org/distribution/estimated_amounts/" + self.walletAddressBech32_,
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

        // Exception for now, Zilswap changed their stats API and the past epochs data
        // need to be processed before retrieval.
        this.bindViewPrevTotalRewardAllLpZwap('-', '-');
        this.bindViewPrevTotalRewardAllLpFiat('-');
        // beforeRpcCallback();
        // queryUrlGetAjax(
        //     /* urlToGet= */
        //     "https://stats.zilswap.org/distribution/data/" + self.walletAddressBech32_,
        //     /* successCallback= */
        //     function (data) {
        //         self.pastRewardListData_ = data;
        //         self.computeLpRewardPastEpochLoaded();

        //         onSuccessCallback();
        //     },
        //     /* errorCallback= */
        //     function () {
        //         onErrorCallback();
        //     });
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
    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }
    exports.ZilswapLpZwapRewardStatus = ZilswapLpZwapRewardStatus;
}