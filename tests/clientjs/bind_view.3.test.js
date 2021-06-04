var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var Constants = require('../../constants.js');
var BindView = require('../../clientjs/bind_view.js');
var assert = require('assert');

describe('BindView3', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
        indexJsdom.assertDefaultStateMainContent();
    });

    afterEach(function () {
        BindView.resetMainContainerContent();
        indexJsdom.assertDefaultStateMainContent();
    });

    describe('#bindViewTotalWalletBalanceZil24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalWalletBalanceZil24hAgo('1234.52', '42.2');

            // Assert
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), '1234.52');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), '42.2');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalWalletBalanceZil24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#wallet_balance_zil_24h_ago').text(), 'asdf');
            assert.strictEqual($('#wallet_balance_zil_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalWalletBalanceZil()', function () {

        beforeEach(function () {
            assert.strictEqual($('#wallet_balance_zil').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalWalletBalanceZil('1234.52');

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalWalletBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#wallet_balance_zil').text(), 'asdf');
        });
    });


    describe('#bindViewTotalWalletBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '');
        });


        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalWalletBalanceFiat24hAgo('1234.52', '1.2');

            // Assert
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), '1234.52');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), '1.2');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalWalletBalanceFiat24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#wallet_balance_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#wallet_balance_fiat_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalWalletBalanceFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#wallet_balance_fiat').text(), 'Loading...');
        });


        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalWalletBalanceFiat('1234.52');

            // Assert
            assert.strictEqual($('#wallet_balance_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalWalletBalanceFiat('asdf');

            // Assert
            assert.strictEqual($('#wallet_balance_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewTotalLpBalanceZil24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalLpBalanceZil24hAgo('1234.52', '4.2');

            // Assert
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), '1234.52');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), '4.2');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalLpBalanceZil24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#lp_balance_zil_24h_ago').text(), 'asdf');
            assert.strictEqual($('#lp_balance_zil_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalLpBalanceZil()', function () {

        beforeEach(function () {
            assert.strictEqual($('#lp_balance_zil').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalLpBalanceZil('1234.52');

            // Assert
            assert.strictEqual($('#lp_balance_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalLpBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#lp_balance_zil').text(), 'asdf');
        });
    });

    describe('#bindViewTotalLpBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalLpBalanceFiat24hAgo('1234.52', '4.2');

            // Assert
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), '1234.52');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), '4.2');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalLpBalanceFiat24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#lp_balance_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#lp_balance_fiat_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalLpBalanceFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#lp_balance_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalLpBalanceFiat('1234.52');

            // Assert
            assert.strictEqual($('#lp_balance_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalLpBalanceFiat('asdf');

            // Assert
            assert.strictEqual($('#lp_balance_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewCarbonStakingBalanceZil24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceZil24hAgo('1234.4', '4.2');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), '1234.4');
            assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), '4.2');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceZil24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_zil_24h_ago').text(), 'asdf');
            assert.strictEqual($('#carbon_staking_balance_zil_percent_change_24h').text(), 'qwer');
        });
    });


    describe('#bindViewCarbonStakingBalanceZil()', function () {

        beforeEach(function () {
            assert.strictEqual($('#carbon_staking_balance_zil').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceZil('1234.4');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_zil').text(), '1234.4');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_zil').text(), 'asdf');
        });
    });

    describe('#bindViewCarbonStakingBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceFiat24hAgo('1234.4', '21');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), '1234.4');
            assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), '21');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceFiat24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#carbon_staking_balance_fiat_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewCarbonStakingBalanceFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#carbon_staking_balance_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceFiat('1234.4');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_fiat').text(), '1234.4');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewCarbonStakingBalanceFiat('asdf');

            // Assert
            assert.strictEqual($('#carbon_staking_balance_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewTotalStakingBalanceZil24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalStakingBalanceZil24hAgo('1234.52', '12');

            // Assert
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), '1234.52');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), '12');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalStakingBalanceZil24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#staking_balance_zil_24h_ago').text(), 'asdf');
            assert.strictEqual($('#staking_balance_zil_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalStakingBalanceZil()', function () {

        beforeEach(function () {
            assert.strictEqual($('#staking_balance_zil').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalStakingBalanceZil('1234.52');

            // Assert
            assert.strictEqual($('#staking_balance_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalStakingBalanceZil('asdf');

            // Assert
            assert.strictEqual($('#staking_balance_zil').text(), 'asdf');
        });
    });

    describe('#bindViewTotalStakingBalanceFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalStakingBalanceFiat24hAgo('1234.52', '22');

            // Assert
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), '1234.52');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), '22');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalStakingBalanceFiat24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#staking_balance_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#staking_balance_fiat_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalStakingBalanceFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#staking_balance_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalStakingBalanceFiat('1234.52');

            // Assert
            assert.strictEqual($('#staking_balance_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalStakingBalanceFiat('asdf');

            // Assert
            assert.strictEqual($('#staking_balance_fiat').text(), 'asdf');
        });
    });

    describe('#bindViewTotalNetWorthZil24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalNetWorthZil24hAgo('1234.52', '22');

            // Assert
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), '1234.52');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), '22');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalNetWorthZil24hAgo('asdf', 'qwer');

            // Assert
            assert.strictEqual($('#net_worth_zil_24h_ago').text(), 'asdf');
            assert.strictEqual($('#net_worth_zil_percent_change_24h').text(), 'qwer');
        });
    });

    describe('#bindViewTotalNetWorthZil()', function () {

        beforeEach(function () {
            assert.strictEqual($('#net_worth_zil').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalNetWorthZil('1234.52');

            // Assert
            assert.strictEqual($('#net_worth_zil').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalNetWorthZil('asdf');

            // Assert
            assert.strictEqual($('#net_worth_zil').text(), 'asdf');
        });
    });


    describe('#bindViewTotalNetWorthFiat24hAgo()', function () {

        beforeEach(function () {
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalNetWorthFiat24hAgo('1234.52', '41');

            // Assert
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), '1234.52');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), '41');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalNetWorthFiat24hAgo('asdf', 'rewq');

            // Assert
            assert.strictEqual($('#net_worth_fiat_24h_ago').text(), 'asdf');
            assert.strictEqual($('#net_worth_fiat_percent_change_24h').text(), 'rewq');
        });
    });

    describe('#bindViewTotalNetWorthFiat()', function () {

        beforeEach(function () {
            assert.strictEqual($('#net_worth_fiat').text(), 'Loading...');
        });

        it('bind view happy case', function () {
            // Act
            BindView.bindViewTotalNetWorthFiat('1234.52');

            // Assert
            assert.strictEqual($('#net_worth_fiat').text(), '1234.52');
        });

        it('bind view random string', function () {
            // Act
            BindView.bindViewTotalNetWorthFiat('asdf');

            // Assert
            assert.strictEqual($('#net_worth_fiat').text(), 'asdf');
        });
    });
});