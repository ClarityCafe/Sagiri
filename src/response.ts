interface IHeaderIndex {
  id: number;
  parent_id: number;
  results: number;
  status: number;
}

export interface IResult {
  data: IResultData;
  header: IResultHeader;
}

export interface IResultData {
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
  "anime-pictures_id"?: string;
  member_id?: string;
  member_name?: string;
  characters: string;
  est_time: string;
  // MangaDex
  md_id?: string;
  author?: string;
  artist?: string;
  part?: string;
  // ArtStation
  as_project?: string;
  // Twitter
  created_at?: string;
  tweet_id?: string;
  twitter_user_id?: string;
  twitter_user_handle?: string;
  // FurAffinity
  fa_id?: string;
  // Furry Network
  fn_id?: string;
  fn_type?: string;
  // Skeb
  creator?: string;
  creator_name?: string;
  path?: string;
  // Kemono
  service?: "patreon" | "dlsite" | "fanbox" | "gumroad" | "subscribestar" | "fantia";
  service_name?: "Patreon" | "DLsite" | "pixiv Fanbox" | "Gumroad" | "SubscribeStar" | "Fantia";
  id?: string;
  user_id?: string;
  user_name?: string;
  published?: string;
}

export interface IResultHeader {
  index_id: Indices;
  index_name: string;
  similarity: number; // Actually a string but this is for type coercion funsies.
  thumbnail: string;
}

export type Indices =
  | "3"
  | "4"
  | "5"
  | "6"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "16"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31"
  | "32"
  | "33"
  | "34"
  | "35"
  | "36";

export interface IResponse {
  header: IHeader;
  results: IResult[];
}

export interface IHeaderStatus {
  status: number;
  message: string;
}

export interface IHeader {
  account_type: string;
  index: { [id: string]: IHeaderIndex | undefined }; // do i wanna generic this to be id value?
  long_limit: string;
  long_remaining: number;
  message?: string;
  minimum_similarity: number;
  query_image: string;
  query_image_display: string;
  results_requested: number;
  results_returned: number;
  search_depth: string;
  short_limit: number;
  short_remaining: number;
  status: number;
  user_id: string;
}
