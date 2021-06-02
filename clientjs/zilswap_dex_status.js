/** A class to represent Zilswap DEX status.  */
class ZilswapDexStatus {

    constructor(zrcTokenPropertiesListMap, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexSmartContractStateData, /* nullable= */ zilswapDexSmartContractState24hAgoData) {
        // Constants
        this.zilswapDexAddress_ = "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w";
        this.zilswapDexAddressBase16_ = "Ba11eB7bCc0a02e947ACF03Cc651Bfaf19C9EC00";

        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexSmartContractStateData_ = zilswapDexSmartContractStateData;
        this.zilswapDexSmartContractState24hAgoData_ = zilswapDexSmartContractState24hAgoData;

        // Private derived variable
        this.zilswapPairPublicStatusMap_ = null; // Null to indicate unset
        this.zilswapPairPublicStatus24hAgoMap_ = null; // Null to indicate unset

        // private variable
        this.lastBindedWalletAddressBase16_ = null;

        this.computeZilswapPairPublicStatusMap();
        this.bindViewIfDataExist();
    }

    hasBalanceData() {
        try {
            if (this.zilswapDexSmartContractStateData_
                && this.zilswapDexSmartContractStateData_.result
                && this.zilswapDexSmartContractStateData_.result.balances
                && this.zilswapDexSmartContractStateData_.result.total_contributions) {
                    return true;
                }
        } catch (ex) {
            console.log(ex);
        }
        return false;
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        this.bindViewZrcTokenPriceFiat();
        this.bindViewPersonalDataFiat(/* walletAddressBase16= */ null);
    }

    computeZilswapPairPublicStatusMap() {
        // Return if there is no raw data.
        if (!this.zilswapDexSmartContractStateData_) {
            return;
        }
        this.zilswapPairPublicStatusMap_ = {};
        this.zilswapPairPublicStatus24hAgoMap_ = {};

        for (let key in this.zrcTokenPropertiesListMap_) {
            let zrcTokenProperties = this.zrcTokenPropertiesListMap_[key];
            let zrcTokenAddressBase16 = zrcTokenProperties.address_base16.toLowerCase();

            // To get pool status and zrc token price in ZIL
            let zilswapSinglePairPublicStatus = getZilswapSinglePairPublicStatusFromDexState(this.zilswapDexSmartContractStateData_, zrcTokenAddressBase16, zrcTokenProperties.decimals);
            if (zilswapSinglePairPublicStatus) {
                this.zilswapPairPublicStatusMap_[key] = zilswapSinglePairPublicStatus;
            }
            let zilswapSinglePairPublicStatus24hAgo = getZilswapSinglePairPublicStatusFromDexState(this.zilswapDexSmartContractState24hAgoData_, zrcTokenAddressBase16, zrcTokenProperties.decimals);
            if (zilswapSinglePairPublicStatus24hAgo) {
                this.zilswapPairPublicStatus24hAgoMap_[key] = zilswapSinglePairPublicStatus24hAgo;
            }
        }
    }

    /**
     * Returns ZilswapPairPublicStatus given a zrcSymbol.
     * ZilswapPairPublicStatus contains total pool in ZRC, ZIL, and ZRC price in ZIL.
     * 
     * Any error will result in returning null.
     */
    getZilswapPairPublicStatus(zrcSymbol) {
        // If data doesn't exist.
        if (!this.zilswapDexSmartContractStateData_) {
            return null;
        }
        // If zrc token symbol is not supported.
        if (!this.zrcTokenPropertiesListMap_[zrcSymbol]) {
            return null;
        }
        if (!this.zilswapPairPublicStatusMap_) {
            return null;
        }
        return this.zilswapPairPublicStatusMap_[zrcSymbol];
    }

