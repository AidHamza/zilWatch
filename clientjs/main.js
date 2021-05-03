// Assumes zrcTokenPropertiesListMap is declared
// Assumes ssnListMap is declared

window.addEventListener("load", async () => {
    // Get the user's theme preference from local storage, if it's available
    let currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
        setLightMode();
    } else if (currentTheme === "dark") {
        setDarkMode();
    }

    computeZilPriceInUsd(onZilUsdPriceLoaded);

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

function refreshMainContentData(account) {
    // (1) show main screen
    bindViewMainContainer(ZilpayStatus.connected);

    // (2) Refresh login button state
    bindViewLoggedInButton(censorBech32Address(account.bech32));

    // (3) Get ZIL balance, async.
    computeZilBalance(account, onZilWalletBalanceLoaded);

    // (4) Get ZRC-2 tokens price & ZRC-2 tokens LP balances in Zilswap, async.
    // Do this together because they are one API call, using the same data.
    computeZrcTokensPriceAndZilswapLpBalance(zrcTokenPropertiesListMap, onZrcTokenPriceInZilLoaded, account, onZrcTokenLpBalanceLoaded);

    // (5) Get ZRC-2 tokens balances, async.
    computeZrcTokensBalance(account, zrcTokenPropertiesListMap, onZrcTokenWalletBalanceLoaded);

    // (6) Get Potential LP reward next epoch and time duration counter to the next epoch
    computeTotalLpRewardNextEpoch(account, onLpRewardNextEpochLoaded);
    computeLpEpochInfo(onLpCurrentEpochInfoLoaded);

    // (7) Get ZIL staking balance
    computeZilStakingBalance(account, onZilStakingBalanceLoaded);
}

$("#theme_toggle").click(function() {
    let isCurrentDark = $("html").hasClass("dark-mode");
    let theme;
    if (isCurrentDark) {
        theme = "light";
        setLightMode();
    } else {
        theme = "dark";
        setDarkMode();
    }
    // Finally, let's save the current preference to localStorage to keep using it
    localStorage.setItem("theme", theme);
});

function setLightMode() {
    $("html").removeClass("dark-mode");
    $("#theme_toggle_icon").removeClass("fa-sun-o");
    $("#theme_toggle_icon").addClass("fa-moon-o");
}

function setDarkMode() {
    $("html").addClass("dark-mode");
    $("#theme_toggle_icon").removeClass("fa-moon-o");
    $("#theme_toggle_icon").addClass("fa-sun-o");
}