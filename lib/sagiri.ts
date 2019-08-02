/**
 * @file API wrapper for SauceNAO, capable of submitting files and urls.
 * @author Capuccino
 * @author Ovyerus
 */

import FormData from 'form-data';
import fs from 'fs';
import http from 'http';
import https from 'https';
import * as Constants from './constants';
import Ratelimiter from './ratelimiter';
import {HandlerOptions, PERIODS, RATINGS} from 'types';

/**
 * Query handler for SauceNAO.
 *
 * @prop {string} key API key
 * @prop {number} numRes Amount of responses returned from the API.
 * @prop {Array<number>} dbMask Bit mask for selecting specific indexes to **ENABLE**.
 * @prop {Array<number>} dbMaskI Bit mask for selecting specific indexes to **DISABLE**.
 * @prop {Ratelimiter} shortLimiter Ratelimiter object that takes care of the short period, usually 30 seconds.
 * @prop {Ratelimiter} longLimiter Ratelimiter object that takes care of the long period, usually 24 hours.
 */
export class Sagiri {
  private key: string;
  private numRes: HandlerOptions['numRes'];
  private testMode: HandlerOptions['testMode'];
  private dbMask: number | null;
  private dbMaskI: number | null;
  private getRating: HandlerOptions['getRating'];

  private shortLimiter: Ratelimiter;
  private longLimiter: Ratelimiter;

  /**
   * @param {string} key API Key for SauceNAO
   * @param {HandlerOptions} [options] Optional options
   * @param {number} [options.numRes=5] Number of results to get from SauceNAO.
   * @param {boolean} [options.getRating=false] Whether to retrieve the rating of a source or not.
   * @param {boolean} [options.testMode=false] Whether to enable "test mode", which causes each index that has a match to output 1 result at most.
   * @param {undefined} [options.dbMask] Array of all the indexes to **ENABLE** results for.
   * @param {undefined} [options.dbMaskI] Array of all the indexes to **DISABLE** results for.
   */
  public constructor(key: string, options: HandlerOptions = {numRes: 5, getRating: false, testMode: false}) {
    if (typeof key !== 'string') throw new TypeError('key is not a string.');
    if (options.numRes && typeof options.numRes !== 'number') throw new TypeError('options.numRes is not a number.');
    if (options.testMode && typeof options.testMode !== 'boolean') throw new TypeError('options.testMode is not a boolean.');
    if (options.getRating && typeof options.getRating !== 'boolean') throw new TypeError('options.getRating is not a boolean.');

    if (options.dbMask) {
      if (!Array.isArray(options.dbMask)) throw new TypeError('options.dbMask is not an array.');
      if (options.dbMask.filter(a => typeof a === 'number').length !== options.dbMask.length) throw new TypeError('Not all of the values in `options.dbMask` are a number.');
    }

    if (options.dbMaskI) {
      if (!Array.isArray(options.dbMaskI)) throw new TypeError('options.dbMaskI is not an array.');
      if (options.dbMaskI.filter(a => typeof a === 'number').length !== options.dbMaskI.length) throw new TypeError('Not all of the values in `options.dbMaskI` are a number.');
    }

    this.key = key;
    this.numRes = options.numRes || 5;
    this.testMode = options.testMode || false;
    this.dbMask = options.dbMask ? this.genBitMask(options.dbMask) : null;
    this.dbMaskI = options.dbMaskI ? this.genBitMask(options.dbMaskI) : null;
    this.getRating = options.getRating || false;

    this.shortLimiter = new Ratelimiter(20, PERIODS.SHORT); // 20 uses every 30 seconds
    this.longLimiter = new Ratelimiter(300, PERIODS.LONG); // 300 uses every 24 hours
  }

  public async getSauce(file: string | Buffer) {
    return [ {} ];
  }

  public async getSource(file: string | Buffer) {
    return this.getSauce(file);
  }

  private genBitMask(arr: number[]) {
    if (!Array.isArray(arr)) throw new TypeError('arr is not an array.');

    let res = 0;

    for (let i = 0; i < arr.length; i++) {
      if (typeof arr[i] !== 'number') throw new TypeError(`Value at index \`${i}\` is not a number.`);
      else if (Constants.MASKS[arr[i]] === null) throw new Error(`DB index \`${arr[i]}\` is unsupported.`);

      else res ^= Constants.MASKS[arr[i]];
    }

    return res;
  }

  private async sendForm(form: any) {
    try {
      form.submit('https://saucenao.com/search.php', (err: string, res: any) => {
        if (err) throw new Error(err);

        let chunked = '';

        res.setEncoding('utf8');
        res.on('data', (data: string) => {
          chunked += data;
        });
        res.on('error', () => {
          throw new Error();
        });
        res.on('end', () => {
          try {
            JSON.parse(chunked);
          } catch{
            throw new Error(`Got HTML response while expected JSON:\n${chunked}`);
          }
        });
      });
    } catch(err) {
      throw new Error(err);
    }
  }

  private resolveSauceData(data: any) {
    const body = data.data;
    const id: number = data.header.index_name.match(/^Index #(\d+):? /)[1];

    if (!Constants.SITE_LIST[id]) throw new Error(`Unsupported site index: ${id}`);

    const name = Constants.SITE_LIST[id].name;
    let url = '';

    if (body.ext_urls && body.ext_urls.length > 1) {
      url = body.ext_urls.filter((urlFilter: string) => Constants.SITE_LIST[id].URLRegex.test(urlFilter))[0];
    } else if (body.ext_urls && body.ext_urls.length === 1) {
      url = body.ext_urls[0];
    }

    // Use fallback generation method.
    if (!url) url = Constants.SITE_LIST[id].backupURL(data);

    return {id, url, name};
  }

  private async resolveRating(url: string) {
    if (!/^https?/.test(url)) throw new Error('url does not start with `https` or `http`');

    const runner = url.startsWith('https:') ? https : http;

    runner
      .request(url, res => {
        let chunked = '';

        res.setEncoding('utf8');
        res.on('data', (data: string) => {
          chunked += data;
        });
        res.on('error', () => {
          throw new Error();
        });
        res.on('end', () => {
          const getter = Object.values(Constants.SITE_LIST).find(v => v.URLRegex.test(url));

          if (!getter) throw new Error('Could not find site matching URL given.');

          try {
            if (getter.getRating) getter.getRating(chunked);
            throw new Error();
          } catch{
            return RATINGS.UNKNOWN;
          }
        });
      })
      .on('error', () => {
        throw new Error();
      })
      .end();
  }
}

export default Sagiri;