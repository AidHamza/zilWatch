/** A class to represent ZRC token Staking Status.  */
class StakingZrcStatus {

    constructor(zrcTokenPropertiesListMap, zrcStakingTokenPropertiesListMap, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexStatus) {
        // Static const
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap;
        this.zrcStakingTokenPropertiesListMap_ = zrcStakingTokenPropertiesListMap;

        // Private variable
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;

        // Mutable private var from constructor parameters.
        this.walletAddressBase16_ = null;

        // map of tickerId to staking amount
        this.zrcBalance_ = {};
    }

    has24hAgoData() {
        return this.zilswapDexStatus_.has24hAgoData();
    }

    /**
     * Callback method to be executed if any properties in zilswapDexStatus_ is changed.
     */
    onZilswapDexStatusChange() {
        for (let tickerId in this.zrcStakingTokenPropertiesListMap_) {
            this.bindViewStakingBalanceZilFiat(tickerId);
        }
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        for (let tickerId in this.zrcStakingTokenPropertiesListMap_) {
            this.bindViewStakingBalanceZilFiat(tickerId);
        }
    }

    reset() {
        this.zrcBalance_ = {};
        this.resetAllView();
    }

    setWalletAddressBase16(walletAddressBase16) {
        // Need to reset the attributes when wallet is changed.
        this.reset();
        this.walletAddressBase16_ = walletAddressBase16;
    }

    /**
     * Returns staking balance in ZRC, number data type.
     * 
     * Any error will result in returning null.
     */
    getZrcStakingBalance(tickerId) {
        if (tickerId in this.zrcBalance_) {
            return this.zrcBalance_[tickerId];
        }
        return null;
    }

    /**
     * Returns staking balance in ZIL, number data type.
     * 
     * Returns 0 if there is no zrc staking.
     */
    getZrcStakingBalanceInZil(tickerId) {
        let zrcStakingBalance = this.getZrcStakingBalance(tickerId);
        if (!zrcStakingBalance) {
            return 0;
        }
        let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil(this.zrcStakingTokenPropertiesListMap_[tickerId].ticker);
        if (!zrcPriceInZil) {
            return 0;
        }
        return 1.0 * zrcStakingBalance * zrcPriceInZil;
    }

    /**
     * Returns staking balance in ZIL, number data type.
     * 
     * Returns 0 if there is no zrc staking.
     */
    getZrcStakingBalanceInZil24hAgo(tickerId) {
        let zrcStakingBalance = this.getZrcStakingBalance(tickerId);
        if (!zrcStakingBalance) {
            return 0;
        }
        let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil24hAgo(this.zrcStakingTokenPropertiesListMap_[tickerId].ticker);
        if (!zrcPriceInZil) {
            return 0;
        }
        return 1.0 * zrcStakingBalance * zrcPriceInZil;
    }

    computeZrcBalance(data, tickerId, walletAddressBase16, stakedAmountVarName) {
        if (!data) {
            return;
        }
        if (!walletAddressBase16) {
            return;
        }
        if (data.result && data.result[stakedAmountVarName]) {
            let stakedZrcBalance = parseInt(data.result[stakedAmountVarName][walletAddressBase16]);
            if (!stakedZrcBalance) {
                return;
            }
            let currentTicker = this.zrcStakingTokenPropertiesListMap_[tickerId].ticker;
            let zrcDecimals = this.zrcTokenPropertiesListMap_[currentTicker].decimals;

            this.zrcBalance_[tickerId] = 1.0 * stakedZrcBalance / Math.pow(10, zrcDecimals);
        }
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        let self = this;
        if (!this.walletAddressBase16_) {
            return;
        }
        let currWalletAddressBase16 = this.walletAddressBase16_;

        for (let tickerId in this.zrcStakingTokenPropertiesListMap_) {
            let currentContractAddressBase16 = this.zrcStakingTokenPropertiesListMap_[tickerId].address_base16.toLowerCase().substring(2);
            if (!('staked_amount' in this.zrcStakingTokenPropertiesListMap_[tickerId].state_attributes)) {
                continue;
            }
            let stakedAmountVarName = this.zrcStakingTokenPropertiesListMap_[tickerId].state_attributes.staked_amount;

            beforeRpcCallback();
            queryZilliqaApiAjax(
                /* method= */
                "GetSmartContractSubState",
                /* params= */
                [currentContractAddressBase16, stakedAmountVarName, [currWalletAddressBase16]],
                /* successCallback= */
                function (data) {
                    self.computeZrcBalance(data, tickerId, currWalletAddressBase16, stakedAmountVarName);
                    self.bindViewStakingBalance(tickerId);
                    onSuccessCallback();
                },
                /* errorCallback= */
                function () {
                    onErrorCallback();
                });
        }
    }

    bindViewStakingBalance(tickerId) {
        let zrcStakingBalance = this.getZrcStakingBalance(tickerId);
        if (!zrcStakingBalance) {
            return;
        }
        let zrcStakingBalanceString = convertNumberQaToDecimalString(zrcStakingBalance, /* decimals= */ 0);
        this.bindViewZrcStakingBalance(tickerId, zrcStakingBalanceString);

        this.bindViewStakingBalanceZilFiat(tickerId);
    }

