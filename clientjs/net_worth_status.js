/** A class to represent global net worth status.  */
class NetWorthStatus {

    constructor(/* nullable= */ barChartDrawer, /* nullable= */ coinPriceStatus, /* nullable= */ zilswapDexStatus, /* nullable= */ walletBalanceStatus, /* nullable= */ stakingBalanceStatus) {
        // Private variable
        this.barChartDrawer_ = barChartDrawer;
        this.coinPriceStatus_ = coinPriceStatus;
        this.zilswapDexStatus_ = zilswapDexStatus;
        this.walletBalanceStatus_ = walletBalanceStatus
        this.stakingBalanceStatus_ = stakingBalanceStatus;

        this.lastWalletBalanceInZil_ = 0;
        this.lastLpBalanceInZil_ = 0;
        this.lastStakingBalanceInZil_ = 0;
    }

    /**
     * Callback method to be executed if any properties in coinPriceStatus_ is changed.
     */
    onCoinPriceStatusChange() {
        this.bindViewWalletBalanceFiat();
        this.bindViewLpBalanceFiat();
        this.bindViewStakingBalanceFiat();

        this.bindViewNetWorthZilFiat();
    }

    /**
     * Callback method to be executed if any properties in zilswapDexStatus_ is changed.
     */
    onZilswapDexStatusChange() {
        this.bindViewWalletBalanceZil();
        this.bindViewWalletBalanceFiat();
        this.bindViewLpBalanceZil();
        this.bindViewLpBalanceFiat();
        this.bindViewStakingBalanceZil();
        this.bindViewStakingBalanceFiat();

        this.bindViewNetWorthZilFiat();
    }

    /**
     * Callback method to be executed if any properties in zilswapDexStatus_ is changed.
     */
    onWalletBalanceStatusChange() {
        this.bindViewWalletBalanceZil();
        this.bindViewWalletBalanceFiat();

        this.bindViewNetWorthZilFiat();
    }

    /**
     * Callback method to be executed if any properties in zilswapDexStatus_ is changed.
     */
    onStakingBalanceStatusChange() {
        this.bindViewStakingBalanceZil();
        this.bindViewStakingBalanceFiat();

        this.bindViewNetWorthZilFiat();
    }

    reset() {
        this.resetViewWalletBalance();
        this.resetViewLpBalance();
        this.resetViewStakingBalance();
        this.resetViewNetWorth();
    }

    bindViewWalletBalanceZil() {
        if (!this.walletBalanceStatus_) {
            return;
        }

        // Balance in ZIL
        let totalWalletBalanceInZil = this.walletBalanceStatus_.getAllTokenBalanceInZil();
        let totalWalletBalanceInZilString = convertNumberQaToDecimalString(totalWalletBalanceInZil, /* decimals= */ 0);
        this.bindViewTotalWalletBalanceZil(totalWalletBalanceInZilString);

        // Balance in ZIL 24h Ago
        let totalWalletBalanceInZil24hAgo = this.walletBalanceStatus_.getAllTokenBalanceInZil24hAgo();
        let totalWalletBalanceInZil24hAgoString = convertNumberQaToDecimalString(totalWalletBalanceInZil24hAgo, /* decimals= */ 0);
        let totalWalletBalanceInZil24hAgoPercentChange = getPercentChange(totalWalletBalanceInZil, totalWalletBalanceInZil24hAgo).toFixed(1);
        this.bindViewTotalWalletBalanceZil24hAgo(totalWalletBalanceInZil24hAgoString, totalWalletBalanceInZil24hAgoPercentChange);
    }

