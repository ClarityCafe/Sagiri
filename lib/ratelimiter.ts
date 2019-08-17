/**
 *  Ratelimiter for Sagiri
 * @param {number} totalUses The total amount of uses the ratelimiter can be used before
 * @param {number} interval Time in milliseoncds between resettings uses.
 * @description SauceNAO employs a rate limiter so in order for this API to be able to handle
 * it also tracks it's own rate usages.
 * @private
 */
export class Ratelimiter {
  uses = 0;

  constructor(public totalUses: number, interval: number) {
    setInterval(() => {
      this.uses = 0;
    }, interval).unref();
  }

  /**
   * @private
   * @returns Increases the tracker usages of the API
   */
  use(): void {
    if (this.uses < this.totalUses) this.uses++;
  }

  /**
   * @returns whether the API is currently ratelimiting
   */
  get ratelimited(): boolean {
    return this.uses === this.totalUses;
  }
}

export default Ratelimiter;
