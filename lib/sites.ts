/* eslint-disable @typescript-eslint/camelcase */
import { Result } from "./response";

export interface SiteData {
  name: string;
  index: number;
  urlMatcher: RegExp;
  backupUrl(result: Result): string;
  // getRating(body: string): boolean; we remove this?
  // isNSFW: boolean
}

// #region Site data objects
const DoujinMangaLexicon: SiteData = {
  name: "The Doujinshi & Manga Lexicon",
  index: 3,
  urlMatcher: /(?:http:\/\/)?doujinshi\.mugimugi\.org\/index\.php?P=BOOK&ID=\d+/i,
  backupUrl: ({ data: { ddb_id } }) =>
    `http://doujinshi.mugimugi.org/index.php?P=BOOK&ID=${ddb_id}`,
};

const Pixiv: SiteData = {
  name: "Pixiv",
  index: 5,
  urlMatcher: /(?:https?:\/\/)?(?:www\.)?pixiv\.net\/member_illust\.php\?mode=.+&illust_id=\d+/i,
  backupUrl: ({ data: { pixiv_id } }) =>
    `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${pixiv_id}`,
};

const NicoNicoSeiga: SiteData = {
  name: "Nico Nico Seiga",
  index: 8,
  urlMatcher: /(?:http:\/\/)?seiga\.nicovideo\.jp\/seiga\/im\d+/i,
  backupUrl: ({ data: { seiga_id } }) =>
    `http://seiga.nicovideo.jp/seiga/im${seiga_id}`,
};

const Danbooru: SiteData = {
  name: "Danbooru",
  index: 9,
  urlMatcher: /(?:https?:\/\/)?danbooru\.donmai\.us\/(?:posts|post\/show)\/\d+/i,
  backupUrl: ({ data: { danbooru_id } }) =>
    `https://danbooru.donmai.us/posts/${danbooru_id}`,
};

const Drawr: SiteData = {
  name: "drawr",
  index: 10,
  urlMatcher: /(?:http:\/\/)?(?:www\.)?drawr\.net\/show\.php\?id=\d+/i,
  backupUrl: ({ data: { drawr_id } }) =>
    `http://drawr.net/show.php?id=${drawr_id}`,
};

const Nijie: SiteData = {
  name: "Nijie",
  index: 11,
  urlMatcher: /(?:http:\/\/)?nijie\.info\/view\.php\?id=\d+/i,
  backupUrl: (data) => `http://nijie.info/view.php?id=${data.data.nijie_id}`,
};

const Yandere: SiteData = {
  name: "Yande.re",
  index: 12,
  urlMatcher: /(?:https?:\/\/)?yande\.re\/post\/show\/\d+/i,
  backupUrl: (data) => `https://yande.re/post/show/${data.data.yandere_id}`,
};

const OpeningsMoe: SiteData = {
  name: "Openings.moe",
  index: 13,
  urlMatcher: /(?:https?:\/\/)?openings\.moe\/\?video=.*/,
  backupUrl: (data) => `https://openings.moe/?video=${data.data.file}`,
};

const Fakku: SiteData = {
  name: "FAKKU",
  index: 16,
  urlMatcher: /(?:https?:\/\/)?(www\.)?fakku\.net\/hentai\/[a-z-]+\d+}/i,
  backupUrl: (data) =>
    `https://www.fakku.net/hentai/${data.data
      .source!.toLowerCase()
      .replace(" ", "-")}`,
};

const NHentai: SiteData = {
  name: "nHentai",
  index: 18,
  urlMatcher: /(?:https?:\/\/)nhentai.net\/g\/\d+/i,
  backupUrl: (data) =>
    `https://nhentai.net/g/${
      data.header.thumbnail.match(/nhentai\/(\d+)/)![1]
    }`,
};

const TwoDMarket: SiteData = {
  name: "2D-Market",
  index: 19,
  urlMatcher: /(?:https?:\/\/)2d-market\.com\/Comic\/\d+/i,
  backupUrl: (data) =>
    `http://2d-market.com/Comic/${
      data.header.thumbnail.match(/2d_market\/(\d+)/i)![1]
    }-${data.data.source!.replace(" ", "-")}`,
};

const MediBang: SiteData = {
  name: "MediBang",
  index: 20,
  urlMatcher: /(?:https?:\/\/)?medibang\.com\/picture\/[a-z0-9]+/i,
  backupUrl: (data) => data.data.url!,
};

const AniDB: SiteData = {
  name: "AniDB",
  index: 21,
  urlMatcher: /(?:https?:\/\/)?anidb\.net\/perl-bin\/animedb\.pl\?show=.+&aid=\d+/i,
  backupUrl: (data) =>
    `https://anidb.net/perl-bin/animedb.pl?show=anime&aid=${data.data.anidb_aid}`,
};

const IMDb: SiteData = {
  name: "IMDb",
  index: 23,
  urlMatcher: /(?:https?:\/\/)?(?:www\.)?imdb\.com\/title\/.+/i,
  backupUrl: (data) => `https://www.imdb.com/title/${data.data.imdb_id}`,
};

