import { Buffer } from 'buffer';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

declare module 'sagiri' {

    enum RATINGS {
        UNKNOWN,
        SAFE,
        QUESTIONABLE,
        NSFW
    }

    interface Site {
        URLRegex: RegExp,
        name: string,
        backupURL(data: string): string,
        getRating?(body: string): number,
    }

    interface HandlerOptions {
        numRes?: number,
        testMode?: boolean,
        getRating?: boolean,
        dbMask?: number[],
        dbMaskI?: number[]
    }

    interface Source {
        url: string,
        site: string,
        index: string,
        similarity: number,
        thumbnail: string,
        rating: number,
        original: {
            header: {[key: string]: any},
            data: {[key: string]: any}
        }
    }

    export interface Constants {
        SITE_LIST: {[key: string]: Site},
        MASKS: {[key: string]: number},
        RATINGS: RATINGS,
        PERIODS: {
            SHORT: number,
            LONG: number
        }
    }
  /**
   * Ratelimiter class.
   * 
   * @prop {Number} totalUses Amount of times a entity can be used before being ratelimited.
   * @prop {Number} interval Interval between resetting amount of uses.
   * @prop {Number} uses Number of current uses this interval has.
   */
    export class Ratelimiter {
        public totalUses: number;
        public interval: number;
        public uses: number;
        public ratelimited: boolean;
        private _timer: NodeJS.Timer;

        public constructor(totalUses: number, interval: number);
        public use(): void;
    }

    /**
     * @param  key API Key for SauceNAO
     * @param  [options] Optional options
     * @param  [options.numRes=5] Number of results to get from SauceNAO.
     * @param  [options.getRating=false] Whether to retrieve the rating of a source or not.
     * @param  [options.testMode=false] Whether to enable "test mode", which causes each index that has a match to output 1 result at most.
     * @param  [options.dbMask] Array of all the indexes to ENABLE results for.
     * @param  [options.dbMaskI] Array of all the indexes to DISABLE results for.
     */
    export class Handler {
        public key: string;
        public numRes: number;
        public testMode: boolean;
        public getRating: boolean;
        public dbMask: number | null;
        public dbMaskI: number | null;
        public shortLimiter: Ratelimiter;
        public longLimiter: Ratelimiter;

        public constructor(key: string, options?: HandlerOptions);
       /**
        * Searches for potential sources of an image.
        *
        * @param file Either a file or URL or a file buffer that you want to find the source of.
        * @returns An array of all the results from the API, with parsed data.
        * @example client.getSauce('http://cfile29.uf.tistory.com/image/277D9B3453F9D9283659F4').then(console.log);
        */
        public getSauce(file: string | Buffer): Promise<Source[]>;

       /**
        * An alias of Handler#getSauce, for those who are more mentally sane.
        * @alias Handler.getSauce
        * 
        * @param file Either a file or URL or a file buffer that you want to find the source of.
        * @returns An array of all the results from the API, with parsed data.
        */
        public getSource(file: string | Buffer): Promise<Source[]>;
    }
}
