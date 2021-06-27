const SwapType = Object.freeze({
    "UNKNOWN": 0,
    "INVALID_AMOUNT": 1,
    "INVALID_ZILSWAP_DEX_ADDRESS": 2,
    "INVALID_GAS_LIMIT": 3,
    "INVALID_DEADLINE_BLOCK": 4,
    // Valid cases
    "TOKEN_TO_ZIL": 5,
    "ZIL_TO_TOKEN": 6,
    "TOKEN_TO_TOKEN": 7,
});

class SwapTxnWrapper {

    constructor(zilswapDexAddressBase16, gasLimit, deadlineBlock, /* nullable= */ fromExactAmountQa, /* nullable= */ fromTokenContractAddressBase16, /* nullable= */ toMinAmountQa, /* nullable= */ toTokenContractAddressBase16) {

        this.zilswapDexAddressBase16_ = zilswapDexAddressBase16;
        this.gasLimit_ = gasLimit;
        this.deadlineBlock_ = deadlineBlock;

        this.fromExactAmountQa_ = fromExactAmountQa;
        this.fromTokenContractAddressBase16_ = fromTokenContractAddressBase16;

        this.toMinAmountQa_ = toMinAmountQa;
        this.toTokenContractAddressBase16_ = toTokenContractAddressBase16;

        this.swapType_ = SwapType.UNKNOWN;

        if (!this.fromExactAmountQa_ && !this.toMinAmountQa_) {
            // Invalid amount
            this.swapType_ = SwapType.INVALID_AMOUNT;
        } else if (this.fromExactAmountQa_ && this.fromTokenContractAddressBase16_ && this.toMinAmountQa_ && this.toTokenContractAddressBase16_) {
            // All amount exists and both tokens (from and to) token adressses are set.
            this.swapType_ = SwapType.TOKEN_TO_TOKEN;
        } else if (this.fromExactAmountQa_ && this.fromTokenContractAddressBase16_ && this.toMinAmountQa_ && !this.toTokenContractAddressBase16_) {
            // All amount exists and from token address is set, but to token address is NOT set.
            this.swapType_ = SwapType.TOKEN_TO_ZIL;
        } else if (this.fromExactAmountQa_ && !this.fromTokenContractAddressBase16_ && this.toMinAmountQa_ && this.toTokenContractAddressBase16_) {
            // All amount exists and from token address is NOT set, but to token address is set.
            this.swapType_ = SwapType.ZIL_TO_TOKEN;
        } else {
            this.swapType_ = SwapType.UNKNOWN;
        }

        if (!this.zilswapDexAddressBase16_) {
            this.swapType_ = SwapType.INVALID_ZILSWAP_DEX_ADDRESS;
        }
        if (!this.gasLimit_) {
            this.swapType_ = SwapType.INVALID_GAS_LIMIT;
        }
        if (!this.deadlineBlock_) {
            this.swapType_ = SwapType.INVALID_DEADLINE_BLOCK;
        }
    }

    async swap() {
        if (this.swapType_ === SwapType.TOKEN_TO_ZIL) {
            return this.swapExactTokensForZil();
        } else if (this.swapType_ === SwapType.ZIL_TO_TOKEN) {
            return this.swapExactZilForTokens();
        } else if (this.swapType_ === SwapType.TOKEN_TO_TOKEN) {
            return this.swapExactTokensForTokens();
        }
        console.log('SwapTxnWrapper.swap() failed!', this.swapType_);
        return this.swapType_;
    }

