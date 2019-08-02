import {SITE_LIST} from './constants';

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
  backupURL(data: BackupUrlData): string;
  getRating?(data?: string): number;
};

/**
 * @typedef SiteList
 * @description Type for the list of supported sites
 */
export type SiteList = {
  [key: number]: SiteData;
};

export type Masks = {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type HandlerOptions = {
  numRes: number;
  testMode: boolean;
  getRating: boolean;
  dbMask?: (keyof typeof SITE_LIST)[];
  dbMaskI?: (keyof typeof SITE_LIST)[];
};

export type SauceData = {
  id: number;
  url: string;
  name: string;
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