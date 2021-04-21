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

    it('usdString not string: null', function () {
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
  });

  describe('#convertNumberQaToDecimalString()', function () {

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
      let expected = "5156711544243";
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 4', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243.23, /* decimals= */ 4);
      let expected = "515671154";
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 12', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243.23, /* decimals= */ 12);
      let expected = "5.157";
      assert.strictEqual(result, expected);
    });

    it('qa 10^30 dec 15', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243247894578451234785.23, /* decimals= */ 15);
      let expected = "5156711544243248";
      assert.strictEqual(result, expected);
    });

    it('qa 10^30 dec 20', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString( /* numberQa= */ 5156711544243247894578451234785.23, /* decimals= */ 20);
      let expected = "51567115442";
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

});