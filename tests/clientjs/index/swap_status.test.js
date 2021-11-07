var indexJsdom = require('../../index.jsdom.js');
var fs = require('fs')
var $ = indexJsdom.$;

var assert = require('assert');
var UtilsConstants = require('../../../clientjs/utils_constants.js');
var ZilswapDexStatus = require('../../../clientjs/index//zilswap_dex_status.js');
var CoinPriceStatus = require('../../../clientjs/index//coin_price_status.js');
var WalletBalanceStatus = require('../../../clientjs/index//wallet_balance_status.js');
var SwapStatus = require('../../../clientjs/index//swap_status.js');
var SwapTxnWrapper = require('../../../clientjs/index//swap_txn_wrapper.js');
var Constants = require('../../../constants.js');

function assertWalletIsNotConnectedAndSwapButtonDisabled() {
    // Assert message wallet is not connected and swap button disabled
    assert.strictEqual($('#swap_error_message_2').text(), SwapStatus.WALLET_IS_NOT_CONNECTED_STRING);
    assert.strictEqual($('#swap_error_message_2_container').css('display'), 'block');

    assert.strictEqual($('#swap_button').css('display'), 'inline-block');
    assert.strictEqual($('#swap_button').hasClass('disabled'), true);

    assert.strictEqual($('#approve_button').css('display'), 'none');
    assert.strictEqual($('#approve_button').hasClass('disabled'), true);
}

function assertSwapButtonEnabled() {
    // Assert message wallet is not connected and swap button disabled
    assert.strictEqual($('#swap_error_message_2').text(), '');
    assert.strictEqual($('#swap_error_message_2_container').css('display'), 'none');

    assert.strictEqual($('#swap_button').css('display'), 'inline-block');
    assert.strictEqual($('#swap_button').hasClass('disabled'), false);

    assert.strictEqual($('#approve_button').css('display'), 'none');
    assert.strictEqual($('#approve_button').hasClass('disabled'), true);
}


function assertDangerExtremelyHighPriceImpact() {
    assert.strictEqual($('#swap_token_from_amount').attr('aria-invalid'), 'true');
    assert.strictEqual($('#swap_token_to_amount').attr('aria-invalid'), undefined);
    assert.strictEqual($('#swap_error_message_container').css('display'), 'block');
    assert.strictEqual($('#swap_error_message').text(), SwapStatus.DANGER_EXTREME_PRICE_IMPACT_STRING);
}

function assertRequestedAmountLargerThanPool() {
    assert.strictEqual($('#swap_token_from_amount').attr('aria-invalid'), undefined);
    assert.strictEqual($('#swap_token_to_amount').attr('aria-invalid'), 'true');
    assert.strictEqual($('#swap_error_message_container').css('display'), 'block');
    assert.strictEqual($('#swap_error_message').text(), SwapStatus.REQUESTED_AMOUNT_LARGER_THAN_POOL_STRING);
}

function assertDefaultFromToken() {
    assert.strictEqual($('#swap_select_token_from_img').attr('src'), '');
    assert.strictEqual($('#swap_select_token_from_img').css('display'), 'none');
    assert.strictEqual($('#swap_select_token_from_ticker').text(), SwapStatus.SELECT_TOKEN_STRING);
}

function assertDefaultToToken() {
    assert.strictEqual($('#swap_select_token_to_img').attr('src'), '');
    assert.strictEqual($('#swap_select_token_to_img').css('display'), 'none');
    assert.strictEqual($('#swap_select_token_to_ticker').text(), SwapStatus.SELECT_TOKEN_STRING);
}

function assertFromToken(ticker) {
    if (ticker === 'ZIL') {
        assert.strictEqual($('#swap_select_token_from_img').attr('src'), 'https://meta.viewblock.io/ZIL/logo' + UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX);
        assert.strictEqual($('#swap_select_token_from_img').css('display'), '');
        assert.strictEqual($('#swap_select_token_from_ticker').text(), 'ZIL');
    } else {
        assert.strictEqual($('#swap_select_token_from_img').attr('src'), Constants.zrcTokenPropertiesListMap[ticker].logo_url + UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX);
        assert.strictEqual($('#swap_select_token_from_img').css('display'), '');
        assert.strictEqual($('#swap_select_token_from_ticker').text(), ticker);
    }
}

function assertToToken(ticker) {

    if (ticker === 'ZIL') {
        assert.strictEqual($('#swap_select_token_to_img').attr('src'), 'https://meta.viewblock.io/ZIL/logo' + UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX);
        assert.strictEqual($('#swap_select_token_to_img').css('display'), '');
        assert.strictEqual($('#swap_select_token_to_ticker').text(), 'ZIL');
    } else {
        assert.strictEqual($('#swap_select_token_to_img').attr('src'), Constants.zrcTokenPropertiesListMap[ticker].logo_url + UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX);
        assert.strictEqual($('#swap_select_token_to_img').css('display'), '');
        assert.strictEqual($('#swap_select_token_to_ticker').text(), ticker);
    }
}

