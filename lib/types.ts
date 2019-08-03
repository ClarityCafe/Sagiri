import {SITE_LIST} from './constants';

/**
 * @typdef SagiriOptions
 * Options for the Sagiri Class constructor
 */
export type SagiriOptions = {
  numRes?: number;
  testMode?: boolean;
  getRating?: boolean;
  dbMask?: (keyof typeof SITE_LIST)[];
  dbMaskI?: (keyof typeof SITE_LIST)[];
};

/**
 * @typedef Source
 * Source result from the search
 */
export type Source = {
  url: string;
  site: string;
  index: string;
  similary: number;
  thumbnail: string;
  rating: string;
  authorName: string;
  authorUrl: string;
  original: FormResResult;
};

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

/**
 * @typedef BackupUrlData
 * @description Data used in the backup url in {@link SiteData}
 */
export type BackupUrlData = {
  data: {
    [key: string]: string;
  };
  header: {
    [key: string]: string;
  };
};

/**
 * @typdef SiteData
 * @description Data for each supported site
 */
export type SiteData = {
  name: string;
  URLRegex: RegExp;
  backupURL(data: FormResResult): string;
  getRating(body?: string): string;
};

/**
 * @typedef SiteList
 * @description Type for the list of supported sites
 */
export type SiteList = {
  [key: number]: SiteData;
};

/**
 * @typdef Masks
 * @description Type for the Masks constant
 */
export type Masks = {
  [key: string]: string | number;
};

/**
 * @typdef Saucedata
 * @description Returned by the internal resolveSauceData function
 */
export type SauceData = {
  id: number;
  url: string;
  name: string;
};

/**
 * @typedef FormResHeaderIndexData
 * @description Data for the FormResHeader index property
 * @private
 */
type FormResHeaderIndexData = {
  status: number;
  parent_id: number;
  id: number;
  results: number;
};

/**
 * @typedef FormResHeader
 * @description Headers from the SauceNao result
 * @private
 */
type FormResHeader = {
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
};

/**
 * @typedef FormResResult
 * @description Single result from SuaceNao
 */
export type FormResResult = {
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
};

/**
 * @typedef FormRes
 * @description Returned by the internal sendForm function
 */
export type FormRes = {
  header: FormResHeader;
  results: FormResResult[];
};