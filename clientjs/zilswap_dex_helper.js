
function onZilswapSinglePairPublicStatusLoaded() {
    for (let ticker in zrcTokenPropertiesListMap) {
        // Total supply
        refreshZrcTokenCirculatingSupplyZilFiat(ticker);
        refreshZrcTokenTotalSupplyZilFiat(ticker);
        
        // Lp reward
        if (ticker === 'ZWAP') {
            refreshTotalLpRewardFiat();
            refreshPrevTotalLpRewardFiat();
            refreshPastTotalLpRewardFiat();
        } else if (ticker === 'CARB') {
            // Staking Balance
            refreshCarbonStakingZilFiat();
            refreshTotalStakingZilFiat();
        }
    }
    // Wallet Balance
    refreshTotalWalletBalanceZilFiat();

    // Lp balance
    refreshTotalLpBalanceZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
}

function onZrcTokenLpBalanceLoaded() {
    // Lp balance
    refreshTotalLpBalanceZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
}