describe('SwapStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(
            function () {
                done();
            });
    });

    describe('#constructor()', function () {

        it('create plain object', function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
            let walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBase16= */ null, /* zilBalanceData= */ null, /* zrcBalanceDataMap= */ null);
            let swapStatus = new SwapStatus.SwapStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletBalanceStatus);

            assert.strictEqual(swapStatus.zrcTokenPropertiesListMap_, Constants.zrcTokenPropertiesListMap);
            assert.strictEqual(swapStatus.coinPriceStatus_, coinPriceStatus);
            assert.strictEqual(swapStatus.zilswapDexStatus_, zilswapDexStatus);
            assert.strictEqual(swapStatus.walletBalanceStatus_, walletBalanceStatus);

            assert.strictEqual(swapStatus.currentTokenSelectorType_, SwapStatus.TokenSelectorType.UNKNOWN);
            assert.strictEqual(swapStatus.currentEstimatedTokenType_, SwapStatus.TokenSelectorType.UNKNOWN);

            assert.strictEqual(swapStatus.fromTokenTicker_, null);
            assert.strictEqual(swapStatus.fromTokenWalletBalance_, null);
            assert.strictEqual(swapStatus.fromTokenAmount_, null);

            assert.strictEqual(swapStatus.toTokenTicker_, null);
            assert.strictEqual(swapStatus.toTokenWalletBalance_, null);
            assert.strictEqual(swapStatus.toTokenAmount_, null);

            assert.strictEqual(swapStatus.slippageTolerancePercent_, swapStatus.defaultSlippageTolerancePercent_);
            assert.strictEqual(swapStatus.transactionDeadlineMins_, swapStatus.defaultTransactionDeadlineMins_);
            assert.strictEqual(swapStatus.gasLimitZil_, swapStatus.defaultGasLimitZil_);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_, null);
            assert.strictEqual(swapStatus.latestBlockNum_, null);

            assert.deepStrictEqual(swapStatus.pendingTxnHashMap_, {});
        });
    });

    describe('#swapHistoryLocalStorage()', function () {
        let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
        let walletAddressBase16_2 = "0xbcd1243abc343212E44ddE38ABA8d8C015343233".toLowerCase();
        var swapStatus;

        let txnHash1 = 'abcadfasd';
        let txnHash2 = 'bjaf646gfe';
        let txnHash3 = 'f6t4gbhfd';

        let txnDescription1 = 'gZIL → ZWAP';
        let txnDescription2 = 'ZLP → ZWAP';
        let txnDescription3 = 'ZWAP → ZIL';

        beforeEach(function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
            let walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletAddressBase16, /* zilBalanceData= */ null, /* zrcBalanceDataMap= */ null);
            swapStatus = new SwapStatus.SwapStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletBalanceStatus);

        });

        it('#addSwapHistoryToLocalStorage', function () {
            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16, txnHash1, txnDescription1);

            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription2), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), false);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription3), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash3), false);

            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16, txnHash2, txnDescription2);

            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription2), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), true);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription3), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash3), false);

            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16, txnHash3, txnDescription3);

            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription2), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), true);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription3), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash3), true);

        });

        it('#loadSwapHistoryFromLocalStorage', function () {
            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16, txnHash1, txnDescription1);
            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16, txnHash2, txnDescription2);
            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16, txnHash3, txnDescription3);

            // Clear just the view but not localstorage
            swapStatus.resetViewSwapHistory();

            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription1), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash1), false);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription2), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), false);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription3), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash3), false);

            swapStatus.loadSwapHistoryFromLocalStorage(walletAddressBase16);

            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription2), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), true);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription3), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash3), true);
        });


        it('#clearSwapHistoryFromLocalStorage', function () {
            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16, txnHash1, txnDescription1);
            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16, txnHash2, txnDescription2);
            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16, txnHash3, txnDescription3);

            // Clear both the view and local storage
            swapStatus.clearSwapHistoryFromLocalStorage();

            // Try to load
            swapStatus.loadSwapHistoryFromLocalStorage(walletAddressBase16);

            // Nothing is binded
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription1), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash1), false);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription2), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), false);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription3), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash3), false);
        });


        it('#swap history different wallet address', function () {
            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16, txnHash1, txnDescription1);
            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16_2, txnHash2, txnDescription2);
            swapStatus.addSwapHistoryToLocalStorage(walletAddressBase16_2, txnHash3, txnDescription3);

            // Clear view
            swapStatus.resetViewSwapHistory();

            // Load wallet 1
            swapStatus.loadSwapHistoryFromLocalStorage(walletAddressBase16);

            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription2), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), false);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription3), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash3), false);

            // Clear view
            swapStatus.resetViewSwapHistory();

            // Load wallet 1
            swapStatus.loadSwapHistoryFromLocalStorage(walletAddressBase16_2);

            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription1), false);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash1), false);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription2), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), true);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription3), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash3), true);
        });

        it('#addSwapSubmittedTxn', function () {
            swapStatus.addSwapSubmittedTxn(walletAddressBase16, txnHash1, txnDescription1);
            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription1), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash1), true);

            assert.strictEqual($('#transaction_table_list').html().includes(txnDescription1), true);
            assert.strictEqual($('#transaction_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash1), true);
            assert.strictEqual($('#transaction_table_list').css('display'), 'table-row-group');
            assert.strictEqual($('#' + txnHash1 + '_spinner').length, 1);
            assert.strictEqual($('#' + txnHash1 + '_spinner').html().includes('spinner'), true);

            swapStatus.addSwapSubmittedTxn(walletAddressBase16, txnHash2, txnDescription2);

            assert.strictEqual($('#swap_history_table_list').html().includes(txnDescription2), true);
            assert.strictEqual($('#swap_history_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), true);

            assert.strictEqual($('#transaction_table_list').html().includes(txnDescription2), true);
            assert.strictEqual($('#transaction_table_list').html().includes("https://viewblock.io/zilliqa/tx/0x" + txnHash2), true);
            assert.strictEqual($('#transaction_table_list').css('display'), 'table-row-group');
            assert.strictEqual($('#' + txnHash2 + '_spinner').length, 1);
            assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('spinner'), true);
        });
    });


    describe('#swapHistoryLocalStorage()', function () {
        let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();
        var swapStatus;

        let txnHash1 = 'abcadfasd';
        let txnHash2 = 'bjaf646gfe';

        let txnDescription1 = 'gZIL → ZWAP';
        let txnDescription2 = 'ZLP → ZWAP';

        beforeEach(function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
            let walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletAddressBase16, /* zilBalanceData= */ null, /* zrcBalanceDataMap= */ null);
            swapStatus = new SwapStatus.SwapStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletBalanceStatus);

        });

        it('#onNewBlockStatusChange blockNum', function () {
            assert.strictEqual(swapStatus.latestBlockNum_, null);

            swapStatus.onNewBlockStatusChange('5472342', []);
            assert.strictEqual(swapStatus.latestBlockNum_, 5472342);

            swapStatus.onNewBlockStatusChange('5472345', []);
            assert.strictEqual(swapStatus.latestBlockNum_, 5472345);
        });

        it('#onNewBlockStatusChange blockNum', function () {
            let txnHashArr = [
                ['abdashfashdfa',
                    'asdfjasldfghk',
                    txnHash1
                ],
            ];

            // Suppress log
            console.log = (msg) => {};

            swapStatus.addSwapSubmittedTxn(walletAddressBase16, txnHash1, txnDescription1);
            swapStatus.addSwapSubmittedTxn(walletAddressBase16, txnHash2, txnDescription2);

            assert.strictEqual($('#' + txnHash1 + '_spinner').html().includes('spinner'), true);
            assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('spinner'), true);

            swapStatus.onNewBlockStatusChange('5472342', txnHashArr);

            assert.strictEqual(swapStatus.latestBlockNum_, 5472342);
            // Spinner disappear, replaced with check
            assert.strictEqual($('#' + txnHash1 + '_spinner').html().includes('fa-check'), true);
            assert.strictEqual($('#' + txnHash1 + '_spinner').html().includes('spinner'), false);
            assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('fa-check'), false);
            assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('spinner'), true);

            txnHashArr.push([
                'abda4231shdfa',
                'a43534sldfghk',
                txnHash2
            ]);
            swapStatus.onNewBlockStatusChange('5472345', txnHashArr);

            assert.strictEqual(swapStatus.latestBlockNum_, 5472345);
            // Spinner disappear, replaced with check
            assert.strictEqual($('#' + txnHash1 + '_spinner').html().includes('fa-check'), true);
            assert.strictEqual($('#' + txnHash1 + '_spinner').html().includes('spinner'), false);
            assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('fa-check'), true);
            assert.strictEqual($('#' + txnHash2 + '_spinner').html().includes('spinner'), false);
        });
    });

    describe('#tokenSelector without wallet', function () {
        var swapStatus;

        beforeEach(function () {
            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));

            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);
            let walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBase16= */ null, /* zilBalanceData= */ null, /* zrcBalanceDataMap= */ null);
            swapStatus = new SwapStatus.SwapStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletBalanceStatus);

            assertDefaultFromToken();
            assertDefaultToToken();
        });

        it('init empty, select to token, not supported token', function () {
            // Suppress log
            console.warn = (msg) => {};

            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ABCD');

            assertDefaultFromToken();
        });

        it('init empty, select token without opening selector, no-op', function () {
            // Suppress log
            console.warn = (msg) => {};

            swapStatus.setTokenSelector('ZWAP');

            assertDefaultFromToken();
        });

        it('init empty, select to token', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            assertFromToken('ZWAP');
        });

        it('init from token, select to token', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            assertFromToken('ZWAP');
            assertToToken('ZIL');
        });

        it('init from and to token, toggle direction', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.toggleTokenDirection();

            assertFromToken('ZIL');
            assertToToken('ZWAP');
        });

        it('init from token selected, input from amount', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.bindViewFromTokenAmount(10);
            swapStatus.processFromTokenAmount(10);

            assertFromToken('ZWAP');
            assert.strictEqual($('#swap_token_from_amount').val(), '10');

            assertDefaultToToken();
            assert.strictEqual($('#swap_token_to_amount').val(), '');
        });

        it('init to token selected, input to amount', function () {
            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.bindViewToTokenAmount(100);
            swapStatus.processToTokenAmount(100);

            assertDefaultFromToken();
            assert.strictEqual($('#swap_token_from_amount').val(), '');

            assertToToken('ZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '100');
        });

        it('init from and to token selected, input from amount', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.bindViewFromTokenAmount(10);
            swapStatus.processFromTokenAmount(10);

            assertFromToken('ZWAP');
            assert.strictEqual($('#swap_token_from_amount').val(), '10');

            assertToToken('ZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '26133.45091577352');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '3,098.39');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');
        });

        it('init from token selected and amount, select to token', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.bindViewFromTokenAmount(10);
            swapStatus.processFromTokenAmount(10);

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            assertFromToken('ZWAP');
            assert.strictEqual($('#swap_token_from_amount').val(), '10');

            assertToToken('ZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '26133.45091577352');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '3,098.39');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');
        });

        it('init from and to token selected, input to amount', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.bindViewToTokenAmount(26133.45);
            swapStatus.processToTokenAmount(26133.45);

            assertFromToken('ZWAP');
            assert.strictEqual($('#swap_token_from_amount').val(), '9.999999649534923');

            assertToToken('ZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '26133.45');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '3,098.39');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');
        });

        it('init to token selected and amount, select from token', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.bindViewToTokenAmount(26133.45);
            swapStatus.processToTokenAmount(26133.45);

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            assertFromToken('ZWAP');
            assert.strictEqual($('#swap_token_from_amount').val(), '9.999999649534923');

            assertToToken('ZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '26133.45');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '3,098.39');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');
        });

        it('init from and to token selected, init from and to amount, toggle direction', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.bindViewFromTokenAmount(10);
            swapStatus.processFromTokenAmount(10);

            swapStatus.toggleTokenDirection();

            assertFromToken('ZIL');
            assert.strictEqual($('#swap_token_from_amount').val(), '26297.439743491548');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '3,108.09');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            assertToToken('ZWAP');
            assert.strictEqual($('#swap_token_to_amount').val(), '10');
        });

        it('init from and to token selected, init from and to amount, toggle direction twice', function () {

            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.bindViewFromTokenAmount(10);
            swapStatus.processFromTokenAmount(10);

            swapStatus.toggleTokenDirection();
            swapStatus.toggleTokenDirection();

            assertFromToken('ZWAP');
            assert.strictEqual($('#swap_token_from_amount').val(), '10');

            assertToToken('ZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '26133.45091577352');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '3,098.39');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');
        });

        it('init from and to token selected, input from amount extremely large amount', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.bindViewFromTokenAmount(1000000000000); // 1 bil
            swapStatus.processFromTokenAmount(1000000000000);

            assertFromToken('ZIL');
            assert.strictEqual($('#swap_token_from_amount').val(), '1000000000000');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '118,190,000,000.00');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            assertToToken('ZWAP');
            assert.strictEqual($('#swap_token_to_amount').val(), '81019.88341618043');

            assertDangerExtremelyHighPriceImpact();
        });

        it('init from and to token selected, input from amount extremely large amount, toggle 2x, same result', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.bindViewFromTokenAmount(1000000000000); // 1 bil
            swapStatus.processFromTokenAmount(1000000000000);

            swapStatus.toggleTokenDirection();
            swapStatus.toggleTokenDirection();

            assertFromToken('ZIL');
            assert.strictEqual($('#swap_token_from_amount').val(), '1000000000000');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '118,190,000,000.00');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            assertToToken('ZWAP');
            assert.strictEqual($('#swap_token_to_amount').val(), '81019.88341618043');

            assertDangerExtremelyHighPriceImpact();
        });

        it('init from and to token selected, input from amount extremely large amount, toggle direction', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.bindViewFromTokenAmount(1000000000000); // 1 bil
            swapStatus.processFromTokenAmount(1000000000000);

            swapStatus.toggleTokenDirection();

            assertFromToken('ZWAP');
            assert.strictEqual($('#swap_token_from_amount').val(), ''); // Empty, because not enough in pool

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '0');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            assertToToken('ZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '1000000000000');

            assertRequestedAmountLargerThanPool();
        });

        it('init from and to token selected, input to amount extremely large amount', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.bindViewToTokenAmount(300000); // 300k
            swapStatus.processToTokenAmount(300000);

            assertFromToken('ZIL');
            assert.strictEqual($('#swap_token_from_amount').val(), ''); // Empty, because not enough in pool

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '0');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            assertToToken('ZWAP');
            assert.strictEqual($('#swap_token_to_amount').val(), '300000');

            assertRequestedAmountLargerThanPool();
        });

        it('init from and to token selected, input to amount extremely large amount, toggle direction', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.bindViewToTokenAmount(300000); // 300k
            swapStatus.processToTokenAmount(300000);

            swapStatus.toggleTokenDirection();

            assertFromToken('ZWAP');
            assert.strictEqual($('#swap_token_from_amount').val(), '300000');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '92,951,631.94');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            assertToToken('ZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '167153424.06177816');

            assertDangerExtremelyHighPriceImpact();
        });

        it('Complex: init from and to token selected, input from amount, toggle direction (ZIL to token)', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('ZIL');

            swapStatus.bindViewFromTokenAmount(10);
            swapStatus.processFromTokenAmount(10);

            assertFromToken('ZWAP');
            assert.strictEqual($('#swap_token_from_amount').val(), '10');

            assertToToken('ZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '26133.45091577352');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '3,098.39');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            // Assert rate
            assert.strictEqual($('#swap_token_final_rate').text(), '1 ZWAP = 2,613 ZIL');
            assert.strictEqual($('#swap_token_final_rate_inverse').text(), '1 ZIL = 0.000383 ZWAP');

            assert.strictEqual($('#swap_token_final_rate').css('display'), '');
            assert.strictEqual($('#swap_token_final_rate_inverse').css('display'), 'none');
            assert.strictEqual($('#swap_token_final_rate_inverse_button').css('display'), '');

            // Assert popover information
            assert.strictEqual($('#popover_minimum_received_amount').text(), '25,872 ZIL');
            assert.strictEqual($('#popover_slippage_tolerance_percent').text(), '1.0');
            assert.strictEqual($('#popover_price_impact_percent').text(), '0.3123');
            assert.strictEqual($('#popover_liquidity_provider_fee_amount').text(), '0.03000 ZWAP');

            assertWalletIsNotConnectedAndSwapButtonDisabled();

            swapStatus.toggleTokenDirection();

            assertFromToken('ZIL');
            assert.strictEqual($('#swap_token_from_amount').val(), '26297.439743491548');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '3,108.09');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            assertToToken('ZWAP');
            assert.strictEqual($('#swap_token_to_amount').val(), '10');

            // Assert rate
            assert.strictEqual($('#swap_token_final_rate').text(), '1 ZIL = 0.000380 ZWAP');
            assert.strictEqual($('#swap_token_final_rate_inverse').text(), '1 ZWAP = 2,630 ZIL');

            assert.strictEqual($('#swap_token_final_rate').css('display'), '');
            assert.strictEqual($('#swap_token_final_rate_inverse').css('display'), 'none');
            assert.strictEqual($('#swap_token_final_rate_inverse_button').css('display'), '');

            // Assert popover information
            assert.strictEqual($('#popover_minimum_received_amount').text(), '9.900 ZWAP');
            assert.strictEqual($('#popover_slippage_tolerance_percent').text(), '1.0');
            assert.strictEqual($('#popover_price_impact_percent').text(), '0.3123');
            assert.strictEqual($('#popover_liquidity_provider_fee_amount').text(), '78.89 ZIL');

            assertWalletIsNotConnectedAndSwapButtonDisabled();
        });

        it('Complex: init from and to token selected, input from amount, toggle direction (token to token)', function () {
            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('ZWAP');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('gZIL');

            swapStatus.bindViewFromTokenAmount(10);
            swapStatus.processFromTokenAmount(10);

            assertFromToken('ZWAP');
            assert.strictEqual($('#swap_token_from_amount').val(), '10');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '3,098.39');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            assertToToken('gZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '20.297212555838815');

            // Assert rate
            assert.strictEqual($('#swap_token_final_rate').text(), '1 ZWAP = 2.030 gZIL');
            assert.strictEqual($('#swap_token_final_rate_inverse').text(), '1 gZIL = 0.4927 ZWAP');

            assert.strictEqual($('#swap_token_final_rate').css('display'), '');
            assert.strictEqual($('#swap_token_final_rate_inverse').css('display'), 'none');
            assert.strictEqual($('#swap_token_final_rate_inverse_button').css('display'), '');

            // Assert popover information
            assert.strictEqual($('#popover_minimum_received_amount').text(), '20.09 gZIL');
            assert.strictEqual($('#popover_slippage_tolerance_percent').text(), '1.0');
            assert.strictEqual($('#popover_price_impact_percent').text(), '0.6503');
            assert.strictEqual($('#popover_liquidity_provider_fee_amount').text(), '0.03000 ZWAP + 78.17 ZIL');

            assertWalletIsNotConnectedAndSwapButtonDisabled();

            swapStatus.toggleTokenDirection();

            assertFromToken('gZIL');
            assert.strictEqual($('#swap_token_from_amount').val(), '20.563865207692437');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '3,118.68');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            assertToToken('ZWAP');
            assert.strictEqual($('#swap_token_to_amount').val(), '10');

            // Assert rate
            assert.strictEqual($('#swap_token_final_rate').text(), '1 gZIL = 0.4863 ZWAP');
            assert.strictEqual($('#swap_token_final_rate_inverse').text(), '1 ZWAP = 2.056 gZIL');

            assert.strictEqual($('#swap_token_final_rate').css('display'), '');
            assert.strictEqual($('#swap_token_final_rate_inverse').css('display'), 'none');
            assert.strictEqual($('#swap_token_final_rate_inverse_button').css('display'), '');

            // Assert popover information
            assert.strictEqual($('#popover_minimum_received_amount').text(), '9.900 ZWAP');
            assert.strictEqual($('#popover_slippage_tolerance_percent').text(), '1.0');
            assert.strictEqual($('#popover_price_impact_percent').text(), '0.6507');
            assert.strictEqual($('#popover_liquidity_provider_fee_amount').text(), '0.06169 gZIL + 78.89 ZIL');

            assertWalletIsNotConnectedAndSwapButtonDisabled();
        });
    });


    describe('#settings related', function () {
        var swapStatus;

        beforeEach(function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            let zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
            let walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBase16= */ null, /* zilBalanceData= */ null, /* zrcBalanceDataMap= */ null);
            swapStatus = new SwapStatus.SwapStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletBalanceStatus);
        });

        it('#default values', function () {
            assert.strictEqual(swapStatus.slippageTolerancePercent_, swapStatus.defaultSlippageTolerancePercent_);
            assert.strictEqual(swapStatus.transactionDeadlineMins_, swapStatus.defaultTransactionDeadlineMins_);
            assert.strictEqual(swapStatus.gasLimitZil_, swapStatus.defaultGasLimitZil_);

            assert.strictEqual($('#slippage_tolerance_input').val(), swapStatus.defaultSlippageTolerancePercent_.toString());
            assert.strictEqual($('#transaction_deadline_input').val(), swapStatus.defaultTransactionDeadlineMins_.toString());
            assert.strictEqual($('#gas_limit_input').val(), swapStatus.defaultGasLimitZil_.toString());
        });

        it('#saveSettings()', function () {
            let slippageTolerancePercent = '2.4';
            let transactionDeadlineMins = '7.4';
            let gasLimitZil = '80';

            swapStatus.saveSettings(slippageTolerancePercent, transactionDeadlineMins, gasLimitZil);

            assert.strictEqual(swapStatus.slippageTolerancePercent_, parseFloat(slippageTolerancePercent));
            assert.strictEqual(swapStatus.transactionDeadlineMins_, parseFloat(transactionDeadlineMins));
            assert.strictEqual(swapStatus.gasLimitZil_, parseFloat(gasLimitZil));

            assert.strictEqual($('#slippage_tolerance_input').val(), slippageTolerancePercent.toString());
            assert.strictEqual($('#transaction_deadline_input').val(), transactionDeadlineMins.toString());
            assert.strictEqual($('#gas_limit_input').val(), gasLimitZil.toString());
        });

        it('#saveSettings value not float parseable, ignored', function () {
            let slippageTolerancePercent = '2.4';
            let transactionDeadlineMins = '7.4';
            let gasLimitZil = 'asdfasdf80';

            swapStatus.bindViewSwapSettings(slippageTolerancePercent, transactionDeadlineMins, gasLimitZil);
            swapStatus.saveSettings(slippageTolerancePercent, transactionDeadlineMins, gasLimitZil);

            assert.strictEqual(swapStatus.slippageTolerancePercent_, parseFloat(slippageTolerancePercent));
            assert.strictEqual(swapStatus.transactionDeadlineMins_, parseFloat(transactionDeadlineMins));
            assert.strictEqual(swapStatus.gasLimitZil_, swapStatus.defaultGasLimitZil_);

            assert.strictEqual($('#slippage_tolerance_input').val(), slippageTolerancePercent.toString());
            assert.strictEqual($('#transaction_deadline_input').val(), transactionDeadlineMins.toString());
            assert.strictEqual($('#gas_limit_input').val(), swapStatus.defaultGasLimitZil_.toString());
        });

        it('#bindview custom amount and then dismiss without save', function () {
            let slippageTolerancePercent = '2.4';
            let transactionDeadlineMins = '7.4';
            let gasLimitZil = '80';

            swapStatus.bindViewSwapSettings(slippageTolerancePercent, transactionDeadlineMins, gasLimitZil);
            swapStatus.dismissSettingsWithoutSave();

            assert.strictEqual($('#slippage_tolerance_input').val(), swapStatus.defaultSlippageTolerancePercent_.toString());
            assert.strictEqual($('#transaction_deadline_input').val(), swapStatus.defaultTransactionDeadlineMins_.toString());
            assert.strictEqual($('#gas_limit_input').val(), swapStatus.defaultGasLimitZil_.toString());
        });

        it('#saveSettings, reset to default, saveSettings', function () {
            let slippageTolerancePercent = '2.4';
            let transactionDeadlineMins = '7.4';
            let gasLimitZil = '80';

            swapStatus.saveSettings(slippageTolerancePercent, transactionDeadlineMins, gasLimitZil);
            swapStatus.resetSettingsWithoutSave();

            assert.strictEqual($('#slippage_tolerance_input').val(), swapStatus.defaultSlippageTolerancePercent_.toString());
            assert.strictEqual($('#transaction_deadline_input').val(), swapStatus.defaultTransactionDeadlineMins_.toString());
            assert.strictEqual($('#gas_limit_input').val(), swapStatus.defaultGasLimitZil_.toString());

            swapStatus.saveSettings($('#slippage_tolerance_input').val(), $('#transaction_deadline_input').val(), $('#gas_limit_input').val());

            assert.strictEqual(swapStatus.slippageTolerancePercent_, swapStatus.defaultSlippageTolerancePercent_);
            assert.strictEqual(swapStatus.transactionDeadlineMins_, swapStatus.defaultTransactionDeadlineMins_);
            assert.strictEqual(swapStatus.gasLimitZil_, swapStatus.defaultGasLimitZil_);

            assert.strictEqual($('#slippage_tolerance_input').val(), swapStatus.defaultSlippageTolerancePercent_.toString());
            assert.strictEqual($('#transaction_deadline_input').val(), swapStatus.defaultTransactionDeadlineMins_.toString());
            assert.strictEqual($('#gas_limit_input').val(), swapStatus.defaultGasLimitZil_.toString());
        });

        it('#saveSettings, reset to default, no save', function () {
            let slippageTolerancePercent = '2.4';
            let transactionDeadlineMins = '7.4';
            let gasLimitZil = '80';

            swapStatus.saveSettings(slippageTolerancePercent, transactionDeadlineMins, gasLimitZil);
            swapStatus.resetSettingsWithoutSave();
            swapStatus.dismissSettingsWithoutSave();

            assert.strictEqual(swapStatus.slippageTolerancePercent_, parseFloat(slippageTolerancePercent));
            assert.strictEqual(swapStatus.transactionDeadlineMins_, parseFloat(transactionDeadlineMins));
            assert.strictEqual(swapStatus.gasLimitZil_, parseFloat(gasLimitZil));

            assert.strictEqual($('#slippage_tolerance_input').val(), slippageTolerancePercent.toString());
            assert.strictEqual($('#transaction_deadline_input').val(), transactionDeadlineMins.toString());
            assert.strictEqual($('#gas_limit_input').val(), gasLimitZil.toString());
        });
    });

    describe('#confirmation modal related', function () {

        function assertEmptyConfirmationModal() {

            assert.strictEqual($('#swap_token_confirmation_send_amount').text(), '');
            assert.strictEqual($('#swap_token_confirmation_receive_amount').text(), '');
            assert.strictEqual($('#swap_token_confirmation_min_receive_amount').text(), '');
            assert.strictEqual($('#swap_token_confirmation_transaction_deadline').text(), '');
            assert.strictEqual($('#swap_token_confirmation_gas_limit').text(), '');

            assert.strictEqual($('#swap_token_confirmation_confirm_button').hasClass('disabled'), true);
            assert.strictEqual($('#swap_token_confirmation_container').css('display'), 'none');

            assert.strictEqual($('#swap_token_confirmation_error_message_container').css('display'), 'none');
            assert.strictEqual($('#swap_token_confirmation_error_message').text(), '');
        }


        function assertErrorConfirmationModal(errorMessage) {
            assert.strictEqual($('#swap_token_confirmation_send_amount').text(), '');
            assert.strictEqual($('#swap_token_confirmation_receive_amount').text(), '');
            assert.strictEqual($('#swap_token_confirmation_min_receive_amount').text(), '');
            assert.strictEqual($('#swap_token_confirmation_transaction_deadline').text(), '');
            assert.strictEqual($('#swap_token_confirmation_gas_limit').text(), '');

            assert.strictEqual($('#swap_token_confirmation_confirm_button').hasClass('disabled'), true);
            assert.strictEqual($('#swap_token_confirmation_container').css('display'), 'none');

            assert.strictEqual($('#swap_token_confirmation_error_message_container').css('display'), 'block');
            assert.strictEqual($('#swap_token_confirmation_error_message').text(), errorMessage);
        }

        var swapStatus;
        var zilswapDexStatus;

        beforeEach(function () {
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', /* coinPriceCoingeckoData= */ null, /* coinPriceCoingecko24hAgoData= */ null);
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, /* zilswapDexSmartContractStateData= */ null, /* zilswapDexSmartContractState24hAgoData= */ null);
            let walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, /* walletAddressBase16= */ null, /* zilBalanceData= */ null, /* zrcBalanceDataMap= */ null);
            swapStatus = new SwapStatus.SwapStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletBalanceStatus);

            assertEmptyConfirmationModal();
        });

        it('#default values', function () {
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_, null);
        });


        it('#set inner values manually', function () {
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_, null);

            swapStatus.slippageTolerancePercent_ = 2;
            swapStatus.transactionDeadlineMins_ = 4;
            swapStatus.gasLimitZil_ = 20;

            swapStatus.latestBlockNum_ = 521323;

            swapStatus.fromTokenTicker_ = 'ZWAP';
            swapStatus.fromTokenAmount_ = 10;

            swapStatus.toTokenTicker_ = 'ZIL';
            swapStatus.toTokenAmount_ = 26133.45091577352;

            // Expected
            let fromTokenAmount = '10.000000000000 ZWAP';
            let toTokenAmount = '26133.450915773519 ZIL';
            let minReceiveAmount = '25610.781897458048 ZIL';
            let transactionDeadline = '~4 mins (9 blocks)';
            let gasLimit = '20 ZIL';

            swapStatus.setConfirmationModal();

            // Assert Swap Txn attributes
            assert.notStrictEqual(swapStatus.swapTxnToBeExecuted_, null);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.zilswapDexAddressBase16_, zilswapDexStatus.zilswapDexAddressBase16_);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.gasLimit_, 10000);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.deadlineBlock_, 521332);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.fromExactAmountQa_, 10000000000000);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.fromTokenContractAddressBase16_, Constants.zrcTokenPropertiesListMap['ZWAP'].address_base16);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.toMinAmountQa_, 25610781897458050);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.toTokenContractAddressBase16_, null);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.swapType_, SwapTxnWrapper.SwapType.TOKEN_TO_ZIL);

            // Assert modal UI
            assert.strictEqual($('#swap_token_confirmation_send_amount').text(), fromTokenAmount);
            assert.strictEqual($('#swap_token_confirmation_receive_amount').text(), toTokenAmount);
            assert.strictEqual($('#swap_token_confirmation_min_receive_amount').text(), minReceiveAmount);
            assert.strictEqual($('#swap_token_confirmation_transaction_deadline').text(), transactionDeadline);
            assert.strictEqual($('#swap_token_confirmation_gas_limit').text(), gasLimit);

            assert.strictEqual($('#swap_token_confirmation_confirm_button').hasClass('disabled'), false);
            assert.strictEqual($('#swap_token_confirmation_container').css('display'), 'table');

            assert.strictEqual($('#swap_token_confirmation_error_message_container').css('display'), 'none');
            assert.strictEqual($('#swap_token_confirmation_error_message').text(), '');
        });


        it('gasLimit invalid', function () {
            // Suppress log
            console.log = (msg) => {};

            swapStatus.slippageTolerancePercent_ = 2;
            swapStatus.transactionDeadlineMins_ = 4;
            swapStatus.gasLimitZil_ = 0;

            swapStatus.latestBlockNum_ = 521323;

            swapStatus.fromTokenTicker_ = 'ZWAP';
            swapStatus.fromTokenAmount_ = 10;

            swapStatus.toTokenTicker_ = 'ZIL';
            swapStatus.toTokenAmount_ = 26133.45091577352;

            swapStatus.setConfirmationModal();

            assertErrorConfirmationModal('Invalid gas limit!');
        });

        it('latestBlockNum invalid', function () {
            // Suppress log
            console.log = (msg) => {};

            swapStatus.slippageTolerancePercent_ = 2;
            swapStatus.transactionDeadlineMins_ = 4;
            swapStatus.gasLimitZil_ = 20;

            swapStatus.latestBlockNum_ = null;

            swapStatus.fromTokenTicker_ = 'ZWAP';
            swapStatus.fromTokenAmount_ = 10;

            swapStatus.toTokenTicker_ = 'ZIL';
            swapStatus.toTokenAmount_ = 26133.45091577352;

            swapStatus.setConfirmationModal();

            assertErrorConfirmationModal('Blockchain status not available!');
        });


        it('deadlineBlock invalid', function () {
            // Suppress log
            console.log = (msg) => {};

            swapStatus.slippageTolerancePercent_ = 2;
            swapStatus.transactionDeadlineMins_ = -1;
            swapStatus.gasLimitZil_ = 20;

            swapStatus.latestBlockNum_ = 5423612;

            swapStatus.fromTokenTicker_ = 'ZWAP';
            swapStatus.fromTokenAmount_ = 10;

            swapStatus.toTokenTicker_ = 'ZIL';
            swapStatus.toTokenAmount_ = 26133.45091577352;

            swapStatus.setConfirmationModal();

            assertErrorConfirmationModal('Deadline block is invalid!');
        });


        it('fromToken invalid', function () {
            // Suppress log
            console.log = (msg) => {};

            swapStatus.slippageTolerancePercent_ = 2;
            swapStatus.transactionDeadlineMins_ = 4;
            swapStatus.gasLimitZil_ = 20;

            swapStatus.latestBlockNum_ = 521323;

            swapStatus.fromTokenTicker_ = null;
            swapStatus.fromTokenAmount_ = 10;

            swapStatus.toTokenTicker_ = 'ZIL';
            swapStatus.toTokenAmount_ = 26133.45091577352;

            swapStatus.setConfirmationModal();

            assertErrorConfirmationModal('From token not specified!');
        });


        it('fromToken Amount invalid', function () {
            // Suppress log
            console.log = (msg) => {};

            swapStatus.slippageTolerancePercent_ = 2;
            swapStatus.transactionDeadlineMins_ = 4;
            swapStatus.gasLimitZil_ = 20;

            swapStatus.latestBlockNum_ = 521323;

            swapStatus.fromTokenTicker_ = 'ZWAP';
            swapStatus.fromTokenAmount_ = 0;

            swapStatus.toTokenTicker_ = 'ZIL';
            swapStatus.toTokenAmount_ = 26133.45091577352;

            swapStatus.setConfirmationModal();

            assertErrorConfirmationModal('Send amount is empty!');
        })


        it('toToken invalid', function () {
            // Suppress log
            console.log = (msg) => {};

            swapStatus.slippageTolerancePercent_ = 2;
            swapStatus.transactionDeadlineMins_ = 4;
            swapStatus.gasLimitZil_ = 20;

            swapStatus.latestBlockNum_ = 521323;

            swapStatus.fromTokenTicker_ = 'ZWAP';
            swapStatus.fromTokenAmount_ = 10;

            swapStatus.toTokenTicker_ = null;
            swapStatus.toTokenAmount_ = 26133.45091577352;

            swapStatus.setConfirmationModal();

            assertErrorConfirmationModal('To token not specified!');
        });

        it('toToken receive amount invalid', function () {
            // Suppress log
            console.log = (msg) => {};

            swapStatus.slippageTolerancePercent_ = 2;
            swapStatus.transactionDeadlineMins_ = 4;
            swapStatus.gasLimitZil_ = 20;

            swapStatus.latestBlockNum_ = 521323;

            swapStatus.fromTokenTicker_ = 'ZWAP';
            swapStatus.fromTokenAmount_ = 10;

            swapStatus.toTokenTicker_ = 'ZIL';
            swapStatus.toTokenAmount_ = 0;

            swapStatus.setConfirmationModal();

            assertErrorConfirmationModal('Min receive amount is too small or empty!');
        });
    });

    describe('#e2e swap case', function () {
        var zilswapDexStatus;
        var swapStatus;

        beforeEach(function () {
            let walletAddressBase16 = "0x278598f13A4cb142E44ddE38ABA8d8C0190bcB85".toLowerCase();

            let coinPriceCoingeckoData = JSON.parse('{"zilliqa":{"usd":0.11819,"idr":1612}}');
            let coinPriceStatus = new CoinPriceStatus.CoinPriceStatus(Constants.coinMap, Constants.currencyMap, /* activeCurrencyCode= */ 'usd', coinPriceCoingeckoData, /* coinPriceCoingecko24hAgoData= */ null);

            let zilswapDexSmartContractStateData = JSON.parse(fs.readFileSync('./tests/testdata/zilswapdex_contractstate_20210602.txt', 'utf8'));
            zilswapDexStatus = new ZilswapDexStatus.ZilswapDexStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, /* walletAddressBase16= */ null, zilswapDexSmartContractStateData, /* zilswapDexSmartContractState24hAgoData= */ null);

            let zilBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balance":"7476589135982234","nonce":46}}');
            let duckBalanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"balances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"4231"}}}');
            let zrcBalanceData = {
                'DUCK': duckBalanceData,
            }
            let duckAllowanceData = JSON.parse('{"id":"1","jsonrpc":"2.0","result":{"allowances":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85": {"0xba11eb7bcc0a02e947acf03cc651bfaf19c9ec00" : "4851423"}}}}');
            let zrcAllowanceData = {
                'DUCK': duckAllowanceData,
            }

            let walletBalanceStatus = new WalletBalanceStatus.WalletBalanceStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletAddressBase16, zilBalanceData, zrcBalanceData, zrcAllowanceData);
            walletBalanceStatus.computeTokenAllowanceZilswapDexMap('DUCK');
            walletBalanceStatus.computeTokenBalanceMap('DUCK');

            swapStatus = new SwapStatus.SwapStatus(Constants.zrcTokenPropertiesListMap, coinPriceStatus, zilswapDexStatus, walletBalanceStatus);
        });

        it('DUCK to gZIL', function () {
            swapStatus.onNewBlockStatusChange('5472342', []);

            swapStatus.openFromTokenSelector();
            swapStatus.setTokenSelector('DUCK');

            swapStatus.openToTokenSelector();
            swapStatus.setTokenSelector('gZIL');

            swapStatus.bindViewFromTokenAmount(10);
            swapStatus.processFromTokenAmount(10);

            assertFromToken('DUCK');
            assert.strictEqual($('#swap_token_from_amount').val(), '10');

            assert.strictEqual($('#swap_token_from_amount_fiat').text(), '8,668.46');
            assert.strictEqual($('#swap_token_from_amount_fiat_container').css('visibility'), 'visible');

            assertToToken('gZIL');
            assert.strictEqual($('#swap_token_to_amount').val(), '47.70972591606139');

            // Assert rate
            assert.strictEqual($('#swap_token_final_rate').text(), '1 DUCK = 4.771 gZIL');
            assert.strictEqual($('#swap_token_final_rate_inverse').text(), '1 gZIL = 0.2096 DUCK');

            assert.strictEqual($('#swap_token_final_rate').css('display'), '');
            assert.strictEqual($('#swap_token_final_rate_inverse').css('display'), 'none');
            assert.strictEqual($('#swap_token_final_rate_inverse_button').css('display'), '');

            // Assert popover information
            assert.strictEqual($('#popover_minimum_received_amount').text(), '47.23 gZIL');
            assert.strictEqual($('#popover_slippage_tolerance_percent').text(), '1.0');
            assert.strictEqual($('#popover_price_impact_percent').text(), '16.53');
            assert.strictEqual($('#popover_liquidity_provider_fee_amount').text(), '0.03000 DUCK + 183.8 ZIL');

            assertSwapButtonEnabled();

            // Press swap button, should invoke confirmation modal
            swapStatus.setConfirmationModal();

            // Assert Swap Txn attributes
            assert.notStrictEqual(swapStatus.swapTxnToBeExecuted_, null);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.zilswapDexAddressBase16_, zilswapDexStatus.zilswapDexAddressBase16_);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.gasLimit_, 5000);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.deadlineBlock_, 5472349);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.fromExactAmountQa_, 1000);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.fromTokenContractAddressBase16_, Constants.zrcTokenPropertiesListMap['DUCK'].address_base16);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.toMinAmountQa_, 47232628656900776);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.toTokenContractAddressBase16_, Constants.zrcTokenPropertiesListMap['gZIL'].address_base16);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.swapType_, SwapTxnWrapper.SwapType.TOKEN_TO_TOKEN);

            // Assert modal UI

            // Expected
            let fromTokenAmount = '10.00 DUCK';
            let toTokenAmount = '47.709725916061387 gZIL';
            let minReceiveAmount = '47.232628656900772 gZIL';
            let transactionDeadline = '~3 mins (7 blocks)';
            let gasLimit = '10 ZIL';

            assert.strictEqual($('#swap_token_confirmation_send_amount').text(), fromTokenAmount);
            assert.strictEqual($('#swap_token_confirmation_receive_amount').text(), toTokenAmount);
            assert.strictEqual($('#swap_token_confirmation_min_receive_amount').text(), minReceiveAmount);
            assert.strictEqual($('#swap_token_confirmation_transaction_deadline').text(), transactionDeadline);
            assert.strictEqual($('#swap_token_confirmation_gas_limit').text(), gasLimit);

            assert.strictEqual($('#swap_token_confirmation_confirm_button').hasClass('disabled'), false);
            assert.strictEqual($('#swap_token_confirmation_container').css('display'), 'table');

            assert.strictEqual($('#swap_token_confirmation_error_message_container').css('display'), 'none');
            assert.strictEqual($('#swap_token_confirmation_error_message').text(), '');

            // Change slippage tolerance
            swapStatus.saveSettings( /* slippageToleancePercent= */ 5.3, /* transactionDeadlineMins= */ 90.5, /* gasLimitZil= */ 154);
            swapStatus.setConfirmationModal();

            // Assert popover information
            assert.strictEqual($('#popover_minimum_received_amount').text(), '45.18 gZIL');
            assert.strictEqual($('#popover_slippage_tolerance_percent').text(), '5.3');
            assert.strictEqual($('#popover_price_impact_percent').text(), '16.53');
            assert.strictEqual($('#popover_liquidity_provider_fee_amount').text(), '0.03000 DUCK + 183.8 ZIL');

            // Assert Swap Txn attributes
            assert.notStrictEqual(swapStatus.swapTxnToBeExecuted_, null);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.zilswapDexAddressBase16_, zilswapDexStatus.zilswapDexAddressBase16_);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.gasLimit_, 77000);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.deadlineBlock_, 5472524);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.fromExactAmountQa_, 1000);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.fromTokenContractAddressBase16_, Constants.zrcTokenPropertiesListMap['DUCK'].address_base16);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.toMinAmountQa_, 45181110442510130);
            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.toTokenContractAddressBase16_, Constants.zrcTokenPropertiesListMap['gZIL'].address_base16);

            assert.strictEqual(swapStatus.swapTxnToBeExecuted_.swapType_, SwapTxnWrapper.SwapType.TOKEN_TO_TOKEN);

            // Assert modal UI

            // Expected
            let fromTokenAmount2 = '10.00 DUCK';
            let toTokenAmount2 = '47.709725916061387 gZIL';
            let minReceiveAmount2 = '45.181110442510132 gZIL';
            let transactionDeadline2 = '~90.5 mins (182 blocks)';
            let gasLimit2 = '154 ZIL';

            assert.strictEqual($('#swap_token_confirmation_send_amount').text(), fromTokenAmount2);
            assert.strictEqual($('#swap_token_confirmation_receive_amount').text(), toTokenAmount2);
            assert.strictEqual($('#swap_token_confirmation_min_receive_amount').text(), minReceiveAmount2);
            assert.strictEqual($('#swap_token_confirmation_transaction_deadline').text(), transactionDeadline2);
            assert.strictEqual($('#swap_token_confirmation_gas_limit').text(), gasLimit2);

            assert.strictEqual($('#swap_token_confirmation_confirm_button').hasClass('disabled'), false);
            assert.strictEqual($('#swap_token_confirmation_container').css('display'), 'table');

            assert.strictEqual($('#swap_token_confirmation_error_message_container').css('display'), 'none');
            assert.strictEqual($('#swap_token_confirmation_error_message').text(), '');
        });
    });
});