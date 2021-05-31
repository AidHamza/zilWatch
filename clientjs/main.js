// Assumes zrcTokenPropertiesListMap is declared
// Assumes ssnListMap is declared

document.addEventListener("DOMContentLoaded", () => {
    // Get the user's theme preference from local storage, if it's available
    let currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
        setThemeLightMode();
    } else {
        setThemeDarkMode();
    }

    let currentCurrencyCode = localStorage.getItem("currency");
    if (!currentCurrencyCode) {
        currentCurrencyCode = "usd";
    }
    let currencySymbol = currencyMap[currentCurrencyCode];
    $("#currency_selector").val(currentCurrencyCode);
    $(".currency_symbol").text(currencySymbol);
    
    // Public information
    computeCoinPriceInFiat(currentCurrencyCode, onCoinFiatPriceLoaded);

    // This is unrelated to balance and the APIs used for personalized dashboard
    // So don't need to reload.
    computeZrcTokensPriceInZil(onZilswapDexStatusLoaded);
    compute24hLpTradeVolume(onLpTradeVolumeLoaded);
    onZrcTokensTotalSupplyLoaded();
    onZrcTokensCirculatingSupplyLoaded();

    computeLpEpochInfo(onLpCurrentEpochInfoLoaded);
});

window.addEventListener("load", async () => {
    let zilpayStatus = checkZilpayStatus();
    bindViewMainContainer(zilpayStatus);
    if (ZilpayStatus.connected !== zilpayStatus) {
        return;
    }

    // Subscribe if there are changes with the account
    window.zilPay.wallet.observableAccount().subscribe(account => {
        refreshMainContentData(account);
    });

    // Subscribe if there are changes with network
    window.zilPay.wallet.observableNetwork().subscribe(() => {
        bindViewMainContainer(checkZilpayStatus());
    });

    if (window.zilPay.wallet.isConnect) {
        refreshMainContentData(window.zilPay.wallet.defaultAccount);
    }
});

$("#wallet_connect").click(function () {
    window.zilPay.wallet.connect().then(
        function (isUnlockSuccessful) {
            console.log("Wallet connect unlock successful: " + isUnlockSuccessful);
            if (isUnlockSuccessful) {
                refreshMainContentData(window.zilPay.wallet.defaultAccount)
            }
        },
        function () {
            console.log("Wallet connect failed!");
        }
    );
});

$("#wallet_refresh").click(function () {
    window.location.reload();
});

$("#toggle_theme_btn").click(function() {
    let isCurrentDark = $("html").hasClass("dark-mode");
    let theme;
    if (isCurrentDark) {
        theme = "light";
        setThemeLightMode();
    } else {
        theme = "dark";
        setThemeDarkMode();
    }
    // Finally, let's save the current preference to localStorage to keep using it
    localStorage.setItem("theme", theme);
});

$( "#currency_selector" ).change(function() {
    let currencyCode = $(this).val();
    computeCoinPriceInFiat( currencyCode, onCoinFiatPriceLoaded);
    localStorage.setItem("currency", currencyCode);
});

function collapsePublicCards() {
    $('.card-header').addClass('collapsed');
    $('.card-body').removeClass('show');
}

// Global var to keep track of the current active wallet being shown to the screen.
var currentActiveAccountBech32 = null;

function refreshMainContentData(account) {
    let walletAddressBase16 = account.base16.toLowerCase();
    let walletAddressBech32 = account.bech32;

    // If the wallet to be refreshed is the same wallet, do not invoke refresh content.
    if (currentActiveAccountBech32 === walletAddressBech32) {
        return;
    }
    currentActiveAccountBech32 = walletAddressBech32;

    // (1) Collapse all public cards.
    collapsePublicCards();

    // (2) Refresh login button state
    bindViewLoggedInButton(censorBech32Address(walletAddressBech32));

    // (3) Reset main content
    resetMainContainerContent();

    // (4) show main screen
    bindViewMainContainer(ZilpayStatus.connected);

    // (5) Get ZIL balance, async.
    computeZilBalance(walletAddressBase16, onZilWalletBalanceLoaded);

    // (6) Get ZRC-2 tokens price & ZRC-2 tokens LP balances in Zilswap, async.
    // Do this together because they are one API call, using the same data.
    computeZrcTokensPriceAndZilswapLpBalance(onZilswapDexStatusLoaded, walletAddressBase16);

    // (7) Get ZRC-2 tokens balances, async.
    computeZrcTokensBalance(walletAddressBase16, zrcTokenPropertiesListMap, onZrcTokenWalletBalanceLoaded);

    // (8) Get Potential LP reward next epoch and past epoch, async
    computeTotalLpRewardNextEpoch(walletAddressBech32, onLpRewardNextEpochLoaded);
    computeTotalLpRewardPastEpoch(walletAddressBech32, onLpRewardPastEpochLoaded);

    // (9) Get ZIL staking balance, async
    computeZilStakingBalance(walletAddressBase16, onZilStakingBalanceLoaded);
    computeZilStakingWithdrawalPendingBalance(walletAddressBase16, onZilStakingWithdrawalPendingBalanceLoaded);

    // (10) Get CARBON staking balance, async
    computeCarbonStakingBalance(walletAddressBech32, walletAddressBase16);
}

function computeCarbonStakingBalance(walletAddressBech32, walletAddressBase16) {
    let stakingCarbonStatus = new StakingCarbonStatus(walletAddressBech32, walletAddressBase16);
    stakingCarbonStatus.computeBalanceRpc(
        /* beforeRpcCallback= */
        function() {
            incrementShowSpinnerStakingBalance();
        },
        /* onSuccessCallback= */
        function() {
            decrementShowSpinnerStakingBalance();
            if (stakingCarbonStatus.carbonBalance) {
                onCarbonStakingBalanceLoaded(stakingCarbonStatus.carbonBalanceFormattedString);
            }
        },
        /* onErrorCallback= */
        function() {
            decrementShowSpinnerStakingBalance();
        });
}
