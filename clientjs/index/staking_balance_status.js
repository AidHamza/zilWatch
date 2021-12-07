/** A class to represent global wallet balance status.  */
class StakingBalanceStatus {

    constructor(zrcTokenPropertiesListMap, zrcStakingTokenPropertiesListMap, ssnListMap, /* nullable= */ coinPriceStatus, /* nullable= */ walletAddressBase16, /* nullable= */ zilStakingBalanceData, /* nullable= */ zilStakingWithdrawalBalanceData, /* nullable= */ stakingZrcStatus) {
        // Constants
        this.zilSeedNodeStakingImplementationAddress_ = "zil15lr86jwg937urdeayvtypvhy6pnp6d7p8n5z09"; // v 1.1
        this.zilSeedNodeStakingImplementationAddressBase16_ = "a7C67D49C82c7dc1B73D231640B2e4d0661D37c1"; // v 1.1

        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.zrcStakingTokenPropertiesListMap_ = zrcStakingTokenPropertiesListMap; // Refer to constants.js for definition
        this.ssnListMap_ = ssnListMap; // Refer to constants.js for definition
        this.coinPriceStatus_ = coinPriceStatus;

        // Private variable
        this.walletAddressBase16_ = walletAddressBase16;
        this.zilStakingBalanceData_ = zilStakingBalanceData;
        this.zilStakingWithdrawalBalanceData_ = zilStakingWithdrawalBalanceData;
        this.stakingZrcStatus_ = stakingZrcStatus;

        // Private derived variable
        this.zilStakingBalanceMap_ = {};
        this.zilStakingWithdrawalBalance_ = null;
    }

    /**
     * Callback method to be executed if any properties in zilswapDexStatus_ is changed.
     */
    onZilswapDexStatusChange() {
        if (this.stakingZrcStatus_) {
            this.stakingZrcStatus_.onZilswapDexStatusChange();
        }
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        this.bindViewStakingBalanceFiat();
        this.bindViewStakingWithdrawalBalanceFiat();
        if (this.stakingZrcStatus_) {
            this.stakingZrcStatus_.onCoinPriceStatusChange();
        }
    }

    reset() {
        this.zilStakingBalanceData_ = null;
        this.zilStakingWithdrawalBalanceData_ = null;
        this.zilStakingBalanceMap_ = {};
        this.zilStakingWithdrawalBalance_ = null;
        this.resetView();
        if (this.stakingZrcStatus_) {
            this.stakingZrcStatus_.reset();
        }
    }

    setWalletAddressBase16(walletAddressBase16) {
        // Need to reset the attributes when wallet is changed.
        this.reset();
        this.walletAddressBase16_ = walletAddressBase16;
        if (this.stakingZrcStatus_) {
            this.stakingZrcStatus_.setWalletAddressBase16(walletAddressBase16);
        }
    }

    /**
     * Returns staking balance in ZIL, number data type.
     * 
     * Any error will result in returning null.
     */
    getStakingBalance(ssnAddress) {
        if (!this.ssnListMap_[ssnAddress]) {
            return;
        }
        return this.zilStakingBalanceMap_[ssnAddress];
    }

    getStakingAllSsnAndWithdrawalBalance() {
        let totalStakingInZil = 0;

        let withdrawalBalanceInZil = this.getStakingWithdrawalBalance();
        if (withdrawalBalanceInZil) {
            totalStakingInZil += withdrawalBalanceInZil;
        }

        for (let ssnAddress in this.ssnListMap_) {
            let currStakingZil = this.getStakingBalance(ssnAddress);
            if (currStakingZil) {
                totalStakingInZil += currStakingZil;
            }
        }

        return totalStakingInZil;
    }

    /**
     * Returns staking withdrawal balance in ZIL, number data type.
     * 
     * Any error will result in returning null.
     */
    getStakingWithdrawalBalance() {
        if (!this.zilStakingWithdrawalBalance_) {
            return;
        }
        return this.zilStakingWithdrawalBalance_;
    }

