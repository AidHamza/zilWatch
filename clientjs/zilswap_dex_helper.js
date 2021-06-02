
function onZilswapSinglePairPublicStatusLoaded() {
    for (let ticker in zrcTokenPropertiesListMap) {
        // Wallet Balance
        refreshZrcTokenWalletBalanceZilFiat(ticker);
        refreshTotalWalletBalanceZilFiat();

        // Lp balance
        refreshZrcTokenLpBalanceFiat(ticker)
        refreshTotalLpBalanceZilFiat();

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

    // Net worth
    refreshNetWorthZilFiat();
}
