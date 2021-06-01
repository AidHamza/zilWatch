function onCoinFiatPriceLoaded() {
        // Wallet Balance
    refreshZilWalletBalanceFiat();
    for (let ticker in zrcTokenPropertiesListMap) {
        refreshZrcTokenWalletBalanceZilFiat(ticker);
    }
    refreshTotalWalletBalanceZilFiat();

    // Lp balance
    for (let ticker in zrcTokenPropertiesListMap) {
        refreshZrcTokenPriceFiat(ticker);

        refreshTotalTradeVolumeFiat(ticker);
        refreshZrcTokenLpTotalPoolBalanceFiat(ticker);
        refreshZrcTokenLpBalanceFiat(ticker);

        // Total supply
        refreshZrcTokenCirculatingSupplyZilFiat(ticker);
        refreshZrcTokenTotalSupplyZilFiat(ticker);
    }
    refreshTotalLpBalanceZilFiat();

    // Lp reward
    refreshTotalLpRewardFiat();
    refreshPrevTotalLpRewardFiat();
    refreshPastTotalLpRewardFiat();

    // ZIL staking
    for (let ssnAddress in ssnListMap) {
        refreshZilStakingFiat(ssnAddress);
    }
    refreshZilStakingWithdrawalPendingFiat();
    refreshCarbonStakingZilFiat();
    refreshTotalStakingZilFiat();

    // Net worth
    refreshNetWorthZilFiat();
}