    /**
     * Returns all staking balance from all types of staking in ZIL
     * 
     * Any error will return 0
     */
    getAllStakingBalanceInZil() {
        let totalStakingInZil = this.getStakingAllSsnAndWithdrawalBalance();

        if (this.stakingZrcStatus_) {
            for (let tickerId in this.zrcStakingTokenPropertiesListMap_) {
                let stakingZrcInZil = this.stakingZrcStatus_.getZrcStakingBalanceInZil(tickerId);
                if (stakingZrcInZil) {
                    totalStakingInZil += stakingZrcInZil;
                }
            }
        }
        return totalStakingInZil;
    }

    /**
     * Returns all staking balance from all types of staking in ZIL
     * 
     * Any error will return 0
     */
    getAllStakingBalanceInZil24hAgo() {
        // ZIL staking and withdrawal doesn't change now vs 24h ago, because
        // they are in ZIL, not affected by ZRC prices.
        let totalStakingInZil = this.getStakingAllSsnAndWithdrawalBalance();

        if (this.stakingZrcStatus_) {
            // If staking zrc is present and there is no 24h ago data, return 0 not to pollute the data.
            if (!this.stakingZrcStatus_.has24hAgoData()) {
                return 0;
            }
            // Else compute 24h ago as usual.
            for (let tickerId in this.zrcStakingTokenPropertiesListMap_) {
                let stakingZrcInZil = this.stakingZrcStatus_.getZrcStakingBalanceInZil24hAgo(tickerId);
                if (stakingZrcInZil) {
                    totalStakingInZil += stakingZrcInZil;
                }
            }
        }
        return totalStakingInZil;
    }

    computeStakingBalanceMap() {
        if (!this.zilStakingBalanceData_) {
            return;
        }
        if (!this.walletAddressBase16_) {
            return;
        }
        if (this.zilStakingBalanceData_.result && this.zilStakingBalanceData_.result.deposit_amt_deleg) {
            let ssnToBalanceMap = this.zilStakingBalanceData_.result.deposit_amt_deleg[this.walletAddressBase16_];
            if (!ssnToBalanceMap) {
                return;
            }
            for (let ssnAddress in ssnToBalanceMap) {
                let zilAmount = ssnToBalanceMap[ssnAddress] / Math.pow(10, 12);
                this.zilStakingBalanceMap_[ssnAddress] = zilAmount;
            }
        }
    }

    computeStakingWithdrawalBalance() {
        if (!this.zilStakingWithdrawalBalanceData_) {
            return;
        }
        if (!this.walletAddressBase16_) {
            return;
        }
        if (this.zilStakingWithdrawalBalanceData_.result && this.zilStakingWithdrawalBalanceData_.result.withdrawal_pending) {
            let blockNumberToBalanceMap = this.zilStakingWithdrawalBalanceData_.result.withdrawal_pending[this.walletAddressBase16_];
            if (!blockNumberToBalanceMap) {
                return;
            }

            let totalZilQa = 0;
            for (let blockNumber in blockNumberToBalanceMap) {
                let zilBalanceQa = parseInt(blockNumberToBalanceMap[blockNumber]);
                if (zilBalanceQa) {
                    totalZilQa += zilBalanceQa;
                }
            }

            this.zilStakingWithdrawalBalance_ = totalZilQa / Math.pow(10, 12);
        }
    }

    /**
     * This will perform RPC and fetch data no matter if data has already exists.
     * This can only be called if walletAddressBase16_ has been set. Else it's a no-op.
     */
    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        if (!this.walletAddressBase16_) {
            return;
        }
        let self = this;

