var REFRESH_INTERVAL_MS = 30000;
var activeIntervalId = null;

document.addEventListener("DOMContentLoaded", () => {
    // Must be initialized first before the rest.
    $('#price_table').DataTable({
        paging: false,
        ordering: true,
        language: {
            decimal: ".",
            thousands: ",",
        },
        columnDefs: [{
            // Disable sorting for column index 3
            // 24h Low / High (sorting not supported)
            targets: 3,
            orderable: false
        }],
        order: [],
        bInfo: false,
    });

    // Public information
    computeZilswapDexPublicStatus();
    computeZilswapTradeVolumeStatus();
    computeCoinMarketStatus();
    computeZilswapZrcPrice24hLowHighStatus();

    // Loop forever to refresh coin price in fiat
    clearInterval(activeIntervalId);
    activeIntervalId = setInterval(function () {
        refreshCoinPriceStatus();
    }, REFRESH_INTERVAL_MS);

    $(window).resize(function () {
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

$("#wallet_censor_button").on('click', function () {
    let isShowingFullAddress = $("#wallet_full_address").css("display") !== 'none';
    if (isShowingFullAddress) {
        hideFullWalletAddress();
    } else {
        showFullWalletAddress();
    }
});

$("#wallet_copy_button").on('click', function () {
    let copyText = $('#wallet_full_address').text();

    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(copyText).select();
    document.execCommand("copy");
    $temp.remove();

    // Show copied text for 5 seconds
    $('#wallet_copy_message').text("Copied!");
    setTimeout(function () {
        $('#wallet_copy_message').text("");
    }, 5000);
});

function collapsePublicCards() {
    $('.card-header').addClass('collapsed');
    $('.card-body').removeClass('show');
}

function onCurrencyChangeCallback(currencyCode) {
    computeCoinPriceStatus(currencyCode);
}

// Callback method defined and called after toggle theme button press
function onThemeChangeCallback() {
    drawAllBarCharts();
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
    let censoredWalletAddress = censorBech32Address(walletAddressBech32);
    bindViewLoggedInButton(censoredWalletAddress);
    bindViewFullWalletAddress(walletAddressBech32, censoredWalletAddress);

    // (3) Reset main content
    resetMainContainerContent();
    walletBalanceStatus.reset();
    stakingBalanceStatus.reset();
    zilswapDexStatus.resetPersonal();
    netWorthStatus.reset();
    uniqueCoinStatus.reset();
    zilswapLpFeeRewardStatus.reset();
    swapStatus.reset();

    // Load swap history for current address
    swapStatus.loadSwapHistoryFromLocalStorage(walletAddressBase16);

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
    computeZilswapTotalLpZwapReward(walletAddressBech32);
}

function computeZilswapTotalLpZwapReward(walletAddressBech32) {
    zilswapLpZwapRewardStatus.setWalletAddressBech32(walletAddressBech32);
    zilswapLpZwapRewardStatus.computeDataRpc(
        /* beforeRpcCallback= */
        function () {},
        /* onSuccessCallback= */
        function () {},
        /* onErrorCallback= */
        function () {});
}

function computeZilswapZrcPrice24hLowHighStatus() {
    zilswapZrcPrice24hLowHighStatus.computeDataRpcIfDataNoExist(
        /* beforeRpcCallback= */
        function () {},
        /* onSuccessCallback= */
        function () {},
        /* onErrorCallback= */
        function () {});
}

function computeCoinMarketStatus() {
    coinMarketStatus.computeDataRpcIfDataNoExist(
        /* beforeRpcCallback= */
        function () {},
        /* onSuccessCallback= */
        function () {
            $('#price_table').DataTable().rows().invalidate().draw();
        },
        /* onErrorCallback= */
        function () {});
}

function computeZilswapTradeVolumeStatus() {
    zilswapTradeVolumeStatus.computeDataRpcIfDataNoExist(
        /* beforeRpcCallback= */
        function () {},
        /* onSuccessCallback= */
        function () {
            zilswapLpFeeRewardStatus.onZilswapTradeVolumeStatusChange();
            $('#price_table').DataTable().rows().invalidate().draw();
        },
        /* onErrorCallback= */
        function () {});
}

function computeStakingBalanceStatus(walletAddressBase16) {
    stakingBalanceStatus.setWalletAddressBase16(walletAddressBase16);
    refreshStakingBalanceStatus();
}

function computeWalletBalanceStatus(walletAddressBase16) {
    walletBalanceStatus.setWalletAddressBase16(walletAddressBase16);
    refreshWalletBalanceStatus();
}

function computeZilswapDexPersonalStatus(walletAddressBase16) {
    zilswapDexStatus.setWalletAddressBase16(walletAddressBase16);
    zilswapDexStatus.computePersonalPublicDataRpcIfDataNoExist(
        /* beforeRpcCallback= */
        function () {
            incrementShowSpinnerLpBalance();
        },
        /* onSuccessCallback= */
        function () {
            walletBalanceStatus.onZilswapDexStatusChange();
            stakingBalanceStatus.onZilswapDexStatusChange();
            netWorthStatus.onZilswapDexStatusChange();
            uniqueCoinStatus.onZilswapDexStatusChange();
            zilswapLpFeeRewardStatus.onZilswapDexStatusChange();
            zilswapLpZwapRewardStatus.onZilswapDexStatusChange();
            zilswapZrcPrice24hLowHighStatus.onZilswapDexStatusChange();

            swapStatus.onZilswapDexStatusChange();
            $('#price_table').DataTable().rows().invalidate().draw();

            decrementShowSpinnerLpBalance();
        },
        /* onErrorCallback= */
        function () {
            decrementShowSpinnerLpBalance();
        });
}

function computeZilswapDexPublicStatus() {
    zilswapDexStatus.computePublicDataRpcIfDataNoExist(
        /* beforeRpcCallback= */
        function () {},
        /* onSuccessCallback= */
        function () {
            walletBalanceStatus.onZilswapDexStatusChange();
            stakingBalanceStatus.onZilswapDexStatusChange();
            netWorthStatus.onZilswapDexStatusChange();
            uniqueCoinStatus.onZilswapDexStatusChange();
            zilswapLpZwapRewardStatus.onZilswapDexStatusChange();
            zilswapZrcPrice24hLowHighStatus.onZilswapDexStatusChange();

            swapStatus.onZilswapDexStatusChange();
            $('#price_table').DataTable().rows().invalidate().draw();
        },
        /* onErrorCallback= */
        function () {});
}

function computeCoinPriceStatus(currencyCode) {
    coinPriceStatus.setActiveCurrencyCode(currencyCode);
    coinPriceStatus.computeDataRpcIfDataNoExist(
        /* beforeRpcCallback= */
        function () {},
        /* onSuccessCallback= */
        function () {
            zilswapDexStatus.onCoinPriceStatusChange();
            walletBalanceStatus.onCoinPriceStatusChange();
            stakingBalanceStatus.onCoinPriceStatusChange();
            netWorthStatus.onCoinPriceStatusChange();
            zilswapTradeVolumeStatus.onCoinPriceStatusChange();
            zilswapLpZwapRewardStatus.onCoinPriceStatusChange();

            swapStatus.onCoinPriceStatusChange();

            coinMarketStatus.onCoinPriceStatusChange();
            $('#price_table').DataTable().rows().invalidate().draw();
        },
        /* onErrorCallback= */
        function () {});
}