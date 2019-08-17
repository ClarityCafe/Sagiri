import { SITE_LIST } from './constants';

/** Data for the FormResHeader index property */
interface FormResHeaderIndexData {
  status: number;
  parent_id: number;
  id: number;
  results: number;
}

/** Headers from the SauceNao result */
interface FormResHeader {
  user_id: string;
  account_type: string;
  short_limit: string;
  long_limit: string;
  short_remaining: number;
  long_remaining: number;
  status: number;
  message: string;
  results_requested: number;
  index: { [key: string]: FormResHeaderIndexData };
  search_depth: string;
  minimum_similarity: number;
  query_iamge_display: string;
  query_image: string;
  results_returned: number;
}

/** Options for the Sagiri constructor */
export interface SagiriOptions {
  numRes?: number;
  testMode?: boolean;
  getRating?: boolean;
  dbMask?: Array<keyof typeof SITE_LIST>;
  dbMaskI?: Array<keyof typeof SITE_LIST>;
}

/** Source result from the search */
export interface Source {
  url: string;
  site: string;
  index: string;
  similarity: number;
  thumbnail: string;
  rating: string;
  authorName: string;
  authorUrl: string;
  original: FormResResult;
}

/** NSFW Classfication ratings */
export enum RATINGS {
  UNKNOWN = 0,
  SAFE = 1,
  QUESTIONABLE = 2,
  NSFW = 3
}

/** Enum used to define periods of time */
export enum PERIODS {
  SHORT = 1000 * 30, // 30 seconds
  LONG = 1000 * 60 * 60 * 24 // 24 hours
}

/** Data used in the backup url in `SiteData` */
export interface BackupUrlData {
  data: {
    [key: string]: string;
  };
  header: {
    [key: string]: string;
  };
}

/** @description Data for each supported site */
export interface SiteData {
  name: string;
  URLRegex: RegExp;
  backupURL(data: FormResResult): string;
  getRating(body?: string): string;
}

/** Type for the list of supported sites */
export interface SiteList {
  [key: number]: SiteData;
}

/** Type for the Masks constant */
export interface Masks {
  [key: string]: string | number;
}

/** Returned by the internal resolveSauceData function */
export interface SauceData {
  id: number;
  url: string;
  name: string;
}

/** Single result from SauceNao */
export interface FormResResult {
  header: {
    similarity: string;
    thumbnail: string;
    index_id: number;
    index_name: string;
  };
  data: {
    ext_urls: string[];
    title: string;
    da_id: number;
    author_name: string;
    author_url: string;
    anidb_aid?: string;
    bcy_id?: string;
    bcy_type?: string;
    danbooru_id?: string;
    ddb_id?: string;
    drawr_id?: string;
    e621_id?: string;
    file?: string;
    gelbooru_id?: string;
    idol_id?: string;
    imdb_id?: string;
    konachan_id?: string;
    member_link_id?: string;
    mu_id?: string;
    nijie_id?: string;
    pawoo_id?: string;
    pg_id?: string;
    pixiv_id?: string;
    sankaku_id?: string;
    seiga_id?: string;
    source?: string;
    url?: string;
    user_acct?: string;
    yandere_id?: string;
    'anime-pictures_id'?: string;
  };
}

/** Returned by the internal sendForm function */
export interface FormRes {
  header: FormResHeader;
  results: FormResResult[];
}
