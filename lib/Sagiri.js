/**
 * @file API wrapper for SauceNAO, capable of submitting files and urls.
 * @author Capuccino
 * @author Ovyerus
 */

const FormData = require('form-data');
const fs = require('fs');

// I didn't know what to call it ¯\_(ツ)_/¯
const SITE_VALUES = {
    5: {
        name: 'Pixiv',
        backupURL: data => `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${data.data.pixiv_id}`,
        URLRegex: /(?:https?:\/\/)?(?:www\.)?pixiv\.net\/member_illust\.php\?mode=.+&illust_id=\d{8}/i
    },
    8: {
        name: 'Nico Nico Seiga',
        backupURL: data => `http://seiga.nicovideo.jp/seiga/im${data.data.seiga_id}`,
        URLRegex: /(?:http:\/\/)?seiga\.nicovideo\.jp\/seiga\/im\d{7}/i
    },
    9: {
        name: 'Danbooru',
        backupURL: data => `https://danbooru.donmai.us/posts/${data.data.danbooru_id}`,
        URLRegex: /(?:https?:\/\/)?danbooru\.donmai\.us\/(?:posts|post\/show)\/\d{7}/i
    },
    10: {
        name: 'drawr',
        backupURL: data => `http://drawr.net/show.php?id=${data.data.drawr_id}`,
        URLRegex: /(?:http:\/\/)?(?:www\.)?drawr\.net\/show\.php\?id=\d{7}/i
    },
    11: {
        name: 'Nijie',
        backupURL: data => `http://nijie.info/view.php?id=${data.data.nijie_id}`,
        URLRegex: /(?:http:\/\/)?nijie\.info\/view\.php\?id=\d{5}/i
    },
    12: {
        name: 'Yande.re',
        backupURL: data => `https://yande.re/post/show/${data.data.yandere_id}`,
        URLRegex: /(?:https?:\/\/)?yande\.re\/post\/show\/\d{6}/i
    },
    16: {
        name: 'FAKKU',
        backupURL: data => `https://www.fakku.net/hentai/${data.data.source.toLowerCase().replace(' ', '-')}`,
        URLRegex: /(?:https?:\/\/)?(www\.)?fakku\.net\/hentai\/[a-z-]+\d{10}/i
    },
    18: {
        name: 'nHentai',
        backupURL: data => `https://nhentai.net/g/${data.header.thumbnail.match(/nhentai\/(\d+)/)[1]}`,
        URLRegex: /(?:)/i
    },
    19: {
        name: '2D-Market',
        backupURL: data => `http://2d-market.com/Comic/${data.header.thumbnail.match(/2d_market\/(\d+)/i)[1]}-${data.data.source.replace(' ', '-')}`,
        URLRegex: /(?:https?:\/\/)2d-market\.com\/Comic\/\d+/i
    },
    20: {
        name: 'MediBang',
        backupURL: data => data.data.url,
        URLRegex: /(?:https?:\/\/)?medibang\.com\/picture\/[a-z0-9]+/i
    },
    21: {
        name: 'AniDB',
        backupURL: data => `https://anidb.net/perl-bin/animedb.pl?show=anime&aid=${data.data.anidb_aid}`,
        URLRegex: /(?:https?:\/\/)?anidb\.net\/perl-bin\/animedb\.pl\?show=.+&aid=\d{4}/i
    },
    25: {
        name: 'Gelbooru',
        backupURL: data => `https://gelbooru.com/index.php?page=post&s=view&id=${data.data.gelbooru_id}`,
        URLRegex: /(?:https?:\/\/)gelbooru\.com\/index\.php\?page=post&s=view&id=\d{7}/i
    },
    26: {
        name: 'Konachan',
        backupURL: data =>  `https://konachan.com/post/show/${data.data.konachan_id}`,
        URLRegex: /(?:http:\/\/)?konachan\.com\/post\/show\/\d{6}/i
    },
    27: {
        name: 'Sankaku Channel',
        backupURL: data => `https://chan.sankakucomplex.com/post/show/${data.data.sankaku_id}`,
        URLRegex: /(?:https?:\/\/)?chan\.sankakucomplex\.com\/post\/show\/\d{7}/i
    },
    28: {
        name: 'Anime-Pictures',
        backupURL: data => `https://anime-pictures.net/pictures/view_post/${data.data['anime-pictures_id']}`,
        URLRegex: /(?:https?:\/\/)?anime-pictures\.net\/pictures\/view_post\/\d{6}/i
    },
    29: {
        name: 'e621',
        backupURL: data => `https://e621.net/post/show/${data.data.e621_id}`,
        URLRegex: /(?:https?:\/\/)?e621\.net\/post\/show\/\d{6}/i
    },
    30: {
        name: 'Idol Complex',
        backupURL: data => `https://idol.sankakucomplex.com/post/show/${data.data.idol_id}`,
        URLRegex: /(?:https?:\/\/)?idol\.sankakucomplex\.com\/post\/show\/\d{6}/i
    },
    31: {
        name: 'bcy.net Illust',
        backupURL: data => `https://bcy.net/${data.data.bcy_type}/detail/${data.data.member_link_id}/${data.data.bcy_id}`,
        URLRegex: /(?:http:\/\/)?bcy.net\/illust\/detail\/\d{5}/i
    },
    32: {
        name: 'bcy.net Cosplay',
        backupURL: data => `https://bcy.net/${data.data.bcy_type}/detail/${data.data.member_link_id}/${data.data.bcy_id}`,
        URLRegex: /(?:http:\/\/)?bcy.net\/coser\/detail\/\d{5}/i
    },
    33: {
        name: 'PortalGraphics',
        backupURL: data => `http://web.archive.org/web/http://www.portalgraphics.net/pg/illust/?image_id=${data.data.pg_id}`,
        URLRegex: /(?:http:\/\/)?web\.archive\.org\/web\/http:\/\/www\.portalgraphics\.net\/pg\/illust\/\?image_id=\d{5}/i
    },
    34: {
        name: 'deviantArt',
        backupURL: data => `https://deviantart.com/view/${data.data.da_id}`,
        URLRegex: /(?:https:\/\/)?deviantart\.com\/view\/\d{8}/i
    },
    35: {
        name: 'Pawoo',
        backupURL: data => `https://pawoo.net/@${data.data.user_acct}/${data.data.pawoo_id}`,
        URLRegex: /(?:https?:\/\/)?pawoo\.net\/@.+/i
    }
};

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
