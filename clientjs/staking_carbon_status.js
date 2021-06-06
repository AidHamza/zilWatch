/** A class to represent Carbon Staking Status.  */
class StakingCarbonStatus {

    constructor( /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexStatus, /* nullable= */ walletAddressBase16, /* nullable= */ carbonBalanceData) {
        // Static const
        this.carbonStakingImplementationAddress_ = 'zil18r37xks4r3rj7rzydujcckzlylftdy2qerszne';
        this.carbonStakingImplementationAddressBase16_ = '38e3e35a151C472f0c446f258c585F27d2B69140';
        this.decimals_ = 8;
        this.decimalsMultiplier_ = Math.pow(10, this.decimals_);

        // Private variable
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;

        // Mutable private var from constructor parameters.
        this.walletAddressBase16_ = walletAddressBase16;
        this.carbonBalanceData_ = carbonBalanceData;

        // number data type, null means not yet computed
        this.carbonBalance_ = null;
    }

    has24hAgoData() {
        return this.zilswapDexStatus_.has24hAgoData();
    }

    /**
     * Callback method to be executed if any properties in zilswapDexStatus_ is changed.
     */
    onZilswapDexStatusChange() {
        this.bindViewStakingBalanceZilFiat();
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        this.bindViewStakingBalanceZilFiat();
    }

    reset() {
        this.carbonBalanceData_ = null;
        this.carbonBalance_ = null;
        this.resetView();
    }

    setWalletAddressBase16(walletAddressBase16) {
        // Need to reset the attributes when wallet is changed.
        this.reset();
        this.walletAddressBase16_ = walletAddressBase16;
    }

    /**
     * Returns staking balance in CARB, number data type.
     * 
     * Any error will result in returning null.
     */
    getCarbonStakingBalance() {
        return this.carbonBalance_;
    }

    /**
     * Returns staking balance in ZIL, number data type.
     * 
     * Returns 0 if there is no carbon staking.
     */
    getCarbonStakingBalanceInZil() {
        if (!this.carbonBalance_) {
            return 0;
        }
        let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil('CARB');
        if (!zrcPriceInZil) {
            return 0;
        }
        return 1.0 * this.carbonBalance_ * zrcPriceInZil;
    }

    /**
     * Returns staking balance in ZIL, number data type.
     * 
     * Returns 0 if there is no carbon staking.
     */
    getCarbonStakingBalanceInZil24hAgo() {
        if (!this.carbonBalance_) {
            return 0;
        }
        let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil24hAgo('CARB');
        if (!zrcPriceInZil) {
            return 0;
        }
        return 1.0 * this.carbonBalance_ * zrcPriceInZil;
    }

