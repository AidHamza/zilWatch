var REFRESH_INTERVAL_MS = 30000;
var activeIntervalId = null;

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
    computeCoinPriceStatus(currentCurrencyCode);
    computeZilswapDexPublicStatus();
    computeZilswapTradeVolumeStatus();

    // Loop forever to refresh coin price and zilswap dex status (for zrc prices)
    clearInterval(activeIntervalId);
    activeIntervalId = setInterval(function() {
        refreshCoinPriceStatus();
        refreshZilswapDexPublicStatus();
        refreshZilswapTradeVolumeStatus();
    }, REFRESH_INTERVAL_MS);

    // This is unrelated to balance and the APIs used for personalized dashboard
    // So don't need to reload.
    computeLpEpochInfo(onLpCurrentEpochInfoLoaded);

    $(window).resize(function(){
        drawAllBarCharts();
    });
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
    drawAllBarCharts();
});

$( "#currency_selector" ).change(function() {
    let currencyCode = $(this).val();
    computeCoinPriceStatus(currencyCode);
    localStorage.setItem("currency", currencyCode);
});

function collapsePublicCards() {
    $('.card-header').addClass('collapsed');
    $('.card-body').removeClass('show');
}

function drawAllBarCharts() {
    netWorthStatus.drawBarChart();
    uniqueCoinStatus.drawBarChart();
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
    walletBalanceStatus.reset();
    stakingBalanceStatus.reset();
    zilswapDexStatus.resetPersonal();
    netWorthStatus.reset();
    uniqueCoinStatus.reset();

    // (4) show main screen
    bindViewMainContainer(ZilpayStatus.connected);

    // (5) Get ZIL and ZRC walletbalance, async.
    computeWalletBalanceStatus(walletAddressBase16);

    // (6) Get ZRC-2 tokens price & ZRC-2 tokens LP balances in Zilswap, async.
    // Do this together because they are one API call, using the same data.
    computeZilswapDexPersonalStatus(walletAddressBase16);

    // (7) Get staking balance (ZIL, CARB), async
    computeStakingBalanceStatus(walletAddressBase16);

    // (8) Get Potential LP reward next epoch and past epoch, async
    computeTotalLpRewardNextEpoch(walletAddressBech32, onLpRewardNextEpochLoaded);
    computeTotalLpRewardPastEpoch(walletAddressBech32, onLpRewardPastEpochLoaded);

    // Loop forever to refresh all balances and coin status
    clearInterval(activeIntervalId);
    activeIntervalId = setInterval(function() {
        refreshCoinPriceStatus();
        refreshZilswapDexPersonalStatus();
        refreshWalletBalanceStatus();
        refreshStakingBalanceStatus();
        refreshZilswapTradeVolumeStatus();
    }, REFRESH_INTERVAL_MS);
}

function computeZilswapTradeVolumeStatus() {
    zilswapTradeVolumeStatus.computeDataRpcIfDataNoExist(
        /* beforeRpcCallback= */
        function() {},
        /* onSuccessCallback= */
        function() {},
        /* onErrorCallback= */
        function() {});
}

function refreshZilswapTradeVolumeStatus() {
    zilswapTradeVolumeStatus.computeDataRpc(
        /* beforeRpcCallback= */
        function() {},
        /* onSuccessCallback= */
        function() {},
        /* onErrorCallback= */
        function() {});
}

function computeStakingBalanceStatus(walletAddressBase16) {
    stakingBalanceStatus.setWalletAddressBase16(walletAddressBase16);
    refreshStakingBalanceStatus();
}

function refreshStakingBalanceStatus() {
    stakingBalanceStatus.computeDataRpc(
        /* beforeRpcCallback= */
        function() {
            incrementShowSpinnerStakingBalance();
        },
        /* onSuccessCallback= */
        function() {
            netWorthStatus.onStakingBalanceStatusChange();
            uniqueCoinStatus.onStakingBalanceStatusChange();
            decrementShowSpinnerStakingBalance();
        },
        /* onErrorCallback= */
        function() {
            decrementShowSpinnerStakingBalance();
        });
}

function computeWalletBalanceStatus(walletAddressBase16) {
    walletBalanceStatus.setWalletAddressBase16(walletAddressBase16);
    refreshWalletBalanceStatus();
}

function refreshWalletBalanceStatus() {
    walletBalanceStatus.computeDataRpc(
        /* beforeRpcCallback= */
        function() {
            incrementShowSpinnerWalletBalance();
        },
        /* onSuccessCallback= */
        function() {
            netWorthStatus.onWalletBalanceStatusChange();
            uniqueCoinStatus.onWalletBalanceStatusChange();
            decrementShowSpinnerWalletBalance();
        },
        /* onErrorCallback= */
        function() {
            decrementShowSpinnerWalletBalance();
        });
}

