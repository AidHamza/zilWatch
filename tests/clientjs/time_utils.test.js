var assert = require('assert');
var TimeUtils = require('../../clientjs/time_utils.js');

describe('TimeUtils', function () {

    describe('#Duration', function () {

        it('Duration getters more than 1 day', function () {
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

        it('Duration getters more than 2 days', function () {
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

        it('Duration getters less than 1 day', function () {
            let duration = new TimeUtils.Duration(67841);
            let expectedDays = 0;
            let expectedHours = 18;
            let expectedMinutes = 50;
            let expectedSeconds = 41;
            let expectedUserFriendlyString = '0d 18h 50m';
            assert.strictEqual(duration.getDays(), expectedDays);
            assert.strictEqual(duration.getHours(), expectedHours);
            assert.strictEqual(duration.getMinutes(), expectedMinutes);
            assert.strictEqual(duration.getSeconds(), expectedSeconds);
            assert.strictEqual(duration.getUserFriendlyString(), expectedUserFriendlyString);
        });

        it('Duration getters less than 1 minute', function () {
            let duration = new TimeUtils.Duration(41);
            let expectedDays = 0;
            let expectedHours = 0;
            let expectedMinutes = 0;
            let expectedSeconds = 41;
            let expectedUserFriendlyString = '0d 0h 0m';
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