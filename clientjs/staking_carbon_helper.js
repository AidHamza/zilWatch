
function onCarbonStakingBalanceLoaded(carbonBalanceFormattedString) {
    bindViewCarbonStakingBalance(carbonBalanceFormattedString);

    // Staking balance
    refreshCarbonStakingZilFiat();
    refreshTotalStakingZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
}

function refreshCarbonStakingZilFiat() {

    let carbonPriceInZil = getNumberFromView('.' + zrcTokenPropertiesListMap['CARB'].ticker + '_price_zil');
    if (Number.isNaN(carbonPriceInZil)) {
        return;
    }

    let carbonStakingBalance = getNumberFromView('#carbon_staking_balance');
    if (Number.isNaN(carbonStakingBalance)) {
        return;
    }

    let carbonStakingBalanceZil = 1.0 * carbonPriceInZil * carbonStakingBalance;
    let carbonStakingBalanceZilString = convertNumberQaToDecimalString(carbonStakingBalanceZil, /* decimals= */ 0);
    bindViewCarbonStakingBalanceZil(carbonStakingBalanceZilString);

    // Balance in ZIL 24h hour ago
    let carbonPriceInZil24hAgo = getNumberFromView('.' + zrcTokenPropertiesListMap['CARB'].ticker + '_price_zil_24h_ago');
    if (!Number.isNaN(carbonPriceInZil24hAgo)) {
        let carbonStakingBalanceZil24hAgo = 1.0 * carbonPriceInZil24hAgo * carbonStakingBalance;
        let carbonStakingBalanceZil24hAgoString = convertNumberQaToDecimalString(carbonStakingBalanceZil24hAgo, /* decimals= */ 0);
        let carbonStakingBalanceZilPercentChange24h = getPercentChange(carbonStakingBalanceZil, carbonStakingBalanceZil24hAgo).toFixed(1);
        bindViewCarbonStakingBalanceZil24hAgo(carbonStakingBalanceZil24hAgoString, carbonStakingBalanceZilPercentChange24h);
    }

    if (!zilPriceInFiatFloat) {
        return;
    }
    let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

    let carbonStakingBalanceFiat = 1.0 * zilPriceInFiatFloat * carbonStakingBalanceZil;
    let carbonStakingBalanceFiatString = commafyNumberToString(carbonStakingBalanceFiat, decimals);
    bindViewCarbonStakingBalanceFiat(carbonStakingBalanceFiatString);

    if (zilPriceInFiat24hAgoFloat) {
        let carbonStakingBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * carbonStakingBalanceZil;
        let carbonStakingBalanceFiat24hAgoString = commafyNumberToString(carbonStakingBalanceFiat24hAgo, decimals);
        let carbonStakingBalanceFiatPercentChange24h = getPercentChange(carbonStakingBalanceFiat, carbonStakingBalanceFiat24hAgo).toFixed(1);
        bindViewCarbonStakingBalanceFiat24hAgo(carbonStakingBalanceFiat24hAgoString, carbonStakingBalanceFiatPercentChange24h);
    }
}