        beforeRpcCallback();
        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractSubState",
            /* params= */
            [this.zilSeedNodeStakingImplementationAddressBase16_, "deposit_amt_deleg", [this.walletAddressBase16_]],
            /* successCallback= */
            function (data) {
                self.zilStakingBalanceData_ = data;
                self.computeStakingBalanceMap();
                self.bindViewStakingBalance();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });

        beforeRpcCallback();
        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractSubState",
            /* params= */
            [this.zilSeedNodeStakingImplementationAddressBase16_, "withdrawal_pending", [this.walletAddressBase16_]],
            /* successCallback= */
            function (data) {
                self.zilStakingWithdrawalBalanceData_ = data;
                self.computeStakingWithdrawalBalance();
                self.bindViewStakingWithdrawalBalance();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });

        if (this.stakingZrcStatus_) {
            this.stakingZrcStatus_.computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback);
        }
    }

    bindViewStakingBalance() {
        for (let ssnAddress in this.ssnListMap_) {
            let zilStakingBalance = this.getStakingBalance(ssnAddress);
            if (!zilStakingBalance) {
                continue;
            }
            let zilStakingBalanceString = convertNumberQaToDecimalString(zilStakingBalance, /* decimals= */ 0);
            this.bindViewZilStakingBalance(zilStakingBalanceString, ssnAddress);
        }

        this.bindViewStakingBalanceFiat();
    }

    bindViewStakingBalanceFiat() {
        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');

        for (let ssnAddress in this.ssnListMap_) {
            let zilStakingBalance = this.getStakingBalance(ssnAddress);
            if (!zilStakingBalance) {
                continue;
            }

            let zilStakingBalanceFiat = 1.0 * zilPriceInFiatFloat * zilStakingBalance;
            let zilStakingBalanceFiatString = commafyNumberToString(zilStakingBalanceFiat, decimals);
            this.bindViewZilStakingBalanceFiat(zilStakingBalanceFiatString, ssnAddress);

            if (!zilPriceInFiat24hAgoFloat) {
                continue;
            }
            let zilStakingBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zilStakingBalance;
            let zilStakingBalanceFiat24hAgoString = commafyNumberToString(zilStakingBalanceFiat24hAgo, decimals);
            let zilStakingBalanceFiat24hAgoPercentChange = getPercentChange(zilStakingBalanceFiat, zilStakingBalanceFiat24hAgo).toFixed(1);
            this.bindViewZilStakingBalanceFiat24hAgo(zilStakingBalanceFiat24hAgoString, zilStakingBalanceFiat24hAgoPercentChange, ssnAddress);
        }
    }

    bindViewStakingWithdrawalBalance() {
        let zilStakingWithdrawalBalance = this.getStakingWithdrawalBalance();
        if (!zilStakingWithdrawalBalance) {
            return;
        }

        let zilStakingWithdrawalBalanceString = convertNumberQaToDecimalString(zilStakingWithdrawalBalance, /* decimals= */ 0);
        this.bindViewZilStakingWithdrawalPendingBalance(zilStakingWithdrawalBalanceString);

        this.bindViewStakingWithdrawalBalanceFiat();
    }

    bindViewStakingWithdrawalBalanceFiat() {
        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');

        let zilStakingWithdrawalBalance = this.getStakingWithdrawalBalance();
        if (!zilStakingWithdrawalBalance) {
            return;
        }

        let zilStakingWithdrawalBalanceFiat = 1.0 * zilPriceInFiatFloat * zilStakingWithdrawalBalance;
        let zilStakingWithdrawalBalanceFiatString = commafyNumberToString(zilStakingWithdrawalBalanceFiat, decimals);
        this.bindViewZilStakingWithdrawalPendingBalanceFiat(zilStakingWithdrawalBalanceFiatString);

        if (!zilPriceInFiat24hAgoFloat) {
            return;
        }
        let zilStakingWithdrawalBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zilStakingWithdrawalBalance;
        let zilStakingWithdrawalBalanceFiat24hAgoString = commafyNumberToString(zilStakingWithdrawalBalanceFiat24hAgo, decimals);
        let zilStakingWithdrawalBalanceFiat24hAgoPercentChange = getPercentChange(zilStakingWithdrawalBalanceFiat, zilStakingWithdrawalBalanceFiat24hAgo).toFixed(1);
        this.bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo(zilStakingWithdrawalBalanceFiat24hAgoString, zilStakingWithdrawalBalanceFiat24hAgoPercentChange);
    }

    /** Private static method */
    bindViewZilStakingBalance(zilStakingBalance, ssnAddress) {
        $('#' + ssnAddress + '_zil_staking_balance').text(zilStakingBalance);
        $('#' + ssnAddress + '_zil_staking_container').show();
        $('#staking_container').show();
    }

    /** Private static method */
    bindViewZilStakingBalanceFiat24hAgo(zilStakingBalanceFiat24hAgo, zilStakingBalanceFiatPercentChange24h, ssnAddress) {
        $('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text(zilStakingBalanceFiat24hAgo);
        $('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text(zilStakingBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range_container', zilStakingBalanceFiatPercentChange24h);
    }

    /** Private static method */
    bindViewZilStakingBalanceFiat(zilStakingBalanceFiat, ssnAddress) {
        $('#' + ssnAddress + '_zil_staking_balance_fiat').text(zilStakingBalanceFiat);
    }

    /** Private static method */
    bindViewZilStakingWithdrawalPendingBalance(zilStakingWithdrawalBalance) {
        $('#zil_staking_withdrawal_pending_balance').text(zilStakingWithdrawalBalance);
        $('#zil_staking_withdrawal_pending_container').show();
        $('#staking_container').show();
    }

    /** Private static method */
    bindViewZilStakingWithdrawalPendingBalanceFiat24hAgo(zilStakingWithdrawalBalanceFiat24hAgo, zilStakingWithdrawalBalanceFiatPercentChange24h) {
        $('#zil_staking_withdrawal_pending_balance_fiat_past_range_ago').text(zilStakingWithdrawalBalanceFiat24hAgo);
        $('#zil_staking_withdrawal_pending_balance_fiat_percent_change_past_range').text(zilStakingWithdrawalBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#zil_staking_withdrawal_pending_balance_fiat_percent_change_past_range_container', zilStakingWithdrawalBalanceFiatPercentChange24h);
    }

    /** Private static method */
    bindViewZilStakingWithdrawalPendingBalanceFiat(zilStakingWithdrawalBalanceFiat) {
        $('#zil_staking_withdrawal_pending_balance_fiat').text(zilStakingWithdrawalBalanceFiat);
    }

    resetView() {
        $('#staking_container').hide();
        $('#zil_staking_withdrawal_pending_container').hide();
        for (let ssnAddress in ssnListMap) {
            $('#' + ssnAddress + '_zil_staking_container').hide();
            $('#' + ssnAddress + '_zil_staking_balance').text('Loading...');
            $('#' + ssnAddress + '_zil_staking_balance_fiat').text('Loading...');
            $('#' + ssnAddress + '_zil_staking_balance_fiat_past_range_ago').text('');
            $('#' + ssnAddress + '_zil_staking_balance_fiat_percent_change_past_range').text('');
        }

        $('#zil_staking_withdrawal_pending_balance').text('Loading...');
        $('#zil_staking_withdrawal_pending_balance_fiat').text('Loading...');
        $('#zil_staking_withdrawal_pending_balance_fiat_past_range_ago').text('');
        $('#zil_staking_withdrawal_pending_balance_fiat_percent_change_past_range').text('');
    }
}

if (typeof exports !== 'undefined') {
    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
        commafyNumberToString = FormattingUtils.commafyNumberToString;
    }
    if (typeof getPercentChange === 'undefined') {
        TokenUtils = require('./token_utils.js');
        getPercentChange = TokenUtils.getPercentChange;
    }

    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }

    if (typeof bindViewPercentChangeColorContainer === 'undefined') {
        BindView = require('./bind_view.js');
        bindViewPercentChangeColorContainer = BindView.bindViewPercentChangeColorContainer;
    }

    exports.StakingBalanceStatus = StakingBalanceStatus;
}