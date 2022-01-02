/** A class to represent Zilswap DEX status.  */
class ZilswapDexStatus {

    constructor(zrcTokenPropertiesListMap,
        /* nullable= */ coinPriceStatus,
        /* nullable= */ xcadDexStatus,
        /* nullable= */ walletAddressBase16,
        /* nullable= */ zilswapDexSmartContractStateData,
        /* nullable= */ zilswapDexSmartContractState24hAgoData,
        /* nullable= */ zrcTokensCirculatingSupplyData,
        /* nullable= */ zrcTokensTotalSupplyData) {

        // Constants
        this.zilswapDexAddress_ = "zil1gkwt95a67lnpe774lcmz72y6ay4jh2asmmjw6u";
        this.zilswapDexAddressBase16_ = "0x459CB2d3BAF7e61cFbD5FE362f289aE92b2BaBb0";
        this.zilswapDexAddressBase16LowerCase_ = this.zilswapDexAddressBase16_.toLowerCase();

        // Private variable
        this.zrcTokenPropertiesListMap_ = zrcTokenPropertiesListMap; // Refer to constants.js for definition
        this.coinPriceStatus_ = coinPriceStatus;

        // Other Dexes to integrate
        this.xcadDexStatus_ = xcadDexStatus;

        this.zilswapDexSmartContractStateData_ = zilswapDexSmartContractStateData;
        this.zilswapDexSmartContractState24hAgoData_ = zilswapDexSmartContractState24hAgoData;
        // Circulating and total supply
        this.zrcTokensCirculatingSupplyData_ = zrcTokensCirculatingSupplyData;
        this.zrcTokensTotalSupplyData_ = zrcTokensTotalSupplyData;

        // Private derived variable
        this.zilswapPairPublicStatusMap_ = {};
        this.zilswapPairPublicStatus24hAgoMap_ = {};

        this.zilswapPairPersonalStatusMap_ = {};
        this.zilswapPairPersonalStatus24hAgoMap_ = {};

        // private variable
        this.walletAddressBase16_ = walletAddressBase16;

        this.computeZilswapPairPublicPersonalStatusMap();
        this.bindViewIfDataExist();
    }

    hasBalanceData() {
        try {
            if (this.zilswapDexSmartContractStateData_ &&
                this.zilswapDexSmartContractStateData_.result &&
                this.zilswapDexSmartContractStateData_.result.balances &&
                this.zilswapDexSmartContractStateData_.result.total_contributions) {
                return true;
            }
        } catch (ex) {
            console.log(ex);
        }
        return false;
    }