    /**
     * Returns ZilswapPairPublicStatus given a zrcSymbol, 24h ago. 
     * ZilswapPairPublicStatus contains total pool in ZRC, ZIL, and ZRC price in ZIL.
     * 
     * Any error will result in returning null.
     */
    getZilswapPairPublicStatus24hAgo(zrcSymbol) {
        // If data doesn't exist.
        if (!this.zilswapDexSmartContractState24hAgoData_) {
            return null;
        }
        // If zrc token symbol is not supported.
        if (!this.zrcTokenPropertiesListMap_[zrcSymbol]) {
            return null;
        }
        if (!this.zilswapPairPublicStatus24hAgoMap_) {
            return null;
        }
        return this.zilswapPairPublicStatus24hAgoMap_[zrcSymbol];
    }

    /**
     * Returns ZilswapPairPersonalStatus given a zrcSymbol.
     * ZilswapPairPersonalStatus contains share ratio and the amount of ZRC and ZIL in a personal wallet's LP pair.
     * 
     * Any error will result in returning null.
     */
     getZilswapPairPersonalStatus(zrcSymbol, walletAddressBase16) {
        if (!this.hasBalanceData()) {
            return null;
        }
        // If zrc token symbol is not supported.
        if (!this.zrcTokenPropertiesListMap_[zrcSymbol]) {
            return null;
        }
        let zilswapSinglePairPublicStatus = this.getZilswapPairPublicStatus(zrcSymbol);
        if (!zilswapSinglePairPublicStatus) {
            return null;
        }

        let zrcTokenAddressBase16 = this.zrcTokenPropertiesListMap_[zrcSymbol].address_base16.toLowerCase();
        let walletShareRatio = getZilswapSinglePairShareRatio(this.zilswapDexSmartContractStateData_, zrcTokenAddressBase16, walletAddressBase16);
        if (!walletShareRatio) {
            return null;
        }
        return getZilswapSinglePairPersonalStatus(walletShareRatio, zilswapSinglePairPublicStatus);
    }

    /**
     * Returns ZilswapPairPersonalStatus given a zrcSymbol, 24h ago
     * ZilswapPairPersonalStatus contains share ratio and the amount of ZRC and ZIL in a personal wallet's LP pair.
     * 
     * Any error will result in returning null.
     */
    getZilswapPairPersonalStatus24hAgo(zrcSymbol, walletAddressBase16) {
        if (!this.hasBalanceData()) {
            return null;
        }
        if (!this.zilswapDexSmartContractState24hAgoData_) {
            return null;
        }
        // If zrc token symbol is not supported.
        if (!this.zrcTokenPropertiesListMap_[zrcSymbol]) {
            return null;
        }
        let zilswapSinglePairPublicStatus24hAgo = this.getZilswapPairPublicStatus24hAgo(zrcSymbol);
        if (!zilswapSinglePairPublicStatus24hAgo) {
            return null;
        }
        
        // This is to assume we have the same liquidity contribution amount 24h ago
        this.zilswapDexSmartContractState24hAgoData_.result.balances = this.zilswapDexSmartContractStateData_.result.balances;

        let zrcTokenAddressBase16 = this.zrcTokenPropertiesListMap_[zrcSymbol].address_base16.toLowerCase();
        let walletShareRatio24hAgo = getZilswapSinglePairShareRatio(this.zilswapDexSmartContractState24hAgoData_, zrcTokenAddressBase16, walletAddressBase16);
        if (!walletShareRatio24hAgo) {
            return null;
        }
        return getZilswapSinglePairPersonalStatus(walletShareRatio24hAgo, zilswapSinglePairPublicStatus24hAgo);
    }