const Gelbooru: SiteData = {
  name: "Gelbooru",
  index: 25,
  urlMatcher: /(?:https?:\/\/)gelbooru\.com\/index\.php\?page=post&s=view&id=\d+/i,
  backupUrl: (data) =>
    `https://gelbooru.com/index.php?page=post&s=view&id=${data.data.gelbooru_id}`,
};

const Konachan: SiteData = {
  name: "Konachan",
  index: 26,
  urlMatcher: /(?:http:\/\/)?konachan\.com\/post\/show\/\d+/i,
  backupUrl: (data) =>
    `https://konachan.com/post/show/${data.data.konachan_id}`,
};

const SankakuChannel: SiteData = {
  name: "Sankaku Channel",
  index: 27,
  urlMatcher: /(?:https?:\/\/)?chan\.sankakucomplex\.com\/post\/show\/\d+/i,
  backupUrl: (data) =>
    `https://chan.sankakucomplex.com/post/show/${data.data.sankaku_id}`,
};

const AnimePictures: SiteData = {
  name: "Anime-Pictures",
  index: 28,
  urlMatcher: /(?:https?:\/\/)?anime-pictures\.net\/pictures\/view_post\/\d+/i,
  backupUrl: (data) =>
    `https://anime-pictures.net/pictures/view_post/${data.data["anime-pictures_id"]}`,
};

const E621: SiteData = {
  name: "e621",
  index: 29,
  urlMatcher: /(?:https?:\/\/)?e621\.net\/post\/show\/\d+/i,
  backupUrl: (data) => `https://e621.net/post/show/${data.data.e621_id}`,
};

const IdolComplex: SiteData = {
  name: "Idol Complex",
  index: 30,
  urlMatcher: /(?:https?:\/\/)?idol\.sankakucomplex\.com\/post\/show\/\d+/i,
  backupUrl: (data) =>
    `https://idol.sankakucomplex.com/post/show/${data.data.idol_id}`,
};

const bcyIllust: SiteData = {
  name: "bcy.net Illust",
  index: 31,
  urlMatcher: /(?:http:\/\/)?bcy.net\/illust\/detail\/\d+/i,
  backupUrl: (data) =>
    `https://bcy.net/${data.data.bcy_type}/detail/${data.data.member_link_id}/${data.data.bcy_id}`,
};

const bcyCosplay: SiteData = {
  name: "bcy.net Cosplay",
  index: 32,
  urlMatcher: /(?:http:\/\/)?bcy.net\/coser\/detail\/\d{5}/i,
  backupUrl: (data) =>
    `https://bcy.net/${data.data.bcy_type}/detail/${data.data.member_link_id}/${data.data.bcy_id}`,
};

const PortalGraphics: SiteData = {
  name: "PortalGraphics",
  index: 33,
  urlMatcher: /(?:http:\/\/)?web\.archive\.org\/web\/http:\/\/www\.portalgraphics\.net\/pg\/illust\/\?image_id=\d+/i,
  backupUrl: (data) =>
    `http://web.archive.org/web/http://www.portalgraphics.net/pg/illust/?image_id=${data.data.pg_id}`,
};

const DeviantArt: SiteData = {
  name: "deviantArt",
  index: 34,
  urlMatcher: /(?:https:\/\/)?deviantart\.com\/view\/\d+/i,
  backupUrl: (data) => `https://deviantart.com/view/${data.data.da_id}`,
};

const Pawoo: SiteData = {
  name: "Pawoo",
  index: 35,
  urlMatcher: /(?:https?:\/\/)?pawoo\.net\/@.+/i,
  backupUrl: (data) =>
    `https://pawoo.net/@${data.data.user_acct}/${data.data.pawoo_id}`,
};

const MangaUpdates: SiteData = {
  name: "Manga Updates",
  index: 36,
  urlMatcher: /(?:https:\/\/)?www\.mangaupdates\.com\/series\.html\?id=\d+/gi,
  backupUrl: (data) =>
    `https://www.mangaupdates.com/series.html?id=${data.data.mu_id}`,
};
// #endregion

const sites: { [key: string]: SiteData | undefined } = {
  "3": DoujinMangaLexicon,
  "4": DoujinMangaLexicon,
  "5": Pixiv,
  "6": Pixiv,
  "8": NicoNicoSeiga,
  "9": Danbooru,
  "10": Drawr,
  "11": Nijie,
  "12": Yandere,
  "13": OpeningsMoe,
  "16": Fakku,
  "18": NHentai,
  "19": TwoDMarket,
  "20": MediBang,
  "21": AniDB,
  "22": AniDB,
  "23": IMDb,
  "24": IMDb,
  "25": Gelbooru,
  "26": Konachan,
  "27": SankakuChannel,
  "28": AnimePictures,
  "29": E621,
  "30": IdolComplex,
  "31": bcyIllust,
  "32": bcyCosplay,
  "33": PortalGraphics,
  "34": DeviantArt,
  "35": Pawoo,
  "36": MangaUpdates,
};

export default sites;