    /** Private method. */
    async swapExactTokensForZil() {
        try {
            console.log('Swap tokens to ZIL: ',
                this.zilswapDexAddressBase16_,
                this.fromTokenContractAddressBase16_,
                this.fromExactAmountQa_,
                this.toMinAmountQa_,
                this.deadlineBlock_,
                window.zilPay.wallet.defaultAccount.base16,
                GAS_PRICE,
                this.gasLimit_);

            return window.zilPay.contracts.at(this.zilswapDexAddressBase16_).call(
                'SwapExactTokensForZIL',
                [{
                        vname: 'token_address',
                        type: 'ByStr20',
                        value: this.fromTokenContractAddressBase16_,
                    },
                    {
                        vname: 'token_amount',
                        type: 'Uint128',
                        value: this.fromExactAmountQa_.toString(),
                    }, {
                        vname: 'min_zil_amount',
                        type: 'Uint128',
                        value: this.toMinAmountQa_.toString(),
                    }, {
                        vname: 'deadline_block',
                        type: 'BNum',
                        value: this.deadlineBlock_.toString(),
                    }, {
                        vname: 'recipient_address',
                        type: 'ByStr20',
                        value: window.zilPay.wallet.defaultAccount.base16,
                    },
                ], {
                    amount: 0,
                    gasPrice: GAS_PRICE,
                    gasLimit: this.gasLimit_,
                }
            );

        } catch (err) {
            console.log(err);
        }
    }

    async swapExactZilForTokens() {
        try {
            console.log('Swap tokens to ZIL: ',
                this.zilswapDexAddressBase16_,
                this.fromExactAmountQa_,
                this.toTokenContractAddressBase16_,
                this.toMinAmountQa_,
                this.deadlineBlock_,
                window.zilPay.wallet.defaultAccount.base16,
                GAS_PRICE,
                this.gasLimit_);

            return window.zilPay.contracts.at(this.zilswapDexAddressBase16_).call(
                'SwapExactZILForTokens',
                [{
                        vname: 'token_address',
                        type: 'ByStr20',
                        value: this.toTokenContractAddressBase16_,
                    },
                    {
                        vname: 'min_token_amount',
                        type: 'Uint128',
                        value: this.toMinAmountQa_.toString(),
                    },
                    {
                        vname: 'deadline_block',
                        type: 'BNum',
                        value: this.deadlineBlock_.toString(),
                    },
                    {
                        vname: 'recipient_address',
                        type: 'ByStr20',
                        value: window.zilPay.wallet.defaultAccount.base16,
                    },
                ], {
                    amount: this.fromExactAmountQa_,
                    gasPrice: GAS_PRICE,
                    gasLimit: this.gasLimit_,
                }
            );

        } catch (err) {
            console.log(err);
        }
    }

    async swapExactTokensForTokens() {
        try {
            console.log('Swap tokens to tokens: ',
                this.zilswapDexAddressBase16_,
                this.fromTokenContractAddressBase16_,
                this.fromExactAmountQa_,
                this.toTokenContractAddressBase16_,
                this.toMinAmountQa_,
                this.deadlineBlock_,
                window.zilPay.wallet.defaultAccount.base16,
                GAS_PRICE,
                this.gasLimit_);

            return window.zilPay.contracts.at(this.zilswapDexAddressBase16_).call(
                'SwapExactTokensForTokens',
                [{
                        vname: 'token0_address',
                        type: 'ByStr20',
                        value: this.fromTokenContractAddressBase16_,
                    },
                    {
                        vname: 'token1_address',
                        type: 'ByStr20',
                        value: this.toTokenContractAddressBase16_,
                    },
                    {
                        vname: 'token0_amount',
                        type: 'Uint128',
                        value: this.fromExactAmountQa_.toString(),
                    },
                    {
                        vname: 'min_token1_amount',
                        type: 'Uint128',
                        value: this.toMinAmountQa_.toString(),
                    },
                    {
                        vname: 'deadline_block',
                        type: 'BNum',
                        value: this.deadlineBlock_.toString(),
                    },
                    {
                        vname: 'recipient_address',
                        type: 'ByStr20',
                        value: window.zilPay.wallet.defaultAccount.base16,
                    },
                ], {
                    amount: 0,
                    gasPrice: GAS_PRICE,
                    gasLimit: this.gasLimit_,
                }
            );

        } catch (err) {
            console.log(err);
        }
    }
}

if (typeof exports !== 'undefined') {
    exports.SwapTxnWrapper = SwapTxnWrapper;
    exports.SwapType = SwapType;
}