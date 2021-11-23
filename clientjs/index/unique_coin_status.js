/** A class to represent global net worth status.  */
class UniqueCoinStatus {

    constructor(zrcTokenPropertiesListMap, zrcStakingTokenPropertiesListMap, /* nullable= */ barChartDrawer, /* nullable= */ zilswapDexStatus, /* nullable= */ walletBalanceStatus, /* nullable= */ stakingBalanceStatus, /* nullable= */ stakingZrcStatus) {
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.zrcStakingTokenPropertiesListMap_ = zrcStakingTokenPropertiesListMap; // Refer to constants.js for definition

        // Private variable
        this.barChartDrawer_ = barChartDrawer;
        this.zilswapDexStatus_ = zilswapDexStatus;
        this.walletBalanceStatus_ = walletBalanceStatus
        this.stakingBalanceStatus_ = stakingBalanceStatus;
        this.stakingZrcStatus_ = stakingZrcStatus;

        // Private derived variable
        // A sorted 2D array, containing multiple ['coin_name', 'coin_amount']
        // Sorted descending by coin_amount
        this.sortedUniqueCoinsBalanceInZil_ = [];
        this.computeUniqueCoinsBalance();
    }

    /**
     * Callback method to be executed if any properties in zilswapDexStatus_ is changed.
     */
    onZilswapDexStatusChange() {
        this.computeUniqueCoinsBalance();
        this.drawBarChart();
    }

    /**
     * Callback method to be executed if any properties in zilswapDexStatus_ is changed.
     */
    onWalletBalanceStatusChange() {
        this.computeUniqueCoinsBalance();
        this.drawBarChart();
    }

    /**
     * Callback method to be executed if any properties in zilswapDexStatus_ is changed.
     */
    onStakingBalanceStatusChange() {
        this.computeUniqueCoinsBalance();
        this.drawBarChart();
    }

    reset() {
        this.sortedUniqueCoinsBalanceInZil_ = [];
        this.hideBarChart();
    }

    computeUniqueCoinsBalance() {
        this.reset();

        let uniqueCoinsBalanceInZil = {};
        uniqueCoinsBalanceInZil['ZIL'] = 0;
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            uniqueCoinsBalanceInZil[ticker] = 0;
        }

        // Zilswap DEX dependent
        if (this.zilswapDexStatus_) {
            for (let ticker in this.zrcTokenPropertiesListMap_) {
                let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil(ticker);
                if (!zrcPriceInZil) {
                    continue;
                }

                // LP balance
                let lpPersonalStatus = this.zilswapDexStatus_.getZilswapPairPersonalStatus(ticker);
                if (lpPersonalStatus) {
                    uniqueCoinsBalanceInZil[ticker] += lpPersonalStatus.zilAmount;
                    uniqueCoinsBalanceInZil['ZIL'] += lpPersonalStatus.zilAmount;
                }

                // Wallet balance ZRC tokens
                if (this.walletBalanceStatus_) {
                    let zrcWalletBalance = this.walletBalanceStatus_.getTokenBalance(ticker);
                    if (zrcWalletBalance) {
                        uniqueCoinsBalanceInZil[ticker] += 1.0 * zrcWalletBalance * zrcPriceInZil;
                    }
                }
            }
        }

        // Wallet balance ZIL
        if (this.walletBalanceStatus_) {
            let zilWalletBalance = this.walletBalanceStatus_.getTokenBalance('ZIL');
            if (zilWalletBalance) {
                uniqueCoinsBalanceInZil['ZIL'] += zilWalletBalance
            }
        }

        // Staking balance
        if (this.stakingBalanceStatus_) {
            let zilStakingBalance = this.stakingBalanceStatus_.getStakingAllSsnAndWithdrawalBalance();
            if (zilStakingBalance) {
                uniqueCoinsBalanceInZil['ZIL'] += zilStakingBalance;
            }
        }

        // ZRC Staking balance
        if (this.stakingZrcStatus_) {
            for (let tickerId in this.zrcStakingTokenPropertiesListMap_) {
                let zrcStakingBalanceInZil = this.stakingZrcStatus_.getZrcStakingBalanceInZil(tickerId);
                if (zrcStakingBalanceInZil) {
                    let currentTicker = this.zrcStakingTokenPropertiesListMap_[tickerId].ticker;
                    uniqueCoinsBalanceInZil[currentTicker] += zrcStakingBalanceInZil;
                }
            }
        }

        // Sort descending based on value
        let uniqueCoinsBalanceArray = [];
        for (let key in uniqueCoinsBalanceInZil) {
            uniqueCoinsBalanceArray.push([key, uniqueCoinsBalanceInZil[key]])
        }
        uniqueCoinsBalanceArray.sort(function compare(kv1, kv2) {
            return kv2[1] - kv1[1]
        })
        this.sortedUniqueCoinsBalanceInZil_ = uniqueCoinsBalanceArray;
    }

    drawBarChart() {
        if (!this.barChartDrawer_) {
            return;
        }
        let sortedCoinBalanceLength = this.sortedUniqueCoinsBalanceInZil_.length;
        if (sortedCoinBalanceLength === 0) {
            return;
        }

        let headerArray = ['Coin Symbol'];
        let dataArray = [''];

        for (let i = 0; i < sortedCoinBalanceLength; i++) {
            let zrcBalance = this.sortedUniqueCoinsBalanceInZil_[i][1];
            if (zrcBalance && zrcBalance > 10) {
                headerArray.push(this.sortedUniqueCoinsBalanceInZil_[i][0]);
                dataArray.push(Math.round(zrcBalance));
            }
        }

        // No data to draw.
        if (headerArray.length === 1 && dataArray.length === 1) {
            return;
        }

        this.barChartDrawer_.drawBarChart( /* barChartDivId= */ 'unique_coin_chart', headerArray, dataArray, /* customChartColor= */ null, /* customChartColorDarkMode= */ null);
    }

    hideBarChart() {
        $('#unique_coin_chart_container').hide();
    }
}

if (typeof exports !== 'undefined') {
    exports.UniqueCoinStatus = UniqueCoinStatus;
}