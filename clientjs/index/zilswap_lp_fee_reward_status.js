/** A class to represent Zilswap LP fee as reward status.  */
class ZilswapLpFeeRewardStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ zilswapDexStatus, /* nullable= */ zilswapTradeVolumeStatus) {
        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.zilswapDexStatus_ = zilswapDexStatus;
        this.zilswapTradeVolumeStatus_ = zilswapTradeVolumeStatus;

        // private variable
        this.coinToFeeRewardMap_ = {};

        this.computeCoinToFeeRewardMap();
        this.bindViewAllLpFeeReward();
    }

    onZilswapDexStatusChange() {
        this.computeCoinToFeeRewardMap();
        this.bindViewAllLpFeeReward();
    }

    onZilswapTradeVolumeStatusChange() { 
        this.computeCoinToFeeRewardMap();
        this.bindViewAllLpFeeReward();
    }

    reset() {
        this.coinToFeeRewardMap_ = {};
        this.resetView();
    }

    getLpFeeRewardInZil(zrcSymbol) {
        return this.coinToFeeRewardMap_[zrcSymbol];
    }

    computeCoinToFeeRewardMap() {
        if (!this.zilswapDexStatus_) {
            return;
        }
        if (!this.zilswapTradeVolumeStatus_) {
            return;
        }
        
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
        }
    }

    bindViewAllLpFeeReward() {
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let currLpFeeReward = this.getLpFeeRewardInZil(ticker);
            if (!currLpFeeReward) {
                continue;
            }
            let currLpFeeRewardString = convertNumberQaToDecimalString(currLpFeeReward, /* decimals= */ 0);
            this.bindViewLpFeeReward(currLpFeeRewardString, ticker);
        }
    }

    bindViewLpFeeReward(currLpFeeRewardString, ticker) {
        $('#' + ticker + '_lp_pool_fee_reward_zil').text(currLpFeeRewardString);
    }

    resetView() {
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            $('#' + ticker + '_lp_pool_fee_reward_zil').text('Loading...');
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
