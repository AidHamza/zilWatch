// Assumes zrcTokenPropertiesListMap is declared
// Assumes ssnListMap is declared

window.addEventListener("load", async () => {
    // Get the user's theme preference from local storage, if it's available
    let currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
        setThemeLightMode();
    } else {
        setThemeDarkMode();
    }

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

function refreshMainContentData(account) {
    // (1) Refresh login button state
    bindViewLoggedInButton(censorBech32Address(account.bech32));

    // (2) show main screen
    bindViewMainContainer(ZilpayStatus.connected);

    // (3) Reset main content
    resetMainContainerContent();

    // (4) Get ZIL price in USD
    computeZilPriceInUsd(onZilUsdPriceLoaded);

    // (5) Get ZIL balance, async.
    computeZilBalance(account, onZilWalletBalanceLoaded);

    // (6) Get ZRC-2 tokens price & ZRC-2 tokens LP balances in Zilswap, async.
    // Do this together because they are one API call, using the same data.
    computeZrcTokensPriceAndZilswapLpBalance(zrcTokenPropertiesListMap, onZrcTokenPriceInZilLoaded, account, onZrcTokenLpBalanceLoaded);

    // (7) Get ZRC-2 tokens balances, async.
    computeZrcTokensBalance(account, zrcTokenPropertiesListMap, onZrcTokenWalletBalanceLoaded);

    // (8) Get Potential LP reward next epoch and time duration counter to the next epoch
    computeTotalLpRewardNextEpoch(account, onLpRewardNextEpochLoaded);
    computeLpEpochInfo(onLpCurrentEpochInfoLoaded);

    // (9) Get ZIL staking balance
    computeZilStakingBalance(account, onZilStakingBalanceLoaded);
}