    bindViewWalletBalanceFiat() {
        if (!this.walletBalanceStatus_ || !this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        // Balance in fiat
        let totalWalletBalanceInZil = this.walletBalanceStatus_.getAllTokenBalanceInZil();
        let totalWalletBalanceInFiat = 1.0 * totalWalletBalanceInZil * zilPriceInFiatFloat;
        let totalWalletBalanceInFiatString = commafyNumberToString(totalWalletBalanceInFiat, decimals);
        this.bindViewTotalWalletBalanceFiat(totalWalletBalanceInFiatString);

        // Balance in fiat 24h Ago
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');
        if (!zilPriceInFiat24hAgoFloat) {
            return;
        }
        let totalWalletBalanceInZil24hAgo = this.walletBalanceStatus_.getAllTokenBalanceInZil24hAgo();
        let totalWalletBalanceInFiat24hAgo = 1.0 * totalWalletBalanceInZil24hAgo * zilPriceInFiat24hAgoFloat;
        let totalWalletBalanceInFiat24hAgoString = commafyNumberToString(totalWalletBalanceInFiat24hAgo, decimals);
        let totalWalletBalanceInFiat24hAgoPercentChange = getPercentChange(totalWalletBalanceInFiat, totalWalletBalanceInFiat24hAgo).toFixed(1);
        this.bindViewTotalWalletBalanceFiat24hAgo(totalWalletBalanceInFiat24hAgoString, totalWalletBalanceInFiat24hAgoPercentChange);
    }

    bindViewLpBalanceZil() {
        if (!this.zilswapDexStatus_) {
            return;
        }

        // Balance in ZIL
        let totalLpBalanceInZil = this.zilswapDexStatus_.getAllPersonalBalanceInZil();
        let totalLpBalanceInZilString = convertNumberQaToDecimalString(totalLpBalanceInZil, /* decimals= */ 0);
        this.bindViewTotalLpBalanceZil(totalLpBalanceInZilString);

        // Balance in ZIL 24h ago
        let totalLpBalanceInZil24hAgo = this.zilswapDexStatus_.getAllPersonalBalanceInZil24hAgo();
        let totalLpBalanceInZil24hAgoString = convertNumberQaToDecimalString(totalLpBalanceInZil24hAgo, /* decimals= */ 0);
        let totalLpBalanceInZil24hAgoPercentChange = getPercentChange(totalLpBalanceInZil, totalLpBalanceInZil24hAgo).toFixed(1);
        this.bindViewTotalLpBalanceZil24hAgo(totalLpBalanceInZil24hAgoString, totalLpBalanceInZil24hAgoPercentChange);
    }

    bindViewLpBalanceFiat() {
        if (!this.zilswapDexStatus_ || !this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        // Balance in fiat
        let totalLpBalanceInZil = this.zilswapDexStatus_.getAllPersonalBalanceInZil();
        let totalLpBalanceInFiat = 1.0 * totalLpBalanceInZil * zilPriceInFiatFloat;
        let totalLpBalanceInFiatString = commafyNumberToString(totalLpBalanceInFiat, decimals);
        this.bindViewTotalLpBalanceFiat(totalLpBalanceInFiatString);

        // Balance in fiat 24h Ago
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');
        if (!zilPriceInFiat24hAgoFloat) {
            return;
        }
        let totalLpBalanceInZil24hAgo = this.zilswapDexStatus_.getAllPersonalBalanceInZil24hAgo();
        let totalLpBalanceInFiat24hAgo = 1.0 * totalLpBalanceInZil24hAgo * zilPriceInFiat24hAgoFloat;
        let totalLpBalanceInFiat24hAgoString = commafyNumberToString(totalLpBalanceInFiat24hAgo, decimals);
        let totalLpBalanceInFiat24hAgoPercentChange = getPercentChange(totalLpBalanceInFiat, totalLpBalanceInFiat24hAgo).toFixed(1);
        this.bindViewTotalLpBalanceFiat24hAgo(totalLpBalanceInFiat24hAgoString, totalLpBalanceInFiat24hAgoPercentChange);
    }

    bindViewStakingBalanceZil() {
        if (!this.stakingBalanceStatus_) {
            return;
        }
        // Balance in ZIL
        let totalStakingBalanceInZil = this.stakingBalanceStatus_.getAllStakingBalanceInZil();
        let totalStakingBalanceInZilString = convertNumberQaToDecimalString(totalStakingBalanceInZil, /* decimals= */ 0);
        this.bindViewTotalStakingBalanceZil(totalStakingBalanceInZilString);

        // Balance in ZIL 24h ago
        let totalStakingBalanceInZil24hAgo = this.stakingBalanceStatus_.getAllStakingBalanceInZil24hAgo();
        let totalStakingBalanceInZil24hAgoString = convertNumberQaToDecimalString(totalStakingBalanceInZil24hAgo, /* decimals= */ 0);
        let totalStakingBalanceInZil24hAgoPercentChange = getPercentChange(totalStakingBalanceInZil, totalStakingBalanceInZil24hAgo).toFixed(1);
        this.bindViewTotalStakingBalanceZil24hAgo(totalStakingBalanceInZil24hAgoString, totalStakingBalanceInZil24hAgoPercentChange);
    }

    bindViewStakingBalanceFiat() {
        if (!this.stakingBalanceStatus_ || !this.coinPriceStatus_) {
            return;
        }
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        // Balance in fiat
        let totalStakingBalanceInZil = this.stakingBalanceStatus_.getAllStakingBalanceInZil();
        let totalStakingBalanceInFiat = 1.0 * totalStakingBalanceInZil * zilPriceInFiatFloat;
        let totalStakingBalanceInFiatString = commafyNumberToString(totalStakingBalanceInFiat, decimals);
        this.bindViewTotalStakingBalanceFiat(totalStakingBalanceInFiatString);

        // Balance in fiat 24h ago
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');
        if (!zilPriceInFiat24hAgoFloat) {
            return;
        }
        let totalStakingBalanceInZil24hAgo = this.stakingBalanceStatus_.getAllStakingBalanceInZil24hAgo();
        let totalStakingBalanceInFiat24hAgo = 1.0 * totalStakingBalanceInZil24hAgo * zilPriceInFiat24hAgoFloat;
        let totalStakingBalanceInFiat24hAgoString = commafyNumberToString(totalStakingBalanceInFiat24hAgo, decimals);
        let totalStakingBalanceInFiat24hAgoPercentChange = getPercentChange(totalStakingBalanceInFiat, totalStakingBalanceInFiat24hAgo).toFixed(1);
        this.bindViewTotalStakingBalanceFiat24hAgo(totalStakingBalanceInFiat24hAgoString, totalStakingBalanceInFiat24hAgoPercentChange);
    }

    bindViewNetWorthZilFiat() {
        if (!this.walletBalanceStatus_ || !this.zilswapDexStatus_ || !this.stakingBalanceStatus_) {
            return;
        }

        // balance in ZIL
        let totalNetWorthInZil = 0;

        this.lastWalletBalanceInZil_ = this.walletBalanceStatus_.getAllTokenBalanceInZil();
        this.lastLpBalanceInZil_ = this.zilswapDexStatus_.getAllPersonalBalanceInZil();
        this.lastStakingBalanceInZil_ = this.stakingBalanceStatus_.getAllStakingBalanceInZil();
        totalNetWorthInZil += this.lastWalletBalanceInZil_;
        totalNetWorthInZil += this.lastLpBalanceInZil_;
        totalNetWorthInZil += this.lastStakingBalanceInZil_;

        let totalNetWorthInZilString = convertNumberQaToDecimalString(totalNetWorthInZil, /* decimals= */ 0);
        this.bindViewTotalNetWorthZil(totalNetWorthInZilString);

        // balance in ZIL 24h Ago
        let totalNetWorthInZil24hAgo = 0;
        totalNetWorthInZil24hAgo += this.walletBalanceStatus_.getAllTokenBalanceInZil24hAgo();
        totalNetWorthInZil24hAgo += this.zilswapDexStatus_.getAllPersonalBalanceInZil24hAgo();
        totalNetWorthInZil24hAgo += this.stakingBalanceStatus_.getAllStakingBalanceInZil24hAgo();
        let totalNetWorthInZil24hAgoString = convertNumberQaToDecimalString(totalNetWorthInZil24hAgo, /* decimals= */ 0);
        let totalNetWorthInZil24hAgoPercentChange = getPercentChange(totalNetWorthInZil, totalNetWorthInZil24hAgo).toFixed(1);
        this.bindViewTotalNetWorthZil24hAgo(totalNetWorthInZil24hAgoString, totalNetWorthInZil24hAgoPercentChange);

        // balance in fiat
        let zilPriceInFiatFloat = this.coinPriceStatus_.getCoinPriceFiat('ZIL');
        if (!zilPriceInFiatFloat) {
            return;
        }
        let decimals = (zilPriceInFiatFloat > 1) ? 0 : 2;

        let totalNetWorthInFiat = 1.0 * totalNetWorthInZil * zilPriceInFiatFloat;
        let totalNetWorthInFiatString = commafyNumberToString(totalNetWorthInFiat, decimals);
        this.bindViewTotalNetWorthFiat(totalNetWorthInFiatString);

        // balance in fiat 24h ago
        let zilPriceInFiat24hAgoFloat = this.coinPriceStatus_.getCoinPriceFiat24hAgo('ZIL');
        if (!zilPriceInFiat24hAgoFloat) {
            return;
        }
        let totalNetWorthInFiat24hAgo = 1.0 * totalNetWorthInZil24hAgo * zilPriceInFiat24hAgoFloat;
        let totalNetWorthInFiat24hAgoString = commafyNumberToString(totalNetWorthInFiat24hAgo, decimals);
        let totalNetWorthInFiat24hAgoPercentChange = getPercentChange(totalNetWorthInFiat, totalNetWorthInFiat24hAgo).toFixed(1);
        this.bindViewTotalNetWorthFiat24hAgo(totalNetWorthInFiat24hAgoString, totalNetWorthInFiat24hAgoPercentChange);

        this.drawBarChart();
    }

    drawBarChart() {
        if (!this.barChartDrawer_) {
            return;
        }
        if (!this.lastWalletBalanceInZil_ && !this.lastLpBalanceInZil_ && !this.lastStakingBalanceInZil_) {
            return;
        }
        let walletBalanceInZil = Math.round(this.lastWalletBalanceInZil_);
        let lpBalanceInZil = Math.round(this.lastLpBalanceInZil_);
        let stakingBalanceInZil = Math.round(this.lastStakingBalanceInZil_);
        
        let customChartColor = ['#0094BA', '#88D581', '#135665'];
        let customChartColorDarkMode = ['#41C6DD', '#AED2AB', '#316B78'];
       
        let headerArray = ['Balance Type', 'Wallet', 'LP', 'Staking'];
        let dataArray = ['', walletBalanceInZil, lpBalanceInZil, stakingBalanceInZil];

        this.barChartDrawer_.drawBarChart( /* barChartDivId= */ 'net_worth_chart', headerArray, dataArray, customChartColor, customChartColorDarkMode);
    }

    /** ================ Total Wallet Balance =================== */

    /** Private static method */
    bindViewTotalWalletBalanceZil(totalWalletBalanceZil) {
        $('#wallet_balance_zil').text(totalWalletBalanceZil);
    }

    /** Private static method */
    bindViewTotalWalletBalanceZil24hAgo(totalWalletBalanceZil24hAgo, totalWalletBalanceZilPercentChange24h) {
        $('#wallet_balance_zil_24h_ago').text(totalWalletBalanceZil24hAgo);
        $('#wallet_balance_zil_percent_change_24h').text(totalWalletBalanceZilPercentChange24h);
        bindViewPercentChangeColorContainer('#wallet_balance_zil_percent_change_24h_container', totalWalletBalanceZilPercentChange24h);
    }

    /** Private static method */
    bindViewTotalWalletBalanceFiat(totalWalletBalanceFiat) {
        $('#wallet_balance_fiat').text(totalWalletBalanceFiat);
    }

    /** Private static method */
    bindViewTotalWalletBalanceFiat24hAgo(totalWalletBalanceFiat24hAgo, totalWalletBalanceFiatPercentChange24h) {
        $('#wallet_balance_fiat_24h_ago').text(totalWalletBalanceFiat24hAgo);
        $('#wallet_balance_fiat_percent_change_24h').text(totalWalletBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#wallet_balance_fiat_percent_change_24h_container', totalWalletBalanceFiatPercentChange24h);
    }

    resetViewWalletBalance() {
        $('#wallet_balance_zil_24h_ago').text('');
        $('#wallet_balance_zil_percent_change_24h').text('');
        $('#wallet_balance_fiat_24h_ago').text('');
        $('#wallet_balance_fiat_percent_change_24h').text('');
        $('#wallet_balance_zil').text('Loading...');
        $('#wallet_balance_fiat').text('Loading...');
    }

    /** ================ Total Lp Balance =================== */

    /** Private static method */
    bindViewTotalLpBalanceZil24hAgo(totalLpBalanceZil24hAgo, totalLpBalanceZilPercentChange24h) {
        $('#lp_balance_zil_24h_ago').text(totalLpBalanceZil24hAgo);
        $('#lp_balance_zil_percent_change_24h').text(totalLpBalanceZilPercentChange24h);
        bindViewPercentChangeColorContainer('#lp_balance_zil_percent_change_24h_container', totalLpBalanceZilPercentChange24h);
    }

    /** Private static method */
    bindViewTotalLpBalanceZil(totalLpBalanceZil) {
        $('#lp_balance_zil').text(totalLpBalanceZil);
    }

    /** Private static method */
    bindViewTotalLpBalanceFiat24hAgo(totalLpBalanceFiat24hAgo, totalLpBalanceFiatPercentChange24h) {
        $('#lp_balance_fiat_24h_ago').text(totalLpBalanceFiat24hAgo);
        $('#lp_balance_fiat_percent_change_24h').text(totalLpBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#lp_balance_fiat_percent_change_24h_container', totalLpBalanceFiatPercentChange24h);
    }

    /** Private static method */
    bindViewTotalLpBalanceFiat(totalLpBalanceFiat) {
        $('#lp_balance_fiat').text(totalLpBalanceFiat);
    }

    resetViewLpBalance() {
        $('#lp_balance_zil_24h_ago').text('');
        $('#lp_balance_zil_percent_change_24h').text('');
        $('#lp_balance_fiat_24h_ago').text('');
        $('#lp_balance_fiat_percent_change_24h').text('');
        $('#lp_balance_zil').text('Loading...');
        $('#lp_balance_fiat').text('Loading...');
    }

    /** ================ Total Staking Balance =================== */

    /** Private static method */
    bindViewTotalStakingBalanceZil24hAgo(totalStakingBalanceZil24hAgo, totalStakingBalanceZilPercentChange24h) {
        $('#staking_balance_zil_24h_ago').text(totalStakingBalanceZil24hAgo);
        $('#staking_balance_zil_percent_change_24h').text(totalStakingBalanceZilPercentChange24h);
        bindViewPercentChangeColorContainer('#staking_balance_zil_percent_change_24h_container', totalStakingBalanceZilPercentChange24h);
    }

    /** Private static method */
    bindViewTotalStakingBalanceZil(totalStakingBalanceZil) {
        $('#staking_balance_zil').text(totalStakingBalanceZil);
    }

    /** Private static method */
    bindViewTotalStakingBalanceFiat24hAgo(totalStakingBalanceFiat24hAgo, totalStakingBalanceFiatPercentChange24h) {
        $('#staking_balance_fiat_24h_ago').text(totalStakingBalanceFiat24hAgo);
        $('#staking_balance_fiat_percent_change_24h').text(totalStakingBalanceFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#staking_balance_fiat_percent_change_24h_container', totalStakingBalanceFiatPercentChange24h);
    }

    /** Private static method */
    bindViewTotalStakingBalanceFiat(totalStakingBalanceFiat) {
        $('#staking_balance_fiat').text(totalStakingBalanceFiat);
    }

    resetViewStakingBalance() {
        $('#staking_balance_zil_24h_ago').text('');
        $('#staking_balance_zil_percent_change_24h').text('');
        $('#staking_balance_fiat_24h_ago').text('');
        $('#staking_balance_fiat_percent_change_24h').text('');
        $('#staking_balance_zil').text('Loading...');
        $('#staking_balance_fiat').text('Loading...');
    }

    /** ================ Total Net Worth =================== */

    /** Private static method */
    bindViewTotalNetWorthZil24hAgo(totalNetWorthZil24hAgo, totalNetWorthZilPercentChange24h) {
        $('#net_worth_zil_24h_ago').text(totalNetWorthZil24hAgo);
        $('#net_worth_zil_percent_change_24h').text(totalNetWorthZilPercentChange24h);
        bindViewPercentChangeColorContainer('#net_worth_zil_percent_change_24h_container', totalNetWorthZilPercentChange24h);
    }

    /** Private static method */
    bindViewTotalNetWorthZil(totalNetWorthZil) {
        $('#net_worth_zil').text(totalNetWorthZil);
    }

    /** Private static method */
    bindViewTotalNetWorthFiat24hAgo(totalNetWorthFiat24hAgo, totalNetWorthFiatPercentChange24h) {
        $('#net_worth_fiat_24h_ago').text(totalNetWorthFiat24hAgo);
        $('#net_worth_fiat_percent_change_24h').text(totalNetWorthFiatPercentChange24h);
        bindViewPercentChangeColorContainer('#net_worth_fiat_percent_change_24h_container', totalNetWorthFiatPercentChange24h);
    }

    /** Private static method */
    bindViewTotalNetWorthFiat(totalNetWorthFiat) {
        $('#net_worth_fiat').text(totalNetWorthFiat);
    }

    resetViewNetWorth() {
        $('#net_worth_zil_24h_ago').text('');
        $('#net_worth_zil_percent_change_24h').text('');
        $('#net_worth_fiat_24h_ago').text('');
        $('#net_worth_fiat_percent_change_24h').text('');
        $('#net_worth_zil').text('Loading...');
        $('#net_worth_fiat').text('Loading...');
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

    exports.NetWorthStatus = NetWorthStatus;
}