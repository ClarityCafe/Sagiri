 
 
import { Result, ResultData } from "./response";
import { SagiriClientError } from "./errors";

interface AuthorData {
  authorName: string | null;
  authorUrl: string | null;
}

// #region Site data objects
const DoujinMangaLexicon: SiteData = {
  name: "The Doujinshi & Manga Lexicon",
  index: 3,
  urlMatcher: /(?:http:\/\/)?doujinshi\.mugimugi\.org\/index\.php?p=book&id=\d+/i,
  backupUrl: ({ data: { ddb_id } }) => `http://doujinshi.mugimugi.org/index.php?P=BOOK&ID=${ddb_id}`,
};

const Pixiv: SiteData = {
  name: "Pixiv",
  index: 5,
  urlMatcher: /(?:https?:\/\/)?(?:www\.)?pixiv\.net\/member_illust\.php\?mode=.+&illust_id=\d+/i,
  backupUrl: ({ data: { pixiv_id } }) => `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${pixiv_id}`,
  authorData: ({ member_id, member_name }) => ({
    authorName: member_name as string,
    authorUrl: `https://www.pixiv.net/users/${member_id as string}`,
  }),
};

const NicoNicoSeiga: SiteData = {
  name: "Nico Nico Seiga",
  index: 8,
  urlMatcher: /(?:http:\/\/)?seiga\.nicovideo\.jp\/seiga\/im\d+/i,
  backupUrl: ({ data: { seiga_id } }) => `http://seiga.nicovideo.jp/seiga/im${seiga_id}`,
};

const Danbooru: SiteData = {
  name: "Danbooru",
  index: 9,
  urlMatcher: /(?:https?:\/\/)?danbooru\.donmai\.us\/(?:posts|post\/show)\/\d+/i,
  backupUrl: ({ data: { danbooru_id } }) => `https://danbooru.donmai.us/posts/${danbooru_id}`,
};

const Drawr: SiteData = {
  name: "drawr",
  index: 10,
  urlMatcher: /(?:http:\/\/)?(?:www\.)?drawr\.net\/show\.php\?id=\d+/i,
  backupUrl: ({ data: { drawr_id } }) => `http://drawr.net/show.php?id=${drawr_id}`,
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
  backupUrl: (data) => `https://www.fakku.net/hentai/${data.data.source?.toLowerCase().replace(" ", "-")}`,
};

const NHentai: SiteData = {
  name: "nHentai",
  index: 18,
  urlMatcher: /https?:\/\/nhentai.net\/g\/\d+/i,
  backupUrl: (data) => `https://nhentai.net/g/${data.header.thumbnail.match(/nhentai\/(\d+)/)?.[1]}`,
};

const TwoDMarket: SiteData = {
  name: "2D-Market",
  index: 19,
  urlMatcher: /https?:\/\/2d-market\.com\/comic\/\d+/i,
  backupUrl: (data) =>
    `http://2d-market.com/Comic/${data.header.thumbnail.match(/2d_market\/(\d+)/i)?.[1]}-${data.data.source?.replace(
      " ",
      "-",
    )}`,
};

const MediBang: SiteData = {
  name: "MediBang",
  index: 20,
  urlMatcher: /(?:https?:\/\/)?medibang\.com\/picture\/[\da-z]+/i,
  backupUrl: (data) => data.data.url!,
};

const AniDB: SiteData = {
  name: "AniDB",
  index: 21,
  urlMatcher: /(?:https?:\/\/)?anidb\.net\/perl-bin\/animedb\.pl\?show=.+&aid=\d+/i,
  backupUrl: (data) => `https://anidb.net/perl-bin/animedb.pl?show=anime&aid=${data.data.anidb_aid}`,
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
  backupUrl: (data) => `https://gelbooru.com/index.php?page=post&s=view&id=${data.data.gelbooru_id}`,
};

const Konachan: SiteData = {
  name: "Konachan",
  index: 26,
  urlMatcher: /(?:http:\/\/)?konachan\.com\/post\/show\/\d+/i,
  backupUrl: (data) => `https://konachan.com/post/show/${data.data.konachan_id}`,
};

