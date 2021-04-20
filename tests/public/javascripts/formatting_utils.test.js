var assert = require('assert');
var FormattingUtils = require('../../../public/javascripts/formatting_utils.js');

describe('FormattingUtils', function() {

  describe('#parseFloatFromUsd()', function() {

    it('thousands with cents', function() {
      let result = FormattingUtils.parseFloatFromUsd("14,243.23");
      let expected = 14243.23;
      assert.strictEqual(result, expected);
    });

    it('thousands', function() {
      let result = FormattingUtils.parseFloatFromUsd("14,243");
      let expected = 14243;
      assert.strictEqual(result, expected);
    });
    
    it('millions with cents', function() {
      let result = FormattingUtils.parseFloatFromUsd("2,447,243.23");
      let expected = 2447243.23;
      assert.strictEqual(result, expected);
    });

    it('millions', function() {
      let result = FormattingUtils.parseFloatFromUsd("2,447,243");
      let expected = 2447243;
      assert.strictEqual(result, expected);
    });

    it('billions with cents', function() {
      let result = FormattingUtils.parseFloatFromUsd("9,722,447,243.23");
      let expected = 9722447243.23;
      assert.strictEqual(result, expected);
    });

    it('billions', function() {
      let result = FormattingUtils.parseFloatFromUsd("9,722,447,243");
      let expected = 9722447243;
      assert.strictEqual(result, expected);
    });
  });
});
