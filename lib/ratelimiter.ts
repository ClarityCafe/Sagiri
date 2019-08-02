/**
 * Ratelimiter class.
 *
 * @prop {number} totalUses Amount of times a entity can be used before being ratelimited.
 * @prop {number} interval Interval between resetting amount of uses.
 * @prop {number} uses Number of current uses this interval has.
 */
export default class Ratelimiter {
  private totalUses: number;
  private uses: number;

  /**
   * Constructs a new ratelimiter.
   *
   * @param {number} totalUses The total amount of uses the ratelimiter can be used before
   * @param {number} interval Time in milliseoncds between resettings uses.
   */
  public constructor(totalUses: number, interval: number) {
    if (typeof totalUses !== 'number') throw new TypeError('totalUses is not a number.');
    if (typeof interval !== 'number') throw new TypeError('interval is not a number.');

    this.totalUses = totalUses;
    this.uses = 0;
    setInterval(() => {
      this.uses = 0;
    }, interval).unref();
  }

  public use() {
    if (this.uses < this.totalUses) this.uses++;
  }

  public get ratelimited() {
    return this.uses === this.totalUses;
  }
}