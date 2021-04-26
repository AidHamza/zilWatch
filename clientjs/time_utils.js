// time_utils.js
// No dependencies

/**
 * A class to represent time duration in days, hours, minutes, and seconds.
 * All getters will return NaN if seconds passed in the constructor is not parseable as a number.
 */
class Duration {
    constructor(seconds) {
        this.seconds = 0;
        if (parseInt(seconds)) {
            this.seconds = seconds;
        }
    }

    getDays() {
        return Math.floor(this.seconds / 60 / 60 / 24);
    }

    getHours() {
        return Math.floor(this.seconds / 60 / 60) % 24;
    }

    getMinutes() {
        return Math.floor(this.seconds / 60) % 60;
    }
    
    getSeconds() {
        return Math.floor(this.seconds) % 60;
    }

    getUserFriendlyString() {
        if (!this.getDays() || !this.getHours() || !this.getMinutes()) {
            return null;
        }
        return this.getDays() + 'd ' + this.getHours() + 'h ' + this.getMinutes() + 'm';
    }
}

if (typeof exports !== 'undefined') {
    exports.Duration = Duration;
}
