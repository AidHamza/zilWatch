var assert = require('assert');
var FormattingUtils = require('../../clientjs/formatting_utils.js');

describe('FormattingUtils', function () {

  describe('#parseFloatFromUsd()', function () {

    it('thousands with cents', function () {
      let result = FormattingUtils.parseFloatFromUsd("14,243.23");
      let expected = 14243.23;
      assert.strictEqual(result, expected);
    });

    it('thousands', function () {
      let result = FormattingUtils.parseFloatFromUsd("14,243");
      let expected = 14243;
      assert.strictEqual(result, expected);
    });

    it('millions with cents', function () {
      let result = FormattingUtils.parseFloatFromUsd("2,447,243.23");
      let expected = 2447243.23;
      assert.strictEqual(result, expected);
    });

    it('millions', function () {
      let result = FormattingUtils.parseFloatFromUsd("2,447,243");
      let expected = 2447243;
      assert.strictEqual(result, expected);
    });

    it('billions with cents', function () {
      let result = FormattingUtils.parseFloatFromUsd("9,722,447,243.23");
      let expected = 9722447243.23;
      assert.strictEqual(result, expected);
    });

    it('billions', function () {
      let result = FormattingUtils.parseFloatFromUsd("9,722,447,243");
      let expected = 9722447243;
      assert.strictEqual(result, expected);
    });
  });

  describe('#convertNumberQaToDecimalString()', function () {

    it('qa 10^4 dec 4', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ 14243.23, /* decimals= */ 4);
      let expected = "1.424";
      assert.strictEqual(result, expected);
    });

    it('qa 10^4 dec 8: returns 3 SF', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ 14243.23, /* decimals= */ 8);
      let expected = "0.000142";
      assert.strictEqual(result, expected);
    });

    it('qa 10^4 dec 14: returns null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ 14243.23, /* decimals= */ 14);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 0', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ 5156711544243.23, /* decimals= */ 0);
      let expected = "5156711544243";
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 4', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ 5156711544243.23, /* decimals= */ 4);
      let expected = "515671154";
      assert.strictEqual(result, expected);
    });

    it('qa 10^12 dec 12', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ 5156711544243.23, /* decimals= */ 12);
      let expected = "5.157";
      assert.strictEqual(result, expected);
    });

    it('qa 10^30 dec 15', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ 5156711544243247894578451234785.23, /* decimals= */ 15);
      let expected = "5156711544243248";
      assert.strictEqual(result, expected);
    });

    it('qa 10^30 dec 20', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ 5156711544243247894578451234785.23, /* decimals= */ 20);
      let expected = "51567115442";
      assert.strictEqual(result, expected);
    });

    it('numberQa not number: returns null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ "GSDF", /* decimals= */ 20);
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('decimals not number: returns null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ 5156711544243, /* decimals= */ "432");
      let expected = null;
      assert.strictEqual(result, expected);
    });

    it('both not number: returns null', function () {
      let result = FormattingUtils.convertNumberQaToDecimalString(/* numberQa= */ null, /* decimals= */ "432");
      let expected = null;
      assert.strictEqual(result, expected);
    });
  });
});
