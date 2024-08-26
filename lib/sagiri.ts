import * as nodeFetch from 'node-fetch';
import type { IOptions } from './interfaces';
import { env } from 'node:process';
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';
import FormData from 'form-data';
import { generateMask, resolveResult } from './util';
import { SagiriClientError, SagiriServerError } from './errors';

let fetchFn;
// compatibility with older versions of nodejs. This will be removed in the future once LTS versions of nodejs has moved above 21.x
if (globalThis.fetch === undefined) {
  fetchFn = nodeFetch.default;
} else {
  fetchFn = globalThis.fetch;
}

type File = string | Buffer | Readable;

const sagiri = (token: string, defaultOpts: IOptions = { results: 5 }) => {
  console.debug(`Created sagiri instance with opts: ${JSON.stringify(defaultOpts)}`);

  // token validation to ensure the token is 40 characters long and alphanumeric
  if (env.NODE_ENV !== "test")
    if (token.length < 40 || !/^[a-zA-Z0-9]+$/.test(token))
      throw new Error("Malformed token. Get a token from https://saucenao.com/user.php");

  return async (file: File, opts: IOptions = {}) => {
    if (!file) throw new Error("No file provided");

    console.debug(`Searching for possible sources of image: ${typeof file === 'string' ? file : 'Buffer'}`);

    const form = new FormData();
    const { results, mask, excludeMask, getRatings, testMode, db } = { ...defaultOpts, ...opts };

    form.append("api_key", token);
    form.append("output_type", 2);
    form.append("numres", results);

    if (testMode) {
      console.debug("Test mode enabled");
      form.append("testmode", 1);
    }

    if (mask && excludeMask) {
      throw new Error("Cannot have both mask and excludeMask");
    } else if (mask) {
      console.log(`Adding inclusive db mask ${generateMask(mask)} from ${mask.join(", ")}`);
      form.append("dbmask", generateMask(mask));
    } else if (excludeMask) {
      console.log(`Adding exclusive db mask ${generateMask(excludeMask)} from ${excludeMask.join(", ")}`);
      form.append("dbmaski", generateMask(excludeMask));
    }

    switch (typeof file) {
      case 'string':
        if (/^https?:\/\//.test(file)) {
          form.append("url", file);
        } else {
          form.append("file", createReadStream(file), { filename: "image.jpg" });
        }
        break;
      case 'object':
        if (file instanceof Buffer) {
          form.append("file", file, { filename: "image.jpg" });
        } else if (file instanceof Readable) {
          form.append("file", file, { filename: "image.jpg" });
        } else {
          throw new Error("Invalid file type");
        }
        break;
      default:
        throw new Error("Invalid file type");
    }

    const response = await fetchFn("https://saucenao.com/search.php", {
      method: "POST",
      body: form.getBuffer(),
      headers: form.getHeaders()
    });

    const { header, res } = await response.json();

    // server-side error
    if (header.status > 0) throw new SagiriServerError(header.status, header.message);
    // client-side error
    if (header.status < 0) throw new SagiriClientError(header.status, header.message);

    const unknownIds = new Set(
      res.map((result: any) => result.header.index_id)
    )

    if (unknownIds.size > 0)
      console.warn(
        `Same results were not resolved, because they were not found in the list of supported sites.
        Please report this IDs to the library maintainer: ${Array.from(unknownIds).join(", ")}`);

    const srcResults = res
    .filter((res: any) => !unknownIds.has(res.header.index_id))
    .sort((a: any, b: any) => b.header.similarity - a.header.similarity);

    console.debug(`Exepcted ${results} results, got ${srcResults.length}, with ${unknownIds.size} unknown IDs`);
  }
}


export default sagiri;
