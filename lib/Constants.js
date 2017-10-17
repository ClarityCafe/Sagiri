const SITE_LIST = {
    /*0: { -- Working on this
        name: 'H-Magazines',
        backupURL: data => `${data}`,
        URLRegex: /aaa/i
    },*/
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
        URLRegex: /(?:https?:\/\/)?danbooru\.donmai\.us\/(?:posts|post\/show)\/\d{7}/i,
        getRating: body => [null, 'Safe', 'Questionable', 'Explicit'].indexOf(body.match(/<li>Rating: (.*?)<\/li>/i)[1])
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
        URLRegex: /(?:https?:\/\/)?yande\.re\/post\/show\/\d{6}/i,
        getRating: body => [null, 'Safe', 'Questionable', 'Explicit'].indexOf(body.match(/<li>Rating: (.*?)<\/li>/i)[1])
    },
    16: {
        name: 'FAKKU',
        backupURL: data => `https://www.fakku.net/hentai/${data.data.source.toLowerCase().replace(' ', '-')}`,
        URLRegex: /(?:https?:\/\/)?(www\.)?fakku\.net\/hentai\/[a-z-]+\d{10}/i,
        getRating: () => RATINGS.NSFW
    },
    18: {
        name: 'nHentai',
        backupURL: data => `https://nhentai.net/g/${data.header.thumbnail.match(/nhentai\/(\d+)/)[1]}`,
        URLRegex: /(?:https?:\/\/)nhentai.net\/g\/\d+/i,
        getRating: () => RATINGS.NSFW
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
    23: {
        name: 'IMDb',
        backupURL: data => `https://www.imdb.com/title/${data.data.imdb_id}`,
        URLRegex: /(?:https?:\/\/)?(?:www\.)?imdb\.com\/title\/.+/i
    },
    25: {
        name: 'Gelbooru',
        backupURL: data => `https://gelbooru.com/index.php?page=post&s=view&id=${data.data.gelbooru_id}`,
        URLRegex: /(?:https?:\/\/)gelbooru\.com\/index\.php\?page=post&s=view&id=\d{7}/i,
        getRating: body => [null, 'Safe', 'Questionable', 'Explicit'].indexOf(body.match(/<li>Rating: (.*?)<\/li>/i)[1])
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

Object.defineProperty(SITE_LIST, '6', {
    get: () => SITE_LIST['5']
});

Object.defineProperty(SITE_LIST, '24', {
    get: () => SITE_LIST['23']
});

const RATINGS = Object.freeze({
    UNKNOWN: 0,
    SAFE: 1,
    QUESTIONABLE: 2,
    NSFW: 3
});

const PERIODS = Object.freeze({
    SHORT: 1000 * 30, // 30 seconds
    LONG: 1000 * 60 * 60 * 24 // 24 hours
});

module.exports = {SITE_LIST, RATINGS, PERIODS};