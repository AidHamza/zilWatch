/** A class to represent Zilswap LP fee as reward status.  */
class ZilswapLpFeeRewardStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ zilswapDexStatus, /* nullable= */ zilswapTradeVolumeStatus) {
        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.zilswapDexStatus_ = zilswapDexStatus;
        this.zilswapTradeVolumeStatus_ = zilswapTradeVolumeStatus;

        // private variable
        this.coinToFeeRewardMap_ = {};

        if (this.computeCoinToFeeRewardMap()) {
            this.bindViewAllLpFeeReward();
        }
    }

    onZilswapDexStatusChange() {
        if (this.computeCoinToFeeRewardMap()) {
            this.bindViewAllLpFeeReward();
        }
    }

    onZilswapTradeVolumeStatusChange() {
        if (this.computeCoinToFeeRewardMap()) {
            this.bindViewAllLpFeeReward();
        }
    }

    reset() {
        this.coinToFeeRewardMap_ = {};
        this.resetView();
    }

    getLpFeeRewardInZil(zrcSymbol) {
        
        return this.coinToFeeRewardMap_[zrcSymbol];
    }

    /** Returns true if there is some data processed, false otherwise. */
    computeCoinToFeeRewardMap() {
        if (!this.zilswapDexStatus_) {
            return false;
        }
        if (!this.zilswapTradeVolumeStatus_) {
            return false;
        }

        let isProcessed = false;
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let zilswapPairPersonalStatus = this.zilswapDexStatus_.getZilswapPairPersonalStatus(ticker);
            if (!zilswapPairPersonalStatus) {
                continue;
            }
            let shareRatio = zilswapPairPersonalStatus.shareRatio;
            if (!shareRatio) {
                continue;
            }
            let tradeVolume24hInZil = this.zilswapTradeVolumeStatus_.getTradeVolumeInZil(ticker, '24h');
            if (!tradeVolume24hInZil) {
                continue;
            }
            let lpFeeInZil = 0.003 * shareRatio * tradeVolume24hInZil;
            this.coinToFeeRewardMap_[ticker] = lpFeeInZil;

            isProcessed = true;
        }
        return isProcessed;
    }

    bindViewAllLpFeeReward() {
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let currLpFeeReward = this.getLpFeeRewardInZil(ticker);
            if (!currLpFeeReward) {
                this.bindViewLpFeeReward('0', ticker);
                continue;
            }
            let currLpFeeRewardString = convertNumberQaToDecimalString(currLpFeeReward, /* decimals= */ 0);
            this.bindViewLpFeeReward(currLpFeeRewardString, ticker);
        }
    }

    bindViewLpFeeReward(currLpFeeRewardString, ticker) {
        $('#' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text(currLpFeeRewardString);
    }

    resetView() {
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            $('#' + ticker + '_lp_pool_fee_reward_zil_past_range_period').text('Loading...');
        }
    }
}

if (typeof exports !== 'undefined') {
    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
    }
    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }
    exports.ZilswapLpFeeRewardStatus = ZilswapLpFeeRewardStatus;
}