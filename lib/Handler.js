/**
 * @file API wrapper for SauceNAO, capable of submitting files and urls.
 * @author Capuccino
 * @author Ovyerus
 */

const FormData = require('form-data');
const fs = require('fs');
const http = require('http');
const https = require('https');
const Constants = require('./Constants');
const Ratelimiter = require('./Ratelimiter');

/**
 * Query handler for SauceNAO.
 *
 * @prop {String} key API key
 * @prop {Number} numRes Amount of responses returned from the API.
 * @prop {Number} dbMask Bit mask for selecting specific indexes to ENABLE.
 * @prop {Number} dbMaskI Bit mask for selecting specific indexes to DISABLE.
 * @prop {Ratelimiter} shortLimiter Ratelimiter object that takes care of the short period, usually 30 seconds.
 * @prop {Ratelimiter} longLimiter Ratelimiter object that takes care of the long period, usually 24 hours.
 */
class Handler {
    /**
     * @param {String} key API Key for SauceNAO
     * @param {Object} [options] Optional options
     * @param {Number} [options.numRes=5] Number of results to get from SauceNAO.
     * @param {Boolean} [options.getRating=false] Whether to retrieve the rating of a source or not.
     * @param {Boolean} [options.testMode=false] Whether to enable "test mode", which causes each index that has a match to output 1 result at most.
     * @param {Number[]} [options.dbMask] Array of all the indexes to ENABLE results for.
     * @param {Number[]} [options.dbMaskI] Array of all the indexes to DISABLE results for.
     */
    constructor(key, options={}) {
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

        this.key = key,
        this.numRes = options.numRes || 5;
        this.testMode = options.testMode || false;
        this.dbMask = options.dbMask ? genBitMask(options.dbMask) : null;
        this.dbMaskI = options.dbMaskI ? genBitMask(options.dbMaskI) : null;
        this.getRating = options.getRating || false;

        this.shortLimiter = new Ratelimiter(20, Constants.PERIODS.SHORT); // 20 uses every 30 seconds
        this.longLimiter = new Ratelimiter(300, Constants.PERIODS.LONG); // 300 uses every 24 hours
    }

    /**
     * Searches for potential sources of an image.
     *
     * @param {String} file Either a file or URL that you want to find the source of.
     * @returns {Promise<Object[]>} An array of all the results from the API, with parsed data.
     * @example client.getSauce('http://cfile29.uf.tistory.com/image/277D9B3453F9D9283659F4').then(console.log);
     */
    getSauce(file) {
        return new Promise((resolve, reject) => {
            if (typeof file !== 'string') return reject(new Error('file is not a string.'));
            if (this.shortLimiter.ratelimited) return reject(new Error('Short duration ratelimit exceeded.'));
            if (this.longLimiter.ratelimited) return reject(new Error('Long duration ratelimit exceeded.'));

            let form = new FormData();

            form.append('api_key', this.key);
            form.append('output_type', 2);
            form.append('numres', this.numRes);
            form.append('testmode', Number(this.testMode));

            if (this.dbMask !== null) form.append('dbmask', this.dbMask);
            if (this.dbMaskI !== null) form.append('dbmaski', this.dbMaskI);

            if (fs.existsSync(file)) form.append('file', fs.createReadStream(file));
            else form.append('url', file);

            sendForm(form).then(res => {
                if (Number(res.header.short_limit) !== this.shortLimiter.totalUses) this.shortLimiter.totalUses = Number(res.header.short_limit);
                if (Number(res.header.long_limit) !== this.longLimiter.totalUses) this.longLimiter.totalUses = Number(res.header.long_limit);

                this.shortLimiter.use();
                this.longLimiter.use();

                if (res.header.status > 0) throw new Error(`Server-side error occurred. Error Code: ${res.header.status}`);
                if (res.header.status < 0) throw new Error(`Client-side error occurred. Error code: ${res.header.status}`);

                if (res.results.length === 0) throw new Error('No results.');

                let results = res.results.sort((a, b) => Number(b.header.similarity) - Number(a.header.similarity));
                let returnData = [];

                for (let result of results) {
                    let data = resolveSauceData(result);
                    returnData.push({
                        url: data.url,
                        site: data.name,
                        index: data.id,
                        similarity: Number(result.header.similarity),
                        thumbnail: result.header.thumbnail,
                        rating: Constants.RATINGS.UNKNOWN,
                        original: result
                    });
                }

                return returnData;
            }).then(res => {
                if (!this.getRating) return res;
                return Promise.all([Promise.all(res.map(v => getRating(v.url))), res]);
            }).then(res => {
                if (!this.getRating) return res;

                let [ratings, original] = res;

                ratings.forEach((v, i) => original[i].rating = v);
                return original;
            }).then(resolve).catch(reject);
        });
    }

    /**
     * An alias of Handler#getSauce, for those who are more mentally sane.
     * @alias Handler.getSauce
     * 
     * @param {String} file Either a file or URL that you want to find the source of.
     * @returns {Promise<Object[]>} An array of all the results from the API, with parsed data.
     */
    getSource(file) {
        return this.getSauce(file);
    }
}

function genBitMask(arr) {
    if (!Array.isArray(arr)) throw new TypeError('arr is not an array.');

    let res = 0;

    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'number') throw new TypeError(`Value at index \`${i}\` is not a number.`);
        else if (Constants.MASKS[arr[i]] == null) throw new Error(`DB index \`${arr[i]}\` is unsupported.`);

        else res ^= Constants.MASKS[arr[i]];
    }

    return res;
}

function sendForm(form) {
    return new Promise((resolve, reject) => {
        form.submit('https://saucenao.com/search.php', (err, res) => {
            if (err) return reject(err);

            let chunked = '';

            res.setEncoding('utf8');
            res.on('data', data => chunked += data);
            res.on('error', reject);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(chunked));
                } catch(e) {
                    reject(Error(`Got XML response while expecting JSON:\n${chunked}`));
                }
            });
        });
    });
}

function resolveSauceData(data) {
    let body = data.data;
    let id = data.header.index_name.match(/^Index #(\d+):? /)[1];

    if (!Constants.SITE_LIST[id]) throw new Error(`Unsupported site index: ${id}`);

    let name = Constants.SITE_LIST[id].name;
    let url;

    if (body.ext_urls && body.ext_urls.length > 1) url = body.ext_urls.filter(url => Constants.SITE_LIST[id].URLRegex.test(url))[0];
    else if (body.ext_urls && body.ext_urls.length === 1) url = body.ext_urls[0];

    // Use fallback generation method.
    if (!url) url = Constants.SITE_LIST[id].backupURL(data);

    return {id, url, name};
}

function getRating(url) {
    return new Promise((resolve, reject) => {
        if (!url.startsWith('https:') && !url.startsWith('http:')) return reject(new Error('url does not start with `https` or `http`.'));

        let runner = url.startsWith('https:') ? https : http;

        runner.request(url, res => {
            let chunked = '';

            res.setEncoding('utf8');
            res.on('data', data => chunked += data);
            res.on('error', reject);
            res.on('end', () => {
                let getter = Object.values(Constants.SITE_LIST).find(v => v.URLRegex.test(url));

                if (!getter) return reject(new Error('Could not find site matching URL given.'));

                try {
                    resolve(getter.getRating(chunked));
                } catch(_) {
                    resolve(Constants.RATINGS.UNKNOWN);
                }
            });
        }).on('error', reject).end();
    });
}

module.exports = Handler;