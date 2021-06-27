const TokenSelectorType = Object.freeze({
    "UNKNOWN": 0,
    "FROM": 1,
    "TO": 2,
});

const LOCAL_STORAGE_SWAP_HISTORY_KEY = "swap_history";

const GAS_PRICE = 2000000000; // Hardcoded current gas price
const ZILSWAP_LP_FEE_RATIO = 0.003;

const SELECT_TOKEN_STRING = "Select token";
const DANGER_EXTREME_PRICE_IMPACT_STRING = 'Danger! Amount specified is having extremely high price impact!';
const REQUESTED_AMOUNT_LARGER_THAN_POOL_STRING = 'Requested amount is larger than available pool.';
const WALLET_IS_NOT_CONNECTED_STRING = 'Wallet is not connected.';

/** A class to represent swap box status.  */
class SwapStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexStatus, /* nullable= */ walletBalanceStatus) {
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition

        // Private variable
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;
        this.walletBalanceStatus_ = walletBalanceStatus;

        // Private derived variable
        this.currentTokenSelectorType_ = TokenSelectorType.UNKNOWN;
        this.currentEstimatedTokenType_ = TokenSelectorType.UNKNOWN;

        this.fromTokenTicker_ = null;
        this.fromTokenWalletBalance_ = null;
        this.fromTokenAmount_ = null;

        this.toTokenTicker_ = null;
        this.toTokenWalletBalance_ = null;
        this.toTokenAmount_ = null;

        // Default values, do not change
        this.defaultSlippageTolerancePercent_ = 1;
        this.defaultTransactionDeadlineMins_ = 3;
        this.defaultGasLimitZil_ = 10;

        // Settings
        this.slippageTolerancePercent_ = this.defaultSlippageTolerancePercent_;
        this.transactionDeadlineMins_ = this.defaultTransactionDeadlineMins_;
        this.gasLimitZil_ = this.defaultGasLimitZil_;

        // Potential swap txn object
        this.swapTxnToBeExecuted_ = null;
        this.latestBlockNum_ = null;

