// Assumes zrcTokensPropertiesMap is declared
// Assumes ssnListMap is declared

window.addEventListener("load", async () => {
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
    computeZrcTokensPriceAndZilswapLpBalance(zrcTokensPropertiesMap, onZrcTokenPriceInZilLoaded, account, onZrcTokenLpBalanceLoaded);

    // (5) Get ZRC-2 tokens balances, async.
    computeZrcTokensBalance(account, zrcTokensPropertiesMap, onZrcTokenWalletBalanceLoaded);

    // (6) Get Potential LP reward next epoch and time duration counter to the next epoch
    computeTotalLpRewardNextEpoch(account, onLpRewardNextEpochLoaded);
    computeLpEpochInfo(onLpCurrentEpochInfoLoaded);

    // (7) Get ZIL staking balance
    computeZilStakingBalance(account, onZilStakingBalanceLoaded);
}
