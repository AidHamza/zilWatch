
/** A class to represent Carbon Staking Status.  */
class StakingCarbonStatus {
    
    constructor(walletAddressBech32, walletAddressBase16) {
        // Static const
        this.carbonStakingImplementationAddress_ = 'zil18r37xks4r3rj7rzydujcckzlylftdy2qerszne';
        this.carbonStakingImplementationAddressBase16_ = '38e3e35a151C472f0c446f258c585F27d2B69140';
        this.decimals_ = 8;
        this.decimalsMultiplier_ = Math.pow(10, this.decimals_);

        // Mutable private var from constructor parameters.
        this.walletAddressBech32_ = walletAddressBech32;
        this.walletAddressBase16_ = walletAddressBase16.toLowerCase();

        // number data type, null means not yet computed
        this.carbonBalance_ = null;
    }

    get carbonBalance() {
        return this.carbonBalance_;
    }

    get carbonBalanceFormattedString() {
        return convertNumberQaToDecimalString(this.carbonBalance_, /* decimals= */ 0);
    }

    setCarbonBalanceFromData(data) {
        if (data.result && data.result.stakers) {
            let stakedCarbonBalance = parseInt(data.result.stakers[this.walletAddressBase16_]);
            if (!Number.isNaN(stakedCarbonBalance)) {
                this.carbonBalance_ = 1.0 * stakedCarbonBalance / this.decimalsMultiplier_;
            }
        }
    }

    computeBalanceRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        beforeRpcCallback();

        let self = this;
        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractSubState",
            /* params= */
            [this.carbonStakingImplementationAddressBase16_, "stakers", [this.walletAddressBase16_]],
            /* successCallback= */
            function (data) {
                self.setCarbonBalanceFromData(data);
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
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