    bindViewStakingBalanceZilFiat(tickerId) {
        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');

        // Process ZRC in ZIL
        let currTicker = this.zrcStakingTokenPropertiesListMap_[tickerId].ticker;
        let zrcStakingBalance = this.getZrcStakingBalance(tickerId);
        if (!zrcStakingBalance) {
            return;
        }
        let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil(currTicker);
        if (!zrcPriceInZil) {
            return;
        }
        let zrcStakingBalanceZil = 1.0 * zrcPriceInZil * zrcStakingBalance;
        let zrcStakingBalanceZilString = convertNumberQaToDecimalString(zrcStakingBalanceZil, /* decimals= */ 0);
        this.bindViewZrcStakingBalanceZil(tickerId, zrcStakingBalanceZilString);

        // Process ZRC in fiat
        if (!zilPriceInFiatFloat) {
            return;
        }
        let zrcStakingBalanceFiat = 1.0 * zilPriceInFiatFloat * zrcStakingBalanceZil;
        let zrcStakingBalanceFiatString = commafyNumberToString(zrcStakingBalanceFiat, decimals);
        this.bindViewZrcStakingBalanceFiat(tickerId, zrcStakingBalanceFiatString);

        // Process ZRC in ZIL 24h ago
        let zrcPriceInZil24hAgo = this.zilswapDexStatus_.getZrcPriceInZil24hAgo(currTicker);
        if (!zrcPriceInZil24hAgo) {
            return;
        }
        let zrcStakingBalanceZil24hAgo = 1.0 * zrcPriceInZil24hAgo * zrcStakingBalance;
        let zrcStakingBalanceZil24hAgoString = convertNumberQaToDecimalString(zrcStakingBalanceZil24hAgo, /* decimals= */ 0);
        let zrcStakingBalanceZil24hAgoPercentChange = getPercentChange(zrcStakingBalanceZil, zrcStakingBalanceZil24hAgo).toFixed(1);
        this.bindViewZrcStakingBalanceZil24hAgo(tickerId, zrcStakingBalanceZil24hAgoString, zrcStakingBalanceZil24hAgoPercentChange);

        // Process ZRC in fiat 24h ago
        if (!zilPriceInFiat24hAgoFloat || !zrcStakingBalanceZil24hAgo) {
            return;
        }
        let zrcStakingBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zrcStakingBalanceZil24hAgo;
        let zrcStakingBalanceFiat24hAgoString = commafyNumberToString(zrcStakingBalanceFiat24hAgo, decimals);
        let zrcStakingBalanceFiat24hAgoPercentChange = getPercentChange(zrcStakingBalanceFiat, zrcStakingBalanceFiat24hAgo).toFixed(1);
        this.bindViewZrcStakingBalanceFiat24hAgo(tickerId, zrcStakingBalanceFiat24hAgoString, zrcStakingBalanceFiat24hAgoPercentChange);
    }

    bindViewZrcStakingBalance(tickerId, zrcStakingBalance) {
        $('#' + tickerId + '_staking_balance').text(zrcStakingBalance);
        $('#' + tickerId + '_staking_container').show();
        $('#staking_container').show();
    }

    bindViewZrcStakingBalanceZil24hAgo(tickerId, zrcStakingBalanceZil24hAgo, zrcStakingBalanceZilPercentChange24h) {
        $('#' + tickerId + '_staking_balance_zil_24h_ago').text(zrcStakingBalanceZil24hAgo);
        $('#' + tickerId + '_staking_balance_zil_percent_change_24h').text(zrcStakingBalanceZilPercentChange24h);
        bindViewPercentChangeColorContainer('#' + tickerId + '_staking_balance_zil_percent_change_24h_container', zrcStakingBalanceZilPercentChange24h);
    }

    bindViewZrcStakingBalanceZil(tickerId, zrcStakingBalanceZil) {
        $('#' + tickerId + '_staking_balance_zil').text(zrcStakingBalanceZil);
    }

    bindViewZrcStakingBalanceFiat24hAgo(tickerId, zrcStakingBalanceFiat24hAgo, zrcStakingBalanceFiatPercentChange24h) {
        $('#' + tickerId + '_staking_balance_fiat_24h_ago').text(zrcStakingBalanceFiat24hAgo);
        $('#' + tickerId + '_staking_balance_fiat_percent_change_24h').text(zrcStakingBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#' + tickerId + '_staking_balance_fiat_percent_change_24h_container', zrcStakingBalanceFiatPercentChange24h);
    }

    bindViewZrcStakingBalanceFiat(tickerId, zrcStakingBalanceFiat) {
        $('#' + tickerId + '_staking_balance_fiat').text(zrcStakingBalanceFiat);
    }

    resetAllView() {
        for (let tickerId in this.zrcStakingTokenPropertiesListMap_) {
            this.resetView(tickerId);
        }
    }

    resetView(tickerId) {
        $('#' + tickerId + '_staking_container').hide();
        $('#' + tickerId + '_staking_balance').text('Loading...');
        $('#' + tickerId + '_staking_balance_zil').text('Loading...');
        $('#' + tickerId + '_staking_balance_zil_24h_ago').text('');
        $('#' + tickerId + '_staking_balance_zil_percent_change_24h').text('');
        $('#' + tickerId + '_staking_balance_fiat').text('Loading...');
        $('#' + tickerId + '_staking_balance_fiat_24h_ago').text('');
        $('#' + tickerId + '_staking_balance_fiat_percent_change_24h').text('');
    }
}

if (typeof exports !== 'undefined') {
    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
        commafyNumberToString = FormattingUtils.commafyNumberToString;
    }

    exports.StakingZrcStatus = StakingZrcStatus;
}