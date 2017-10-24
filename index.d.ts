declare module 'sagiri' {
    import * as FormData from 'form-data';
    import * as fs from 'fs';
    import * as http from 'http';
    import * as https from 'https';

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

    export class Ratelimiter {
        public totalUses: number;
        public interval: number;
        public uses: number;
        public ratelimited: boolean;
        private _timer: NodeJS.Timer;

        public constructor(totalUses: number, interval: number);
        public use(): void;
    }

    export class Handler {
        public key: string;
        public numRes: number;
        public testMode: boolean;
        public getRating: boolean;
        public dbMask: number | null;
        public dbMaskI: number | null;
        public shortLimiter: Ratelimiter;
        public longLimiter: Ratelimiter;

        public constructor(key: string, options: HandlerOptions);
        public getSauce(file: string): Promise<Source[]>;
        public getSource(file: string): Promise<Source[]>;
    }
}
