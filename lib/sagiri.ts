import FormData from 'form-data';
import fetch from 'node-fetch';

import fs from 'fs';

import { MASKS, SITE_LIST } from './constants';
import Ratelimiter from './ratelimiter';
import {
  SagiriOptions,
  PERIODS,
  RATINGS,
  Source,
  SauceData,
  FormRes,
  FormResResult
} from './types';

const exists = (path: fs.PathLike) =>
  new Promise(res => fs.exists(path, ex => res(ex)));

/**
 * @class Sagiri
 * @module Sagiri
 * @classdesc Query handler for SauceNAO.
 * @param {string} key API Key for SauceNAO
 * @param {SagiriOptions} [options] Optional options
 * @param {number} [options.numRes=5] Number of results to get from SauceNAO.
 * @param {boolean} [options.getRating=false] Whether to retrieve the rating of a source or not.
 * @param {boolean} [options.testMode=false] Whether to enable "test mode", which causes each index that has a match to output 1 result at most.
 * @param {number[] | null} [options.dbMask=null] Array of all the indexes to **ENABLE** results for.
 * @param {number[] | null} [options.dbMaskI=null] Array of all the indexes to **DISABLE** results for.
 * @description The main class for the library to get sources of images.
 * An instance of this class can be created with a SauceNAO token upon which you can query the API get the `getSauce` method
 */
export default class Sagiri {
  private key: string;
  private numRes: SagiriOptions['numRes'];
  private testMode: SagiriOptions['testMode'];
  private dbMask: number | null;
  private dbMaskI: number | null;
  private getRating: SagiriOptions['getRating'];
  private shortLimiter: Ratelimiter;
  private longLimiter: Ratelimiter;

  constructor(
    key: string,
    options: SagiriOptions = { numRes: 5, getRating: false, testMode: false }
  ) {
    if (typeof key !== 'string') throw new TypeError('key is not a string.');
    if (options.numRes && typeof options.numRes !== 'number')
      throw new TypeError('options.numRes is not a number.');
    if (options.testMode && typeof options.testMode !== 'boolean')
      throw new TypeError('options.testMode is not a boolean.');
    if (options.getRating && typeof options.getRating !== 'boolean')
      throw new TypeError('options.getRating is not a boolean.');

    if (options.dbMask && options.dbMask.length) {
      if (!Array.isArray(options.dbMask))
        throw new TypeError('options.dbMask is not an array.');
      if (
        options.dbMask.filter(a => typeof a === 'number').length !==
        options.dbMask.length
      )
        throw new TypeError(
          'Not all of the values in `options.dbMask` are a number.'
        );
    }

    if (options.dbMaskI && options.dbMaskI.length) {
      if (!Array.isArray(options.dbMaskI))
        throw new TypeError('options.dbMaskI is not an array.');
      if (
        options.dbMaskI.filter(a => typeof a === 'number').length !==
        options.dbMaskI.length
      )
        throw new TypeError(
          'Not all of the values in `options.dbMaskI` are a number.'
        );
    }

    this.key = key;
    this.numRes = this.hasProp(options, 'numRes') ? options.numRes : 5;
    this.testMode = this.hasProp(options, 'testMode')
      ? options.testMode
      : false;
    this.dbMask = options.dbMask ? this.genBitMask(options.dbMask) : null;
    this.dbMaskI = options.dbMaskI ? this.genBitMask(options.dbMaskI) : null;
    this.getRating = this.hasProp(options, 'getRating')
      ? options.getRating
      : false;

    this.shortLimiter = new Ratelimiter(20, PERIODS.SHORT); // 20 uses every 30 seconds
    this.longLimiter = new Ratelimiter(300, PERIODS.LONG); // 300 uses every 24 hours
  }

