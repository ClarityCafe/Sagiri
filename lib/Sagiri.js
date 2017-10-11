/**
 * @file API wrapper for SauceNAO, capable of submitting files and urls.
 * @author Capuccino
 * @author Ovyerus
 */

const FormData = require('form-data');
const fs = require('fs');
const http = require('http');
const https = require('https');
const {SITE_LIST, RATINGS} = require('./Constants');

/**
 * Query handler for SauceNAO.
 *
 * @prop {String} key API key
 * @prop {Number} numRes Amount of responses returned from the API.
 * @prop {?Number} shortLimit Ratelimit for the "short" period, currently the last 30 seconds. Will be null before the first request.
 * @prop {?Number} longLimit Ratelimit for the "long" period, currently 24 hours. Will be null before the first request.
 * @prop {?Number} shortRemaining Amount of requests left during the "short" period before you get ratelimited. Will be null before the first request.
 * @prop {?Number} longRemaining Amount of requests left during the "long" period before you get ratelimited. Will be null before the first request.
 */
class Sagiri {
    /**
     * @param {String} key API Key for SauceNAO
     * @param {Object} [options] Optional options
     * @param {Number} [options.numRes=5] Number of results to get from SauceNAO.
     * @param {Boolean} [options.getRating=false] Whether to retrieve the rating of a source or not.
     * @see {link} https://saucenao.com/user.php?page=search-api
     */
    constructor(key, options={}) {
        if (typeof key !== 'string') throw new TypeError('key is not a string.');

        this.key = key,
        this.numRes = options.numRes != null ? options.numRes : 5;
        this.getRating = options.getRating || false;
        this.shortLimit = null;
        this.longLimit = null;
        this.shortRemaining = null;
        this.longRemaining = null;
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
            if (typeof file !== 'string') {
                reject(new Error('file is not a string.'));
            } else {
                let form = new FormData();

                form.append('api_key', this.key);
                form.append('output_type', 2);
                form.append('numres', this.numRes);

                if (fs.existsSync(file)) form.append('file', fs.createReadStream(file));
                else form.append('url', file);

                sendForm(form).then(res => {
                    this.shortLimit = res.header.short_limit;
                    this.longLimit = res.header.long_limit;
                    this.shortRemaining = res.header.short_remaining;
                    this.longRemaining = res.header.long_remaining;

                    if (this.shortLimit === 0) throw new Error('Short duration ratelimit exceeded.');
                    if (this.longLimit === 0) throw new Error('Long duration ratelimit exceeded.');

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
                            rating: RATINGS.UNKNOWN,
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
            }
        });
    }

    /**
     * An alias of Sagiri#getSauce
     *
     * @param {String} file Either a file or URL that you want to find the source of.
     * @returns {Promise<Object[]>} An array of all the results from the API, with parsed data.
     * @see Sagiri#getSauce
     */
    getSource(file) {
        return this.getSauce(file);
    }
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

    if (!SITE_LIST[id]) throw new Error(`Unsupported site index: ${id}`);

    let name = SITE_LIST[id].name;
    let url;

    if (body.ext_urls && body.ext_urls.length > 1) url = body.ext_urls.filter(url => SITE_LIST[id].URLRegex.test(url))[0];
    else if (body.ext_urls && body.ext_urls.length === 1) url = body.ext_urls[0];

    // Use fallback generation method.
    if (!url) url = SITE_LIST[id].backupURL(data);

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
                let getter = Object.values(SITE_LIST).find(v => v.URLRegex.test(url));

                if (!getter) return reject(new Error('Could not find site matching URL given.'));

                try {
                    resolve(getter.getRating(chunked));
                } catch(_) {
                    resolve(RATINGS.UNKNOWN);
                }
            });
        }).on('error', reject).end();
    });
}

module.exports = Sagiri;