    computeCarbonBalance() {
        if (!this.carbonBalanceData_) {
            return;
        }
        if (!this.walletAddressBase16_) {
            return;
        }
        if (this.carbonBalanceData_.result && this.carbonBalanceData_.result.stakers) {
            let stakedCarbonBalance = parseInt(this.carbonBalanceData_.result.stakers[this.walletAddressBase16_]);
            if (!stakedCarbonBalance) {
                return;
            }
            this.carbonBalance_ = 1.0 * stakedCarbonBalance / this.decimalsMultiplier_;
        }
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        beforeRpcCallback();

        let self = this;
        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractSubState",
            /* params= */
            [this.carbonStakingImplementationAddressBase16_, "stakers", [this.walletAddressBase16_]],
            /* successCallback= */
            function (data) {
                self.carbonBalanceData_ = data;
                self.computeCarbonBalance();
                self.bindViewStakingBalance();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }
    bindViewStakingBalance() {
        let carbonStakingBalance = this.getCarbonStakingBalance();
        if (!carbonStakingBalance) {
            return;
        }
        let carbonStakingBalanceString = convertNumberQaToDecimalString(carbonStakingBalance, /* decimals= */ 0);
        this.bindViewCarbonStakingBalance(carbonStakingBalanceString);

        this.bindViewStakingBalanceZilFiat();
    }

    bindViewStakingBalanceZilFiat() {
        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');

        // Process ZRC in ZIL
        let carbonStakingBalance = this.getCarbonStakingBalance();
        if (!carbonStakingBalance) {
            return;
        }
        let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil('CARB');
        if (!zrcPriceInZil) {
            return;
        }
        let carbonStakingBalanceZil = 1.0 * zrcPriceInZil * carbonStakingBalance;
        let carbonStakingBalanceZilString = convertNumberQaToDecimalString(carbonStakingBalanceZil, /* decimals= */ 0);
        this.bindViewCarbonStakingBalanceZil(carbonStakingBalanceZilString);

        // Process ZRC in fiat
        if (!zilPriceInFiatFloat) {
            return;
        }
        let carbonStakingBalanceFiat = 1.0 * zilPriceInFiatFloat * carbonStakingBalanceZil;
        let carbonStakingBalanceFiatString = commafyNumberToString(carbonStakingBalanceFiat, decimals);
        this.bindViewCarbonStakingBalanceFiat(carbonStakingBalanceFiatString);

        // Process ZRC in ZIL 24h ago
        let zrcPriceInZil24hAgo = this.zilswapDexStatus_.getZrcPriceInZil24hAgo('CARB');
        if (!zrcPriceInZil24hAgo) {
            return;
        }
        let carbonStakingBalanceZil24hAgo = 1.0 * zrcPriceInZil24hAgo * carbonStakingBalance;
        let carbonStakingBalanceZil24hAgoString = convertNumberQaToDecimalString(carbonStakingBalanceZil24hAgo, /* decimals= */ 0);
        let carbonStakingBalanceZil24hAgoPercentChange = getPercentChange(carbonStakingBalanceZil, carbonStakingBalanceZil24hAgo).toFixed(1);
        this.bindViewCarbonStakingBalanceZil24hAgo(carbonStakingBalanceZil24hAgoString, carbonStakingBalanceZil24hAgoPercentChange);

        // Process ZRC in fiat 24h ago
        if (!zilPriceInFiat24hAgoFloat || !carbonStakingBalanceZil24hAgo) {
            return;
        }
        let carbonStakingBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * carbonStakingBalanceZil24hAgo;
        let carbonStakingBalanceFiat24hAgoString = commafyNumberToString(carbonStakingBalanceFiat24hAgo, decimals);
        let carbonStakingBalanceFiat24hAgoPercentChange = getPercentChange(carbonStakingBalanceFiat, carbonStakingBalanceFiat24hAgo).toFixed(1);
        this.bindViewCarbonStakingBalanceFiat24hAgo(carbonStakingBalanceFiat24hAgoString, carbonStakingBalanceFiat24hAgoPercentChange);
    }

    bindViewCarbonStakingBalance(carbonStakingBalance) {
        $('#carbon_staking_balance').text(carbonStakingBalance);
        $('#carbon_staking_container').show();
        $('#staking_container').show();
    }

    bindViewCarbonStakingBalanceZil24hAgo(carbonStakingBalanceZil24hAgo, carbonStakingBalanceZilPercentChange24h) {
        $('#carbon_staking_balance_zil_24h_ago').text(carbonStakingBalanceZil24hAgo);
        $('#carbon_staking_balance_zil_percent_change_24h').text(carbonStakingBalanceZilPercentChange24h);
        bindViewPercentChangeColorContainer('#carbon_staking_balance_zil_percent_change_24h_container', carbonStakingBalanceZilPercentChange24h);
    }

    bindViewCarbonStakingBalanceZil(carbonStakingBalanceZil) {
        $('#carbon_staking_balance_zil').text(carbonStakingBalanceZil);
    }

    bindViewCarbonStakingBalanceFiat24hAgo(carbonStakingBalanceFiat24hAgo, carbonStakingBalanceFiatPercentChange24h) {
        $('#carbon_staking_balance_fiat_24h_ago').text(carbonStakingBalanceFiat24hAgo);
        $('#carbon_staking_balance_fiat_percent_change_24h').text(carbonStakingBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#carbon_staking_balance_fiat_percent_change_24h_container', carbonStakingBalanceFiatPercentChange24h);
    }

    bindViewCarbonStakingBalanceFiat(carbonStakingBalanceFiat) {
        $('#carbon_staking_balance_fiat').text(carbonStakingBalanceFiat);
    }

    resetView() {
        $('#carbon_staking_container').hide();
        $('#carbon_staking_balance').text('Loading...');
        $('#carbon_staking_balance_zil').text('Loading...');
        $('#carbon_staking_balance_zil_24h_ago').text('');
        $('#carbon_staking_balance_zil_percent_change_24h').text('');
        $('#carbon_staking_balance_fiat').text('Loading...');
        $('#carbon_staking_balance_fiat_24h_ago').text('');
        $('#carbon_staking_balance_fiat_percent_change_24h').text('');
    }
}

if (typeof exports !== 'undefined') {
    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
        commafyNumberToString = FormattingUtils.commafyNumberToString;
    }

    exports.StakingCarbonStatus = StakingCarbonStatus;
}