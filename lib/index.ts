import bent from 'bent';
import FormData from 'form-data';

import { createReadStream } from 'fs';
import { Readable } from 'stream';

import { SagiriClientError, SagiriServerError } from './errors';
import { generateMask, resolveResult } from './util';
import { Response, Result } from './response';
import sites from './sites';

export interface Options {
  results?: number;
  mask?: number[];
  excludeMask?: number[];
  // getRatings?: boolean;
  testMode?: boolean;
  db?: number;
}

export interface SagiriResult {
  url: string;
  site: string;
  index: number;
  similarity: number;
  thumbnail: string;
  authorName: string;
  authorUrl: string;
  raw: Result;
}

type File = string | Buffer | Readable;

// Ratelimiter?
const sagiri = (token: string, defaultOptions: Options = { results: 5 }) => {
  const request = bent('https://saucenao.com', 'json', 'POST');

  return async (
    file: File,
    optionOverrides: Options = {}
  ): Promise<SagiriResult[]> => {
    const options = { ...defaultOptions, ...optionOverrides };
    const form = new FormData();

    form.append('api_key', token);
    form.append('output_type', 2);
    form.append('numres', options.results);

    if (options.testMode) form.append('testmode', 1);

    if (options.mask && options.excludeMask)
      throw new Error(
        "It's redundant to set both mask and excludeMask. Choose one or the other."
      );
    else if (options.mask) form.append('dbmask', generateMask(options.mask));
    else if (options.excludeMask)
      form.append('dbmaski', generateMask(options.excludeMask));

    if (typeof file === 'string' && /^https?:/.test(file))
      form.append('url', file);
    else if (typeof file === 'string')
      form.append('file', createReadStream(file));
    else form.append('file', file);

    const response = (await request('/search.php', form)) as Response;
    const {
      header: { status, message }
    } = response;

    // Server side error
    if (status > 0) throw new SagiriServerError(status, message!);
    // Client side error
    else if (status < 0) throw new SagiriClientError(status, message!);

    const results = response.results
      .filter(({ header: { index_id: id } }) => !!sites[id])
      .sort((a, b) => b.header.similarity - a.header.similarity);

    return results.map(result => {
      const { url, name, id } = resolveResult(result);
      const {
        data: { author_name: authorName, author_url: authorUrl },
        header: { similarity, thumbnail }
      } = result;

      return {
        url,
        site: name,
        index: (id as any) as number, // These are actually numbers but they're typed as strings so they can be used to select from the sites map
        similarity: Number(similarity),
        thumbnail,
        authorName,
        authorUrl,
        raw: result
      };
    });
  };
};

export default sagiri;