function computeZilswapDexPersonalStatus(walletAddressBase16) {
    zilswapDexStatus.setWalletAddressBase16(walletAddressBase16);
    zilswapDexStatus.computePersonalPublicDataRpcIfDataNoExist(
        /* beforeRpcCallback= */
        function() {
            incrementShowSpinnerLpBalance();
        },
        /* onSuccessCallback= */
        function() {
            refreshTotalLpRewardFiat();
            refreshPrevTotalLpRewardFiat();
            refreshPastTotalLpRewardFiat();
            
            walletBalanceStatus.onZilswapDexStatusChange();
            stakingBalanceStatus.onZilswapDexStatusChange();
            netWorthStatus.onZilswapDexStatusChange();
            uniqueCoinStatus.onZilswapDexStatusChange();

            decrementShowSpinnerLpBalance();
        },
        /* onErrorCallback= */
        function() {
            decrementShowSpinnerLpBalance();
        });
}

function refreshZilswapDexPersonalStatus() {
    zilswapDexStatus.computePersonalPublicDataRpc(
        /* beforeRpcCallback= */
        function() {
            incrementShowSpinnerLpBalance();
        },
        /* onSuccessCallback= */
        function() {
            refreshTotalLpRewardFiat();
            refreshPrevTotalLpRewardFiat();
            refreshPastTotalLpRewardFiat();
            
            walletBalanceStatus.onZilswapDexStatusChange();
            stakingBalanceStatus.onZilswapDexStatusChange();
            netWorthStatus.onZilswapDexStatusChange();
            uniqueCoinStatus.onZilswapDexStatusChange();

            decrementShowSpinnerLpBalance();
        },
        /* onErrorCallback= */
        function() {
            decrementShowSpinnerLpBalance();
        });
}

function computeZilswapDexPublicStatus() {
    zilswapDexStatus.computePublicDataRpcIfDataNoExist(
        /* beforeRpcCallback= */
        function() {
        },
        /* onSuccessCallback= */
        function() {
            refreshTotalLpRewardFiat();
            refreshPrevTotalLpRewardFiat();
            refreshPastTotalLpRewardFiat();

            walletBalanceStatus.onZilswapDexStatusChange();
            stakingBalanceStatus.onZilswapDexStatusChange();
            netWorthStatus.onZilswapDexStatusChange();
            uniqueCoinStatus.onZilswapDexStatusChange();
        },
        /* onErrorCallback= */
        function() {
        });
}

function refreshZilswapDexPublicStatus() {
    zilswapDexStatus.computePublicDataRpc(
        /* beforeRpcCallback= */
        function() {
        },
        /* onSuccessCallback= */
        function() {
            refreshTotalLpRewardFiat();
            refreshPrevTotalLpRewardFiat();
            refreshPastTotalLpRewardFiat();

            walletBalanceStatus.onZilswapDexStatusChange();
            stakingBalanceStatus.onZilswapDexStatusChange();
            netWorthStatus.onZilswapDexStatusChange();
            uniqueCoinStatus.onZilswapDexStatusChange();
        },
        /* onErrorCallback= */
        function() {
        });
}

function computeCoinPriceStatus(currencyCode) {
    coinPriceStatus.setActiveCurrencyCode(currencyCode);
    coinPriceStatus.computeDataRpcIfDataNoExist(
        /* beforeRpcCallback= */
        function() {
        },
        /* onSuccessCallback= */
        function() {
            refreshTotalLpRewardFiat();
            refreshPrevTotalLpRewardFiat();
            refreshPastTotalLpRewardFiat();

            zilswapDexStatus.onCoinPriceStatusChange();
            walletBalanceStatus.onCoinPriceStatusChange();
            stakingBalanceStatus.onCoinPriceStatusChange();
            netWorthStatus.onCoinPriceStatusChange();
            zilswapTradeVolumeStatus.onCoinPriceStatusChange();
        },
        /* onErrorCallback= */
        function() {
        });
}

function refreshCoinPriceStatus() {
    coinPriceStatus.computeDataRpc(
        /* beforeRpcCallback= */
        function() {
        },
        /* onSuccessCallback= */
        function() {
            refreshTotalLpRewardFiat();
            refreshPrevTotalLpRewardFiat();
            refreshPastTotalLpRewardFiat();

            zilswapDexStatus.onCoinPriceStatusChange();
            walletBalanceStatus.onCoinPriceStatusChange();
            stakingBalanceStatus.onCoinPriceStatusChange();
            netWorthStatus.onCoinPriceStatusChange();
            zilswapTradeVolumeStatus.onCoinPriceStatusChange();
        },
        /* onErrorCallback= */
        function() {
        });
}
