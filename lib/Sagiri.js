/**
 * @file API wrapper for SauceNAO, capable of submitting files and urls.
 * @author Capuccino
 * @author Ovyerus
 * @todo Finish off url list and make lib return as many results as wanted
 */

const FormData = require('form-data');
const fs = require('fs');

/**
 * Query handler for SauceNAO.
 *
 * @prop {String} key API key
 * @prop {Number} numRes Amount of responses returned from the API.
 */
class SauceHandler {
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
     * Gets the source and outputs it in your preferred output type
     *
     * @param {String} file Either a file or URL that you want to find the source of.
     * @returns {Promise<Object>} JSON that contains the closest match.
     * @example client.getSauce(path/link).then(console.log);
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

                    res = res.results;
                    let result;

                    if (res.length > 1) result = res.sort((a, b) => Number(b.header.similarity) - Number(a.header.similarity))[0];
                    else if (res.length === 1) result = res[0];
                    else throw new Error('No results.');

                    return {
                        similarity: Number(result.header.similarity),
                        url: resolveSauceURL(result),
                        original: result
                    };
                }).then(resolve).catch(reject);
            }
        });
    }

    /**
     * An alias of SauceHandler#getSauce
     *
     * @param {String} file Either a file or URL that you want to find the source of.
     * @returns {Promise<Object>} JSON that contains the closest match.
     * @see SauceHandler#getSauce
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

// I could shorten this to hell and back but it'll do for now.
function resolveSauceURL(data) {
    let url;

    switch (data.header.index_name.match(/^Index #(\d+):? /)[1]) {
        case '5':
            // Pixiv
            url = `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${data.data.pixiv_id}`;
            break;
        case '8':
            // Nico Nico Seiga
            url = `http://seiga.nicovideo.jp/seiga/im${data.data.seiga_id}`;
            break;
        case '9':
            // Danbooru
            url = `https://danbooru.donmai/us/posts/${data.data.danbooru_id}`;
            break;
        case '10':
            // drawr
            url = `http://drawr.net/show.php?id=${data.data.drawr_id}`;
            break;
        case '11':
            // Nijie
            url = `http://nijie.info/view.php?id=${data.data.nijie_id}`;
            break;
        case '12':
            // Yande.re
            url = `https://yande.re/post/show/${data.data.yandere_id}`;
            break;
        case '16':
            // FAKKU
            url = `https://www.fakku.net/hentai/${data.data.source.toLowerCase().replace(' ', '-')}`;
            break;
        case '18':
            // H-Misc
            url = `https://nhentai.net/g/${data.header.thumbnail.match(/nhentai\/(\d+)/)[1]}`;
            break;
        case '19':
            // 2D-Market
            url = `http://2d-market.com/Comic/${data.header.thumbnail.match(/2d_market\/(\d+)/i)[1]}-${data.data.source.replace(' ', '-')}`;
            break;
        case '20':
            // MediBang
            url = data.data.url;
            break;
        case '21':
            // Anime
            url = `https://anidb.net/perl-bin/animedb.pl?show=anime&aid=${data.data.anidb_aid}`;
            break;
        case '25':
            // Gelbooru
            url = `https://gelbooru.com/index.php?page=post&s=view&id=${data.data.gelbooru_id}`;
            break;
        case '26':
            // Konachan
            url = `https://konachan.com/post/show/${data.data.konachan_id}`;
            break;
        case '27':
            // Sankaku Channel
            // TODO: Find a reliable way to differentiate between channel and idol pics.
            url = `https://chan.sankakucomplex.com/post/show/${data.data.sankaku_id}`;
            break;
        case '28':
            // Anime-Pictures
            url = `https://anime-pictures.net/pictures/view_post/${data.data['anime-pictures_id']}`;
            break;
        case '29':
            // e621
            url = `https://e621.net/post/show/${data.data.e621_id}`;
            break;
        case '30':
            // Idol Complex
            url = `https://idol.sankakucomplex.com/post/show/${data.data.sankaku_id}`;
            break;
        case '31':
            // bcy.net Illust
            url = `https://bcy.net/${data.data.bcy_type}/detail/${data.data.member_link_id}/${data.data.bcy_id}`;
            break;
        case '32':
            // bcy.net Cosplay
            url = `https://bcy.net/${data.data.bcy_type}/detail/${data.data.member_link_id}/${data.data.bcy_id}`;
            break;
        case '33':
            // PortalGraphics
            break;
        case '34':
            // deviantArt
            url = `https://${data.data.author_url}/art/${data.data.title.replace(/=/g, '').replace(/ - /g, '-').replace(/ /g, '-')}-${data.data.da_id}`;
            break;
        case '35':
            // Pawoo
            url = `https://pawoo.net/@${data.data.user_acct}/${data.data.pawoo_id}`;
            break;
        default:
            throw new Error(`Unsupported site index: ${data.header.index_name.match(/^Index #(\d+):? /)[1]}`);
    }

    return url;
}

module.exports = SauceHandler;
