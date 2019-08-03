import {SiteList, RATINGS, Masks} from './types';

export const BASE_SITE_LIST: SiteList = {
  /**
   * @todo Add indices that are missing in between known ones.
   */

  /*
  -- Working on this
  0: {
    name: 'H-Magazines',
    backupURL: data => `${data}`,
    URLRegex: /aaa/i
  },
  2: {
    name: 'H-Game CG'
  }
  */
  '3': {
    name: 'The Doujinshi & Manga Lexicon',
    URLRegex: /(?:http:\/\/)?doujinshi\.mugimugi\.org\/index\.php?P=BOOK&ID=\d+/i,
    backupURL: data => `http://doujinshi.mugimugi.org/index.php?P=BOOK&ID=${data.data.ddb_id}`,
    getRating: (data: string) => {
      const match = data.match(/<td>.*?<b>Adult:<\/b><\/td><td>(.*)<\/td>/i);

      if (!match || match[1] === 'No') return RATINGS[1];

      return RATINGS[3];
    },
  },
  '5': {
    name: 'Pixiv',
    URLRegex: /(?:https?:\/\/)?(?:www\.)?pixiv\.net\/member_illust\.php\?mode=.+&illust_id=\d+/i,
    backupURL: data => `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${data.data.pixiv_id}`,
    getRating: (data: string) => {
      const match = data.match(/<div class="introduction-modal"><p class="title">(.*?)<\/p>/i);

      if (!match) return RATINGS[1];

      return match[1].toLowerCase().includes('r-18') ? RATINGS[3] : RATINGS[1];
    },
  },
  '8': {
    name: 'Nico Nico Seiga',
    URLRegex: /(?:http:\/\/)?seiga\.nicovideo\.jp\/seiga\/im\d+/i,
    backupURL: data => `http://seiga.nicovideo.jp/seiga/im${data.data.seiga_id}`,
    getRating: () => RATINGS[0],
  },
  '9': {
    name: 'Danbooru',
    URLRegex: /(?:https?:\/\/)?danbooru\.donmai\.us\/(?:posts|post\/show)\/\d+/i,
    backupURL: data => `https://danbooru.donmai.us/posts/${data.data.danbooru_id}`,
    getRating: (data: string) => RATINGS[[ null, 'Safe', 'Questionable', 'Explicit' ].indexOf(data.match(/<li>Rating: (.*?)<\/li>/i)![1])],
  },
  '10': {
    name: 'drawr',
    URLRegex: /(?:http:\/\/)?(?:www\.)?drawr\.net\/show\.php\?id=\d+/i,
    backupURL: data => `http://drawr.net/show.php?id=${data.data.drawr_id}`,
    getRating: () => RATINGS[0],
  },
  '11': {
    name: 'Nijie',
    URLRegex: /(?:http:\/\/)?nijie\.info\/view\.php\?id=\d+/i,
    backupURL: data => `http://nijie.info/view.php?id=${data.data.nijie_id}`,
    getRating: () => RATINGS[0],
  },
  '12': {
    name: 'Yande.re',
    URLRegex: /(?:https?:\/\/)?yande\.re\/post\/show\/\d+/i,
    backupURL: data => `https://yande.re/post/show/${data.data.yandere_id}`,
    getRating: (body: string) => RATINGS[[ null, 'Safe', 'Questionable', 'Explicit' ].indexOf(body.match(/<li>Rating: (.*?)<\/li>/i)![1])],
  },
  '13': {
    name: 'Openings.moe',
    URLRegex: /(?:https?:\/\/)?openings\.moe\/\?video=.*/,
    backupURL: data => `https://openings.moe/?video=${data.data.file}`,
    getRating: () => RATINGS[3],
  },
  '16': {
    name: 'FAKKU',
    URLRegex: /(?:https?:\/\/)?(www\.)?fakku\.net\/hentai\/[a-z-]+\d+}/i,
    backupURL: data => `https://www.fakku.net/hentai/${data.data.source!.toLowerCase().replace(' ', '-')}`,
    getRating: () => RATINGS[3],
  },
  '18': {
    name: 'nHentai',
    URLRegex: /(?:https?:\/\/)nhentai.net\/g\/\d+/i,
    backupURL: data => `https://nhentai.net/g/${data.header.thumbnail.match(/nhentai\/(\d+)/)![1]}`,
    getRating: () => RATINGS[3],
  },
  '19': {
    name: '2D-Market',
    URLRegex: /(?:https?:\/\/)2d-market\.com\/Comic\/\d+/i,
    backupURL: data => `http://2d-market.com/Comic/${data.header.thumbnail.match(/2d_market\/(\d+)/i)![1]}-${data.data.source!.replace(' ', '-')}`,
    getRating: () => RATINGS[3],
  },
  '20': {
    name: 'MediBang',
    URLRegex: /(?:https?:\/\/)?medibang\.com\/picture\/[a-z0-9]+/i,
    backupURL: data => data.data.url!,
    getRating: () => RATINGS[3],
  },
  '21': {
    name: 'AniDB',
    URLRegex: /(?:https?:\/\/)?anidb\.net\/perl-bin\/animedb\.pl\?show=.+&aid=\d+/i,
    backupURL: data => `https://anidb.net/perl-bin/animedb.pl?show=anime&aid=${data.data.anidb_aid}`,
    getRating: () => RATINGS[3],
  },
  '23': {
    name: 'IMDb',
    URLRegex: /(?:https?:\/\/)?(?:www\.)?imdb\.com\/title\/.+/i,
    backupURL: data => `https://www.imdb.com/title/${data.data.imdb_id}`,
    getRating: () => RATINGS[3],
  },
  '25': {
    name: 'Gelbooru',
    URLRegex: /(?:https?:\/\/)gelbooru\.com\/index\.php\?page=post&s=view&id=\d+/i,
    backupURL: data => `https://gelbooru.com/index.php?page=post&s=view&id=${data.data.gelbooru_id}`,
    getRating: (body: string) => RATINGS[[ null, 'Safe', 'Questionable', 'Explicit' ].indexOf(body.match(/<li>Rating: (.*?)<\/li>/i)![1])],
  },
  '26': {
    name: 'Konachan',
    URLRegex: /(?:http:\/\/)?konachan\.com\/post\/show\/\d+/i,
    backupURL: data => `https://konachan.com/post/show/${data.data.konachan_id}`,
    getRating: (body: string) => RATINGS[[ null, 'Safe', 'Questionable', 'Explicit' ].indexOf(body.match(/<li>Rating: (.*?)<\/li>/i)![1].split(' ')[0])],
  },
  '27': {
    name: 'Sankaku Channel',
    URLRegex: /(?:https?:\/\/)?chan\.sankakucomplex\.com\/post\/show\/\d+/i,
    backupURL: data => `https://chan.sankakucomplex.com/post/show/${data.data.sankaku_id}`,
    getRating: () => RATINGS[3],
  },
  '28': {
    name: 'Anime-Pictures',
    URLRegex: /(?:https?:\/\/)?anime-pictures\.net\/pictures\/view_post\/\d+/i,
    backupURL: data => `https://anime-pictures.net/pictures/view_post/${data.data['anime-pictures_id']}`,
    getRating: () => RATINGS[3],
  },
  '29': {
    name: 'e621',
    URLRegex: /(?:https?:\/\/)?e621\.net\/post\/show\/\d+/i,
    backupURL: data => `https://e621.net/post/show/${data.data.e621_id}`,
    getRating: () => RATINGS[3],
  },
  '30': {
    name: 'Idol Complex',
    URLRegex: /(?:https?:\/\/)?idol\.sankakucomplex\.com\/post\/show\/\d+/i,
    backupURL: data => `https://idol.sankakucomplex.com/post/show/${data.data.idol_id}`,
    getRating: (body: string) => RATINGS[[ null, 'Safe', 'Questionable', 'Explicit' ].indexOf(
      body
        .match(/<li>Rating: (.*?)<\/li>/gi)!
        .slice(-1)[0].split(' ')[1].slice(0, -5)
    )],
  },
  '31': {
    name: 'bcy.net Illust',
    URLRegex: /(?:http:\/\/)?bcy.net\/illust\/detail\/\d+/i,
    backupURL: data => `https://bcy.net/${data.data.bcy_type}/detail/${data.data.member_link_id}/${data.data.bcy_id}`,
    getRating: () => RATINGS[3],
  },
  '32': {
    name: 'bcy.net Cosplay',
    URLRegex: /(?:http:\/\/)?bcy.net\/coser\/detail\/\d{5}/i,
    backupURL: data => `https://bcy.net/${data.data.bcy_type}/detail/${data.data.member_link_id}/${data.data.bcy_id}`,
    getRating: () => RATINGS[3],
  },
  '33': {
    name: 'PortalGraphics',
    URLRegex: /(?:http:\/\/)?web\.archive\.org\/web\/http:\/\/www\.portalgraphics\.net\/pg\/illust\/\?image_id=\d+/i,
    backupURL: data => `http://web.archive.org/web/http://www.portalgraphics.net/pg/illust/?image_id=${data.data.pg_id}`,
    getRating: () => RATINGS[3],
  },
  '34': {
    name: 'deviantArt',
    URLRegex: /(?:https:\/\/)?deviantart\.com\/view\/\d+/i,
    backupURL: data => `https://deviantart.com/view/${data.data.da_id}`,
    getRating: () => RATINGS[2],
  },
  '35': {
    name: 'Pawoo',
    URLRegex: /(?:https?:\/\/)?pawoo\.net\/@.+/i,
    backupURL: data => `https://pawoo.net/@${data.data.user_acct}/${data.data.pawoo_id}`,
    getRating: () => RATINGS[3],
  },
  '36': {
    name: 'Manga Updates',
    URLRegex: /(?:https:\/\/)?www\.mangaupdates\.com\/series\.html\?id=\d+/gi,
    backupURL: data => `https://www.mangaupdates.com/series.html?id=${data.data.mu_id}`,
    getRating: () => RATINGS[3],
  },
};

/** List of supported sites */
export const SITE_LIST: SiteList = {
  ...BASE_SITE_LIST,
  '4': {...BASE_SITE_LIST[3]},
  '6': {...BASE_SITE_LIST[5]},
  '22': {...BASE_SITE_LIST[21]},
  '24': {...BASE_SITE_LIST[23]},
};

// Bitshifting wasn't working, so this is the next best thing.
const tmp = Object.keys(SITE_LIST).map(v => [ v, parseInt(`1${'0'.repeat(parseInt(v))}`, 2) ]);
export const MASKS: Masks = {};

tmp.forEach(v => {
  MASKS[v[0]] = v[1];
});