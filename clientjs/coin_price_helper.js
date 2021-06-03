function onCoinFiatPriceLoaded() {
    // Wallet Balance
    refreshTotalWalletBalanceZilFiat();

    // Lp balance
    for (let ticker in zrcTokenPropertiesListMap) {
        refreshTotalTradeVolumeFiat(ticker);

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
