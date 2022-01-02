/** A class to represent Xcad DEX status.  */
class XcadDexStatus {

    constructor(zrcTokenPropertiesListMap,
        /* nullable= */ walletAddressBase16,
        /* nullable= */ xcadDexSmartContractStateData,
        /* nullable= */ xcadDexSmartContractState24hAgoData) {
        // Constants
        this.xcadDexAddress_ = "zil1r7c6fltm4993v9myr4sz9wjgeta80mhs59sq67";
        this.xcadDexAddressBase16_ = "0x1fb1A4fD7ba94B1617641D6022BA48cafa77eEf0";
        this.xcadDexAddressBase16LowerCase_ = this.xcadDexAddressBase16_.toLowerCase();

        this.xcadTokenAddressBase16_ = zrcTokenPropertiesListMap['XCAD'].address_base16;
        this.xcadTokenDecimals_ = zrcTokenPropertiesListMap['XCAD'].decimals;

        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.xcadDexSmartContractStateData_ = xcadDexSmartContractStateData;
        this.xcadDexSmartContractState24hAgoData_ = xcadDexSmartContractState24hAgoData;

        // Private derived variable
        this.xcadPairPublicStatusMap_ = {};
        this.xcadPairPublicStatus24hAgoMap_ = {};

        this.xcadPairPersonalStatusMap_ = {};
        this.xcadPairPersonalStatus24hAgoMap_ = {};

        // private variable
        this.walletAddressBase16_ = walletAddressBase16;

        this.computeXcadPairPublicPersonalStatusMap();
    }

    hasBalanceData() {
        try {
            if (this.xcadDexSmartContractStateData_ &&
                this.xcadDexSmartContractStateData_.result &&
                this.xcadDexSmartContractStateData_.result.xbalances &&
                this.xcadDexSmartContractStateData_.result.xtotal_contributions) {
                return true;
            }
        } catch (ex) {
            console.log(ex);
        }
        return false;
    }

    has24hAgoData() {
        try {
            if (this.xcadDexSmartContractState24hAgoData_ &&
                this.xcadDexSmartContractState24hAgoData_.result &&
                this.xcadDexSmartContractState24hAgoData_.result.xtotal_contributions) {
                return true;
            }
        } catch (ex) {
            console.log(ex);
        }
        return false;
    }

    isWalletAddressSet() {
        if (this.walletAddressBase16_) {
            return true;
        }
        return false;
    }

    resetPersonal() {
        this.xcadPairPersonalStatusMap_ = {};
        this.xcadPairPersonalStatus24hAgoMap_ = {};
    }

    setWalletAddressBase16(walletAddressBase16) {
        // Need to reset the attributes when wallet is changed.
        this.resetPersonal();
        this.walletAddressBase16_ = walletAddressBase16;
    }

    computeXcadPairPublicPersonalStatusMap() {
        // Current data
        if (!this.xcadDexSmartContractStateData_) {
            return;
        }
        let hasBalanceData = this.hasBalanceData();

        // Special token with fixed rate contract must be defined at the end, so that we finished
        // processing the rest of the zrc tokens before processing the fixed rate ones.
        for (let key in this.zrcTokenPropertiesListMap_) {
            let zrcTokenProperties = this.zrcTokenPropertiesListMap_[key];
            let zrcTokenAddressBase16 = zrcTokenProperties.address_base16.toLowerCase();

            // To get pool status and zrc token price in XCAD
            let xcadSinglePairPublicStatus = getXcadSinglePairPublicStatusFromDexState(this.xcadDexSmartContractStateData_, this.xcadTokenAddressBase16_, this.xcadTokenDecimals_, zrcTokenAddressBase16, zrcTokenProperties.decimals);
            if (!xcadSinglePairPublicStatus) {
                continue;
            }
            // Set public data
            this.xcadPairPublicStatusMap_[key] = xcadSinglePairPublicStatus;

            // Compute personal status
            if (!hasBalanceData || !this.walletAddressBase16_) {
                continue;
            }
            let walletShareRatio = getXcadSinglePairShareRatio(this.xcadDexSmartContractStateData_, this.xcadTokenAddressBase16_, zrcTokenAddressBase16, this.walletAddressBase16_);
            if (!walletShareRatio) {
                continue;
            }

            // Set personal data
            this.xcadPairPersonalStatusMap_[key] = getXcadSinglePairPersonalStatus(walletShareRatio, xcadSinglePairPublicStatus);
        }

        // 24h Ago data
        if (!this.xcadDexSmartContractState24hAgoData_) {
            return;
        }
        if (hasBalanceData) {
            // This is to assume user have the same liquidity contribution amount 24h ago
            this.xcadDexSmartContractState24hAgoData_.result.xbalances = this.xcadDexSmartContractStateData_.result.xbalances;
        }
        for (let key in this.zrcTokenPropertiesListMap_) {
            let zrcTokenProperties = this.zrcTokenPropertiesListMap_[key];
            let zrcTokenAddressBase16 = zrcTokenProperties.address_base16.toLowerCase();

            // Regular case if it's a regular token
            let xcadSinglePairPublicStatus24hAgo = getXcadSinglePairPublicStatusFromDexState(this.xcadDexSmartContractState24hAgoData_, this.xcadTokenAddressBase16_, this.xcadTokenDecimals_, zrcTokenAddressBase16, zrcTokenProperties.decimals);
            if (!xcadSinglePairPublicStatus24hAgo) {
                continue;
            }
            // Set public data
            this.xcadPairPublicStatus24hAgoMap_[key] = xcadSinglePairPublicStatus24hAgo;

            if (!hasBalanceData || !this.walletAddressBase16_) {
                continue;
            }

            let walletShareRatio24hAgo = getXcadSinglePairShareRatio(this.xcadDexSmartContractState24hAgoData_, this.xcadTokenAddressBase16_, zrcTokenAddressBase16, this.walletAddressBase16_);
            if (!walletShareRatio24hAgo) {
                continue;
            }

            // Set personal data
            this.xcadPairPersonalStatus24hAgoMap_[key] = getXcadSinglePairPersonalStatus(walletShareRatio24hAgo, xcadSinglePairPublicStatus24hAgo);
        }
    }