        // Transaction Hash
        this.pendingTxnHashMap_ = {};
    }


    /** ------------- Start Swap History local storage methods ------------------- */

    clearSwapHistoryFromLocalStorage() {
        this.resetViewSwapHistory();

        let walletAddressBase16 = this.walletBalanceStatus_.getWalletAddressBase16();
        if (!walletAddressBase16) {
            return;
        }
        walletAddressBase16 = walletAddressBase16.toLowerCase();

        let swapHistoryLocalStorage = localStorage.getItem(LOCAL_STORAGE_SWAP_HISTORY_KEY);
        if (!swapHistoryLocalStorage) {
            return;
        }

        let swapHistoryMap = JSON.parse(swapHistoryLocalStorage);
        if (!swapHistoryMap[walletAddressBase16]) {
            return;
        }

        delete swapHistoryMap[walletAddressBase16];
        localStorage.setItem(LOCAL_STORAGE_SWAP_HISTORY_KEY, JSON.stringify(swapHistoryMap));
    }

    loadSwapHistoryFromLocalStorage(walletAddressBase16) {
        if (!walletAddressBase16) {
            return;
        }

        let swapHistoryLocalStorage = localStorage.getItem(LOCAL_STORAGE_SWAP_HISTORY_KEY);
        if (!swapHistoryLocalStorage) {
            return;
        }

        let swapHistoryMap = JSON.parse(swapHistoryLocalStorage);
        if (!swapHistoryMap[walletAddressBase16]) {
            return;
        }

        let swapHistoryArr = swapHistoryMap[walletAddressBase16];
        let swapHistoryArrLength = swapHistoryArr.length;
        for (let i = 0; i < swapHistoryArrLength; i++) {
            this.bindViewAddSwapHistory(swapHistoryArr[i].TxnHash, swapHistoryArr[i].TxnDescription, swapHistoryArr[i].TxnTimestamp);
        }
    }

    addSwapHistoryToLocalStorage(walletAddressBase16LowerCase, txnHash, txnDescription) {
        let dateTimestampNow = new Date().toLocaleTimeString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        let currSwapHistoryObject = {
            "TxnHash": txnHash,
            "TxnDescription": txnDescription,
            "TxnTimestamp": dateTimestampNow
        };
        this.bindViewAddSwapHistory(currSwapHistoryObject.TxnHash, currSwapHistoryObject.TxnDescription, currSwapHistoryObject.TxnTimestamp);

        let swapHistoryMap = {}

        let swapHistoryLocalStorage = localStorage.getItem(LOCAL_STORAGE_SWAP_HISTORY_KEY);
        if (swapHistoryLocalStorage) {
            swapHistoryMap = JSON.parse(swapHistoryLocalStorage);
        }
        if (!swapHistoryMap[walletAddressBase16LowerCase]) {
            swapHistoryMap[walletAddressBase16LowerCase] = [];
        }
        swapHistoryMap[walletAddressBase16LowerCase].push(currSwapHistoryObject);

        localStorage.setItem(LOCAL_STORAGE_SWAP_HISTORY_KEY, JSON.stringify(swapHistoryMap));
    }

    addSwapSubmittedTxn(walletAddressBase16LowerCase, txnHash, txnDescription) {
        this.pendingTxnHashMap_[txnHash] = txnDescription;
        this.bindViewAddSubmittedTransaction(txnHash, txnDescription);
        this.addSwapHistoryToLocalStorage(walletAddressBase16LowerCase, txnHash, txnDescription);
    }

    /** ------------- End Swap History local storage methods ------------------- */


    /** ------------- Start onChange listener callbacks ------------------- */
    onNewBlockStatusChange(blockNum, txnHashArr) {
        // Try to consume the block Num
        try {
            let blockNumInt = parseInt(blockNum);
            this.latestBlockNum_ = blockNumInt;
        } catch (err) {
            console.log(err);
        }

        // Consume the txnHashArray
        try {
            let pendingTxnHashCount = 0;
            for (let hash in this.pendingTxnHashMap_) {
                if (this.pendingTxnHashMap_[hash]) {
                    pendingTxnHashCount++;
                }
            }
            if (pendingTxnHashCount <= 0) {
                return;
            }

            let txnHashArrLength = txnHashArr.length;
            for (let i = 0; i < txnHashArrLength; i++) {
                let txnHashInnerArrLength = txnHashArr[i].length;
                for (let j = 0; j < txnHashInnerArrLength; j++) {
                    let currentHash = txnHashArr[i][j].toLowerCase();
                    if (this.pendingTxnHashMap_[currentHash]) {
                        // Change loading spinner to a check icon
                        this.bindViewCompletedTransaction(currentHash);

                        // Remove the txn from pending
                        delete this.pendingTxnHashMap_[currentHash];
                        pendingTxnHashCount--;

                        console.log(currentHash, "is completed!");
                    }

                    // If no more pending txn, no need to iterate.
                    if (pendingTxnHashCount <= 0) {
                        return;
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    onZilswapDexStatusChange() {
        // Compute swap rate from amount to amount if set
        this.computeAndBindViewFromTokenAmountFiat();

        if (this.currentEstimatedTokenType_ === TokenSelectorType.FROM) {
            this.calculateFromTokenAmount();
        } else {
            this.calculateToTokenAmount();
        }
    }

    onCoinPriceStatusChange() {
        // Compute from token price in fiat
        this.computeAndBindViewFromTokenAmountFiat();
    }

    onWalletBalanceStatusChange() {
        // Show from token balance
        this.computeAndBindViewWalletBalance();
    }
    /** ------------- End onChange listener callbacks ------------------- */

    reset() {
        this.swapTxnToBeExecuted_ = null;
        this.pendingTxnHashMap_ = {};

        this.closeAllModals();
        this.resetViewSwapHistory();
        this.resetViewSubmittedTransaction();
    }

    /** ------------- Start token selector and computation ------------------- */
    openFromTokenSelector() {
        this.currentTokenSelectorType_ = TokenSelectorType.FROM;
    }

    openToTokenSelector() {
        this.currentTokenSelectorType_ = TokenSelectorType.TO;
    }

    dismissTokenSelectorWithoutSave() {
        this.currentTokenSelectorType_ = TokenSelectorType.UNKNOWN;
    }

    setTokenSelector(coinSymbol) {
        // Save to local variable and reset immediately.
        let currentTokenType = this.currentTokenSelectorType_;
        this.currentTokenSelectorType_ = TokenSelectorType.UNKNOWN;

        if (currentTokenType !== TokenSelectorType.FROM && currentTokenType !== TokenSelectorType.TO) {
            console.warn("Invalid TokenSelectorType: ", currentTokenType);
            return;
        }

        if (!coinSymbol) {
            if (currentTokenType === TokenSelectorType.FROM) {
                this.resetViewFromToken();
            } else if (currentTokenType === TokenSelectorType.TO) {
                this.resetViewToToken();
            }
            return;
        }

        // Get token logo src
        let tokenLogoSrc = '';
        if (coinSymbol.toUpperCase() === 'ZIL') {
            tokenLogoSrc = 'https://meta.viewblock.io/ZIL/logo';
        } else if (this.zrcTokenPropertiesListMap_[coinSymbol]) {
            tokenLogoSrc = this.zrcTokenPropertiesListMap_[coinSymbol].logo_url;
        } else {
            // Invalid coin
            console.warn("Invalid coin selected!");
            return;
        }

        let isCurrentDark = $("html").hasClass("dark-mode");
        if (isCurrentDark) {
            tokenLogoSrc += '?t=dark';
        }

        // Compute necessary data
        if (currentTokenType === TokenSelectorType.FROM) {
            this.fromTokenTicker_ = coinSymbol;
            this.bindViewFromToken(tokenLogoSrc, this.fromTokenTicker_);
            this.computeAndBindViewFromTokenAmountFiat();
        } else if (currentTokenType === TokenSelectorType.TO) {
            this.toTokenTicker_ = coinSymbol;
            this.bindViewToToken(tokenLogoSrc, this.toTokenTicker_);
        }
        this.bindViewDisableSelectedTokenListRow(this.fromTokenTicker_, this.toTokenTicker_);
        this.computeAndBindViewWalletBalance();

        if (this.fromTokenAmount_) {
            this.calculateToTokenAmount();
        } else if (this.toTokenAmount_) {
            this.calculateFromTokenAmount();
        }
    }

    toggleTokenDirection() {
        let currentFromTokenTicker = this.fromTokenTicker_;
        let currentFromTokenAmount = this.fromTokenAmount_;

        let currentToTokenTicker = this.toTokenTicker_;
        let currentToTokenAmount = this.toTokenAmount_;

        let currentEstimatedTokenType = this.currentEstimatedTokenType_;

        this.fromTokenTicker_ = null;
        this.fromTokenWalletBalance_ = null;
        this.fromTokenAmount_ = null;

        this.toTokenTicker_ = null;
        this.toTokenWalletBalance_ = null;
        this.toTokenAmount_ = null;

        this.currentEstimatedTokenType_ = TokenSelectorType.UNKNOWN;

        // Swap the token symbols first
        this.toTokenTicker_ = currentFromTokenTicker;
        this.openToTokenSelector();
        this.setTokenSelector(this.toTokenTicker_);

        this.fromTokenTicker_ = currentToTokenTicker;
        this.openFromTokenSelector();
        this.setTokenSelector(this.fromTokenTicker_);

        if (currentEstimatedTokenType === TokenSelectorType.FROM) {
            if (!currentToTokenAmount) {
                currentToTokenAmount = 0;
            }
            this.bindViewFromTokenAmount(currentToTokenAmount);
            this.processFromTokenAmount(currentToTokenAmount);
        } else {
            if (!currentFromTokenAmount) {
                currentFromTokenAmount = 0;
            }
            this.bindViewToTokenAmount(currentFromTokenAmount);
            this.processToTokenAmount(currentFromTokenAmount);
        }
    }

    computeAndBindViewWalletBalance() {
        if (!this.walletBalanceStatus_ || !this.walletBalanceStatus_.isWalletAddressSet()) {
            return;
        }

        // Get wallet balance
        if (this.fromTokenTicker_) {
            this.fromTokenWalletBalance_ = this.walletBalanceStatus_.getTokenBalance(this.fromTokenTicker_);
            if (!this.fromTokenWalletBalance_) {
                this.bindViewFromTokenBalance('0');
            } else {
                this.bindViewFromTokenBalance(this.fromTokenWalletBalance_);
            }
        }

        if (this.toTokenTicker_) {
            this.toTokenWalletBalance_ = this.walletBalanceStatus_.getTokenBalance(this.toTokenTicker_);
            if (!this.toTokenWalletBalance_) {
                this.bindViewToTokenBalance('0');
            } else {
                this.bindViewToTokenBalance(this.toTokenWalletBalance_);
            }
        }
    }

    setMaxWalletBalanceFromTokenAmount() {
        if (this.fromTokenWalletBalance_) {
            this.bindViewFromTokenAmount(this.fromTokenWalletBalance_);
            this.processFromTokenAmount(this.fromTokenWalletBalance_);
        }
    }

    processFromTokenAmount(fromAmount) {
        this.fromTokenAmount_ = parseFloat(fromAmount);
        if (!this.fromTokenAmount_) {
            this.fromTokenAmount_ = 0;
            this.toTokenAmount_ = 0;
            this.bindViewFromTokenAmountFiat('0');
            this.bindViewToTokenAmount('');
            this.resetViewTokenPriceFinal();
            this.resetViewPopOverInformation();
            this.checkValidityBindViewSwapButton();
        }
        this.computeAndBindViewFromTokenAmountFiat();
        this.calculateToTokenAmount();
    }

    computeAndBindViewFromTokenAmountFiat() {
        if (!this.coinPriceStatus_) {
            return;
        }
        if (!this.fromTokenTicker_ || !this.fromTokenAmount_) {
            return;
        }

        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        let fromTokenAmountFiat = 0;
        if (this.fromTokenTicker_ === 'ZIL') {
            fromTokenAmountFiat = 1.0 * zilPriceInFiatFloat * this.fromTokenAmount_;
        } else if (this.zilswapDexStatus_) {
            let zrcPriceInZil = this.zilswapDexStatus_.getZrcPriceInZil(this.fromTokenTicker_);
            if (zrcPriceInZil) {
                fromTokenAmountFiat = 1.0 * zilPriceInFiatFloat * zrcPriceInZil * this.fromTokenAmount_;
            }
        }

        let fromTokenAmountFiatString = commafyNumberToString(fromTokenAmountFiat, decimals);
        this.bindViewFromTokenAmountFiat(fromTokenAmountFiatString);
    }

    calculateToTokenAmount() {
        if (!this.fromTokenTicker_ || !this.fromTokenAmount_ || !this.toTokenTicker_) {
            return;
        }
        this.resetViewTokenErrorState();
        this.currentEstimatedTokenType_ = TokenSelectorType.TO;

        let fromTokenAmountAfterFee = (1.0 - ZILSWAP_LP_FEE_RATIO) * this.fromTokenAmount_;
        let toTokenAmount = 0;
        let lpFeeZilAmount = null;
        let idealPrice = 0;

        if (this.fromTokenTicker_ === 'ZIL') {
            // ZIL to ZRC
            let zilswapSinglePairPublicStatus = this.zilswapDexStatus_.getZilswapPairPublicStatus(this.toTokenTicker_);
            if (!zilswapSinglePairPublicStatus) {
                return;
            }
            idealPrice = 1.0 / zilswapSinglePairPublicStatus.zrcTokenPriceInZil;

            if (fromTokenAmountAfterFee >= zilswapSinglePairPublicStatus.totalPoolZilAmount) {
                this.bindViewFromTokenErrorState(DANGER_EXTREME_PRICE_IMPACT_STRING);
            }

            toTokenAmount = (1.0 * fromTokenAmountAfterFee * zilswapSinglePairPublicStatus.totalPoolZrcTokenAmount) / (zilswapSinglePairPublicStatus.totalPoolZilAmount + fromTokenAmountAfterFee);
        } else if (this.toTokenTicker_ === 'ZIL') {
            // ZRC to ZIL
            let zilswapSinglePairPublicStatus = this.zilswapDexStatus_.getZilswapPairPublicStatus(this.fromTokenTicker_);
            if (!zilswapSinglePairPublicStatus) {
                return;
            }
            idealPrice = zilswapSinglePairPublicStatus.zrcTokenPriceInZil;

            if (fromTokenAmountAfterFee >= zilswapSinglePairPublicStatus.totalPoolZrcTokenAmount) {
                this.bindViewFromTokenErrorState(DANGER_EXTREME_PRICE_IMPACT_STRING);
            }

            toTokenAmount = (1.0 * fromTokenAmountAfterFee * zilswapSinglePairPublicStatus.totalPoolZilAmount) / (zilswapSinglePairPublicStatus.totalPoolZrcTokenAmount + fromTokenAmountAfterFee);
        } else {
            // ZRC to ZRC

            // ZRC to ZIL first
            let zilswapSinglePairPublicStatus1 = this.zilswapDexStatus_.getZilswapPairPublicStatus(this.fromTokenTicker_);
            if (!zilswapSinglePairPublicStatus1) {
                return;
            }
            let intermediateZilAmount = (1.0 * fromTokenAmountAfterFee * zilswapSinglePairPublicStatus1.totalPoolZilAmount) / (zilswapSinglePairPublicStatus1.totalPoolZrcTokenAmount + fromTokenAmountAfterFee);
            intermediateZilAmount = (1.0 - ZILSWAP_LP_FEE_RATIO) * intermediateZilAmount;
            lpFeeZilAmount = ZILSWAP_LP_FEE_RATIO * intermediateZilAmount;

            if (fromTokenAmountAfterFee >= zilswapSinglePairPublicStatus1.totalPoolZrcTokenAmount) {
                this.bindViewFromTokenErrorState(DANGER_EXTREME_PRICE_IMPACT_STRING);
            }

            // then ZIL to ZRC
            let zilswapSinglePairPublicStatus2 = this.zilswapDexStatus_.getZilswapPairPublicStatus(this.toTokenTicker_);
            if (!zilswapSinglePairPublicStatus2) {
                return;
            }
            idealPrice = 1.0 * zilswapSinglePairPublicStatus1.zrcTokenPriceInZil / zilswapSinglePairPublicStatus2.zrcTokenPriceInZil;

            if (intermediateZilAmount >= zilswapSinglePairPublicStatus2.totalPoolZilAmount) {
                this.bindViewFromTokenErrorState(DANGER_EXTREME_PRICE_IMPACT_STRING);
            }

            toTokenAmount = (1.0 * intermediateZilAmount * zilswapSinglePairPublicStatus2.totalPoolZrcTokenAmount) / (zilswapSinglePairPublicStatus2.totalPoolZilAmount + intermediateZilAmount);
        }
        this.toTokenAmount_ = toTokenAmount;
        this.bindViewToTokenAmount(this.toTokenAmount_);

        // Compute all the information for the info popover
        let currentPrice = 1.0 * this.toTokenAmount_ / this.fromTokenAmount_;
        let lpFeeTokenAmount = ZILSWAP_LP_FEE_RATIO * this.fromTokenAmount_;

        let minimumReceivedAmountString = this.computeMinimumReceivedAmountString(this.toTokenAmount_, this.toTokenTicker_, this.slippageTolerancePercent_);
        let slippageTolerancePercentString = this.slippageTolerancePercent_.toFixed(1);
        let priceImpactPercentString = this.computePriceImpactPercentString(currentPrice, idealPrice);
        let liquidityProviderFeeAmountString = this.getLiquidityProviderFeeAmountString(lpFeeTokenAmount, lpFeeZilAmount, this.fromTokenTicker_);

        this.bindViewPopOverInformation(minimumReceivedAmountString, slippageTolerancePercentString, priceImpactPercentString, liquidityProviderFeeAmountString, this.fromTokenTicker_);

        // Compute token price and inverse
        let tokenPriceFinalString = this.computeTokenPriceString(currentPrice, this.toTokenTicker_, this.fromTokenTicker_);
        let tokenPriceInverseFinalString = this.computeTokenPriceInverseString(currentPrice, this.toTokenTicker_, this.fromTokenTicker_);
        this.bindViewTokenPriceFinal(tokenPriceFinalString, tokenPriceInverseFinalString);

        this.checkValidityBindViewSwapButton();
    }

    processToTokenAmount(toAmount) {
        this.toTokenAmount_ = parseFloat(toAmount);
        if (!this.toTokenAmount_) {
            this.fromTokenAmount_ = 0;
            this.toTokenAmount_ = 0;
            this.bindViewFromTokenAmount('');
            this.bindViewFromTokenAmountFiat('0');
            this.resetViewTokenPriceFinal();
            this.resetViewPopOverInformation();
            this.checkValidityBindViewSwapButton();
        }
        this.calculateFromTokenAmount();
    }

    /** Private, can only be called by processToTokenAmount(). */
    calculateFromTokenAmount() {
        if (!this.fromTokenTicker_ || !this.toTokenAmount_ || !this.toTokenTicker_) {
            return;
        }
        this.resetViewTokenErrorState()
        this.currentEstimatedTokenType_ = TokenSelectorType.FROM;

        let fromTokenAmount = 0;
        let idealPrice = 0;
        let lpFeeZilAmount = null;

        if (this.fromTokenTicker_ === 'ZIL') {
            // ZIL to ZRC
            let zilswapSinglePairPublicStatus = this.zilswapDexStatus_.getZilswapPairPublicStatus(this.toTokenTicker_);
            if (!zilswapSinglePairPublicStatus) {
                return;
            }
            idealPrice = 1.0 / zilswapSinglePairPublicStatus.zrcTokenPriceInZil;

            if (this.toTokenAmount_ >= zilswapSinglePairPublicStatus.totalPoolZrcTokenAmount) {
                this.bindViewToTokenErrorState(REQUESTED_AMOUNT_LARGER_THAN_POOL_STRING);
                this.bindViewFromTokenAmount('');
                this.bindViewFromTokenAmountFiat('0');
                return;
            }

            fromTokenAmount = (1.0 * this.toTokenAmount_ * zilswapSinglePairPublicStatus.totalPoolZilAmount) / (zilswapSinglePairPublicStatus.totalPoolZrcTokenAmount - this.toTokenAmount_);
        } else if (this.toTokenTicker_ === 'ZIL') {
            // ZRC to ZIL
            let zilswapSinglePairPublicStatus = this.zilswapDexStatus_.getZilswapPairPublicStatus(this.fromTokenTicker_);
            if (!zilswapSinglePairPublicStatus) {
                return;
            }
            idealPrice = zilswapSinglePairPublicStatus.zrcTokenPriceInZil;

            if (this.toTokenAmount_ >= zilswapSinglePairPublicStatus.totalPoolZilAmount) {
                this.bindViewToTokenErrorState(REQUESTED_AMOUNT_LARGER_THAN_POOL_STRING);
                this.bindViewFromTokenAmount('');
                this.bindViewFromTokenAmountFiat('0');
                return;
            }

            fromTokenAmount = (1.0 * this.toTokenAmount_ * zilswapSinglePairPublicStatus.totalPoolZrcTokenAmount) / (zilswapSinglePairPublicStatus.totalPoolZilAmount - this.toTokenAmount_);
        } else {
            // ZRC to ZRC

            // ZRC to ZIL first
            let zilswapSinglePairPublicStatus1 = this.zilswapDexStatus_.getZilswapPairPublicStatus(this.toTokenTicker_);
            if (!zilswapSinglePairPublicStatus1) {
                return;
            }
            let intermediateZilAmount = (1.0 * this.toTokenAmount_ * zilswapSinglePairPublicStatus1.totalPoolZilAmount) / (zilswapSinglePairPublicStatus1.totalPoolZrcTokenAmount - this.toTokenAmount_);
            intermediateZilAmount = (1.0 / (1.0 - ZILSWAP_LP_FEE_RATIO)) * intermediateZilAmount;
            lpFeeZilAmount = ZILSWAP_LP_FEE_RATIO * intermediateZilAmount;

            if (this.toTokenAmount_ >= zilswapSinglePairPublicStatus1.totalPoolZrcTokenAmount) {
                this.bindViewToTokenErrorState(REQUESTED_AMOUNT_LARGER_THAN_POOL_STRING);
                this.bindViewFromTokenAmount('');
                this.bindViewFromTokenAmountFiat('0');
                return;
            }

            // then ZIL to ZRC
            let zilswapSinglePairPublicStatus2 = this.zilswapDexStatus_.getZilswapPairPublicStatus(this.fromTokenTicker_);
            if (!zilswapSinglePairPublicStatus2) {
                return;
            }
            idealPrice = 1.0 * zilswapSinglePairPublicStatus2.zrcTokenPriceInZil / zilswapSinglePairPublicStatus1.zrcTokenPriceInZil;


            if (intermediateZilAmount >= zilswapSinglePairPublicStatus2.totalPoolZilAmount) {
                this.bindViewToTokenErrorState(REQUESTED_AMOUNT_LARGER_THAN_POOL_STRING);
                this.bindViewFromTokenAmount('');
                this.bindViewFromTokenAmountFiat('0');
                return;
            }

            fromTokenAmount = (1.0 * intermediateZilAmount * zilswapSinglePairPublicStatus2.totalPoolZrcTokenAmount) / (zilswapSinglePairPublicStatus2.totalPoolZilAmount - intermediateZilAmount);
        }

        // Compute final fromToken amount after fee
        let fromTokenAmountAfterFee = (1.0 / (1.0 - ZILSWAP_LP_FEE_RATIO)) * fromTokenAmount;
        this.fromTokenAmount_ = fromTokenAmountAfterFee;

        this.bindViewFromTokenAmount(this.fromTokenAmount_);
        this.computeAndBindViewFromTokenAmountFiat();

        // Compute all the information for the info popover
        let currentPrice = 1.0 * this.toTokenAmount_ / this.fromTokenAmount_;
        let lpFeeTokenAmount = ZILSWAP_LP_FEE_RATIO * this.fromTokenAmount_;

        let minimumReceivedAmountString = this.computeMinimumReceivedAmountString(this.toTokenAmount_, this.toTokenTicker_, this.slippageTolerancePercent_);
        let slippageTolerancePercentString = this.slippageTolerancePercent_.toFixed(1);
        let priceImpactPercentString = this.computePriceImpactPercentString(currentPrice, idealPrice);
        let liquidityProviderFeeAmountString = this.getLiquidityProviderFeeAmountString(lpFeeTokenAmount, lpFeeZilAmount, this.fromTokenTicker_);

        this.bindViewPopOverInformation(minimumReceivedAmountString, slippageTolerancePercentString, priceImpactPercentString, liquidityProviderFeeAmountString, this.fromTokenTicker_);

        // Compute token price and inverse
        let tokenPriceFinalString = this.computeTokenPriceString(currentPrice, this.toTokenTicker_, this.fromTokenTicker_);
        let tokenPriceInverseFinalString = this.computeTokenPriceInverseString(currentPrice, this.toTokenTicker_, this.fromTokenTicker_);
        this.bindViewTokenPriceFinal(tokenPriceFinalString, tokenPriceInverseFinalString);

        // Check whether we should enable or disable swap button
        this.checkValidityBindViewSwapButton();
    }
    /** ------------- End token selector and commputation ------------------- */

    /** ------------- Start helper methods ------------------- */
    getLiquidityProviderFeeAmountString(tokenFeeAmount, zilFeeAmount, tokenTicker) {
        let amountString = convertNumberQaToDecimalString(tokenFeeAmount, /* decimals= */ 0) + ' ' + tokenTicker;
        if (zilFeeAmount) {
            amountString += ' + ' + convertNumberQaToDecimalString(zilFeeAmount, /* decimals= */ 0) + ' ZIL';
        }
        return amountString;
    }

    computePriceImpactPercentString(currentPrice, idealPrice) {
        let priceImpactPercent = (idealPrice - currentPrice) / idealPrice * 100.0;
        let priceImpactPercentString = convertNumberQaToDecimalString(priceImpactPercent, /* decimals= */ 0);
        return priceImpactPercentString;
    }

    computeTokenPriceString(token1ToToken2Ratio, token1Ticker, token2Ticker) {
        let tokenPriceString = convertNumberQaToDecimalString(token1ToToken2Ratio, /* decimals= */ 0);
        if (!tokenPriceString) {
            tokenPriceString = '~0';
        }
        let tokenPriceFinalString = '1 ' + token2Ticker + ' = ' + tokenPriceString + ' ' + token1Ticker;
        return tokenPriceFinalString;
    }

    computeTokenPriceInverseString(token1ToToken2Ratio, token1Ticker, token2Ticker) {
        let tokenPriceString = convertNumberQaToDecimalString(1.0 / token1ToToken2Ratio, /* decimals= */ 0);
        if (!tokenPriceString) {
            tokenPriceString = '~0';
        }
        let tokenPriceFinalString = '1 ' + token1Ticker + ' = ' + tokenPriceString + ' ' + token2Ticker;
        return tokenPriceFinalString;
    }

    computeMinimumReceivedAmountString(tokenAmount, tokenTicker, slippageTolerancePercent) {
        let minimumReceivedAmount = tokenAmount * (1.0 - (slippageTolerancePercent / 100.0));
        let minimumReceivedAmountString = convertNumberQaToDecimalString(minimumReceivedAmount, /* decimals= */ 0) + ' ' + tokenTicker;
        return minimumReceivedAmountString;
    }
    /** ------------- End helper methods ------------------- */

    /** Final confirmation modal and data set before sending to blockchain */
    setConfirmationModal() {
        this.swapTxnToBeExecuted_ = null;

        // Calculate for real txn
        if (!this.zilswapDexStatus_ || !this.zilswapDexStatus_.zilswapDexAddressBase16_) {
            console.log('Swap confirmation modal, zilswapDexStatus_ error!');
            this.bindViewErrorConfirmationModal('Zilswap DEX Information is not available!');
            return;
        }

        // Compute gasLimit
        let gasPriceInZil = GAS_PRICE / Math.pow(10, 12);
        let gasLimit = Math.ceil(this.gasLimitZil_ / gasPriceInZil);
        if (!gasLimit) {
            console.log('Swap confirmation modal, gas limit error: ', gasLimit);
            this.bindViewErrorConfirmationModal('Invalid gas limit!');
            return;
        }

        // Compute txn deadline block
        let latestBlockNum = this.latestBlockNum_;
        if (!latestBlockNum) {
            console.log('Swap confirmation modal, blockchain status error: ', latestBlockNum);
            this.bindViewErrorConfirmationModal('Blockchain status not available!');
            return;
        }
        let transactionDeadlineNumBlocks = 1 + Math.ceil(this.transactionDeadlineMins_ * 2.0); // Assuming one block is 0.5 minute
        let deadlineBlock = Math.ceil(latestBlockNum + transactionDeadlineNumBlocks);
        if (deadlineBlock <= latestBlockNum) {
            console.log('Swap confirmation modal, deadline block num smaller or equal than currentBlockNum: ', latestBlockNum);
            this.bindViewErrorConfirmationModal('Deadline block is invalid!');
            return;
        }

        // Compute from exact amount
        if (!this.fromTokenTicker_) {
            console.log('Swap confirmation modal, from token not defined!');
            this.bindViewErrorConfirmationModal('From token not specified!');
            return;
        }
        let fromExactAmountQa = null;
        let fromExactAmount = null;
        let fromTokenContractAddressBase16 = null;
        if (this.fromTokenTicker_ === 'ZIL') {
            fromExactAmountQa = Math.floor(this.fromTokenAmount_ * Math.pow(10, 12));
            fromExactAmount = this.fromTokenAmount_.toFixed(12);
        } else {
            let tokenDecimals = this.zrcTokenPropertiesListMap_[this.fromTokenTicker_].decimals;
            fromExactAmountQa = Math.floor(this.fromTokenAmount_ * Math.pow(10, tokenDecimals));
            fromExactAmount = this.fromTokenAmount_.toFixed(tokenDecimals);

            fromTokenContractAddressBase16 = this.zrcTokenPropertiesListMap_[this.fromTokenTicker_].address_base16;
        }
        if (!fromExactAmountQa) {
            console.log('Swap confirmation modal, fromExactAmountQa status error: ', fromExactAmountQa);
            this.bindViewErrorConfirmationModal('Send amount is empty!');
            return;
        }

        // Compute to estimated and minimum amount to receive
        if (!this.toTokenTicker_) {
            console.log('Swap confirmation modal, to token not defined!');
            this.bindViewErrorConfirmationModal('To token not specified!');
            return;
        }
        let minReceiveAmount = this.toTokenAmount_ * (1.0 - (this.slippageTolerancePercent_ / 100.0));
        let toMinAmountQa = null;
        let toMinAmount = null;
        let toEstAmount = null;
        let toTokenContractAddressBase16 = null;

        if (this.toTokenTicker_ === 'ZIL') {
            toMinAmountQa = Math.floor(minReceiveAmount * Math.pow(10, 12));
            toMinAmount = minReceiveAmount.toFixed(12);
            toEstAmount = this.toTokenAmount_.toFixed(12);
        } else {
            let tokenDecimals = this.zrcTokenPropertiesListMap_[this.toTokenTicker_].decimals;
            toMinAmountQa = Math.floor(minReceiveAmount * Math.pow(10, tokenDecimals));
            toMinAmount = minReceiveAmount.toFixed(tokenDecimals);
            toEstAmount = this.toTokenAmount_.toFixed(tokenDecimals);

            toTokenContractAddressBase16 = this.zrcTokenPropertiesListMap_[this.toTokenTicker_].address_base16;
        }
        if (!toMinAmountQa) {
            console.log('Swap confirmation modal, toMinAmountQa status error: ', toMinAmountQa);
            this.bindViewErrorConfirmationModal('Min receive amount is too small or empty!');
            return;
        }

        // Create transaction
        this.swapTxnToBeExecuted_ = new SwapTxnWrapper(
            this.zilswapDexStatus_.zilswapDexAddressBase16_,
            gasLimit,
            deadlineBlock,
            fromExactAmountQa,
            fromTokenContractAddressBase16,
            toMinAmountQa,
            toTokenContractAddressBase16);

        let sendAmountString = fromExactAmount + ' ' + this.fromTokenTicker_;
        let receiveAmountString = toEstAmount + ' ' + this.toTokenTicker_;
        let minReceiveAmountString = toMinAmount + ' ' + this.toTokenTicker_;
        let transactionDeadlineMinsString = '~' + this.transactionDeadlineMins_ + ' mins' + ' (' + transactionDeadlineNumBlocks + ' blocks)';
        let gasLimitZilString = this.gasLimitZil_ + ' ZIL';

        this.bindViewConfirmationModal(sendAmountString, receiveAmountString, minReceiveAmountString, transactionDeadlineMinsString, gasLimitZilString);
    }

    /** ------------- Start execute txn to blockchain methods ------------------- */
    executeSwap() {
        if (!this.swapTxnToBeExecuted_) {
            console.warn("No swap txn pending to be executed!");
            return;
        }
        let self = this;

        this.swapTxnToBeExecuted_.swap()
            .then(function (data) {
                let walletAddressBase16Lower = 'unknown_wallet_address';
                if (self.walletBalanceStatus_.isWalletAddressSet()) {
                    walletAddressBase16Lower = self.walletBalanceStatus_.getWalletAddressBase16().toLowerCase();
                }
                let txnHash = 'unknown_hash';
                if (data.ID) {
                    txnHash = data.ID.toLowerCase();
                }
                let txnDescription = self.fromTokenTicker_ + " → " + self.toTokenTicker_;
                self.addSwapSubmittedTxn(walletAddressBase16Lower, txnHash, txnDescription);

                console.log("Swap is executed and sent to blockchain! ", txnHash);
            })
            .catch(function (err) {
                console.warn("Swap execution failed! ", err);
            });
    }

    increaseAllowanceToZilswapDex() {
        if (!this.fromTokenTicker_ || !this.gasLimitZil_ || !this.zilswapDexStatus_ || !this.zrcTokenPropertiesListMap_[this.fromTokenTicker_]) {
            return;
        }

        let gasPriceInZil = 1.0 * GAS_PRICE / Math.pow(10, 12);
        let gasLimit = Math.ceil(this.gasLimitZil_ / gasPriceInZil);

        let increaseAllowanceToken = new SwapTxnIncreaseAllowanceWrapper(
            this.zrcTokenPropertiesListMap_[this.fromTokenTicker_].address_base16,
            this.zilswapDexStatus_.zilswapDexAddressBase16_,
            gasLimit);

        let self = this;
        increaseAllowanceToken.increaseAllowance()
            .then(function (data) {
                self.walletBalanceStatus_.setTokenAllowanceNeedRefresh(self.fromTokenTicker_);

                let walletAddressBase16Lower = 'unknown_wallet_address';
                if (self.walletBalanceStatus_.isWalletAddressSet()) {
                    walletAddressBase16Lower = self.walletBalanceStatus_.getWalletAddressBase16().toLowerCase();
                }
                let txnHash = 'unknown_hash';
                if (data.ID) {
                    txnHash = data.ID.toLowerCase();
                }
                let txnDescription = "Approve " + self.fromTokenTicker_;
                self.addSwapSubmittedTxn(walletAddressBase16Lower, txnHash, txnDescription);

                console.log("Increase allowance to Zilswap DEX completed! ", txnHash);
            })
            .catch(function (err) {
                console.warn("Increase allowance to Zilswap DEX failed! ", err);
            });
    }
    /** ------------- End execute txn to blockchain methods ------------------- */

    /** ------------- Start settings related methods ------------------- */
    dismissSettingsWithoutSave() {
        // Set modal settings to current values
        this.bindViewSwapSettings(this.slippageTolerancePercent_, this.transactionDeadlineMins_, this.gasLimitZil_);
    }

    resetSettingsWithoutSave() {
        // Set modal settings to default values
        this.bindViewSwapSettings(this.defaultSlippageTolerancePercent_, this.defaultTransactionDeadlineMins_, this.defaultGasLimitZil_);
    }

    saveSettings(slippageTolerancePercent, transactionDeadlineMins, gasLimitZil) {
        if (parseFloat(slippageTolerancePercent)) {
            this.slippageTolerancePercent_ = parseFloat(slippageTolerancePercent);
        }
        if (parseFloat(transactionDeadlineMins)) {
            this.transactionDeadlineMins_ = parseFloat(transactionDeadlineMins);
        }
        if (parseFloat(gasLimitZil)) {
            this.gasLimitZil_ = parseFloat(gasLimitZil);
        }
        this.calculateToTokenAmount();
        this.bindViewSwapSettings(this.slippageTolerancePercent_, this.transactionDeadlineMins_, this.gasLimitZil_);
    }

    /** ------------- End settings related method ------------------- */

    closeAllModals() {
        $('#swap_token_settings_modal').modal('hide');
        $('#swap_token_picker_modal').modal('hide');
        $('#swap_token_confirmation_modal').modal('hide');
    }

    /** Set token selector as enabled or disabled based on current choice. */
    bindViewDisableSelectedTokenListRow(fromTokenTicker, toTokenTicker) {
        $('#ZIL_token_list_row').removeClass('disabled');
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            $('#' + ticker + '_token_list_row').removeClass('disabled');
        }
        if (fromTokenTicker) {
            $('#' + fromTokenTicker + '_token_list_row').addClass('disabled');
        }
        if (toTokenTicker) {
            $('#' + toTokenTicker + '_token_list_row').addClass('disabled');
        }
    }

    /** ------------- Bind view from token attributes ------------- */
    bindViewFromToken(tokenLogoSrc, ticker) {
        $('#swap_select_token_from_img').attr('src', tokenLogoSrc);
        $('#swap_select_token_from_img').show();
        $('#swap_select_token_from_ticker').text(ticker);
    }

    resetViewFromToken() {
        $('#swap_select_token_from_img').attr('src', '');
        $('#swap_select_token_from_img').hide();
        $('#swap_select_token_from_ticker').text(SELECT_TOKEN_STRING);
    }

    bindViewFromTokenBalance(balance) {
        $('#swap_token_from_balance').text(balance);
        $('#swap_token_from_balance_container').css('visibility', 'visible');
    }

    bindViewFromTokenAmount(fromAmount) {
        $('#swap_token_from_amount').val(fromAmount);
    }

    bindViewFromTokenAmountFiat(fromAmountFiat) {
        $('#swap_token_from_amount_fiat').text(fromAmountFiat);
        $('#swap_token_from_amount_fiat_container').css('visibility', 'visible');
    }

    /** ------------- Bind view to token attributes ------------- */
    bindViewToToken(tokenLogoSrc, ticker) {
        $('#swap_select_token_to_img').attr('src', tokenLogoSrc);
        $('#swap_select_token_to_img').show();
        $('#swap_select_token_to_ticker').text(ticker);
    }

    resetViewToToken() {
        $('#swap_select_token_to_img').attr('src', '');
        $('#swap_select_token_to_img').hide();
        $('#swap_select_token_to_ticker').text(SELECT_TOKEN_STRING);
    }

    bindViewToTokenBalance(balance) {
        $('#swap_token_to_balance').text(balance);
        $('#swap_token_to_balance_container').css('visibility', 'visible');
    }

    bindViewToTokenAmount(toTokenAmount) {
        $('#swap_token_to_amount').val(toTokenAmount);
    }

    /** ------------- Token price information ------------- */
    bindViewTokenPriceFinal(rateString, rateStringInverse) {
        $('#swap_token_final_rate').text(rateString);
        $('#swap_token_final_rate_inverse').text(rateStringInverse);
        $('#swap_token_final_rate').show();
        $('#swap_token_final_rate_inverse_button').show();
    }

    toggleViewTokenPriceFinal() {
        $('#swap_token_final_rate').toggle();
        $('#swap_token_final_rate_inverse').toggle();
    }

    resetViewTokenPriceFinal() {
        $('#swap_token_final_rate_inverse_button').hide();
        $('#swap_token_final_rate_inverse').hide();
        $('#swap_token_final_rate').show();
        $('#swap_token_final_rate').text('');
        $('#swap_token_final_rate_inverse').text('');
    }

    /** ------------- Popover information before the swap ------------- */
    bindViewPopOverInformation(minimumReceivedAmount, slippageTolerancePercent, priceImpactPercent, liquidityProviderFeeAmount) {
        $('#popover_minimum_received_amount').text(minimumReceivedAmount);
        $('#popover_slippage_tolerance_percent').text(slippageTolerancePercent);
        $('#popover_price_impact_percent').text(priceImpactPercent);
        $('#popover_liquidity_provider_fee_amount').text(liquidityProviderFeeAmount);
    }

    resetViewPopOverInformation() {
        $('#popover_minimum_received_amount').text('N.A.');
        $('#popover_slippage_tolerance_percent').text('N.A.');
        $('#popover_price_impact_percent').text('N.A.');
        $('#popover_liquidity_provider_fee_amount').text('N.A.');
    }

    /** ------------- Error state for from token and to token amount --------------- */
    bindViewFromTokenErrorState(errorStateMessage) {
        $('#swap_token_from_amount').attr('aria-invalid', 'true');
        $('#swap_error_message').text(errorStateMessage);
        $('#swap_error_message_container').show();
    }

    bindViewToTokenErrorState(errorStateMessage) {
        $('#swap_token_to_amount').attr('aria-invalid', 'true');
        $('#swap_error_message').text(errorStateMessage);
        $('#swap_error_message_container').show();
    }

    resetViewTokenErrorState() {
        $('#swap_token_from_amount').removeAttr('aria-invalid');
        $('#swap_token_to_amount').removeAttr('aria-invalid');
        $('#swap_error_message_container').hide();
        $('#swap_error_message').text('');
    }

    /** ------------- Swap final confirmation modal ---------------- */
    bindViewErrorConfirmationModal(errorMessage) {
        $('#swap_token_confirmation_error_message_container').show();
        $('#swap_token_confirmation_error_message').text(errorMessage);
        $('#swap_token_confirmation_container').hide();
        $('#swap_token_confirmation_confirm_button').addClass('disabled');
    }

    bindViewConfirmationModal(sendAmount, receiveAmount, minReceiveAmount, transactionDeadline, gasLimit) {
        $('#swap_token_confirmation_send_amount').text(sendAmount);
        $('#swap_token_confirmation_receive_amount').text(receiveAmount);
        $('#swap_token_confirmation_min_receive_amount').text(minReceiveAmount);
        $('#swap_token_confirmation_transaction_deadline').text(transactionDeadline);
        $('#swap_token_confirmation_gas_limit').text(gasLimit);

        $('#swap_token_confirmation_confirm_button').removeClass('disabled');
        $('#swap_token_confirmation_error_message_container').hide();
        $('#swap_token_confirmation_error_message').text('');
        $('#swap_token_confirmation_container').show();
    }

    /** Swap settings modal. */
    bindViewSwapSettings(slippageTolerancePercent, transactionDeadlineMins, gasLimitZil) {
        $('#slippage_tolerance_input').val(slippageTolerancePercent).removeAttr('aria-invalid').trigger('input');
        $('#transaction_deadline_input').val(transactionDeadlineMins).removeAttr('aria-invalid').trigger('input');
        $('#gas_limit_input').val(gasLimitZil).removeAttr('aria-invalid').trigger('input');
    }

    /** Bind view final big swap button with some logic. */
    checkValidityBindViewSwapButton() {
        $('#swap_error_message_2').text('');
        $('#swap_error_message_2_container').hide();

        $('#approve_button').addClass('disabled');
        $('#approve_button').hide();

        $('#swap_button').addClass('disabled');
        $('#swap_button').show();

        if (this.fromTokenTicker_ && this.toTokenTicker_ && this.fromTokenAmount_ && this.toTokenAmount_) {
            if (!this.walletBalanceStatus_ || !this.walletBalanceStatus_.isWalletAddressSet()) {
                $('#swap_error_message_2').text(WALLET_IS_NOT_CONNECTED_STRING);
                $('#swap_error_message_2_container').show();
                return;
            }
            let tokenAllowance = this.walletBalanceStatus_.getTokenAllowanceZilswapDex(this.fromTokenTicker_);
            if (!tokenAllowance) {
                $('#approve_button').removeClass('disabled');
                $('#approve_button').show();
                $('#swap_button').hide();

                let errorMessage = 'Please approve Zilswap DEX to spend your ' + this.fromTokenTicker_ + '.';
                $('#swap_error_message_2').text(errorMessage);
                $('#swap_error_message_2_container').show();
                return;
            } else if (tokenAllowance < this.fromTokenAmount_) {
                let errorMessage = 'Not enough allowance for Zilswap DEX to spend your ' + this.fromTokenTicker_ + '.';
                $('#swap_error_message_2').text(errorMessage);
                $('#swap_error_message_2_container').show();
                return;
            }
            if (!this.fromTokenWalletBalance_ || this.fromTokenWalletBalance_ < this.fromTokenAmount_) {
                let errorMessage = 'Insufficient ' + this.fromTokenTicker_ + ' balance.';
                $('#swap_error_message_2').text(errorMessage);
                $('#swap_error_message_2_container').show();
                return;
            }
            $('#swap_button').removeClass('disabled');
        }
    }

    /** ------------- Submitted txn list ---------------------- */

    getSubmittedTransactionElement(txnHash, txnDescription) {
        return "<tr>" +
            "<td id='" + txnHash + "_spinner' scope='row' style='text-align: left; white-space: nowrap; width: 1%;' >" +
            "<div class='spinner-grow spinner-grow-sm text-info' role='status'>" +
            "<span class='sr-only'>Loading...</span>" +
            "</div>" +
            "</td>" +
            "<td scope='row' style='text-align: left; white-space: nowrap; width: 1%;' >" +
            "<span>" + txnDescription + "</span>" +
            "</td>" +
            "<td scope='row' style='text-align: left; white-space: nowrap; width: 50%;'>" +
            "<a href='https://viewblock.io/zilliqa/tx/0x" + txnHash + "' target='_blank' style='color: var(--text-color);'>" +
            "<span class='swap-mini-button-box'><i class='fa fa-external-link mr-1'></i>ViewBlock</span>" +
            "</a>" +
            "</td>" +
            "</tr>";
    }

    bindViewAddSubmittedTransaction(txnHash, txnDescription) {
        $('#transaction_table_list').prepend(this.getSubmittedTransactionElement(txnHash, txnDescription));
        $('#transaction_table_container').show();
    }

    bindViewCompletedTransaction(txnHash) {
        $('#' + txnHash + '_spinner').empty().html("<i class='fa fa-check'></i>");
    }

    resetViewSubmittedTransaction() {
        $('#transaction_table_container').hide();
        $('#transaction_table_list').empty();
    }


    /** ------------- Swap history modal ---------------------- */

    getSwapHistoryTransactionElement(txnHash, txnDescription, txnTimestamp) {
        return "<tr>" +
            "<td scope='row' style='text-align: left; white-space: nowrap; width: 20%;' >" +
            "<span>" + txnTimestamp + "</span>" +
            "</td>" +
            "<td scope='row' style='text-align: left; white-space: nowrap; width: 20%;' >" +
            "<span>" + txnDescription + "</span>" +
            "</td>" +
            "<td scope='row' style='text-align: left; white-space: nowrap; width: 50%;'>" +
            "<a href='https://viewblock.io/zilliqa/tx/0x" + txnHash + "' target='_blank' style='color: var(--text-color);'>" +
            "<span class='swap-mini-button-box'><i class='fa fa-external-link mr-1'></i>ViewBlock</span>" +
            "</a>" +
            "</td>" +
            "</tr>";
    }

    bindViewAddSwapHistory(txnHash, txnDescription, txnTimestamp) {
        $('#swap_history_placeholder').hide();
        $('#swap_history_table_list').prepend(this.getSwapHistoryTransactionElement(txnHash, txnDescription, txnTimestamp));
    }

    resetViewSwapHistory() {
        $('#swap_history_table_list').empty();
        $('#swap_history_placeholder').show();
    }
}

if (typeof exports !== 'undefined') {
    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
        commafyNumberToString = FormattingUtils.commafyNumberToString;
    }

    if (typeof SwapTxnWrapper === 'undefined') {
        Stw = require('./swap_txn_wrapper.js');
        SwapTxnWrapper = Stw.SwapTxnWrapper;
    }

    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }

    if (typeof localStorage === 'undefined') {
        MockLocalStorage = require('../tests/mocks/mock_localstorage.js');
        localStorage = new MockLocalStorage.MockLocalStorage();
    }

    exports.SELECT_TOKEN_STRING = SELECT_TOKEN_STRING;
    exports.LOCAL_STORAGE_SWAP_HISTORY_KEY = LOCAL_STORAGE_SWAP_HISTORY_KEY;
    exports.DANGER_EXTREME_PRICE_IMPACT_STRING = DANGER_EXTREME_PRICE_IMPACT_STRING;
    exports.REQUESTED_AMOUNT_LARGER_THAN_POOL_STRING = REQUESTED_AMOUNT_LARGER_THAN_POOL_STRING;
    exports.WALLET_IS_NOT_CONNECTED_STRING = WALLET_IS_NOT_CONNECTED_STRING;
    exports.TokenSelectorType = TokenSelectorType;

    exports.SwapStatus = SwapStatus;
}