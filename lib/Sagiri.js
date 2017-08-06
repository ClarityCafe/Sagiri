/**
 * @file Sagiri.js
 * @description Sagiri client
 * @author Capuccino
 * @license MIT
 * 
 */
const Promise = require('bluebird');
const got = require('got');
const rest = require('restler');
const fs = require('fs');
const mime =require('mime-types');
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
        this.key = key,
        this.outputType = outputType || 2,
        this.numRes = numRes || 5;
        if (!key) throw new TypeError('NO API Key provided!');
    }
    /**
     * Gets the source and outputs it in your preferred output type
     * @param {String} link web address for the source, must be a valid HTTP/HTTPS address.
     * @param {String} path the path to your file.
     * @returns {Promise} output data form Saucenao based from the output type you provided
     * @example client.getSauce(path/link).then(res => { console.log(res); });
     * 
     */
    getSauce(link, path) {
        return new Promise((resolve, reject) => {
            if (path) {
                fs.stat(path, (err, stats) => {
                    rest.post(`https://saucenao.com/search.php?output_type=${this.outputType}&numres=${this.numRes}`, {                       
                        multipart: true,
                        data: {
                            file: rest.file(path, null, stats.size, null, mime.contentType(path.extname(path)))
                        }
                    }).on('complete', data => {
                        resolve(data);
                    });
                });
            } else if (link) {
                if (!urlRegex) {
                    throw new TypeError('Link is not valid HTTP/HTTPS Address.');
                } else {
                    got(`http://saucenao.com/search.php?output_type=${this.outputType}&numres=${this.numRes}&api_key=${this.key}&url=${encodeURIComponent(link)}`)
                    .then(res => {
                        resolve(res.body);
                    }).catch(reject);
                }
            }
        });
    }

}

module.exports = Sagiri;