    computeDataRpcIfBalanceDataNoExist(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        beforeRpcCallback();

        // If data is already loaded, do not perform RPC.
        if (this.hasBalanceData()) {
            this.computeZilswapPairPublicStatusMap();
            this.bindViewIfDataExist();
            onSuccessCallback(); // Call success callback as if the RPC is successful.
            return;
        }

        let self = this;
        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractState",
            /* params= */
            [this.zilswapDexAddressBase16_],
            /* successCallback= */
            function (data) {
                self.zilswapDexSmartContractStateData_ = data;
                self.computeZilswapPairPublicStatusMap();
                self.bindViewIfDataExist();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    computeDataRpcIfDataNoExist(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        beforeRpcCallback();

        // If data is already loaded, do not perform RPC.
        if (this.zilswapDexSmartContractStateData_) {
            this.computeZilswapPairPublicStatusMap();
            this.bindViewIfDataExist();
            onSuccessCallback(); // Call success callback as if the RPC is successful.
            return;
        }

        let self = this;
        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractSubState",
            /* params= */
            [this.zilswapDexAddressBase16_, "pools", []],
            /* successCallback= */
            function (data) {
                self.zilswapDexSmartContractStateData_ = data;
                self.computeZilswapPairPublicStatusMap();
                self.bindViewIfDataExist();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    bindViewPersonalDataIfDataExist(walletAddressBase16) {
        this.lastBindedWalletAddressBase16_ = walletAddressBase16;
        if (!this.hasBalanceData()) {
            return;
        }
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            
            // To get ZilswapLp balance and Total pool status
            let zilswapSinglePairPersonalStatus = this.getZilswapPairPersonalStatus(ticker, walletAddressBase16);
            if (!zilswapSinglePairPersonalStatus) {
                continue;
            }
            let poolSharePercent = parseFloat((zilswapSinglePairPersonalStatus.shareRatio) * 100).toPrecision(3);
            let zilAmount = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus.zilAmount, /* decimals= */ 0);
            let zrcTokenAmount = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus.zrcTokenAmount, /* decimals= */ 0);
            let balanceInZilAmount = convertNumberQaToDecimalString(2.0 * zilswapSinglePairPersonalStatus.zilAmount, /* decimals= */ 0);

            if (!poolSharePercent || !zilAmount || !zrcTokenAmount || !balanceInZilAmount) {
                continue;
            }
            this.bindViewZrcTokenLpBalance(poolSharePercent, zilAmount, zrcTokenAmount, balanceInZilAmount, ticker);

            // If there is a 24h ago data
            let zilswapSinglePairPersonalStatus24hAgo = this.getZilswapPairPersonalStatus24hAgo(ticker, walletAddressBase16);
            if (!zilswapSinglePairPersonalStatus24hAgo) {
                continue;
            }
            let poolSharePercent24hAgo = parseFloat((zilswapSinglePairPersonalStatus24hAgo.shareRatio) * 100).toPrecision(3);
            let zilAmount24hAgo = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus24hAgo.zilAmount, /* decimals= */ 0);
            let zrcTokenAmount24hAgo = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus24hAgo.zrcTokenAmount, /* decimals= */ 0);
            let balanceInZilAmount24hAgo = convertNumberQaToDecimalString(2.0 * zilswapSinglePairPersonalStatus24hAgo.zilAmount, /* decimals= */ 0);
            let balanceInZilPercentChange24h = getPercentChange(zilswapSinglePairPersonalStatus.zilAmount, zilswapSinglePairPersonalStatus24hAgo.zilAmount).toFixed(1);

            if (!poolSharePercent24hAgo || !zilAmount24hAgo || !zrcTokenAmount24hAgo || !balanceInZilAmount24hAgo) {
                continue;
            }
            this.bindViewZrcTokenLpBalance24hAgo(poolSharePercent24hAgo, zilAmount24hAgo, zrcTokenAmount24hAgo, balanceInZilAmount24hAgo, balanceInZilPercentChange24h, ticker);
        }
        this.bindViewPersonalDataFiat(walletAddressBase16);
    }

    /** Private method */
    bindViewPersonalDataFiat(walletAddressBase16) {
        if (!walletAddressBase16 && this.lastBindedWalletAddressBase16_) {
            walletAddressBase16 = this.lastBindedWalletAddressBase16_;
        }
        if (!walletAddressBase16) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');

        for (let ticker in zrcTokenPropertiesListMap) {

            let zilswapSinglePairPersonalStatus = this.getZilswapPairPersonalStatus(ticker, walletAddressBase16);
            if (!zilswapSinglePairPersonalStatus) {
                continue;
            }
            let lpBalanceInZil = zilswapSinglePairPersonalStatus.zilAmount;
            if (!lpBalanceInZil) {
                continue;
            }
            let lpBalanceFiat = zilPriceInFiatFloat * lpBalanceInZil * 2.0;
            let lpBalanceFiatString = commafyNumberToString(lpBalanceFiat, decimals);
            this.bindViewZrcTokenLpBalanceFiat(lpBalanceFiatString, ticker);

            if (!zilPriceInFiat24hAgoFloat) {
                continue;
            }
            let zilswapSinglePairPersonalStatus24hAgo = this.getZilswapPairPersonalStatus24hAgo(ticker, walletAddressBase16);
            if (!zilswapSinglePairPersonalStatus24hAgo) {
                continue;
            }
            let lpBalanceInZil24hAgo = zilswapSinglePairPersonalStatus24hAgo.zilAmount;
            if (!lpBalanceInZil24hAgo) {
                continue;
            }
            let lpBalanceFiat24hAgo = zilPriceInFiat24hAgoFloat * lpBalanceInZil24hAgo * 2.0;
            let lpBalanceFiat24hAgoString = commafyNumberToString(lpBalanceFiat24hAgo, decimals);
            let lpBalanceFiatPercentChange24h = getPercentChange(lpBalanceFiat, lpBalanceFiat24hAgo).toFixed(1);
            this.bindViewZrcTokenLpBalanceFiat24hAgo(lpBalanceFiat24hAgoString, lpBalanceFiatPercentChange24h, ticker);
        }
    }

    bindViewIfDataExist() {
        if (!this.zilswapPairPublicStatusMap_) {
            return;
        }

        for (let key in this.zrcTokenPropertiesListMap_) {
            let zrcTokenProperties = this.zrcTokenPropertiesListMap_[key];

            let zilswapSinglePairPublicStatus = this.getZilswapPairPublicStatus(key);
            // If the token is not present in Zilswap dex, we can stop processing this token.
            if (!zilswapSinglePairPublicStatus) {
                this.bindViewZrcTokenPriceInZil("0", "0", zrcTokenProperties.ticker);
                this.bindViewZrcTokenPriceInFiat("0", zrcTokenProperties.ticker);
                continue;
            }
            let zilswapSinglePairPublicStatus24hAgo = this.getZilswapPairPublicStatus24hAgo(key);

            // ZRC token price in ZIL
            let zrcTokenPriceInZilNumber = zilswapSinglePairPublicStatus.zrcTokenPriceInZil;
            let userFriendlyZrcTokenPriceInZil = convertNumberQaToDecimalString(zrcTokenPriceInZilNumber, /* decimals= */ 0);
            let publicUserFriendlyZrcTokenPriceInZil = commafyNumberToString(zrcTokenPriceInZilNumber, 2);
            this.bindViewZrcTokenPriceInZil(userFriendlyZrcTokenPriceInZil, publicUserFriendlyZrcTokenPriceInZil, zrcTokenProperties.ticker)

            // ZRC token price in ZIL 24h ago
            if (!zilswapSinglePairPublicStatus24hAgo) {
                continue;
            }
            let zrcTokenPriceInZilNumber24hAgo = zilswapSinglePairPublicStatus24hAgo.zrcTokenPriceInZil;
            let userFriendlyZrcTokenPriceInZil24hAgo = convertNumberQaToDecimalString(zrcTokenPriceInZilNumber24hAgo, /* decimals= */ 0);
            let publicUserFriendlyZrcTokenPriceInZil24hAgo = commafyNumberToString(zrcTokenPriceInZilNumber24hAgo, 2);
            let zrcTokenPriceInZilPercentChange24h = getPercentChange(zrcTokenPriceInZilNumber, zrcTokenPriceInZilNumber24hAgo).toFixed(1);
            this.bindViewZrcTokenPriceInZil24hAgo(userFriendlyZrcTokenPriceInZil24hAgo, publicUserFriendlyZrcTokenPriceInZil24hAgo, zrcTokenPriceInZilPercentChange24h, zrcTokenProperties.ticker);
        }

        this.bindViewZrcTokenPriceFiat();
    }

    /** Private method */
    bindViewZrcTokenPriceFiat() {
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1000) ? 0 : 2;
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');

        for (let ticker in this.zrcTokenPropertiesListMap_) {

            let zilswapSinglePairPublicStatus = this.getZilswapPairPublicStatus(ticker);
            if (!zilswapSinglePairPublicStatus) {
                continue;
            }
            let zrcTokenPriceInZil = zilswapSinglePairPublicStatus.zrcTokenPriceInZil;
            if (Number.isNaN(zrcTokenPriceInZil)) {
                continue;
            }

            // ZRC token price in fiat
            let zrcTokenPriceInFiat = 1.0 * zilPriceInFiatFloat * zrcTokenPriceInZil;
            let zrcTokenPriceInFiatString = commafyNumberToString(zrcTokenPriceInFiat, decimals);

            this.bindViewZrcTokenPriceInFiat(zrcTokenPriceInFiatString, ticker);

            // ZRC token price in fiat 24h ago
            let zilswapSinglePairPublicStatus24hAgo = this.getZilswapPairPublicStatus24hAgo(ticker);
            if (zilswapSinglePairPublicStatus24hAgo) {
                let zrcTokenPriceInZil24hAgo = zilswapSinglePairPublicStatus24hAgo.zrcTokenPriceInZil;
                if (zilPriceInFiat24hAgoFloat && zrcTokenPriceInZil24hAgo) {
                    let zrcTokenPriceInFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zrcTokenPriceInZil24hAgo;
                    let zrcTokenPriceInFiat24hAgoString = commafyNumberToString(zrcTokenPriceInFiat24hAgo, decimals);
                    let zrcTokenPriceInFiatPercentChange24h = getPercentChange(zrcTokenPriceInFiat, zrcTokenPriceInFiat24hAgo).toFixed(1);
                    this.bindViewZrcTokenPriceInFiat24hAgo(zrcTokenPriceInFiat24hAgoString, zrcTokenPriceInFiatPercentChange24h, ticker);
                }
            }

            // public total pool container in fiat
            let zilLpBalance = zilswapSinglePairPublicStatus.totalPoolZilAmount;
            if (zilLpBalance) {
                // total worth is always times 2 (e.g., ZRC2-ZIL pair always have 50:50 value).
                // For now ZilSwap only support 50-50 weight pair.
                let lpTotalPoolBalanceFiat = 1.0 * zilPriceInFiatFloat * (zilLpBalance * 2.0);
                let lpTotalPoolBalanceFiatString = commafyNumberToString(lpTotalPoolBalanceFiat, /* decimals= */ 0);
                this.bindViewZrcTokenLpTotalPoolBalanceFiat(lpTotalPoolBalanceFiatString, ticker);
            }
        }
    }

    /** Private static method */
    bindViewZrcTokenLpBalance24hAgo(poolSharePercent24hAgo, zilBalance24hAgo, zrcBalance24hAgo, balanceInZil24hAgo, balanceInZilPercentChange24h, ticker) {
        $('#' + ticker + '_lp_pool_share_percent_24h_ago').text(poolSharePercent24hAgo);
        $('#' + ticker + '_lp_zil_balance_24h_ago').text(zilBalance24hAgo);
        $('#' + ticker + '_lp_token_balance_24h_ago').text(zrcBalance24hAgo);
        $('#' + ticker + '_lp_balance_zil_24h_ago').text(balanceInZil24hAgo);
        $('#' + ticker + '_lp_balance_zil_percent_change_24h').text(balanceInZilPercentChange24h);
        bindViewPercentChangeColorContainer('#' + ticker + '_lp_balance_zil_percent_change_24h_container', balanceInZilPercentChange24h);
    }
    
    /** Private static method */
    bindViewZrcTokenLpBalance(poolSharePercent, zilBalance, zrcBalance, balanceInZil, ticker) {
        $('#' + ticker + '_lp_pool_share_percent').text(poolSharePercent);
        $('#' + ticker + '_lp_zil_balance').text(zilBalance);
        $('#' + ticker + '_lp_token_balance').text(zrcBalance);
        $('#' + ticker + '_lp_balance_zil').text(balanceInZil);
        $('#' + ticker + '_lp_container').show();
        $('#lp_container').show();
    }

    /** Private static method */
    bindViewZrcTokenLpBalanceFiat24hAgo(lpBalanceFiat24hAgo, lpBalanceFiatPercentChange24h, ticker) {
        $('#' + ticker + '_lp_balance_fiat_24h_ago').text(lpBalanceFiat24hAgo);
        $('#' + ticker + '_lp_balance_fiat_percent_change_24h').text(lpBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#' + ticker + '_lp_balance_fiat_percent_change_24h_container', lpBalanceFiatPercentChange24h);
    }

    /** Private static method */
    bindViewZrcTokenLpBalanceFiat(lpBalanceFiat, ticker) {
        $('#' + ticker + '_lp_balance_fiat').text(lpBalanceFiat);
    }

    /** Private static method */
    bindViewZrcTokenPriceInZil24hAgo(zrcTokenPriceInZil24hAgo, publicZrcTokenPriceInZil24hAgo, publicZrcTokenPriceInZilPercentChange24h, ticker) {
        $('.' + ticker + '_price_zil_24h_ago').text(zrcTokenPriceInZil24hAgo);
        $('#public_' + ticker + '_price_zil_24h_ago').text(publicZrcTokenPriceInZil24hAgo);
        $('#public_' + ticker + '_price_zil_percent_change_24h').text(publicZrcTokenPriceInZilPercentChange24h);
        bindViewPercentChangeColorContainer('#public_' + ticker + '_price_zil_percent_change_24h_container', publicZrcTokenPriceInZilPercentChange24h);
    }

    /** Private static method */
    bindViewZrcTokenPriceInZil(zrcTokenPriceInZil, publicZrcTokenPriceInZil, ticker) {
        $('.' + ticker + '_price_zil').text(zrcTokenPriceInZil);
        $('#public_' + ticker + '_price_zil').text(publicZrcTokenPriceInZil);
    }

    /** Private static method */
    bindViewZrcTokenPriceInFiat24hAgo(zrcTokenPriceInFiat24hAgo, zrcTokenPriceInFiatPercentChange24h, ticker) {
        $('#public_' + ticker + '_price_fiat_24h_ago').text(zrcTokenPriceInFiat24hAgo);
        $('#public_' + ticker + '_price_fiat_percent_change_24h').text(zrcTokenPriceInFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#public_' + ticker + '_price_fiat_percent_change_24h_container', zrcTokenPriceInFiatPercentChange24h);
    }

    /** Private static method */
    bindViewZrcTokenPriceInFiat(zrcTokenPriceInFiat, ticker) {
        $('#public_' + ticker + '_price_fiat').text(zrcTokenPriceInFiat);
    }

    /** Private static method */
    bindViewZrcTokenLpTotalPoolBalanceFiat(lpTotalPoolBalanceFiat, ticker) {
        $('#' + ticker + '_lp_total_pool_fiat').text(lpTotalPoolBalanceFiat);
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
        getZilswapSinglePairShareRatio = TokenUtils.getZilswapSinglePairShareRatio;
        getZilswapSinglePairPublicStatusFromDexState = TokenUtils.getZilswapSinglePairPublicStatusFromDexState;
        getZilswapSinglePairPersonalStatus = TokenUtils.getZilswapSinglePairPersonalStatus;
    }

    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }

    if (typeof bindViewPercentChangeColorContainer === 'undefined') {
        BindView = require('./bind_view.js');
        bindViewPercentChangeColorContainer = BindView.bindViewPercentChangeColorContainer;
    }

    exports.ZilswapDexStatus = ZilswapDexStatus;
}