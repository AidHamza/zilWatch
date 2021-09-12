var indexJsdom = require('../../index.jsdom.js');
var $ = indexJsdom.$;

var BindView = require('../../../clientjs/index//bind_view.js');
var assert = require('assert');

describe('BindView5', function () {


    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
        indexJsdom.assertDefaultStateMainContent();
        $('.wallet-balance-spinner').each(function () {
            assert.strictEqual($(this).css('display'), 'none');
        });
        $('.lp-balance-spinner').each(function () {
            assert.strictEqual($(this).css('display'), 'none');
        });
        $('.staking-balance-spinner').each(function () {
            assert.strictEqual($(this).css('display'), 'none');
        });
        $('.net-worth-spinner').each(function () {
            assert.strictEqual($(this).css('display'), 'none');
        });
    });

    afterEach(function () {
        BindView.resetMainContainerContent();
        indexJsdom.assertDefaultStateMainContent();
    });

    describe('#dec|incrementShowSpinnerWalletBalance()', function () {

        it('inc once', function () {
            // Act
            BindView.incrementShowSpinnerWalletBalance();

            // Assert
            $('.wallet-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
        });

        it('inc dec', function () {
            // Act
            BindView.incrementShowSpinnerWalletBalance();

            // Assert
            $('.wallet-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerWalletBalance();

            // Assert
            $('.wallet-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('inc 2x dec 2x', function () {
            // Act
            BindView.incrementShowSpinnerWalletBalance();
            BindView.incrementShowSpinnerWalletBalance();
            BindView.decrementShowSpinnerWalletBalance();

            // Assert
            $('.wallet-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerWalletBalance();

            // Assert
            $('.wallet-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('dec 2x', function () {
            // Act
            BindView.decrementShowSpinnerWalletBalance();

            // Assert
            $('.wallet-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });

            // Act
            BindView.decrementShowSpinnerWalletBalance();

            // Assert
            $('.wallet-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('inc 2x dec 2x with net worth', function () {
            // Act
            BindView.incrementShowSpinnerWalletBalance();
            BindView.incrementShowSpinnerWalletBalance();
            BindView.decrementShowSpinnerWalletBalance();

            // Assert
            $('.wallet-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerWalletBalance();

            // Assert
            $('.wallet-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });
    });

    describe('#dec|incrementShowSpinnerLpBalance()', function () {

        it('inc once', function () {
            // Act
            BindView.incrementShowSpinnerLpBalance();

            // Assert
            $('.lp-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
        });

        it('inc dec', function () {
            // Act
            BindView.incrementShowSpinnerLpBalance();

            // Assert
            $('.lp-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerLpBalance();

            // Assert
            $('.lp-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('inc 2x dec 2x', function () {
            // Act
            BindView.incrementShowSpinnerLpBalance();
            BindView.incrementShowSpinnerLpBalance();
            BindView.decrementShowSpinnerLpBalance();

            // Assert
            $('.lp-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerLpBalance();

            // Assert
            $('.lp-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('dec 2x', function () {
            // Act
            BindView.decrementShowSpinnerLpBalance();

            // Assert
            $('.lp-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });

            // Act
            BindView.decrementShowSpinnerLpBalance();

            // Assert
            $('.lp-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('inc 2x dec 2x with net worth', function () {
            // Act
            BindView.incrementShowSpinnerLpBalance();
            BindView.incrementShowSpinnerLpBalance();
            BindView.decrementShowSpinnerLpBalance();

            // Assert
            $('.lp-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerLpBalance();

            // Assert
            $('.lp-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });
    });

    describe('#dec|incrementShowSpinnerStakingBalance()', function () {

        it('inc once', function () {
            // Act
            BindView.incrementShowSpinnerStakingBalance();

            // Assert
            $('.staking-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
        });

        it('inc dec', function () {
            // Act
            BindView.incrementShowSpinnerStakingBalance();

            // Assert
            $('.staking-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerStakingBalance();

            // Assert
            $('.staking-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('inc 2x dec 2x', function () {
            // Act
            BindView.incrementShowSpinnerStakingBalance();
            BindView.incrementShowSpinnerStakingBalance();
            BindView.decrementShowSpinnerStakingBalance();

            // Assert
            $('.staking-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerStakingBalance();

            // Assert
            $('.staking-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('dec 2x', function () {
            // Act
            BindView.decrementShowSpinnerStakingBalance();

            // Assert
            $('.staking-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });

            // Act
            BindView.decrementShowSpinnerStakingBalance();

            // Assert
            $('.staking-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('inc 2x dec 2x with net worth', function () {
            // Act
            BindView.incrementShowSpinnerStakingBalance();
            BindView.incrementShowSpinnerStakingBalance();
            BindView.decrementShowSpinnerStakingBalance();

            // Assert
            $('.staking-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerStakingBalance();

            // Assert
            $('.staking-balance-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });
    });

    describe('#dec|incrementShowSpinnerNetWorth()', function () {

        it('inc once', function () {
            // Act
            BindView.incrementShowSpinnerNetWorth();

            // Assert
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });
        });

        it('inc dec', function () {
            // Act
            BindView.incrementShowSpinnerNetWorth();

            // Assert
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerNetWorth();

            // Assert
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('inc 2x dec 2x', function () {
            // Act
            BindView.incrementShowSpinnerNetWorth();
            BindView.incrementShowSpinnerNetWorth();
            BindView.decrementShowSpinnerNetWorth();

            // Assert
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Act
            BindView.decrementShowSpinnerNetWorth();

            // Assert
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('dec 2x', function () {
            // Act
            BindView.decrementShowSpinnerNetWorth();

            // Assert
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });

            // Act
            BindView.decrementShowSpinnerNetWorth();

            // Assert
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });

        it('mix inc 4x, mix dec 4x', function () {
            BindView.incrementShowSpinnerLpBalance();
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            BindView.incrementShowSpinnerStakingBalance();
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            BindView.incrementShowSpinnerStakingBalance();
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            BindView.incrementShowSpinnerWalletBalance();
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Now decrement
            BindView.decrementShowSpinnerStakingBalance();
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            BindView.decrementShowSpinnerWalletBalance();
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            BindView.decrementShowSpinnerStakingBalance();
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'block');
            });

            // Only last one is hidden
            BindView.decrementShowSpinnerLpBalance();
            $('.net-worth-spinner').each(function () {
                assert.strictEqual($(this).css('display'), 'none');
            });
        });
    });
});