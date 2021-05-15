var assert = require('assert');
var FormattingUtils = require('../../clientjs/formatting_utils.js');

describe('FormattingUtils', function () {

  describe('#parseFloatFromCommafiedNumberString()', function () {

    it('floating point only', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("0.023231423");
      let expected = 0.023231423;
      assert.strictEqual(result, expected);
    });

    it('hundreds with long floating point', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("143.23231423");
      let expected = 143.23231423;
      assert.strictEqual(result, expected);
    });

    it('hundreds with cents', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("143.23");
      let expected = 143.23;
      assert.strictEqual(result, expected);
    });

    it('thousands with long floating point', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("14,243.23231423");
      let expected = 14243.23231423;
      assert.strictEqual(result, expected);
    });

    it('thousands with cents', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("14,243.23");
      let expected = 14243.23;
      assert.strictEqual(result, expected);
    });

    it('thousands', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("14,243");
      let expected = 14243;
      assert.strictEqual(result, expected);
    });

    it('millions with cents', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("2,447,243.23");
      let expected = 2447243.23;
      assert.strictEqual(result, expected);
    });

    it('millions', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("2,447,243");
      let expected = 2447243;
      assert.strictEqual(result, expected);
    });

    it('billions with long floating point', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("9,722,447,243.23231423");
      let expected = 9722447243.23231423;
      assert.strictEqual(result, expected);
    });

    it('billions with cents', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("9,722,447,243.23");
      let expected = 9722447243.23;
      assert.strictEqual(result, expected);
    });

    it('billions', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString("9,722,447,243");
      let expected = 9722447243;
      assert.strictEqual(result, expected);
    });

    it('fiatString not string: null', function () {
      let result = FormattingUtils.parseFloatFromCommafiedNumberString(9432.45);
      let expected = null;
      assert.strictEqual(result, expected);
    });
  });

  describe('#commafyNumberToString(decimalPlace=default=2)', function () {

    it('floating point only', function () {
      let result = FormattingUtils.commafyNumberToString(0.023231423);
      let expected = "0.02";
      assert.strictEqual(result, expected);
    });

    it('hundreds with long floating point', function () {
      let result = FormattingUtils.commafyNumberToString(143.23231423);
      let expected = "143.23";
      assert.strictEqual(result, expected);
    });

    it('hundreds with cents', function () {
      let result = FormattingUtils.commafyNumberToString(143.23);
      let expected = "143.23";
      assert.strictEqual(result, expected);
    });

    it('hundreds', function () {
      let result = FormattingUtils.commafyNumberToString(143);
      let expected = "143.00";
      assert.strictEqual(result, expected);
    });

    it('thousands with long floating point', function () {
      let result = FormattingUtils.commafyNumberToString(14243.23231423);
      let expected = "14,243.23";
      assert.strictEqual(result, expected);
    });

    it('thousands with cents', function () {
      let result = FormattingUtils.commafyNumberToString(14243.23);
      let expected = "14,243.23";
      assert.strictEqual(result, expected);
    });

    it('thousands', function () {
      let result = FormattingUtils.commafyNumberToString(14243);
      let expected = "14,243.00";
      assert.strictEqual(result, expected);
    });

    it('millions with cents', function () {
      let result = FormattingUtils.commafyNumberToString(2447243.23);
      let expected = "2,447,243.23";
      assert.strictEqual(result, expected);
    });

    it('millions', function () {
      let result = FormattingUtils.commafyNumberToString(2447243);
      let expected = "2,447,243.00";
      assert.strictEqual(result, expected);
    });

    it('billions with long floating point', function () {
      let result = FormattingUtils.commafyNumberToString(9722447243.23231423);
      let expected = "9,722,447,243.23";
      assert.strictEqual(result, expected);
    });

    it('billions with cents', function () {
      let result = FormattingUtils.commafyNumberToString(9722447243.23);
      let expected = "9,722,447,243.23";
      assert.strictEqual(result, expected);
    });

    it('billions', function () {
      let result = FormattingUtils.commafyNumberToString(9722447243);
      let expected = "9,722,447,243.00";
      assert.strictEqual(result, expected);
    });

    it('numberVar not number: null', function () {
      let result = FormattingUtils.commafyNumberToString("9432.45");
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('decimalPlace less than 0: null', function () {
      let result = FormattingUtils.commafyNumberToString(2543432, /* decimalPlace= */ -1);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.0001, too small, use defaultDecimals', function () {
      let result = FormattingUtils.commafyNumberToString(0.0000023231423);
      let expected = "0.00";
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.0001', function () {
      let result = FormattingUtils.commafyNumberToString(0.000023231423);
      let expected = "0.00002";
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.001', function () {
      let result = FormattingUtils.commafyNumberToString(0.00023231423);
      let expected = "0.0002";
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.01', function () {
      let result = FormattingUtils.commafyNumberToString(0.0023231423);
      let expected = "0.002";
      assert.strictEqual(result, expected);
    });
  });

  describe('#commafyNumberToString(decimalPlace=1)', function () {

    it('floating point only', function () {
      let result = FormattingUtils.commafyNumberToString(0.023231423, /* decimalPlace= */ 1);
      let expected = "0.0";
      assert.strictEqual(result, expected);
    });

    it('hundreds with long floating point', function () {
      let result = FormattingUtils.commafyNumberToString(143.23231423, /* decimalPlace= */ 1);
      let expected = "143.2";
      assert.strictEqual(result, expected);
    });

    it('hundreds with cents', function () {
      let result = FormattingUtils.commafyNumberToString(143.23, /* decimalPlace= */ 1);
      let expected = "143.2";
      assert.strictEqual(result, expected);
    });

    it('hundreds', function () {
      let result = FormattingUtils.commafyNumberToString(143, /* decimalPlace= */ 1);
      let expected = "143.0";
      assert.strictEqual(result, expected);
    });

    it('thousands with long floating point', function () {
      let result = FormattingUtils.commafyNumberToString(14243.23231423, /* decimalPlace= */ 1);
      let expected = "14,243.2";
      assert.strictEqual(result, expected);
    });

    it('thousands with cents', function () {
      let result = FormattingUtils.commafyNumberToString(14243.23, /* decimalPlace= */ 1);
      let expected = "14,243.2";
      assert.strictEqual(result, expected);
    });

    it('thousands', function () {
      let result = FormattingUtils.commafyNumberToString(14243, /* decimalPlace= */ 1);
      let expected = "14,243.0";
      assert.strictEqual(result, expected);
    });

    it('millions with cents', function () {
      let result = FormattingUtils.commafyNumberToString(2447243.23, /* decimalPlace= */ 1);
      let expected = "2,447,243.2";
      assert.strictEqual(result, expected);
    });

    it('millions', function () {
      let result = FormattingUtils.commafyNumberToString(2447243, /* decimalPlace= */ 1);
      let expected = "2,447,243.0";
      assert.strictEqual(result, expected);
    });

    it('billions with long floating point', function () {
      let result = FormattingUtils.commafyNumberToString(9722447243.23231423, /* decimalPlace= */ 1);
      let expected = "9,722,447,243.2";
      assert.strictEqual(result, expected);
    });

    it('billions with cents', function () {
      let result = FormattingUtils.commafyNumberToString(9722447243.23, /* decimalPlace= */ 1);
      let expected = "9,722,447,243.2";
      assert.strictEqual(result, expected);
    });

    it('billions', function () {
      let result = FormattingUtils.commafyNumberToString(9722447243, /* decimalPlace= */ 1);
      let expected = "9,722,447,243.0";
      assert.strictEqual(result, expected);
    });

    it('numberVar not number: null', function () {
      let result = FormattingUtils.commafyNumberToString("9432.45", /* decimalPlace= */ 1);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.00001, too small, use defaultDecimals', function () {
      let result = FormattingUtils.commafyNumberToString(0.0000023231423, /* decimalPlace= */ 1);
      let expected = "0.0";
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.0001', function () {
      let result = FormattingUtils.commafyNumberToString(0.000023231423, /* decimalPlace= */ 1);
      let expected = "0.00002";
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.001', function () {
      let result = FormattingUtils.commafyNumberToString(0.00023231423, /* decimalPlace= */ 1);
      let expected = "0.0002";
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.01', function () {
      let result = FormattingUtils.commafyNumberToString(0.0023231423, /* decimalPlace= */ 1);
      let expected = "0.002";
      assert.strictEqual(result, expected);
    });
  });

  describe('#commafyNumberToString(decimalPlace=0)', function () {

    it('floating point only', function () {
      let result = FormattingUtils.commafyNumberToString(0.023231423, /* decimalPlace= */ 0);
      let expected = "0";
      assert.strictEqual(result, expected);
    });

    it('hundreds with long floating point', function () {
      let result = FormattingUtils.commafyNumberToString(143.23231423, /* decimalPlace= */ 0);
      let expected = "143";
      assert.strictEqual(result, expected);
    });

    it('hundreds with cents', function () {
      let result = FormattingUtils.commafyNumberToString(143.23, /* decimalPlace= */ 0);
      let expected = "143";
      assert.strictEqual(result, expected);
    });

    it('hundreds', function () {
      let result = FormattingUtils.commafyNumberToString(143, /* decimalPlace= */ 0);
      let expected = "143";
      assert.strictEqual(result, expected);
    });

    it('thousands with long floating point', function () {
      let result = FormattingUtils.commafyNumberToString(14243.23231423, /* decimalPlace= */ 0);
      let expected = "14,243";
      assert.strictEqual(result, expected);
    });

    it('thousands with cents', function () {
      let result = FormattingUtils.commafyNumberToString(14243.23, /* decimalPlace= */ 0);
      let expected = "14,243";
      assert.strictEqual(result, expected);
    });

    it('thousands', function () {
      let result = FormattingUtils.commafyNumberToString(14243, /* decimalPlace= */ 0);
      let expected = "14,243";
      assert.strictEqual(result, expected);
    });

    it('millions with cents', function () {
      let result = FormattingUtils.commafyNumberToString(2447243.23, /* decimalPlace= */ 0);
      let expected = "2,447,243";
      assert.strictEqual(result, expected);
    });

    it('millions', function () {
      let result = FormattingUtils.commafyNumberToString(2447243, /* decimalPlace= */ 0);
      let expected = "2,447,243";
      assert.strictEqual(result, expected);
    });

    it('billions with long floating point', function () {
      let result = FormattingUtils.commafyNumberToString(9722447243.23231423, /* decimalPlace= */ 0);
      let expected = "9,722,447,243";
      assert.strictEqual(result, expected);
    });

    it('billions with cents', function () {
      let result = FormattingUtils.commafyNumberToString(9722447243.23, /* decimalPlace= */ 0);
      let expected = "9,722,447,243";
      assert.strictEqual(result, expected);
    });

    it('billions', function () {
      let result = FormattingUtils.commafyNumberToString(9722447243, /* decimalPlace= */ 0);
      let expected = "9,722,447,243";
      assert.strictEqual(result, expected);
    });

    it('numberVar not number: null', function () {
      let result = FormattingUtils.commafyNumberToString("9432.45", /* decimalPlace= */ 0);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.00001, too small, use defaultDecimals', function () {
      let result = FormattingUtils.commafyNumberToString(0.0000023231423, /* decimalPlace= */ 0);
      let expected = "0";
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.0001', function () {
      let result = FormattingUtils.commafyNumberToString(0.000023231423, /* decimalPlace= */ 0);
      let expected = "0.00002";
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.001', function () {
      let result = FormattingUtils.commafyNumberToString(0.00023231423, /* decimalPlace= */ 0);
      let expected = "0.0002";
      assert.strictEqual(result, expected);
    });

    it('floating point < 0.01', function () {
      let result = FormattingUtils.commafyNumberToString(0.0023231423, /* decimalPlace= */ 0);
      let expected = "0.002";
      assert.strictEqual(result, expected);
    });
  });

  describe('#convertNumberQaToDecimalString(isCommafied=false)', function () {

    it('qa 10^4 dec 4', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 14243.23, /* decimals= */ 4, /* isCommafied= */ false);
      let expected = "1.424";
      assert.strictEqual(result, expected);
    });

    it('qa 10^4 dec 8: 3 SF', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 14243.23, /* decimals= */ 8, /* isCommafied= */ false);
      let expected = "0.000142";
      assert.strictEqual(result, expected);
    });

    it('qa 10^4 dec 14: null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 14243.23, /* decimals= */ 14, /* isCommafied= */ false);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 0', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243.23, /* decimals= */ 0, /* isCommafied= */ false);
      let expected = "5156711544243";
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 4', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243.23, /* decimals= */ 4, /* isCommafied= */ false);
      let expected = "515671154";
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 12', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243.23, /* decimals= */ 12, /* isCommafied= */ false);
      let expected = "5.157";
      assert.strictEqual(result, expected);
    });

    it('qa 10^30 dec 15', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243247894578451234785.23, /* decimals= */ 15, /* isCommafied= */ false);
      let expected = "5156711544243248";
      assert.strictEqual(result, expected);
    });

    it('qa 10^30 dec 20', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243247894578451234785.23, /* decimals= */ 20, /* isCommafied= */ false);
      let expected = "51567115442";
      assert.strictEqual(result, expected);
    });

    it('numberQa not number: null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ "GSDF", /* decimals= */ 20, /* isCommafied= */ false);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('decimals not number: null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243, /* decimals= */ "432", /* isCommafied= */ false);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('both not number: null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ null, /* decimals= */ "432", /* isCommafied= */ false);
      let expected = null;
      assert.strictEqual(result, expected);
    });
  });

  describe('#convertNumberQaToDecimalString(isCommafied=default=true)', function () {

    it('qa 10^4 dec 4', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 14243.23, /* decimals= */ 4);
      let expected = "1.424";
      assert.strictEqual(result, expected);
    });

    it('qa 10^4 dec 8: 3 SF', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 14243.23, /* decimals= */ 8);
      let expected = "0.000142";
      assert.strictEqual(result, expected);
    });

    it('qa 10^4 dec 14: null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 14243.23, /* decimals= */ 14);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 0', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243.23, /* decimals= */ 0);
      let expected = "5,156,711,544,243";
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 4', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243.23, /* decimals= */ 4);
      let expected = "515,671,154";
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 12', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243.23, /* decimals= */ 12);
      let expected = "5.157";
      assert.strictEqual(result, expected);
    });

    it('qa 10^30 dec 15', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243247894578451234785.23, /* decimals= */ 15);
      let expected = "5,156,711,544,243,248";
      assert.strictEqual(result, expected);
    });

    it('qa 10^30 dec 20', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243247894578451234785.23, /* decimals= */ 20);
      let expected = "51,567,115,442";
      assert.strictEqual(result, expected);
    });

    it('numberQa not number: null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ "GSDF", /* decimals= */ 20);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('decimals not number: null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243, /* decimals= */ "432");
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('both not number: null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ null, /* decimals= */ "432");
      let expected = null;
      assert.strictEqual(result, expected);
    });
  });

  describe('#censorBech32Address()', function () {

    it('ZilSwap DEX address', function () {
      let result = FormattingUtils.censorBech32Address("zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w");
      let expected = "zil1h...zpv2w";
      assert.strictEqual(result, expected);
    });

    it('ZilSwap Governance Token', function () {
      let result = FormattingUtils.censorBech32Address("zil1p5suryq6q647usxczale29cu3336hhp376c627");
      let expected = "zil1p...6c627";
      assert.strictEqual(result, expected);
    });

    it('Random whale wallet address', function () {
      let result = FormattingUtils.censorBech32Address("zil1f68jl32af8zdrkhwt3rem6ueqvrqn5zvwwaxmq");
      let expected = "zil1f...waxmq";
      assert.strictEqual(result, expected);
    });

    it('Shorter than 11 chars: null', function () {
      let result = FormattingUtils.censorBech32Address("zil134d627");
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('bech32Address not string: null', function () {
      let result = FormattingUtils.censorBech32Address(12445234);
      let expected = null;
      assert.strictEqual(result, expected);
    });
  });

  describe('#isStartsWithNegative()', function () {

    it('starts with negative', function () {
      let result = FormattingUtils.isStartsWithNegative("-43.453");
      let expected = true;
      assert.strictEqual(result, expected);
    });

    it('no negative', function () {
      let result = FormattingUtils.isStartsWithNegative("436.12");
      let expected = false;
      assert.strictEqual(result, expected);
    });

    it('double negative', function () {
      let result = FormattingUtils.isStartsWithNegative("--436.12");
      let expected = true;
      assert.strictEqual(result, expected);
    });

    it('zero, return false', function () {
      let result = FormattingUtils.isStartsWithNegative("0");
      let expected = false;
      assert.strictEqual(result, expected);
    });

    it('not a string, return null', function () {
      let result = FormattingUtils.isStartsWithNegative(123);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('empty string, return null', function () {
      let result = FormattingUtils.isStartsWithNegative("");
      let expected = null;
      assert.strictEqual(result, expected);
    });
  });


  describe('#isStringZero()', function () {

    it('starts with negative', function () {
      let result = FormattingUtils.isStringZero("-43.453");
      let expected = false;
      assert.strictEqual(result, expected);
    });

    it('no negative', function () {
      let result = FormattingUtils.isStringZero("436.12");
      let expected = false;
      assert.strictEqual(result, expected);
    });

    it('double negative', function () {
      let result = FormattingUtils.isStringZero("--436.12");
      let expected = false;
      assert.strictEqual(result, expected);
    });

    it('zero, return true', function () {
      let result = FormattingUtils.isStringZero("0");
      let expected = true;
      assert.strictEqual(result, expected);
    });

    it('zero floating point, return true', function () {
      let result = FormattingUtils.isStringZero("0.000");
      let expected = true;
      assert.strictEqual(result, expected);
    });

    it('not a string, return null', function () {
      let result = FormattingUtils.isStringZero(123);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('empty string, return null', function () {
      let result = FormattingUtils.isStringZero("");
      let expected = null;
      assert.strictEqual(result, expected);
    });
  });

});