// controller_lp_reward.js
// data used here not included in total networth and total balance summary at the top.

/**
 * --------------------------------------------------------------------------------
 */

 function onLpRewardNextEpochLoaded(contractAddressToRewardMap) {
    if (!contractAddressToRewardMap) {
        return;
    }
    // Sum of the rewards from all pools.
    let totalZwapRewardQa = 0;

    // Loop all individuals ZRC token LP and show ZWAP reward per ZRC LP.
    for (let ticker in zrcTokenPropertiesListMap) {
        let zrcTokenAddress = zrcTokenPropertiesListMap[ticker].address;

        if (contractAddressToRewardMap[zrcTokenAddress]) {
            let zwapRewardQa = parseInt(contractAddressToRewardMap[zrcTokenAddress]);
            if (zwapRewardQa) {
                totalZwapRewardQa += zwapRewardQa;

                let zwapRewardString = convertNumberQaToDecimalString(zwapRewardQa, zrcTokenPropertiesListMap['ZWAP'].decimals);
                if (zwapRewardString) {
                    bindViewZwapRewardLp(zwapRewardString, ticker);
                }
            }
        }
    }

    // Total reward from all pools
    let totalRewardZwapString = convertNumberQaToDecimalString(totalZwapRewardQa, zrcTokenPropertiesListMap['ZWAP'].decimals)
    if (totalRewardZwapString) {
        bindViewTotalRewardAllLpZwap(totalRewardZwapString);
        refreshTotalLpRewardUsd();
    }
}

function onLpCurrentEpochInfoLoaded(epochInfoData) {
    let nextEpochStartSeconds = parseInt(epochInfoData.next_epoch_start);
    if (!nextEpochStartSeconds) {
        return;
    }
    let currentDate = new Date();
    let currentTimeSeconds = currentDate.getTime() / 1000;
    let timeDiffSeconds = Math.max(0, nextEpochStartSeconds - currentTimeSeconds);
    let timeDiffDuration = new Duration(timeDiffSeconds);

    bindViewLpNextEpochCounter(timeDiffDuration.getUserFriendlyString());
}

function refreshTotalLpRewardUsd() {
    let ticker = 'ZWAP';

    let usdPrice = getNumberFromView('.zil_price_usd');
    if (!usdPrice) {
        return;
    }

    let zrcTokenPriceInZil = getNumberFromView('#' + ticker + '_price_zil');
    if (!zrcTokenPriceInZil) {
        return;
    }

    let rewardBalance = getNumberFromView('#total_all_lp_reward_next_epoch_zwap');
    if (!rewardBalance) {
        return;
    }

    let rewardBalanceUsd = (usdPrice * zrcTokenPriceInZil * rewardBalance);
    let totalAllLpRewardUsd = commafyNumberToString(rewardBalanceUsd);
    bindViewTotalRewardAllLpUsd(totalAllLpRewardUsd);
}

if (typeof exports !== 'undefined') {
    if (typeof bindViewZwapRewardLp === 'undefined') {
        BindView = require('./bind_view.js');
        bindViewZwapRewardLp = BindView.bindViewZwapRewardLp;
        bindViewTotalRewardAllLpZwap = BindView.bindViewTotalRewardAllLpZwap;
        bindViewLpNextEpochCounter = BindView.bindViewLpNextEpochCounter;
        bindViewTotalRewardAllLpUsd = BindView.bindViewTotalRewardAllLpUsd
        getNumberFromView = BindView.getNumberFromView;
    }

    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
        commafyNumberToString = FormattingUtils.commafyNumberToString;
    }

    if (typeof zrcTokenPropertiesListMap === 'undefined') {
        Constants = require('../constants.js');
        zrcTokenPropertiesListMap = Constants.zrcTokenPropertiesListMap;
    }

    if (typeof Duration === 'undefined') {
        TimeUtils = require('./time_utils.js');
        Duration = TimeUtils.Duration;
    }

    exports.onLpRewardNextEpochLoaded = onLpRewardNextEpochLoaded;
    exports.onLpCurrentEpochInfoLoaded = onLpCurrentEpochInfoLoaded;
}
