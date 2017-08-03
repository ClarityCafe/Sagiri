/**
 * @file Sagiri.js
 * @description Sagiri client
 * @author Capuccino
 * @license MIT
 * 
 */
const Promise = require('bluebird');
const got = require('got');
const urlRegex = str => /(http(s)?:\/\/)?(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(str);

/** 
 * Query Handler for SauceNao-related requests.
 */

class Sagiri {
    /**
     * @param {String} key your API Key for Saucenao
     * @param {Number} outputType type of output you want the API to show. Default is value 2 (JSON Response)
     * @param {Number} numRes amount of responses you want returned from the API. Default is 5 Responses.
     * @see {link} https://saucenao.com/user.php?page=search-api
     */
    constructor({key, numRes, outputType}) {
        if (!key) throw new TypeError('NO API Key provided!');
        this.key = key,
        this.outputType = outputType || 2,
        this.numRes = numRes || 5;
    }
    /**
     * Gets the source and outputs it in your preferred output type
     * @param {String} path filepath for the image you want to get the source from (Deprecated).
     * @param {String} link web address for the source, must be a valid HTTP/HTTPS address.
     * @returns {Promise} JSON that contains the closest match.
     * @example client.getSauce(path/link).then(res => { console.log(res); });
     */
    getSauce(link) {
        return new Promise((resolve, reject) => {
           if (link) {
                if (!urlRegex) {
                    throw new TypeError('Link is not valid HTTP/HTTPS Address.');
                } else {
                    got(`http://saucenao.com/search.php?output_type=${this.outputType}&numres=${this.numRes}&api_key=${this.key}&url=${encodeURIComponent(link)}`).then(res => {
                        resolve(res.body);
                    }).catch(reject);
                }
            }
        });
    }
}

module.exports = Sagiri;