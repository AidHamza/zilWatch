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
        } else {
            bindViewZwapRewardLp('No reward', ticker);
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
        bindViewPrevTotalRewardAllLpZwap('-', '0');
        bindViewPrevTotalRewardAllLpFiat('0');
        return;
    }
    
    let pastRewardListLastIndex = pastRewardList.length - 1;
    let prevRewardMap = pastRewardList[pastRewardListLastIndex];
    let prevZwapRewardQa = parseInt(prevRewardMap.amount);
    if (!prevZwapRewardQa) {
        bindViewPrevTotalRewardAllLpZwap(prevRewardMap.epoch_number, '0');
        bindViewPrevTotalRewardAllLpFiat('0');
        return;
    }

    let prevTotalZwapRewardString = convertNumberQaToDecimalString(prevZwapRewardQa, zrcTokenPropertiesListMap['ZWAP'].decimals);
    if (!prevTotalZwapRewardString) {
        bindViewPrevTotalRewardAllLpZwap(prevRewardMap.epoch_number, '0');
        bindViewPrevTotalRewardAllLpFiat('0');
        return;
    }
    bindViewPrevTotalRewardAllLpZwap(prevRewardMap.epoch_number, prevTotalZwapRewardString);
    refreshPrevTotalLpRewardFiat();
    
    // Check if we have more past rewards from ZWAP, If there are no past rewards, return.
    let pastRewardListIndex = pastRewardListLastIndex - 1;
    if (pastRewardListIndex < 0) {
        return;
    }
    
    // If we have more past rewards, show them
    enableTooltipPastTotalRewardAllLpZwap();
    clearViewPastTotalRewardAllLpZwap();
    while (pastRewardListIndex >= 0) {
        // Need to decrement the counter immediately to prevent infinite loop.
        let currRewardMap = pastRewardList[pastRewardListIndex--];
        let currZwapRewardQa = parseInt(currRewardMap.amount);
        if (!currZwapRewardQa) {
            continue;
        }
        let currZwapRewardString = convertNumberQaToDecimalString(currZwapRewardQa, zrcTokenPropertiesListMap['ZWAP'].decimals);
        if (!currZwapRewardString) {
            continue;
        }
        let viewElement = getViewPastTotalRewardAllLpZwap(currRewardMap.epoch_number, currZwapRewardString);
        addViewPastTotalRewardAllLpZwap(viewElement);
    }
    refreshPastTotalLpRewardFiat();
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

    let zilPriceInFiatFloat = coinPriceStatus.getCoinPriceFiat('ZIL');
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

    let zilPriceInFiatFloat = coinPriceStatus.getCoinPriceFiat('ZIL');
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

function refreshPastTotalLpRewardFiat() {
    let ticker = 'ZWAP';

    let zilPriceInFiatFloat = coinPriceStatus.getCoinPriceFiat('ZIL');
    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let zrcTokenPriceInZil = getNumberFromView('.' + ticker + '_price_zil');
    if (!zrcTokenPriceInZil) {
        return;
    }

    bindViewPastTotalRewardAllLpFiat(function(rewardBalance) {
        let rewardBalanceFiat = (zilPriceInFiatFloat * zrcTokenPriceInZil * rewardBalance);
        let rewardBalanceFiatString = commafyNumberToString(rewardBalanceFiat, decimals);
        return rewardBalanceFiatString;
    });
}

function getViewPastTotalRewardAllLpZwap(epochNumber, pastTotalRewardZwapString) {
    return "<tr>" +
        "<td colspan='2' style='text-align: left; white-space: nowrap;' >" +
        "<span>Epoch " + epochNumber + "</span>" +
        "</td>" +
        "<td class='text-secondary' style='text-align: right; white-space:'>" +
        "<span id='total_all_lp_reward_epoch_" + epochNumber + "_zwap' class='ml-1'>" + pastTotalRewardZwapString + "</span>" +
        "<span class='ml-1'>ZWAP</span>" +
        "</td>" + 
        "<td class='text-secondary' style='text-align: right; white-space: nowrap;'>" +
        "<span class='currency_symbol mr-1'>" + coinPriceStatus.getCurrentActiveDollarSymbol() + "</span>" + 
        "<span id='total_all_lp_reward_epoch_" +  epochNumber + "_fiat' class='past_lp_reward_fiat'/>" +
        "</td>" +
    "</tr>";
}

if (typeof exports !== 'undefined') {
    if (typeof bindViewZwapRewardLp === 'undefined') {
        BindView = require('./bind_view.js');
        bindViewZwapRewardLp = BindView.bindViewZwapRewardLp;
        bindViewTotalRewardAllLpZwap = BindView.bindViewTotalRewardAllLpZwap;
        bindViewPrevTotalRewardAllLpZwap = BindView.bindViewPrevTotalRewardAllLpZwap;
        bindViewLpNextEpochCounter = BindView.bindViewLpNextEpochCounter;
        bindViewTotalRewardAllLpFiat = BindView.bindViewTotalRewardAllLpFiat;
        bindViewPrevTotalRewardAllLpFiat = BindView.bindViewPrevTotalRewardAllLpFiat;

        enableTooltipPastTotalRewardAllLpZwap = BindView.enableTooltipPastTotalRewardAllLpZwap;
        disableTooltipPastTotalRewardAllLpZwap = BindView.disableTooltipPastTotalRewardAllLpZwap;
        clearViewPastTotalRewardAllLpZwap = BindView.clearViewPastTotalRewardAllLpZwap;
        addViewPastTotalRewardAllLpZwap = BindView.addViewPastTotalRewardAllLpZwap;
        bindViewPastTotalRewardAllLpFiat = BindView.bindViewPastTotalRewardAllLpFiat;

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

    if (typeof coinPriceStatus === 'undefined') {
        CoinPriceStatus = require('./coin_price_status.js');
        let Constants = require('../constants.js');

        let dataString = '{"zilliqa":{"usd":0.11819}}';
        let dataObject = JSON.parse(dataString);
        coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', dataObject, null);
    }

    exports.onLpRewardNextEpochLoaded = onLpRewardNextEpochLoaded;
    exports.onLpRewardPastEpochLoaded = onLpRewardPastEpochLoaded;
    exports.onLpCurrentEpochInfoLoaded = onLpCurrentEpochInfoLoaded;
    exports.getViewPastTotalRewardAllLpZwap = getViewPastTotalRewardAllLpZwap;
}
