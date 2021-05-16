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
        refreshTotalLpRewardFiat();
    }
}

function onLpRewardPastEpochLoaded(pastRewardList) {
    if (!pastRewardList || pastRewardList.length < 1) {
        // If there is no data, it means user has no past reward, show 0 to user
        bindViewPrevTotalRewardAllLpZwap('0');
        bindViewPrevTotalRewardAllLpFiat('0');
        return;
    }
    
    let pastRewardListLastIndex = pastRewardList.length - 1;
    let prevRewardMap = pastRewardList[pastRewardListLastIndex];
    let prevZwapRewardQa = parseInt(prevRewardMap.amount);
    if (!prevZwapRewardQa) {
        return;
    }

    let prevTotalZwapRewardString = convertNumberQaToDecimalString(prevZwapRewardQa, zrcTokenPropertiesListMap['ZWAP'].decimals);
    if (prevTotalZwapRewardString) {
        bindViewPrevTotalRewardAllLpZwap(prevTotalZwapRewardString);
        refreshPrevTotalLpRewardFiat();
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

function refreshTotalLpRewardFiat() {
    let ticker = 'ZWAP';

    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let zrcTokenPriceInZil = getNumberFromView('.' + ticker + '_price_zil');
    if (!zrcTokenPriceInZil) {
        return;
    }

    let rewardBalance = getNumberFromView('#total_all_lp_reward_next_epoch_zwap');
    if (!rewardBalance) {
        return;
    }

    let rewardBalanceFiat = (zilPriceInFiatFloat * zrcTokenPriceInZil * rewardBalance);
    let totalAllLpRewardFiat = commafyNumberToString(rewardBalanceFiat, decimals);
    bindViewTotalRewardAllLpFiat(totalAllLpRewardFiat);
}

function refreshPrevTotalLpRewardFiat() {
    let ticker = 'ZWAP';

    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let zrcTokenPriceInZil = getNumberFromView('.' + ticker + '_price_zil');
    if (!zrcTokenPriceInZil) {
        return;
    }

    let rewardBalance = getNumberFromView('#total_all_lp_reward_prev_epoch_zwap');
    if (!rewardBalance) {
        return;
    }

    let rewardBalanceFiat = (zilPriceInFiatFloat * zrcTokenPriceInZil * rewardBalance);
    let prevTotalAllLpRewardFiat = commafyNumberToString(rewardBalanceFiat, decimals);
    bindViewPrevTotalRewardAllLpFiat(prevTotalAllLpRewardFiat);
}

if (typeof exports !== 'undefined') {
    if (typeof bindViewZwapRewardLp === 'undefined') {
        BindView = require('./bind_view.js');
        bindViewZwapRewardLp = BindView.bindViewZwapRewardLp;
        bindViewTotalRewardAllLpZwap = BindView.bindViewTotalRewardAllLpZwap;
        bindViewPrevTotalRewardAllLpZwap = BindView.bindViewPrevTotalRewardAllLpZwap;
        bindViewLpNextEpochCounter = BindView.bindViewLpNextEpochCounter;
        bindViewTotalRewardAllLpFiat = BindView.bindViewTotalRewardAllLpFiat
        bindViewPrevTotalRewardAllLpFiat = BindView.bindViewPrevTotalRewardAllLpFiat
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

    // This is just a mock stub to make the test run
    if (typeof zilPriceInFiatFloat === 'undefined') {
        zilPriceInFiatFloat = 0.2;
    }

    exports.onLpRewardNextEpochLoaded = onLpRewardNextEpochLoaded;
    exports.onLpRewardPastEpochLoaded = onLpRewardPastEpochLoaded;
    exports.onLpCurrentEpochInfoLoaded = onLpCurrentEpochInfoLoaded;
}
