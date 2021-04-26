var assert = require('assert');
var TimeUtils = require('../../clientjs/time_utils.js');

describe('TimeUtils', function () {

    describe('#Duration', function () {

        it('Duration getters #1', function () {
            let duration = new TimeUtils.Duration(143874);
            let expectedDays = 1;
            let expectedHours = 15;
            let expectedMinutes = 57;
            let expectedSeconds = 54;
            let expectedUserFriendlyString = '1d 15h 57m';
            assert.strictEqual(duration.getDays(), expectedDays);
            assert.strictEqual(duration.getHours(), expectedHours);
            assert.strictEqual(duration.getMinutes(), expectedMinutes);
            assert.strictEqual(duration.getSeconds(), expectedSeconds);
            assert.strictEqual(duration.getUserFriendlyString(), expectedUserFriendlyString);
        });

        it('Duration getters #2', function () {
            let duration = new TimeUtils.Duration(237470);
            let expectedDays = 2;
            let expectedHours = 17;
            let expectedMinutes = 57;
            let expectedSeconds = 50;
            let expectedUserFriendlyString = '2d 17h 57m';
            assert.strictEqual(duration.getDays(), expectedDays);
            assert.strictEqual(duration.getHours(), expectedHours);
            assert.strictEqual(duration.getMinutes(), expectedMinutes);
            assert.strictEqual(duration.getSeconds(), expectedSeconds);
            assert.strictEqual(duration.getUserFriendlyString(), expectedUserFriendlyString);
        });

        it('Duration constructor with a string of numbers', function () {
            let duration = new TimeUtils.Duration("237470");
            let expectedDays = 2;
            let expectedHours = 17;
            let expectedMinutes = 57;
            let expectedSeconds = 50;
            let expectedUserFriendlyString = '2d 17h 57m';
            assert.strictEqual(duration.getDays(), expectedDays);
            assert.strictEqual(duration.getHours(), expectedHours);
            assert.strictEqual(duration.getMinutes(), expectedMinutes);
            assert.strictEqual(duration.getSeconds(), expectedSeconds);
            assert.strictEqual(duration.getUserFriendlyString(), expectedUserFriendlyString);
        });

        it('Duration constructor non-number: getters return NaN', function () {
            let duration = new TimeUtils.Duration("2374a70");
            assert.strictEqual(duration.getDays(), NaN);
            assert.strictEqual(duration.getHours(), NaN);
            assert.strictEqual(duration.getMinutes(), NaN);
            assert.strictEqual(duration.getSeconds(), NaN);
            assert.strictEqual(duration.getUserFriendlyString(), null);
        });
    });
});