    /**
     * Returns XcadPairPublicStatus given a zrcSymbol.
     * XcadPairPublicStatus contains total pool in ZRC, XCAD, and ZRC price in XCAD.
     * 
     * Any error will result in returning null.
     */
    getXcadPairPublicStatus(zrcSymbol) {
        return this.xcadPairPublicStatusMap_[zrcSymbol];
    }

    /**
     * Returns XcadPairPublicStatus given a zrcSymbol, 24h ago. 
     * XcadPairPublicStatus contains total pool in ZRC, XCAD, and ZRC price in XCAD.
     * 
     * Any error will result in returning null.
     */
    getXcadPairPublicStatus24hAgo(zrcSymbol) {
        return this.xcadPairPublicStatus24hAgoMap_[zrcSymbol];
    }

    getZrcPriceInXcad(zrcSymbol) {
        let pairPublicStatus = this.xcadPairPublicStatusMap_[zrcSymbol];
        if (!pairPublicStatus) {
            return null;
        }
        return pairPublicStatus.zrcTokenPriceInXcad;
    }

    getZrcPriceInXcad24hAgo(zrcSymbol) {
        let pairPublicStatus = this.xcadPairPublicStatus24hAgoMap_[zrcSymbol];
        if (!pairPublicStatus) {
            return null;
        }
        return pairPublicStatus.zrcTokenPriceInXcad;
    }

    /**
     * Returns XcadPairPersonalStatus given a zrcSymbol.
     * XcadPairPersonalStatus contains share ratio and the amount of ZRC and XCAD in a personal wallet's LP pair.
     * 
     * Any error will result in returning null.
     */
    getXcadPairPersonalStatus(zrcSymbol) {
        return this.xcadPairPersonalStatusMap_[zrcSymbol];
    }

    /**
     * Returns XcadPairPersonalStatus given a zrcSymbol, 24h ago
     * XcadPairPersonalStatus contains share ratio and the amount of ZRC and XCAD in a personal wallet's LP pair.
     * 
     * Any error will result in returning null.
     */
    getXcadPairPersonalStatus24hAgo(zrcSymbol) {
        return this.xcadPairPersonalStatus24hAgoMap_[zrcSymbol];
    }

    /**
     * Returns all personal LP balance in XCAD.
     * 
     * Any error will result in returning 0.
     */
    getAllPersonalBalanceInXcad() {
        let totalXcadAmount = 0;
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let currPersonalStatus = this.getXcadPairPersonalStatus(ticker);
            if (!currPersonalStatus) {
                continue;
            }
            totalXcadAmount += 2.0 * currPersonalStatus.xcadAmount;
        }
        return totalXcadAmount;
    }

    /**
     * Returns all personal LP balance in XCAD 24h ago.
     * 
     * Any error will result in returning 0.
     */
    getAllPersonalBalanceInXcad24hAgo() {
        let totalXcadAmount = 0;
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let currPersonalStatus = this.getXcadPairPersonalStatus24hAgo(ticker);
            if (!currPersonalStatus) {
                continue;
            }
            totalXcadAmount += 2.0 * currPersonalStatus.xcadAmount;
        }
        return totalXcadAmount;
    }

    computePersonalPublicDataRpcIfDataNoExist(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        // If data is already loaded, do not perform RPC.
        if (this.hasBalanceData()) {
            beforeRpcCallback();
            this.computeXcadPairPublicPersonalStatusMap();
            onSuccessCallback(); // Call success callback as if the RPC is successful.
            return;
        }

        this.computePersonalPublicDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback);
    }

    computePersonalPublicDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        beforeRpcCallback();
        let self = this;
        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractState",
            /* params= */
            [this.xcadDexAddressBase16_.substring(2)],
            /* successCallback= */
            function (data) {
                self.xcadDexSmartContractStateData_ = data;
                self.computeXcadPairPublicPersonalStatusMap();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    computePublicDataRpcIfDataNoExist(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        // If data is already loaded, do not perform RPC.
        if (this.xcadDexSmartContractStateData_) {
            beforeRpcCallback();
            this.computeXcadPairPublicPersonalStatusMap();
            onSuccessCallback(); // Call success callback as if the RPC is successful.
            return;
        }

        this.computePublicDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback);
    }

    computePublicDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        beforeRpcCallback();

        let self = this;
        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractSubState",
            /* params= */
            [this.xcadDexAddressBase16_.substring(2), "xpools", []],
            /* successCallback= */
            function (data) {
                self.xcadDexSmartContractStateData_ = data;
                self.computeXcadPairPublicPersonalStatusMap();
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
    if (typeof getXcadSinglePairPublicStatusFromDexState === 'undefined') {
        TokenUtils = require('./token_utils.js');
        getPercentChange = TokenUtils.getPercentChange;
        getXcadSinglePairShareRatio = TokenUtils.getXcadSinglePairShareRatio;
        getXcadSinglePairPublicStatusFromDexState = TokenUtils.getXcadSinglePairPublicStatusFromDexState;
        getXcadSinglePairPersonalStatus = TokenUtils.getXcadSinglePairPersonalStatus;
        XcadSinglePairPublicStatus = TokenUtils.XcadSinglePairPublicStatus;
    }
    exports.XcadDexStatus = XcadDexStatus;
}