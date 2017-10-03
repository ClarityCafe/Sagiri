/**
 * @file API wrapper for SauceNAO, capable of submitting files and urls.
 * @author Capuccino
 * @author Ovyerus
 */

const FormData = require('form-data');
const fs = require('fs');
const siteValues = require('./siteValues');

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
     * @param {Number} numRes amount of responses you want returned from the API. Default is 5 Responses.
     * @see {link} https://saucenao.com/user.php?page=search-api
     */
    constructor(key, numRes=5) {
        if (typeof key !== 'string') throw new TypeError('key is not a string.');
        if (typeof numRes !== 'number') throw new TypeError('numRes is not a number.');

        this.key = key,
        this.numRes = numRes;
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
                            original: result
                        });
                    }

                    return returnData;
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

    if (!siteValues[id]) throw new Error(`Unsupported site index: ${id}`);

    let name = siteValues[id].name;
    let url;


    if (body.ext_urls && body.ext_urls.length > 1) url = body.ext_urls.filter(url => siteValues[id].URLRegex.test(url))[0];
    else if (body.ext_urls && body.ext_urls.length === 1) url = body.ext_urls[0];

    // Use fallback generation method.
    if (!url) url = siteValues[id].backupURL(data);

    return {id, url, name};
}

module.exports = Sagiri;