  /**
   * @method Sagiri#getSauce
   * @description Searches for potential sources of an image.
   * @param {string | Buffer} file Either a file or URL or a file buffer that you want to find the source of
   * @returns {Promise<Array<Source>>} An array of all the results from the API, with parsed data.
   * @example
   * ```ts
   *  const Sagiri = require('sagiri');
   *  const sagiri = new Sagiri('YOUR_TOKEN');
   *  (async function() {
   *    const data = await sagiri.getSauce('https://i.imgur.com/YmaYT5L.jpg');
   *    console.log(data);
   *  })();
   * ```
   */
  async getSauce(file: string | Buffer): Promise<Source[]> {
    if (this.shortLimiter.ratelimited)
      throw new Error('Short duration ratelimit excedeeded');
    if (this.longLimiter.ratelimited)
      throw new Error('Long duration ratelimit exceeded');

    const form = new FormData();

    form.append('api_key', this.key);
    form.append('output_type', 2);
    form.append('numres', this.numRes);
    form.append('testmode', Number(this.testMode));

    if (this.dbMask) form.append('dbmask', this.dbMask);
    if (this.dbMaskI) form.append('dbmaski', this.dbMaskI);

    if (typeof file === 'string')
      if (await exists(file)) form.append('file', fs.createReadStream(file));
      else form.append('url', file);
    else if (Buffer.isBuffer(file)) form.append('file', file);

    const res = await this.sendForm(form);

    if (parseInt(res.header.short_limit) !== this.shortLimiter.totalUses)
      this.shortLimiter.totalUses = parseInt(res.header.short_limit);
    if (parseInt(res.header.long_limit) !== this.longLimiter.totalUses)
      this.longLimiter.totalUses = parseInt(res.header.long_limit);

    this.shortLimiter.use();
    this.longLimiter.use();

    // TODO: better errors
    if (res.header.status === -2)
      throw new Error(
        `SauceNao Search Rate Too High.\n${
          res.header.message.match(
            /(Your IP \((?:[0-9]{1,3}\.){3}[0-9]{1,3}\)[a-z \\'0-9]+)/
          )![0]
        }`
      );
    if (res.header.status > 0)
      throw new Error(
        `Server-side error occurred. Error Code: ${res.header.status}`
      );
    if (res.header.status < 0)
      throw new Error(
        `Client-side error occurred. Error code: ${res.header.status}`
      );

    if (res.results.length === 0) throw new Error('No results.');

    // Filter out any results that do not have a resolver, and sort according to their similarity.
    let results = res.results.filter(
      r =>
        SITE_LIST[parseInt(r.header.index_name.match(/^Index #(\d+):? /)![1])]
    );

    if (results.length === 0) throw new Error('No results');

    results = results.sort(
      (a, b) =>
        parseFloat(b.header.similarity) - parseFloat(a.header.similarity)
    );
    const returnData: Source[] = [];

    results.forEach(result => {
      const data = this.resolveSauceData(result);
      returnData.push({
        url: data.url,
        site: data.name,
        index: data.id.toString(),
        similarity: parseFloat(result.header.similarity),
        thumbnail: result.header.thumbnail,
        authorName: result.data.author_name,
        authorUrl: result.data.author_url,
        rating: RATINGS[0],
        original: result
      });
    });

    if (this.getRating)
      return Promise.all(
        returnData.map(async dataSet => ({
          ...dataSet,
          rating: await this.resolveRating(dataSet.url)
        }))
      );

    return returnData;
  }

  /**
   * @method sagiri#getSource
   * @description An alias of `Sagiri#getSauce`, for those who are more mentally sane.
   * @param {string | Buffer} file Either a file or URL or a file buffer that you want to find the source of
   * @returns {Promise<Array<Source>>} An array of all the results from the API, with parsed data.
   */
  // eslint-disable-next-line no-invalid-this
  getSource = (file: string | Buffer): Promise<Source[]> => this.getSauce(file);

  private genBitMask(arr: number[]): number {
    if (!Array.isArray(arr)) throw new TypeError('arr is not an array.');

    let res = 0;

    for (const mask of arr)
      if (typeof mask !== 'number')
        throw new TypeError(`Unexpected '${mask}' in mask.`);
      else if (MASKS[mask] === null)
        throw new Error(`DB index '${mask}' is unsupported.`);
      else res ^= Number(MASKS[mask]);

    return res;
  }

  private async sendForm(form: FormData): Promise<FormRes> {
    try {
      const res = await fetch('https://saucenao.com/search.php', {
        method: 'POST',
        body: form
      });

      return res.json() as Promise<FormRes>;
    } catch (err) {
      throw new Error('Got HTML response while expecting JSON');
    }
  }

  private resolveSauceData(data: FormResResult): SauceData {
    const body = data.data;
    const id: number = parseInt(
      data.header.index_name.match(/^Index #(\d+):? /)![1]
    );

    if (!SITE_LIST[id]) throw new Error(`Unsupported site index: ${id}`);

    const { name } = SITE_LIST[id];
    let url = '';

    if (body.ext_urls && body.ext_urls.length > 1)
      [url] = body.ext_urls.filter((urlFilter: string) =>
        SITE_LIST[id].URLRegex.test(urlFilter)
      );
    else if (body.ext_urls && body.ext_urls.length === 1) [url] = body.ext_urls;

    // Use fallback generation method.
    if (!url) url = SITE_LIST[id].backupURL(data);

    return { id, url, name };
  }

  private async resolveRating(url: string) {
    if (!/^https?/.test(url))
      throw new Error('url does not start with `https` or `http`');

    try {
      const res = await fetch(url);
      const data = await res.text();
      const getter = Object.values(SITE_LIST).find(v => v.URLRegex.test(url));

      if (!getter) throw new Error('Could not find site matching URL given.');

      return getter.getRating(data);
    } catch (err) {
      return RATINGS[0];
    }
  }

  private hasProp<O extends {}>(obj: O, prop: keyof O) {
    return obj && prop in obj;
  }
}
