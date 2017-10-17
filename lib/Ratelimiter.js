/**
 * Ratelimiter class.
 * 
 * @prop {Number} totalUses Amount of times a entity can be used before being ratelimited.
 * @prop {Number} interval Interval between resetting amount of uses.
 * @prop {Number} uses Number of current uses this interval has.
 */
class Ratelimiter {
    /**
     * Constructs a new ratelimiter.
     * 
     * @param {Number} totalUses The total amount of uses the ratelimiter can be used before
     * @param {Number} interval Time in milliseoncds between resettings uses.
     */
    constructor(totalUses, interval) {
        if (typeof totalUses !== 'number') throw new TypeError('totalUses is not a number.');
        if (typeof interval !== 'number') throw new TypeError('interval is not a number.');

        this.totalUses = totalUses;
        this.interval = interval;
        this.uses = 0;
        this._timer = setInterval(() => this.uses = 0, interval).unref();
    }

    /**
     * Add a use to the ratelimiter.
     */
    use() {
        if (this.uses < this.totalUses) this.uses++;
    }

    get ratelimited() {
        return this.uses === this.totalUses;
    }
}

module.exports = Ratelimiter;