/**
 * @file API wrapper for SauceNAO, capable of submitting files and urls.
 * @author Capuccino
 * @author Ovyerus
 */

const FormData = require('form-data');
const fs = require('fs');
const SITE_VALUES = require('./Endpoints');


/**
 * Query handler for SauceNAO.
 *
 * @prop {String} key API key
 * @prop {Number} numRes Amount of responses returned from the API.
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
                    if (res.header.status !== 0) throw new Error('An error occurred. (will be more info soon)');

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
            res.on('end', () => resolve(JSON.parse(chunked)));
        });
    });
}

function resolveSauceData(data) {
    let body = data.data;
    let id = data.header.index_name.match(/^Index #(\d+):? /)[1];
    let name = SITE_VALUES[id].name;
    let url;

    if (body.ext_urls[0] && body.ext_urls.length > 1) {
        url = body.ext_urls.filter(url => SITE_VALUES[id].URLRegex.test(url))[0];
    } else if (body.ext_urls[0] && body.ext_urls.length === 1) {
        url = body.ext_urls[0];
    }

    // Use fallback generation method.
    if (!url) url = SITE_VALUES[id].backupURL(data);

    return {id, url, name};
}

module.exports = Sagiri;