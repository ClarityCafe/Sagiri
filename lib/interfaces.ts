import type { IResult } from "./response";

/**
 * Represents the valid options to pass on to SauceNAO.
 */
export interface IOptions {
  results?: number;
  mask?: number[];
  excludeMask?: number[];
  getRatings?: boolean;
  testMode?: boolean;
  db?: number;
}

/**
 * Represents the result of a Sagiri search.
 */
export interface ISagiriResult {
  url: string;
  site: string;
  index: number;
  similarity: number;
  thumbnail: string;
  authorName: string | null;
  authorUrl: string | null;
  raw: IResult;
}
