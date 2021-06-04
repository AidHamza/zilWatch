
/** A class to represent global wallet balance status.  */
class WalletBalanceStatus {
    
    constructor(zrcTokenPropertiesListMap, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexStatus, /* nullable= */ walletAddressBase16, /* nullable= */ zilBalanceData, /* nullable= */ zrcBalanceDataMap) {
        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;

        // Private variable
        this.walletAddressBase16_ = walletAddressBase16;
        this.zilBalanceData_ = zilBalanceData;
        this.zrcBalanceDataMap_ = {};
        if (zrcBalanceDataMap) {
            this.zrcBalanceDataMap_ = zrcBalanceDataMap;
        }

        // Private derived variable
        this.tokenBalanceMap_ = {};
    }

    /**
     * Callback method to be executed if any properties in zilswapDexStatus_ is changed.
     */
    onZilswapDexStatusChange() {
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            this.bindViewDataFiat(ticker);
        }
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        this.bindViewDataFiat('ZIL');
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            this.bindViewDataFiat(ticker);
        }
    }

    reset() {
        this.zilBalanceData_ = null;
        this.zrcBalanceDataMap_ = {};
        this.tokenBalanceMap_ = {};
    }

    setWalletAddressBase16(walletAddressBase16) {
        // Need to reset the attributes when wallet is changed.
        this.reset();
        this.walletAddressBase16_ = walletAddressBase16;
    }

    /**
     * Returns token balance in fiat, number data type.
     * 
     * Any error will result in returning null.
     */
    getTokenBalance(coinSymbol) {
        if (coinSymbol === 'ZIL') {
            return this.tokenBalanceMap_['ZIL'];
        }

        // If zrc token symbol is not supported.
        if (!this.zrcTokenPropertiesListMap_[coinSymbol]) {
            return null;
        }
        return this.tokenBalanceMap_[coinSymbol];
    }

    computeTokenBalanceMap(coinSymbol) {
        // If coinSymbol is ZIL, process here
        if (coinSymbol === 'ZIL') {
            if (this.zilBalanceData_ && this.zilBalanceData_.result && this.zilBalanceData_.result.balance) {
                let zilBalance = parseInt(this.zilBalanceData_.result.balance);
                if (!Number.isNaN(zilBalance)) {
                    this.tokenBalanceMap_['ZIL'] = zilBalance / Math.pow(10,12);
                }
            }
            return;
        }
        
        // ZRC tokens process here
        if (!this.zrcTokenPropertiesListMap_[coinSymbol]) {
            return;
        }
        if (this.zrcBalanceDataMap_ && this.zrcBalanceDataMap_[coinSymbol]) {
            let zrcBalanceData = this.zrcBalanceDataMap_[coinSymbol];
            if (zrcBalanceData && zrcBalanceData.result && zrcBalanceData.result.balances) {
                let zrcTokenBalance = parseInt(zrcBalanceData.result.balances[this.walletAddressBase16_]);
                if (!Number.isNaN(zrcTokenBalance)) {
                    this.tokenBalanceMap_[coinSymbol] = zrcTokenBalance / Math.pow(10, this.zrcTokenPropertiesListMap_[coinSymbol].decimals);
                }
            }
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

        beforeRpcCallback();
        let self = this;

        queryZilliqaApiAjax(
            /* method= */
            "GetBalance",
            /* params= */
            [this.walletAddressBase16_.substring(2)],
            /* successCallback= */
            function (data) {
                self.zilBalanceData_ = data;
                self.computeTokenBalanceMap('ZIL');
                self.bindViewIfDataExist('ZIL');
                self.bindViewDataFiat('ZIL');
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });

        
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let zrcTokenProperties = this.zrcTokenPropertiesListMap_[ticker];

            beforeRpcCallback();

            queryZilliqaApiAjax(
                /* method= */
                "GetSmartContractSubState",
                /* params= */
                [zrcTokenProperties.address_base16.substring(2), "balances", [this.walletAddressBase16_]],
                /* successCallback= */
                function (data) {
                    self.zrcBalanceDataMap_[ticker] = data;
                    self.computeTokenBalanceMap(ticker);
                    self.bindViewIfDataExist(ticker);
                    self.bindViewDataFiat(ticker);
                    onSuccessCallback();
                },
                /* errorCallback= */
                function () {
                    onErrorCallback();
                });
        }
    }

    bindViewIfDataExist(coinSymbol) {
        if (coinSymbol === 'ZIL') {
            let zilBalanceString = '0';
            let zilBalance = this.getTokenBalance('ZIL');
            if (zilBalance) {
                zilBalanceString = convertNumberQaToDecimalString(zilBalance, /* decimals= */ 0);
            }
            this.bindViewZilBalance(zilBalanceString);
            return;
        }

        let zrcBalance = this.getTokenBalance(coinSymbol);
        if (!zrcBalance) {
            return;
        }
        let zrcBalanceString = convertNumberQaToDecimalString(zrcBalance,  /* decimals= */ 0);
        if (!zrcBalanceString) {
            return;
        }
        this.bindViewZrcTokenWalletBalance(zrcBalanceString, coinSymbol);
    }

    bindViewDataFiat(coinSymbol) {
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');

        // Process ZIL
        if (coinSymbol === 'ZIL') {
            let zilBalance = this.getTokenBalance('ZIL');
            if (!zilBalance) {
                return;
            }
            let zilBalanceFiat = (zilPriceInFiatFloat * zilBalance);

            this.bindViewZilBalanceFiat(commafyNumberToString(zilBalanceFiat, decimals));

            // Set token wallet balance in fiat 24h ago
            if (zilPriceInFiat24hAgoFloat) {
                let zilBalanceFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zilBalance;
                let zilBalanceFiat24hAgoString = commafyNumberToString(zilBalanceFiat24hAgo, decimals);
                let zilBalanceFiatPercentChange24h = getPercentChange(zilBalanceFiat, zilBalanceFiat24hAgo).toFixed(1);
                this.bindViewZilBalanceFiat24hAgo(zilBalanceFiat24hAgoString, zilBalanceFiatPercentChange24h);
            }
            return;
        }

        // Process ZRC in ZIL
        let zrcBalance = this.getTokenBalance(coinSymbol);
        if (!zrcBalance) {
            return;
        }
        let zrcPairPublicStatus = this.zilswapDexStatus_.getZilswapPairPublicStatus(coinSymbol);
        if (!zrcPairPublicStatus) {
            return;
        }
        let zrcPriceInZil = zrcPairPublicStatus.zrcTokenPriceInZil;
        if (Number.isNaN(zrcPriceInZil)) {
            return;
        }

        let zrcBalanceInZil = 1.0 * zrcPriceInZil * zrcBalance;
        let zrcBalanceInZilString = convertNumberQaToDecimalString(zrcBalanceInZil, /* decimals= */ 0);
        this.bindViewZrcTokenWalletBalanceZil(zrcBalanceInZilString, coinSymbol);

        // Process ZRC in fiat
        let zrcBalanceFiat = 1.0 * zilPriceInFiatFloat * zrcBalanceInZil;
        let zrcBalanceFiatString = commafyNumberToString(zrcBalanceFiat, decimals);
        this.bindViewZrcTokenWalletBalanceFiat(zrcBalanceFiatString, coinSymbol);

        // Process ZRC in ZIL 24h ago
        let zrcPairPublicStatus24hAgo = this.zilswapDexStatus_.getZilswapPairPublicStatus24hAgo(coinSymbol);
        if (!zrcPairPublicStatus24hAgo) {
            return;
        }
        let zrcPriceInZil24hAgo = zrcPairPublicStatus24hAgo.zrcTokenPriceInZil;
        if (Number.isNaN(zrcPriceInZil24hAgo)) {
            return;
        }
        let zrcBalanceInZil24hAgo = 1.0 * zrcPriceInZil24hAgo * zrcBalance;
        let zrcBalanceInZil24hAgoString = convertNumberQaToDecimalString(zrcBalanceInZil24hAgo, /* decimals= */ 0);
        let zrcBalanceInZil24hAgoPercentChange = getPercentChange(zrcBalanceInZil, zrcBalanceInZil24hAgo);
        this.bindViewZrcTokenWalletBalanceZil24hAgo(zrcBalanceInZil24hAgoString, zrcBalanceInZil24hAgoPercentChange.toFixed(1), coinSymbol);

        // Process ZRC in fiat 24h ago
        if (!zilPriceInFiat24hAgoFloat || !zrcBalanceInZil24hAgo) {
            return;
        }
        let zrcBalanceInFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zrcBalanceInZil24hAgo;
        let zrcBalanceInFiat24hAgoString = commafyNumberToString(zrcBalanceInFiat24hAgo, decimals);
        let zrcBalanceInFiat24hAgoPercentChange = getPercentChange(zrcBalanceFiat, zrcBalanceInFiat24hAgo);
        this.bindViewZrcTokenWalletBalanceFiat24hAgo(zrcBalanceInFiat24hAgoString, zrcBalanceInFiat24hAgoPercentChange.toFixed(1), coinSymbol);
    }

    /** Private static method */
    bindViewZilBalance(zilBalance) {
        $('#zil_balance').text(zilBalance);
    }

    /** Private static method */
    bindViewZrcTokenWalletBalance(zrcTokenBalance, ticker) {
        $('#' + ticker + '_balance').text(zrcTokenBalance);
        $('#' + ticker + '_container').show();
    }

    /** Private static method */
    bindViewZilBalanceFiat24hAgo(zilBalanceFiat24hAgo, zilBalanceFiatPercentChange24h) {
        $('#zil_balance_fiat_24h_ago').text(zilBalanceFiat24hAgo);
        $('#zil_balance_fiat_percent_change_24h').text(zilBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#zil_balance_fiat_percent_change_24h_container', zilBalanceFiatPercentChange24h);
    }

    /** Private static method */
    bindViewZilBalanceFiat(zilBalanceFiat) {
        $('#zil_balance_fiat').text(zilBalanceFiat);
    }

    /** Private static method */
    bindViewZrcTokenWalletBalanceZil24hAgo(zrcBalanceZil24hAgo, zrcBalanceZilPercentChange24h, ticker) {
        $('#' + ticker + '_balance_zil_24h_ago').text(zrcBalanceZil24hAgo);
        $('#' + ticker + '_balance_zil_percent_change_24h').text(zrcBalanceZilPercentChange24h);
        bindViewPercentChangeColorContainer('#' + ticker + '_balance_zil_percent_change_24h_container', zrcBalanceZilPercentChange24h);
    }

    /** Private static method */
    bindViewZrcTokenWalletBalanceZil(zrcBalanceZil, ticker) {
        $('#' + ticker + '_balance_zil').text(zrcBalanceZil);
    }

    /** Private static method */
    bindViewZrcTokenWalletBalanceFiat24hAgo(zrcBalanceFiat24hAgo, zrcBalanceFiatPercentChange24h, ticker) {
        $('#' + ticker + '_balance_fiat_24h_ago').text(zrcBalanceFiat24hAgo);
        $('#' + ticker + '_balance_fiat_percent_change_24h').text(zrcBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#' + ticker + '_balance_fiat_percent_change_24h_container', zrcBalanceFiatPercentChange24h);
    }

    /** Private static method */
    bindViewZrcTokenWalletBalanceFiat(zrcBalanceFiat, ticker) {
        $('#' + ticker + '_balance_fiat').text(zrcBalanceFiat);
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

    exports.WalletBalanceStatus = WalletBalanceStatus;
}
