/**
 * @class Ratelimiter
 * @module Ratelimiter
 * @classdesc Ratelimiter for Sagiri
 * @param {number} totalUses The total amount of uses the ratelimiter can be used before
 * @param {number} interval Time in milliseoncds between resettings uses.
 * @description SauceNAO employs a rate limiter so in order for this API to be able to handle
 * it also tracks it's own rate usages.
 * @private
 */
export class Ratelimiter {
  private static totalUses: number;
  private uses: number;

  public constructor(totalUses: number, interval: number) {
    if (typeof totalUses !== 'number') throw new TypeError('totalUses is not a number.');
    if (typeof interval !== 'number') throw new TypeError('interval is not a number.');

    this.totalUses = totalUses;
    this.uses = 0;
    setInterval(() => {
      this.uses = 0;
    }, interval).unref();
  }

  /**
   * @method ratelimiter#use
   * @returns {void} Increases the tracker usages of the API
   * @private
   */
  public use(): void {
    if (this.uses < this.totalUses) this.uses++;
  }

  /**
   * @prop {boolean} ratelimited
   * @returns {boolean} whether the API is currently ratelimiting
   * @private
   */
  public get ratelimited(): boolean {
    return this.uses === this.totalUses;
  }

  /**
   * @prop {number} totalUses
   * @returns {number} Gets the current total uses
   * @private
   */
  public get totalUses(): number {
    return Ratelimiter.totalUses;
  }

  /**
   * @param {number} value the new value to set
   * @description Sets the current totalUses
   * @private
   */
  public set totalUses(value: number) {
    Ratelimiter.totalUses = value;
  }
}

export default Ratelimiter;