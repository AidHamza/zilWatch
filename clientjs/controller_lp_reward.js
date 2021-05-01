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

if (typeof exports !== 'undefined') {
    if (typeof bindViewZwapRewardLp === 'undefined') {
        BindView = require('./bind_view.js');
        bindViewZwapRewardLp = BindView.bindViewZwapRewardLp;
        bindViewTotalRewardAllLpZwap = BindView.bindViewTotalRewardAllLpZwap;
        bindViewLpNextEpochCounter = BindView.bindViewLpNextEpochCounter;
    }

    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
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