    has24hAgoData() {
        try {
            if (this.zilswapDexSmartContractState24hAgoData_ &&
                this.zilswapDexSmartContractState24hAgoData_.result &&
                this.zilswapDexSmartContractState24hAgoData_.result.total_contributions) {
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
        this.zilswapPairPersonalStatusMap_ = {};
        this.zilswapPairPersonalStatus24hAgoMap_ = {};

        this.resetPersonalView();
    }

    setWalletAddressBase16(walletAddressBase16) {
        // Need to reset the attributes when wallet is changed.
        this.resetPersonal();
        this.walletAddressBase16_ = walletAddressBase16;
        this.xcadDexStatus_.setWalletAddressBase16(walletAddressBase16);
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        this.bindViewZrcTokenPriceFiat();
        this.bindViewPersonalDataIfDataExist();

        this.bindViewZrcTokenCirculatingSupplyZilFiat();
        this.bindViewZrcTokenTotalSupplyZilFiat();
    }

    computeZilswapPairPublicPersonalStatusMap() {
        // Current data
        if (!this.zilswapDexSmartContractStateData_) {
            return;
        }
        let hasBalanceData = this.hasBalanceData();

        // Special token with fixed rate contract must be defined at the end, so that we finished
        // processing the rest of the zrc tokens before processing the fixed rate ones.
        for (let key in this.zrcTokenPropertiesListMap_) {
            let zrcTokenProperties = this.zrcTokenPropertiesListMap_[key];
            let zrcTokenAddressBase16 = zrcTokenProperties.address_base16.toLowerCase();

            // Special case if it's a fixed token rate
            if ('fixed_token_rate' in zrcTokenProperties) {
                let zilswapSinglePairPublicStatus = null;
                // Special token with fixed rate
                let fixedRate = parseFloat(zrcTokenProperties['fixed_token_rate']['value']);
                let fixedRateTicker = zrcTokenProperties['fixed_token_rate']['ticker'];

                if (fixedRateTicker in this.zrcTokenPropertiesListMap_) {
                    let baseSinglePairPublicStatus = this.getZilswapPairPublicStatus(fixedRateTicker);
                    if (baseSinglePairPublicStatus) {
                        zilswapSinglePairPublicStatus = new ZilswapSinglePairPublicStatus(baseSinglePairPublicStatus.totalPoolZilAmount * fixedRate, baseSinglePairPublicStatus.totalPoolZrcTokenAmount);
                    }
                } else if (fixedRateTicker.toLowerCase() === 'zil') {
                    // It's pegged to ZIL, there is no need for a pool, put a random 100mil pool
                    zilswapSinglePairPublicStatus = new ZilswapSinglePairPublicStatus(100000000 * fixedRate, 100000000)
                }

                if (zilswapSinglePairPublicStatus) {
                    // Set public data
                    this.zilswapPairPublicStatusMap_[key] = zilswapSinglePairPublicStatus;
                }
                continue;
            }

            // Regular case if it's a regular token

            // To get pool status and zrc token price in ZIL
            let zilswapSinglePairPublicStatus = getZilswapSinglePairPublicStatusFromDexState(this.zilswapDexSmartContractStateData_, zrcTokenAddressBase16, zrcTokenProperties.decimals);
            if (!zilswapSinglePairPublicStatus) {
                continue;
            }
            // Set public data
            this.zilswapPairPublicStatusMap_[key] = zilswapSinglePairPublicStatus;

            // Compute personal status
            if (!hasBalanceData || !this.walletAddressBase16_) {
                continue;
            }
            let walletShareRatio = getZilswapSinglePairShareRatio(this.zilswapDexSmartContractStateData_, zrcTokenAddressBase16, this.walletAddressBase16_);
            if (!walletShareRatio) {
                continue;
            }

            // Set personal data
            this.zilswapPairPersonalStatusMap_[key] = getZilswapSinglePairPersonalStatus(walletShareRatio, zilswapSinglePairPublicStatus);
        }

        // 24h Ago data
        if (!this.zilswapDexSmartContractState24hAgoData_) {
            return;
        }
        if (hasBalanceData) {
            // This is to assume user have the same liquidity contribution amount 24h ago
            this.zilswapDexSmartContractState24hAgoData_.result.balances = this.zilswapDexSmartContractStateData_.result.balances;
        }
        for (let key in this.zrcTokenPropertiesListMap_) {
            let zrcTokenProperties = this.zrcTokenPropertiesListMap_[key];
            let zrcTokenAddressBase16 = zrcTokenProperties.address_base16.toLowerCase();

            // Special case if it's a fixed token rate
            if ('fixed_token_rate' in zrcTokenProperties) {
                let zilswapSinglePairPublicStatus = null;
                // Special token with fixed rate
                let fixedRate = parseFloat(zrcTokenProperties['fixed_token_rate']['value']);
                let fixedRateTicker = zrcTokenProperties['fixed_token_rate']['ticker'];

                if (fixedRateTicker in this.zrcTokenPropertiesListMap_) {
                    let baseSinglePairPublicStatus = this.getZilswapPairPublicStatus24hAgo(fixedRateTicker);
                    if (baseSinglePairPublicStatus) {
                        zilswapSinglePairPublicStatus = new ZilswapSinglePairPublicStatus(baseSinglePairPublicStatus.totalPoolZilAmount * fixedRate, baseSinglePairPublicStatus.totalPoolZrcTokenAmount);
                    }
                } else if (fixedRateTicker.toLowerCase() === 'zil') {
                    // It's pegged to ZIL, there is no need for a pool, put a random 100mil pool
                    zilswapSinglePairPublicStatus = new ZilswapSinglePairPublicStatus(100000000 * fixedRate, 100000000)
                }

                if (zilswapSinglePairPublicStatus) {
                    // Set public data
                    this.zilswapPairPublicStatus24hAgoMap_[key] = zilswapSinglePairPublicStatus;
                }
                continue;
            }

            // Regular case if it's a regular token
            let zilswapSinglePairPublicStatus24hAgo = getZilswapSinglePairPublicStatusFromDexState(this.zilswapDexSmartContractState24hAgoData_, zrcTokenAddressBase16, zrcTokenProperties.decimals);
            if (!zilswapSinglePairPublicStatus24hAgo) {
                continue;
            }
            // Set public data
            this.zilswapPairPublicStatus24hAgoMap_[key] = zilswapSinglePairPublicStatus24hAgo;

            if (!hasBalanceData || !this.walletAddressBase16_) {
                continue;
            }

            let walletShareRatio24hAgo = getZilswapSinglePairShareRatio(this.zilswapDexSmartContractState24hAgoData_, zrcTokenAddressBase16, this.walletAddressBase16_);
            if (!walletShareRatio24hAgo) {
                continue;
            }

            // Set personal data
            this.zilswapPairPersonalStatus24hAgoMap_[key] = getZilswapSinglePairPersonalStatus(walletShareRatio24hAgo, zilswapSinglePairPublicStatus24hAgo);
        }
    }

    /**
     * Returns ZilswapPairPublicStatus given a zrcSymbol.
     * ZilswapPairPublicStatus contains total pool in ZRC, ZIL, and ZRC price in ZIL.
     * 
     * Any error will result in returning null.
     */
    getZilswapPairPublicStatus(zrcSymbol) {
        return this.zilswapPairPublicStatusMap_[zrcSymbol];
    }

    /**
     * Returns ZilswapPairPublicStatus given a zrcSymbol, 24h ago. 
     * ZilswapPairPublicStatus contains total pool in ZRC, ZIL, and ZRC price in ZIL.
     * 
     * Any error will result in returning null.
     */
    getZilswapPairPublicStatus24hAgo(zrcSymbol) {
        return this.zilswapPairPublicStatus24hAgoMap_[zrcSymbol];
    }

    getZrcPriceInZil(zrcSymbol) {
        let pairPublicStatus = this.getZilswapPairPublicStatus(zrcSymbol);
        if (pairPublicStatus) {
            return pairPublicStatus.zrcTokenPriceInZil;
        }
        return null;
    }

    /**
     * Try to get zrc price from zilswap first, and then fallback to other dexes if there is no liquidity in zilswap
     */
    getZrcPriceInZilWithFallback(zrcSymbol) {
        // TODO: Remove the manual guard for dXCAD, this is to guard showing
        // zilswap price with low liquidity.
        if (zrcSymbol !== 'dXCAD') {
            let zilswapZrcPriceInZil = this.getZrcPriceInZil(zrcSymbol);
            if (zilswapZrcPriceInZil) {
                return zilswapZrcPriceInZil;
            }
        }

        if (!this.xcadDexStatus_) {
            return null;
        }
        // Proxy get from XCAD dex
        let zrcPriceInXcad = this.xcadDexStatus_.getZrcPriceInXcad(zrcSymbol);
        let xcadPairPublicStatus = this.zilswapPairPublicStatusMap_['XCAD'];
        if (zrcPriceInXcad && xcadPairPublicStatus) {
            return xcadPairPublicStatus.zrcTokenPriceInZil * zrcPriceInXcad;
        }
        return null;
    }

    getZrcPriceInZil24hAgo(zrcSymbol) {
        let pairPublicStatus = this.getZilswapPairPublicStatus24hAgo(zrcSymbol);
        if (pairPublicStatus) {
            return pairPublicStatus.zrcTokenPriceInZil;
        }
        return null;
    }

    /**
     * Try to get zrc price from zilswap first, and then fallback to other dexes if there is no liquidity in zilswap
     */
    getZrcPriceInZil24hAgoWithFallback(zrcSymbol) {
        // TODO: Remove the manual guard for dXCAD, this is to guard showing
        // zilswap price with low liquidity.
        if (zrcSymbol !== 'dXCAD') {
            let zilswapZrcPriceInZil = this.getZrcPriceInZil24hAgo(zrcSymbol);
            if (zilswapZrcPriceInZil) {
                return zilswapZrcPriceInZil;
            }
        }

        if (!this.xcadDexStatus_) {
            return null;
        }
        // Proxy get from XCAD dex
        let zrcPriceInXcad = this.xcadDexStatus_.getZrcPriceInXcad24hAgo(zrcSymbol);
        let xcadPairPublicStatus = this.zilswapPairPublicStatus24hAgoMap_['XCAD'];
        if (zrcPriceInXcad && xcadPairPublicStatus) {
            return xcadPairPublicStatus.zrcTokenPriceInZil * zrcPriceInXcad;
        }
        return null;
    }

    getCirculatingSupply(zrcSymbol) {
        if (!this.zrcTokensCirculatingSupplyData_) {
            return null;
        }
        let zrcTokenProperties = this.zrcTokenPropertiesListMap_[zrcSymbol];
        if (!zrcTokenProperties) {
            return null;
        }
        let zrcCirculatingSupply = parseInt(this.zrcTokensCirculatingSupplyData_[zrcSymbol]);
        if (!zrcCirculatingSupply) {
            return null;
        }
        zrcCirculatingSupply = zrcCirculatingSupply / Math.pow(10, zrcTokenProperties.decimals);
        return zrcCirculatingSupply;
    }

    /**
     * Returns ZilswapPairPersonalStatus given a zrcSymbol.
     * ZilswapPairPersonalStatus contains share ratio and the amount of ZRC and ZIL in a personal wallet's LP pair.
     * 
     * Any error will result in returning null.
     */
    getZilswapPairPersonalStatus(zrcSymbol) {
        return this.zilswapPairPersonalStatusMap_[zrcSymbol];
    }

    /**
     * Returns ZilswapPairPersonalStatus given a zrcSymbol, 24h ago
     * ZilswapPairPersonalStatus contains share ratio and the amount of ZRC and ZIL in a personal wallet's LP pair.
     * 
     * Any error will result in returning null.
     */
    getZilswapPairPersonalStatus24hAgo(zrcSymbol) {
        return this.zilswapPairPersonalStatus24hAgoMap_[zrcSymbol];
    }

    /**
     * Returns all personal LP balance in ZIL.
     * 
     * Any error will result in returning 0.
     */
    getAllPersonalBalanceInZil() {
        let totalZilAmount = 0;
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let currPersonalStatus = this.getZilswapPairPersonalStatus(ticker);
            if (!currPersonalStatus) {
                continue;
            }
            totalZilAmount += 2.0 * currPersonalStatus.zilAmount;
        }

        // Include from Xcad Dex
        if (this.xcadDexStatus_) {
            let totalXcadAmount = this.xcadDexStatus_.getAllPersonalBalanceInXcad();
            let xcadPriceInZil = this.getZrcPriceInZil('XCAD');
            if (xcadPriceInZil && totalXcadAmount) {
                totalZilAmount += xcadPriceInZil * totalXcadAmount;
            }
        }

        return totalZilAmount;
    }

    /**
     * Returns all personal LP balance in ZIL 24h ago.
     * 
     * Any error will result in returning 0.
     */
    getAllPersonalBalanceInZil24hAgo() {
        let totalZilAmount = 0;
        for (let ticker in this.zrcTokenPropertiesListMap_) {
            let currPersonalStatus = this.getZilswapPairPersonalStatus24hAgo(ticker);
            if (!currPersonalStatus) {
                continue;
            }
            totalZilAmount += 2.0 * currPersonalStatus.zilAmount;
        }

        // Include from Xcad Dex
        if (this.xcadDexStatus_) {
            let totalXcadAmount = this.xcadDexStatus_.getAllPersonalBalanceInXcad24hAgo();
            let xcadPriceInZil = this.getZrcPriceInZil24hAgo('XCAD');
            if (xcadPriceInZil && totalXcadAmount) {
                totalZilAmount += xcadPriceInZil * totalXcadAmount;
            }
        }

        return totalZilAmount;
    }

    computePersonalPublicDataRpcIfDataNoExist(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        let self = this;
        this.xcadDexStatus_.computePersonalPublicDataRpcIfDataNoExist(
            beforeRpcCallback,
            /* successCallback= */
            function () {
                self.computeZilswapPairPublicPersonalStatusMap();
                self.bindViewIfDataExist();
                self.bindViewPersonalDataIfDataExist();
                onSuccessCallback();
            },
            onErrorCallback);

        // If data is already loaded, do not perform RPC.
        if (this.hasBalanceData()) {
            beforeRpcCallback();
            this.computeZilswapPairPublicPersonalStatusMap();
            this.bindViewIfDataExist();
            this.bindViewPersonalDataIfDataExist();
            onSuccessCallback(); // Call success callback as if the RPC is successful.
            return;
        }

        this.computePersonalPublicDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback);
    }

    computePersonalPublicDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        let self = this;
        this.xcadDexStatus_.computePersonalPublicDataRpc(
            beforeRpcCallback,
            /* successCallback= */
            function () {
                self.computeZilswapPairPublicPersonalStatusMap();
                self.bindViewIfDataExist();
                self.bindViewPersonalDataIfDataExist();
                onSuccessCallback();
            },
            onErrorCallback);

        beforeRpcCallback();
        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractState",
            /* params= */
            [this.zilswapDexAddressBase16_.substring(2)],
            /* successCallback= */
            function (data) {
                self.zilswapDexSmartContractStateData_ = data;
                self.computeZilswapPairPublicPersonalStatusMap();
                self.bindViewIfDataExist();
                self.bindViewPersonalDataIfDataExist();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    computePublicDataRpcIfDataNoExist(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        let self = this;
        this.xcadDexStatus_.computePublicDataRpcIfDataNoExist(
            beforeRpcCallback,
            /* successCallback= */
            function () {
                self.computeZilswapPairPublicPersonalStatusMap();
                self.bindViewIfDataExist();
                onSuccessCallback();
            },
            onErrorCallback);

        // If data is already loaded, do not perform RPC.
        if (this.zilswapDexSmartContractStateData_) {
            beforeRpcCallback();
            this.computeZilswapPairPublicPersonalStatusMap();
            this.bindViewIfDataExist();
            onSuccessCallback(); // Call success callback as if the RPC is successful.
            return;
        }

        this.computePublicDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback);
    }

    computePublicDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        let self = this;
        this.xcadDexStatus_.computePublicDataRpc(
            beforeRpcCallback,
            /* successCallback= */
            function () {
                self.computeZilswapPairPublicPersonalStatusMap();
                self.bindViewIfDataExist();
                onSuccessCallback();
            },
            onErrorCallback);

        beforeRpcCallback();
        queryZilliqaApiAjax(
            /* method= */
            "GetSmartContractSubState",
            /* params= */
            [this.zilswapDexAddressBase16_.substring(2), "pools", []],
            /* successCallback= */
            function (data) {
                self.zilswapDexSmartContractStateData_ = data;
                self.computeZilswapPairPublicPersonalStatusMap();
                self.bindViewIfDataExist();
                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    /** Private method */
    bindViewPersonalDataIfDataExist() {
        let zilPriceInFiatFloat = null;
        let zilPriceInFiat24hAgoFloat = null;
        let decimals = 2;
        if (this.coinPriceStatus_) {
            zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
            if (zilPriceInFiatFloat) {
                decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;
            }
            zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');
        }

        for (let ticker in this.zrcTokenPropertiesListMap_) {

            // To get ZilswapLp balance and Total pool status
            let zilswapSinglePairPersonalStatus = this.getZilswapPairPersonalStatus(ticker);
            if (zilswapSinglePairPersonalStatus) {
                let poolSharePercent = parseFloat((zilswapSinglePairPersonalStatus.shareRatio) * 100).toPrecision(3);
                let zilAmount = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus.zilAmount, /* decimals= */ 0);
                let zrcTokenAmount = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus.zrcTokenAmount, /* decimals= */ 0);

                let balanceInZilAmount = 2.0 * zilswapSinglePairPersonalStatus.zilAmount;
                let balanceInZilAmountString = convertNumberQaToDecimalString(balanceInZilAmount, /* decimals= */ 0);

                // Bind view basic information and balance in ZIL
                if (poolSharePercent && zilAmount && zrcTokenAmount && balanceInZilAmountString) {
                    this.bindViewZrcTokenLpBalance(poolSharePercent, zilAmount, zrcTokenAmount, balanceInZilAmountString, 'zilswap', ticker);
                }
                // Bind view fiat total
                if (zilPriceInFiatFloat) {
                    let lpBalanceFiat = zilPriceInFiatFloat * balanceInZilAmount;
                    let lpBalanceFiatString = commafyNumberToString(lpBalanceFiat, decimals);
                    this.bindViewZrcTokenLpBalanceFiat(lpBalanceFiatString, 'zilswap', ticker);
                }

                // If there is a 24h ago data
                let zilswapSinglePairPersonalStatus24hAgo = this.getZilswapPairPersonalStatus24hAgo(ticker);
                if (zilswapSinglePairPersonalStatus24hAgo) {
                    let poolSharePercent24hAgo = parseFloat((zilswapSinglePairPersonalStatus24hAgo.shareRatio) * 100).toPrecision(3);
                    let zilAmount24hAgo = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus24hAgo.zilAmount, /* decimals= */ 0);
                    let zrcTokenAmount24hAgo = convertNumberQaToDecimalString(zilswapSinglePairPersonalStatus24hAgo.zrcTokenAmount, /* decimals= */ 0);

                    let balanceInZilAmount24hAgo = 2.0 * zilswapSinglePairPersonalStatus24hAgo.zilAmount;
                    let balanceInZilAmount24hAgoString = convertNumberQaToDecimalString(balanceInZilAmount24hAgo, /* decimals= */ 0);
                    let balanceInZilPercentChange24h = getPercentChange(zilswapSinglePairPersonalStatus.zilAmount, zilswapSinglePairPersonalStatus24hAgo.zilAmount).toFixed(1);

                    if (poolSharePercent24hAgo && zilAmount24hAgo && zrcTokenAmount24hAgo && balanceInZilAmount24hAgoString) {
                        this.bindViewZrcTokenLpBalance24hAgo(poolSharePercent24hAgo, zilAmount24hAgo, zrcTokenAmount24hAgo, balanceInZilAmount24hAgoString, balanceInZilPercentChange24h, 'zilswap', ticker);
                    }
                    // Bind view fiat total
                    if (zilPriceInFiat24hAgoFloat) {
                        let lpBalanceFiat = zilPriceInFiatFloat * balanceInZilAmount;
                        let lpBalanceFiat24hAgo = zilPriceInFiat24hAgoFloat * balanceInZilAmount24hAgo;
                        let lpBalanceFiat24hAgoString = commafyNumberToString(lpBalanceFiat24hAgo, decimals);
                        let lpBalanceFiatPercentChange24h = getPercentChange(lpBalanceFiat, lpBalanceFiat24hAgo).toFixed(1);
                        this.bindViewZrcTokenLpBalanceFiat24hAgo(lpBalanceFiat24hAgoString, lpBalanceFiatPercentChange24h, 'zilswap', ticker);
                    }
                }
            }

            // To get Xcad Lp balance and total pool status
            if (this.xcadDexStatus_) {
                let xcadSinglePairPersonalStatus = this.xcadDexStatus_.getXcadPairPersonalStatus(ticker);
                if (xcadSinglePairPersonalStatus) {
                    let poolSharePercent = parseFloat((xcadSinglePairPersonalStatus.shareRatio) * 100).toPrecision(3);
                    let xcadAmount = convertNumberQaToDecimalString(xcadSinglePairPersonalStatus.xcadAmount, /* decimals= */ 0);
                    let zrcTokenAmount = convertNumberQaToDecimalString(xcadSinglePairPersonalStatus.zrcTokenAmount, /* decimals= */ 0);

                    let balanceInZilAmount = 2.0 * xcadSinglePairPersonalStatus.xcadAmount * this.getZrcPriceInZil('XCAD');
                    let balanceInZilAmountString = convertNumberQaToDecimalString(balanceInZilAmount, /* decimals= */ 0);

                    if (poolSharePercent && xcadAmount && zrcTokenAmount && balanceInZilAmountString) {
                        this.bindViewZrcTokenLpBalance(poolSharePercent, xcadAmount, zrcTokenAmount, balanceInZilAmountString, 'xcaddex', ticker);
                    }
                    // Bind view fiat total
                    if (zilPriceInFiatFloat) {
                        let lpBalanceFiat = zilPriceInFiatFloat * balanceInZilAmount;
                        let lpBalanceFiatString = commafyNumberToString(lpBalanceFiat, decimals);
                        this.bindViewZrcTokenLpBalanceFiat(lpBalanceFiatString, 'xcaddex', ticker);
                    }

                    // If there is a 24h ago data
                    let xcadSinglePairPersonalStatus24hAgo = this.xcadDexStatus_.getXcadPairPersonalStatus24hAgo(ticker);
                    if (xcadSinglePairPersonalStatus24hAgo) {
                        let poolSharePercent24hAgo = parseFloat((xcadSinglePairPersonalStatus24hAgo.shareRatio) * 100).toPrecision(3);
                        let xcadAmount24hAgo = convertNumberQaToDecimalString(xcadSinglePairPersonalStatus24hAgo.xcadAmount, /* decimals= */ 0);
                        let zrcTokenAmount24hAgo = convertNumberQaToDecimalString(xcadSinglePairPersonalStatus24hAgo.zrcTokenAmount, /* decimals= */ 0);

                        let balanceInZilAmount24hAgo = 2.0 * xcadSinglePairPersonalStatus24hAgo.xcadAmount * this.getZrcPriceInZil24hAgo('XCAD');
                        let balanceInZilAmount24hAgoString = convertNumberQaToDecimalString(balanceInZilAmount24hAgo, /* decimals= */ 0);
                        let balanceInZilPercentChange24h = getPercentChange(balanceInZilAmount, balanceInZilAmount24hAgo).toFixed(1);

                        if (poolSharePercent24hAgo && xcadAmount24hAgo && zrcTokenAmount24hAgo && balanceInZilAmount24hAgoString) {
                            this.bindViewZrcTokenLpBalance24hAgo(poolSharePercent24hAgo, xcadAmount24hAgo, zrcTokenAmount24hAgo, balanceInZilAmount24hAgoString, balanceInZilPercentChange24h, 'xcaddex', ticker);
                        }
                        // Bind view fiat total
                        if (zilPriceInFiat24hAgoFloat) {
                            let lpBalanceFiat = zilPriceInFiatFloat * balanceInZilAmount;
                            let lpBalanceFiat24hAgo = zilPriceInFiat24hAgoFloat * balanceInZilAmount24hAgo;
                            let lpBalanceFiat24hAgoString = commafyNumberToString(lpBalanceFiat24hAgo, decimals);
                            let lpBalanceFiatPercentChange24h = getPercentChange(lpBalanceFiat, lpBalanceFiat24hAgo).toFixed(1);
                            this.bindViewZrcTokenLpBalanceFiat24hAgo(lpBalanceFiat24hAgoString, lpBalanceFiatPercentChange24h, 'xcaddex', ticker);
                        }
                    }
                }
            }
        }
    }

    bindViewIfDataExist() {
        for (let key in this.zrcTokenPropertiesListMap_) {
            let zrcTokenProperties = this.zrcTokenPropertiesListMap_[key];

            let zrcTokenPriceInZilNumber = this.getZrcPriceInZilWithFallback(key);
            // If the token is not present in Zilswap dex, we can stop processing this token.
            if (!zrcTokenPriceInZilNumber) {
                this.bindViewZrcTokenPriceInZil("0", "0", zrcTokenProperties.ticker);
                this.bindViewZrcTokenPriceInFiat("0", zrcTokenProperties.ticker);
                this.bindViewZrcTokenLpTotalPoolBalanceFiat("0", zrcTokenProperties.ticker);
                continue;
            }
            // ZRC token price in ZIL
            let userFriendlyZrcTokenPriceInZil = convertNumberQaToDecimalString(zrcTokenPriceInZilNumber, /* decimals= */ 0);
            let publicUserFriendlyZrcTokenPriceInZil = commafyNumberToString(zrcTokenPriceInZilNumber, 2);
            this.bindViewZrcTokenPriceInZil(userFriendlyZrcTokenPriceInZil, publicUserFriendlyZrcTokenPriceInZil, zrcTokenProperties.ticker)

            // ZRC token price in ZIL 24h ago
            let zrcTokenPriceInZilNumber24hAgo = this.getZrcPriceInZil24hAgoWithFallback(key);
            if (!zrcTokenPriceInZilNumber24hAgo) {
                continue;
            }
            let zrcTokenPriceInZilPercentChange24h = getPercentChange(zrcTokenPriceInZilNumber, zrcTokenPriceInZilNumber24hAgo).toFixed(1);
            this.bindViewZrcTokenPriceInZil24hAgo(zrcTokenPriceInZilPercentChange24h, zrcTokenProperties.ticker);
        }

        this.bindViewZrcTokenPriceFiat();
        this.bindViewZrcTokenCirculatingSupplyZilFiat();
        this.bindViewZrcTokenTotalSupplyZilFiat();
    }

    /** Private method */
    bindViewZrcTokenPriceFiat() {
        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1000) ? 0 : 2;
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');

        for (let ticker in this.zrcTokenPropertiesListMap_) {

            let zrcTokenPriceInZil = this.getZrcPriceInZilWithFallback(ticker);
            if (Number.isNaN(zrcTokenPriceInZil) || zrcTokenPriceInZil === null) {
                continue;
            }

            // ZRC token price in fiat
            let zrcTokenPriceInFiat = 1.0 * zilPriceInFiatFloat * zrcTokenPriceInZil;
            let zrcTokenPriceInFiatString = commafyNumberToString(zrcTokenPriceInFiat, decimals);

            this.bindViewZrcTokenPriceInFiat(zrcTokenPriceInFiatString, ticker);

            // ZRC token price in fiat 24h ago
            let zrcTokenPriceInZil24hAgo = this.getZrcPriceInZil24hAgoWithFallback(ticker);
            if (zilPriceInFiat24hAgoFloat && zrcTokenPriceInZil24hAgo) {
                let zrcTokenPriceInFiat24hAgo = 1.0 * zilPriceInFiat24hAgoFloat * zrcTokenPriceInZil24hAgo;
                let zrcTokenPriceInFiatPercentChange24h = getPercentChange(zrcTokenPriceInFiat, zrcTokenPriceInFiat24hAgo).toFixed(1);
                this.bindViewZrcTokenPriceInFiat24hAgo(zrcTokenPriceInFiatPercentChange24h, ticker);
            }

            // public total pool container in fiat
            let zilswapSinglePairPublicStatus = this.getZilswapPairPublicStatus(ticker);
            let lpTotalPoolBalanceFiat = 0;
            if (zilswapSinglePairPublicStatus) {
                let zilLpBalance = zilswapSinglePairPublicStatus.totalPoolZilAmount;
                // total worth is always times 2 (e.g., ZRC2-ZIL pair always have 50:50 value).
                // For now ZilSwap only support 50-50 weight pair.
                let zilswapLpTotalPoolBalanceFiat = 1.0 * zilPriceInFiatFloat * (zilLpBalance * 2.0);
                lpTotalPoolBalanceFiat += zilswapLpTotalPoolBalanceFiat;
            }
            
            if (this.xcadDexStatus_) {
                let xcadSinglePairPublicStatus = this.xcadDexStatus_.getXcadPairPublicStatus(ticker);
                let xcadPriceInZil = this.getZrcPriceInZil('XCAD');
                if (xcadSinglePairPublicStatus && xcadPriceInZil) {
                    let xcadLpBalance = xcadSinglePairPublicStatus.totalPoolXcadAmount;
                    let xcadLpTotalPoolBalanceFiat = 1.0 * zilPriceInFiatFloat * xcadPriceInZil * (xcadLpBalance * 2.0);
                    lpTotalPoolBalanceFiat += xcadLpTotalPoolBalanceFiat;
                }
            }
            let lpTotalPoolBalanceFiatString = commafyNumberToString(lpTotalPoolBalanceFiat, /* decimals= */ 0);
            this.bindViewZrcTokenLpTotalPoolBalanceFiat(lpTotalPoolBalanceFiatString, ticker);
        }
    }

    bindViewZrcTokenCirculatingSupplyZilFiat() {
        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        if (!this.zrcTokensCirculatingSupplyData_) {
            return;
        }

        for (let ticker in this.zrcTokensCirculatingSupplyData_) {
            let zrcCirculatingSupply = this.getCirculatingSupply(ticker);
            if (!zrcCirculatingSupply) {
                continue;
            }
            let zrcCirculatingSupplyString = convertNumberQaToDecimalString(zrcCirculatingSupply, /* decimals= */ 0);
            this.bindViewZrcTokenCirculatingSupply(zrcCirculatingSupplyString, ticker);

            let zrcTokenPriceInZil = this.getZrcPriceInZilWithFallback(ticker);
            if (!zrcTokenPriceInZil) {
                continue;
            }

            let zrcCirculatingSupplyInFiat = 1.0 * zrcCirculatingSupply * zrcTokenPriceInZil * zilPriceInFiatFloat;
            let zrcCirculatingSupplyInFiatString = commafyNumberToString(zrcCirculatingSupplyInFiat, /* decimals= */ 0);
            this.bindViewZrcTokenCirculatingSupplyFiat(zrcCirculatingSupplyInFiatString, ticker);
        }
    }

    bindViewZrcTokenTotalSupplyZilFiat() {
        if (!this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        if (!this.zrcTokensTotalSupplyData_) {
            return;
        }

        for (let ticker in this.zrcTokensTotalSupplyData_) {
            let zrcTokenProperties = this.zrcTokenPropertiesListMap_[ticker];
            if (!zrcTokenProperties) {
                continue;
            }
            let zrcTotalSupply = parseInt(this.zrcTokensTotalSupplyData_[ticker]);
            if (!zrcTotalSupply) {
                continue;
            }

            zrcTotalSupply = zrcTotalSupply / Math.pow(10, zrcTokenProperties.decimals);
            let zrcTotalSupplyString = convertNumberQaToDecimalString(zrcTotalSupply, /* decimals= */ 0);
            this.bindViewZrcTokenTotalSupply(zrcTotalSupplyString, ticker);

            let zrcTokenPriceInZil = this.getZrcPriceInZilWithFallback(ticker);
            if (!zrcTokenPriceInZil) {
                continue;
            }
            let zrcTotalSupplyInFiat = 1.0 * zrcTotalSupply * zrcTokenPriceInZil * zilPriceInFiatFloat;
            let zrcTotalSupplyInFiatString = commafyNumberToString(zrcTotalSupplyInFiat, /* decimals= */ 0);
            this.bindViewZrcTokenTotalSupplyFiat(zrcTotalSupplyInFiatString, ticker);
        }
    }


    /** Private static method. public. */
    bindViewZrcTokenPriceInZil24hAgo(publicZrcTokenPriceInZilPercentChange24h, ticker) {
        $('.' + ticker + '_price_zil_percent_change_past_range').text(publicZrcTokenPriceInZilPercentChange24h);
        bindViewPercentChangeColorContainer('.' + ticker + '_price_zil_percent_change_past_range_container', publicZrcTokenPriceInZilPercentChange24h);
    }

    /** Private static method. public. */
    bindViewZrcTokenPriceInZil(zrcTokenPriceInZil, publicZrcTokenPriceInZil, ticker) {
        $('.' + ticker + '_price_zil').text(zrcTokenPriceInZil);
        $('#public_' + ticker + '_price_zil').text(publicZrcTokenPriceInZil);
    }

    /** Private static method. public. */
    bindViewZrcTokenPriceInFiat24hAgo(zrcTokenPriceInFiatPercentChange24h, ticker) {
        $('.' + ticker + '_price_fiat_percent_change_past_range').text(zrcTokenPriceInFiatPercentChange24h);
        bindViewPercentChangeColorContainer('.' + ticker + '_price_fiat_percent_change_past_range_container', zrcTokenPriceInFiatPercentChange24h);
    }

    /** Private static method. public. */
    bindViewZrcTokenPriceInFiat(zrcTokenPriceInFiat, ticker) {
        $('#public_' + ticker + '_price_fiat').text(zrcTokenPriceInFiat);
    }

    /** Private static method. public. */
    bindViewZrcTokenLpTotalPoolBalanceFiat(lpTotalPoolBalanceFiat, ticker) {
        $('#' + ticker + '_lp_total_pool_fiat').text(lpTotalPoolBalanceFiat);
    }

    /** Private static method. Personal. */
    bindViewZrcTokenLpBalance24hAgo(poolSharePercent24hAgo, zilBalance24hAgo, zrcBalance24hAgo, balanceInZil24hAgo, balanceInZilPercentChange24h, dexName, ticker) {
        $('#' + dexName + '_' + ticker + '_lp_pool_share_percent_past_range_ago').text(poolSharePercent24hAgo);
        $('#' + dexName + '_' + ticker + '_lp_base_token_balance_past_range_ago').text(zilBalance24hAgo);
        $('#' + dexName + '_' + ticker + '_lp_token_balance_past_range_ago').text(zrcBalance24hAgo);
        $('#' + dexName + '_' + ticker + '_lp_balance_zil_past_range_ago').text(balanceInZil24hAgo);
        $('#' + dexName + '_' + ticker + '_lp_balance_zil_percent_change_past_range').text(balanceInZilPercentChange24h);
        bindViewPercentChangeColorContainer('#' + dexName + '_' + ticker + '_lp_balance_zil_percent_change_past_range_container', balanceInZilPercentChange24h);
    }

    /** Private static method. Personal. */
    bindViewZrcTokenLpBalance(poolSharePercent, zilBalance, zrcBalance, balanceInZil, dexName, ticker) {
        $('#' + dexName + '_' + ticker + '_lp_pool_share_percent').text(poolSharePercent);
        $('#' + dexName + '_' + ticker + '_lp_base_token_balance').text(zilBalance);
        $('#' + dexName + '_' + ticker + '_lp_token_balance').text(zrcBalance);
        $('#' + dexName + '_' + ticker + '_lp_balance_zil').text(balanceInZil);
        $('#' + dexName + '_' + ticker + '_lp_container').show();
        $('#lp_container').show();
    }

    /** Private static method. Personal. */
    bindViewZrcTokenLpBalanceFiat24hAgo(lpBalanceFiat24hAgo, lpBalanceFiatPercentChange24h, dexName, ticker) {
        $('#' + dexName + '_' + ticker + '_lp_balance_fiat_past_range_ago').text(lpBalanceFiat24hAgo);
        $('#' + dexName + '_' + ticker + '_lp_balance_fiat_percent_change_past_range').text(lpBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#' + dexName + '_' + ticker + '_lp_balance_fiat_percent_change_past_range_container', lpBalanceFiatPercentChange24h);
    }

    /** Private static method. Personal. */
    bindViewZrcTokenLpBalanceFiat(lpBalanceFiat, dexName, ticker) {
        $('#' + dexName + '_' + ticker + '_lp_balance_fiat').text(lpBalanceFiat);
    }

    resetPersonalView() {
        $('#lp_container').hide();
        for (let ticker in this.zrcTokenPropertiesListMap_) {

            let length = this.zrcTokenPropertiesListMap_[ticker].supported_dex.length;
            for (let i = 0; i < length; i++) {
                let dexName = this.zrcTokenPropertiesListMap_[ticker].supported_dex[i];

                $('#' + dexName + '_' + ticker + '_lp_container').hide();

                $('#' + dexName + '_' + ticker + '_lp_pool_share_percent').text('Loading...');
                $('#' + dexName + '_' + ticker + '_lp_pool_share_percent_past_range_ago').text('');

                $('#' + dexName + '_' + ticker + '_lp_base_token_balance').text('');
                $('#' + dexName + '_' + ticker + '_lp_base_token_balance_past_range_ago').text('');
                $('#' + dexName + '_' + ticker + '_lp_token_balance').text('');
                $('#' + dexName + '_' + ticker + '_lp_token_balance_past_range_ago').text('');

                $('#' + dexName + '_' + ticker + '_lp_balance_zil').text('');
                $('#' + dexName + '_' + ticker + '_lp_balance_zil_past_range_ago').text('');
                $('#' + dexName + '_' + ticker + '_lp_balance_zil_percent_change_past_range').text('');

                $('#' + dexName + '_' + ticker + '_lp_balance_fiat').text('Loading...');
                $('#' + dexName + '_' + ticker + '_lp_balance_fiat_past_range_ago').text('');
                $('#' + dexName + '_' + ticker + '_lp_balance_fiat_percent_change_past_range').text('');
            }
        }
    }

    /** Private static method. Public. */
    bindViewZrcTokenCirculatingSupply(zrcTokenCirculatingSupply, ticker) {
        $('#' + ticker + '_circulating_supply_zrc').text(zrcTokenCirculatingSupply);
    }

    /** Private static method. Public. */
    bindViewZrcTokenCirculatingSupplyFiat(zrcTokenCirculatingSupplyFiat, ticker) {
        $('#' + ticker + '_circulating_supply_fiat').text(zrcTokenCirculatingSupplyFiat);
    }

    /** Private static method. Public. */
    bindViewZrcTokenTotalSupply(zrcTokenTotalSupply, ticker) {
        $('#' + ticker + '_total_supply_zrc').text(zrcTokenTotalSupply);
    }

    /** Private static method. Public. */
    bindViewZrcTokenTotalSupplyFiat(zrcTokenTotalSupplyFiat, ticker) {
        $('#' + ticker + '_total_supply_fiat').text(zrcTokenTotalSupplyFiat);
    }
}

if (typeof exports !== 'undefined') {
    if (typeof convertNumberQaToDecimalString === 'undefined') {
        FormattingUtils = require('./formatting_utils.js');
        convertNumberQaToDecimalString = FormattingUtils.convertNumberQaToDecimalString;
        commafyNumberToString = FormattingUtils.commafyNumberToString;
    }
    if (typeof getZilswapSinglePairPublicStatusFromDexState === 'undefined') {
        TokenUtils = require('./token_utils.js');
        getPercentChange = TokenUtils.getPercentChange;
        getZilswapSinglePairShareRatio = TokenUtils.getZilswapSinglePairShareRatio;
        getZilswapSinglePairPublicStatusFromDexState = TokenUtils.getZilswapSinglePairPublicStatusFromDexState;
        getZilswapSinglePairPersonalStatus = TokenUtils.getZilswapSinglePairPersonalStatus;
        ZilswapSinglePairPublicStatus = TokenUtils.ZilswapSinglePairPublicStatus;
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