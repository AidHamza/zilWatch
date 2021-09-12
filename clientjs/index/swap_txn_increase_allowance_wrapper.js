class SwapTxnIncreaseAllowanceWrapper {

    constructor(tokenContractAddressBase16, allowedSpenderAddressBase16, gasLimit) {
        this.tokenContractAddressBase16_ = tokenContractAddressBase16;
        this.allowedSpenderAddressBase16_ = allowedSpenderAddressBase16;
        this.gasLimit_ = gasLimit;
    }

    async increaseAllowance() {
        if (!this.tokenContractAddressBase16_ || !this.allowedSpenderAddressBase16_ || !this.gasLimit_) {
            console.log('Increase Allowance failed: ', this.tokenContractAddressBase16_, this.allowedSpenderAddressBase16_, this.gasLimit_);
            return null;
        }
        try {
            console.log('Increase Allowance: ',
                this.tokenContractAddressBase16_,
                this.allowedSpenderAddressBase16_,
                this.gasLimit_);

            return window.zilPay.contracts.at(this.tokenContractAddressBase16_).call(
                'IncreaseAllowance',
                [{
                        vname: 'spender',
                        type: 'ByStr20',
                        value: this.allowedSpenderAddressBase16_,
                    },
                    {
                        vname: 'amount',
                        type: 'Uint128',
                        value: '340282366920938463463374607431768211455', // Hard-coded large value
                    },
                ], {
                    amount: 0,
                    gasPrice: 2000000000,
                    gasLimit: this.gasLimit_,
                }
            );
        } catch (err) {
            console.log('Failed to increase allowance: ' + err);
        }
    }
}