const SankakuChannel: SiteData = {
  name: "Sankaku Channel",
  index: 27,
  urlMatcher: /(?:https?:\/\/)?chan\.sankakucomplex\.com\/post\/show\/\d+/i,
  backupUrl: (data) => `https://chan.sankakucomplex.com/post/show/${data.data.sankaku_id}`,
};

const AnimePictures: SiteData = {
  name: "Anime-Pictures",
  index: 28,
  urlMatcher: /(?:https?:\/\/)?anime-pictures\.net\/pictures\/view_post\/\d+/i,
  backupUrl: (data) => `https://anime-pictures.net/pictures/view_post/${data.data["anime-pictures_id"]}`,
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
  backupUrl: (data) => `https://idol.sankakucomplex.com/post/show/${data.data.idol_id}`,
};

const bcyIllust: SiteData = {
  name: "bcy.net Illust",
  index: 31,
  urlMatcher: /(?:http:\/\/)?bcy.net\/illust\/detail\/\d+/i,
  backupUrl: (data) => `https://bcy.net/${data.data.bcy_type}/detail/${data.data.member_link_id}/${data.data.bcy_id}`,
  authorData: ({ member_id, member_name }) => ({
    authorName: member_name as string,
    authorUrl: `https://bcy.net/u/${member_id as string}`,
  }),
};

const bcyCosplay: SiteData = {
  name: "bcy.net Cosplay",
  index: 32,
  urlMatcher: /(?:http:\/\/)?bcy.net\/coser\/detail\/\d{5}/i,
  backupUrl: (data) => `https://bcy.net/${data.data.bcy_type}/detail/${data.data.member_link_id}/${data.data.bcy_id}`,
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
  authorData: ({ author_name: authorName, author_url: authorUrl }) => ({
    authorName,
    authorUrl,
  }),
};

const Pawoo: SiteData = {
  name: "Pawoo",
  index: 35,
  urlMatcher: /(?:https?:\/\/)?pawoo\.net\/@.+/i,
  backupUrl: (data) => `https://pawoo.net/@${data.data.user_acct}/${data.data.pawoo_id}`,
};

const MangaUpdates: SiteData = {
  name: "Manga Updates",
  index: 36,
  urlMatcher: /(?:https:\/\/)?www\.mangaupdates\.com\/series\.html\?id=\d+/gi,
  backupUrl: (data) => `https://www.mangaupdates.com/series.html?id=${data.data.mu_id}`,
};

const MangaDex: SiteData = {
  name: "MangaDex",
  index: 37,
  urlMatcher: /(?:https?:\/\/)?mangadex\.org\/chapter\/(\w|-)+\/(?:\d+)?/gi,
  backupUrl: (data) => `https://mangadex.org/chapter/${data.data.md_id}`,
  authorData: (data) => ({
    authorName: data.author!,
    authorUrl: null,
  }),
};

const ArtStation: SiteData = {
  name: "FurAffinity",
  index: 39,
  urlMatcher: /(?:https?:\/\/)?www\.artstation\.com\/artwork\/\w+/i,
  backupUrl: (data) => `https://www.artstation.com/artwork/${data.data.as_project}`,
  authorData: (data) => ({
    authorName: data.author_name!,
    authorUrl: data.author_url,
  }),
};

const FurAffinity: SiteData = {
  name: "FurAffinity",
  index: 40,
  urlMatcher: /(?:https?:\/\/)?furaffinity\.net\/view\/\d+/i,
  backupUrl: (data) => `https://furaffinity.net/view/${data.data.fa_id}`,
  authorData: (data) => ({
    authorName: data.author_name!,
    authorUrl: data.author_url,
  }),
};

const Twitter: SiteData = {
  name: "Twitter",
  index: 41,
  urlMatcher: /(?:https?:\/\/)?twitter\.com\/.+/i,
  backupUrl: (data) => `https://twitter.com/i/web/status/${data.data.tweet_id}`,
  authorData: (data) => ({
    authorName: data.twitter_user_handle!,
    authorUrl: `https://twitter.com/i/user/${data.twitter_user_id}`,
  }),
};

