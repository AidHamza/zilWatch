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
            let currentStakingTokenProperty = this.zrcStakingTokenPropertiesListMap_[tickerId];
            if (!('state_attributes_amount' in currentStakingTokenProperty)) {
                continue;
            }
            for (let stakingCategoryId in currentStakingTokenProperty.state_attributes_amount) {
                this.bindViewStakingBalanceZilFiat(tickerId, stakingCategoryId);
            }
        }
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        for (let tickerId in this.zrcStakingTokenPropertiesListMap_) {
            let currentStakingTokenProperty = this.zrcStakingTokenPropertiesListMap_[tickerId];
            if (!('state_attributes_amount' in currentStakingTokenProperty)) {
                continue;
            }
            for (let stakingCategoryId in currentStakingTokenProperty.state_attributes_amount) {
                this.bindViewStakingBalanceZilFiat(tickerId, stakingCategoryId);
            }
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
     * Any error will result in returning 0.
     */
    getZrcStakingBalance(tickerId) {
        let currentStakingTokenProperty = this.zrcStakingTokenPropertiesListMap_[tickerId];
        if (!('state_attributes_amount' in currentStakingTokenProperty)) {
            return 0;
        }
        let amount = 0;
        for (let stakingCategoryId in currentStakingTokenProperty.state_attributes_amount) {
            let currAmount = this.getSingleCategoryZrcStakingBalance(tickerId, stakingCategoryId);
            if (currAmount) {
                amount += currAmount;
            }
        }
        return amount;
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
        let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZilWithFallback(this.zrcStakingTokenPropertiesListMap_[tickerId].ticker);
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
        let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil24hAgoWithFallback(this.zrcStakingTokenPropertiesListMap_[tickerId].ticker);
        if (!zrcPriceInZil) {
            return 0;
        }
        return 1.0 * zrcStakingBalance * zrcPriceInZil;
    }

    /**
     * (Private) For this class only
     * Returns staking balance in ZRC, number data type.
     * 
     * Any error will result in returning null.
     */
    getSingleCategoryZrcStakingBalance(tickerId, stakingCategoryId) {
        try {
            return this.zrcBalance_[tickerId][stakingCategoryId];
        } catch (err) {
            // Do nothing
        }
        return null;
    }

    computeZrcBalance(data, tickerId, stakingCategoryId, walletAddressBase16) {
        if (!data) {
            return;
        }
        if (!walletAddressBase16) {
            return;
        }
        try {
            let stakedAmountVarName = this.zrcStakingTokenPropertiesListMap_[tickerId].state_attributes_amount[stakingCategoryId];
            if (data.result && data.result[stakedAmountVarName]) {
                let stakedZrcBalance = parseInt(data.result[stakedAmountVarName][walletAddressBase16]);
                if (!stakedZrcBalance) {
                    return;
                }
                let currentTicker = this.zrcStakingTokenPropertiesListMap_[tickerId].ticker;
                let zrcDecimals = this.zrcTokenPropertiesListMap_[currentTicker].decimals;

                if (!(tickerId in this.zrcBalance_)) {
                    this.zrcBalance_[tickerId] = {};
                }
                this.zrcBalance_[tickerId][stakingCategoryId] = 1.0 * stakedZrcBalance / Math.pow(10, zrcDecimals);
            }
        } catch (err) {
            console.log("Failed to compute staking ZrcBalance " + tickerId + " " + stakingCategoryId);
        }
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        let self = this;
        if (!this.walletAddressBase16_) {
            return;
        }
        let currWalletAddressBase16 = this.walletAddressBase16_;

        for (let tickerId in this.zrcStakingTokenPropertiesListMap_) {
            let currentStakingTokenProperty = this.zrcStakingTokenPropertiesListMap_[tickerId];
            let currentContractAddressBase16 = currentStakingTokenProperty.address_base16.toLowerCase().substring(2);
            if (!('state_attributes_amount' in currentStakingTokenProperty)) {
                continue;
            }
            for (let stakingCategoryId in currentStakingTokenProperty.state_attributes_amount) {
                let stakedAmountVarName = this.zrcStakingTokenPropertiesListMap_[tickerId].state_attributes_amount[stakingCategoryId];

                beforeRpcCallback();
                queryZilliqaApiAjax(
                    /* method= */
                    "GetSmartContractSubState",
                    /* params= */
                    [currentContractAddressBase16, stakedAmountVarName, [currWalletAddressBase16]],
                    /* successCallback= */
                    function (data) {
                        self.computeZrcBalance(data, tickerId, stakingCategoryId, currWalletAddressBase16);
                        self.bindViewStakingBalance(tickerId, stakingCategoryId);
                        onSuccessCallback();
                    },
                    /* errorCallback= */
                    function () {
                        onErrorCallback();
                    });
            }
        }
    }

    bindViewStakingBalance(tickerId, stakingCategoryId) {
        let zrcStakingBalance = this.getSingleCategoryZrcStakingBalance(tickerId, stakingCategoryId);
        if (!zrcStakingBalance) {
            return;
        }
        let zrcStakingBalanceString = convertNumberQaToDecimalString(zrcStakingBalance, /* decimals= */ 0);
        this.bindViewZrcStakingBalance(tickerId, stakingCategoryId, zrcStakingBalanceString);

        this.bindViewStakingBalanceZilFiat(tickerId, stakingCategoryId);
    }

    bindViewStakingBalanceZilFiat(tickerId, stakingCategoryId) {
        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');

        // Process ZRC in ZIL
        let currTicker = this.zrcStakingTokenPropertiesListMap_[tickerId].ticker;
        let zrcStakingBalance = this.getSingleCategoryZrcStakingBalance(tickerId, stakingCategoryId);
        if (!zrcStakingBalance) {
            return;
        }
        let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZilWithFallback(currTicker);
        if (!zrcPriceInZil) {
            return;
        }
        let zrcStakingBalanceZil = 1.0 * zrcPriceInZil * zrcStakingBalance;
        let zrcStakingBalanceZilString = convertNumberQaToDecimalString(zrcStakingBalanceZil, /* decimals= */ 0);
        this.bindViewZrcStakingBalanceZil(tickerId, stakingCategoryId, zrcStakingBalanceZilString);

        // Process ZRC in fiat
        if (!zilPriceInFiatFloat) {
            return;
        }
        let zrcStakingBalanceFiat = 1.0 * zilPriceInFiatFloat * zrcStakingBalanceZil;
        let zrcStakingBalanceFiatString = commafyNumberToString(zrcStakingBalanceFiat, decimals);
        this.bindViewZrcStakingBalanceFiat(tickerId, stakingCategoryId, zrcStakingBalanceFiatString);

        // Process ZRC in ZIL 24h ago
        let zrcPriceInZil24hAgo = this.zilswapDexStatus_.getZrcPriceInZil24hAgoWithFallback(currTicker);
        if (!zrcPriceInZil24hAgo) {
            return;
        }
        let zrcStakingBalanceZil24hAgo = 1.0 * zrcPriceInZil24hAgo * zrcStakingBalance;
        let zrcStakingBalanceZil24hAgoString = convertNumberQaToDecimalString(zrcStakingBalanceZil24hAgo, /* decimals= */ 0);
        let zrcStakingBalanceZil24hAgoPercentChange = getPercentChange(zrcStakingBalanceZil, zrcStakingBalanceZil24hAgo).toFixed(1);
        this.bindViewZrcStakingBalanceZil24hAgo(tickerId, stakingCategoryId, zrcStakingBalanceZil24hAgoString, zrcStakingBalanceZil24hAgoPercentChange);

        // Process ZRC in fiat 24h ago
        if (!zilPriceInFiat24hAgoFloat || !zrcStakingBalanceZil24hAgo) {
            return;
        }
        let zrcStakingBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zrcStakingBalanceZil24hAgo;
        let zrcStakingBalanceFiat24hAgoString = commafyNumberToString(zrcStakingBalanceFiat24hAgo, decimals);
        let zrcStakingBalanceFiat24hAgoPercentChange = getPercentChange(zrcStakingBalanceFiat, zrcStakingBalanceFiat24hAgo).toFixed(1);
        this.bindViewZrcStakingBalanceFiat24hAgo(tickerId, stakingCategoryId, zrcStakingBalanceFiat24hAgoString, zrcStakingBalanceFiat24hAgoPercentChange);
    }

    bindViewZrcStakingBalance(tickerId, stakingCategoryId, zrcStakingBalance) {
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text(zrcStakingBalance);
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_container').show();
        $('#staking_container').show();
    }

    bindViewZrcStakingBalanceZil24hAgo(tickerId, stakingCategoryId, zrcStakingBalanceZil24hAgo, zrcStakingBalanceZilPercentChange24h) {
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text(zrcStakingBalanceZil24hAgo);
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text(zrcStakingBalanceZilPercentChange24h);
        bindViewPercentChangeColorContainer('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range_container', zrcStakingBalanceZilPercentChange24h);
    }

    bindViewZrcStakingBalanceZil(tickerId, stakingCategoryId, zrcStakingBalanceZil) {
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text(zrcStakingBalanceZil);
    }

    bindViewZrcStakingBalanceFiat24hAgo(tickerId, stakingCategoryId, zrcStakingBalanceFiat24hAgo, zrcStakingBalanceFiatPercentChange24h) {
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text(zrcStakingBalanceFiat24hAgo);
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text(zrcStakingBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range_container', zrcStakingBalanceFiatPercentChange24h);
    }

    bindViewZrcStakingBalanceFiat(tickerId, stakingCategoryId, zrcStakingBalanceFiat) {
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text(zrcStakingBalanceFiat);
    }

    resetAllView() {
        for (let tickerId in this.zrcStakingTokenPropertiesListMap_) {
            let currentStakingTokenProperty = this.zrcStakingTokenPropertiesListMap_[tickerId];
            if (!('state_attributes_amount' in currentStakingTokenProperty)) {
                continue;
            }
            for (let stakingCategoryId in currentStakingTokenProperty.state_attributes_amount) {
                this.resetView(tickerId, stakingCategoryId);
            }
        }
    }

    resetView(tickerId, stakingCategoryId) {
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_container').hide();
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance').text('Loading...');
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil').text('Loading...');
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_past_range_ago').text('');
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_zil_percent_change_past_range').text('');
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat').text('Loading...');
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_past_range_ago').text('');
        $('#' + tickerId + '_' + stakingCategoryId + '_staking_balance_fiat_percent_change_past_range').text('');
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