const FurryNetwork: SiteData = {
  name: "Furry Network",
  index: 42,
  urlMatcher: /(?:https?:\/\/)?furrynetwork\.com\/artwork\/\d+/i,
  backupUrl: (data) => `https://furrynetwork.com/artwork/${data.data.fn_id}`,
  authorData: (data) => ({
    authorName: data.author_name!,
    authorUrl: data.author_url,
  }),
};

const Kemono: SiteData = {
  name: "Kemono",
  index: 43,
  urlMatcher:
    /|(?:(?:https?:\/\/)?fantia\.jp\/posts\/\d+)|(?:(?:https?:\/\/)?subscribestar\.adult\/posts\/\d+)|(?:(?:https?:\/\/)?gumroad\.com\/l\/\w+)|(?:(?:https?:\/\/)?patreon\.com\/posts\/\d+)|(?:(?:https?:\/\/)?pixiv\.net\/fanbox\/creator\/\d+\/post\/\d+)|(?:(?:https?:\/\/)?dlsite\.com\/home\/work\/=\/product_id\/\w+\.\w+)/i,
  backupUrl: (data) => {
    switch (data.data.service) {
      case "fantia":
        return `https://fantia.jp/posts/${data.data.id}`;
      case "subscribestar":
        return `https://subscribestar.adult/posts/${data.data.id}`;
      case "gumroad":
        return `https://gumroad.com/l/${data.data.id}`;
      case "patreon":
        return `https://patreon.com/posts/${data.data.id}`;
      case "fanbox":
        return `https://pixiv.net/fanbox/creator/${data.data.user_id}/post/${data.data.id}`;
      case "dlsite":
        return `https://dlsite.com/home/work/=/${data.data.id}`;
      default:
        throw new SagiriClientError(999, `Unknown service type for Kemono: ${data.data.service}`);
    }
  },
  authorData: (data) => {
    switch (data.service) {
      case "fantia":
        return {
          authorName: data.user_name!,
          authorUrl: `https://fantia.jp/fanclubs/${data.user_id}`,
        };
      case "subscribestar":
        return {
          authorName: data.user_name!,
          authorUrl: `https://subscribestar.adult/${data.user_id}`,
        };
      case "gumroad":
        return {
          authorName: data.user_name!,
          authorUrl: `https://gumroad.com/${data.user_id}`,
        };
      case "patreon":
        return {
          authorName: data.user_name!,
          authorUrl: `https://patreon.com/user?u=${data.user_id}`,
        };
      case "fanbox":
        return {
          authorName: data.user_name!,
          authorUrl: `https://pixiv.net/fanbox/creator/${data.user_id}`,
        };
      case "dlsite":
        return {
          authorName: data.user_name!,
          authorUrl: `https://dlsite.com/eng/cicrle/profile/=/marker_id/${data.user_id}`,
        };
      default:
        throw new SagiriClientError(999, `Unknown service type for Kemono: ${data.service}`);
    }
  },
};

const Skeb: SiteData = {
  name: "Skeb",
  index: 44,
  urlMatcher: /(?:(?:https?:\/\/)?skeb\.jp\/@\w+\/works\/\d+)/i,
  backupUrl: (data) => `https://skeb.jp${data.data.path}`,
  authorData: (data) => ({
    authorName: data.creator_name!,
    authorUrl: data.author_url,
  }),
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
  "37": MangaDex,
  "371": MangaDex,
  // 38
  "39": ArtStation,
  "40": FurAffinity,
  "41": Twitter,
  "42": FurryNetwork,
  "43": Kemono,
  "44": Skeb,
};

export interface SiteData {
  name: string;
  index: number;
  urlMatcher: RegExp;

  backupUrl(result: Result): string;

  authorData?(data: ResultData): AuthorData;

  // getRating(body: string): boolean; we remove this?
  // isNSFW: boolean
}

export default sites;
