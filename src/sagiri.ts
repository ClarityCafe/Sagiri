import type { IOptions } from "./interfaces";
import { env } from "node:process";
import { Buffer } from "node:buffer";
import { Readable } from "node:stream";
import { createReadStream } from "node:fs";
import FormData from "form-data";
import { generateMask, resolveResult } from "./util";
import { SagiriClientError, SagiriServerError } from "./errors";
import type { IResponse, IResult } from "./response";
import sites from "./sites";

// compatibility with older versions of nodejs. This will be removed in the future once LTS versions of nodejs has moved above 21.x
let fetchFn;
const disableWarning = process.env.SAGIRI_DISABLE_NODE_FETCH_WARNING === "true" ? true : false;

if (globalThis.fetch === undefined) {
  if (!disableWarning)
    console.warn(`
    WARNING: Starting in Sagiri 4.3.x, the node-fetch fallback will be removed in favor of using Node.js's native
    fetch implementation. Furthermore, CJS exports will cease to work. 4.3.0 will be a transitionary period for
    everyone relying on the old implementation. If you wish to use older LTS versions, stick to Sagiri 4.2.x
    which will be supported until EOY 2025.

    To disable this warning, add SAGIRI_DISABLE_NODE_FETCH_WARNING="true" in your environment variable.
  `)

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  fetchFn = require("node-fetch");
} else {
  fetchFn = globalThis.fetch;
}

type File = string | Buffer | globalThis.Blob | Readable;

/**
 * Creates a function to be used for finding potential sources for a given image.
 * By default has options set to give 5 results from SauceNAO.
 * @param token your saucenao token, get one from https://saucenao.com/user.php
 * @param defaultOpts the default options that the client will use for querying
 * @returns an `async function (file: File, optionOverrides?: Options)` which is loaded with the given token and default options to use.
 */
const sagiri = (
  token: string,
  defaultOpts: IOptions = { results: 5 },
): ((
  file: File,
  opts?: IOptions,
) => Promise<
  {
    url: string;
    site: string;
    index: number;
    similarity: number;
    thumbnail: string;
    authorName: string;
    authorUrl: string;
    raw: IResult;
  }[]
>) => {
  console.debug(`Created sagiri instance with opts: ${JSON.stringify(defaultOpts)}`);

  // token validation to ensure the token is 40 characters long and alphanumeric
  if (env.NODE_ENV !== "test")
    if (token.length < 40 || !/^[a-zA-Z0-9]+$/.test(token))
      throw new Error("Malformed token. Get a token from https://saucenao.com/user.php");

  return async (file: File, opts: IOptions = {}) => {
    if (!file) throw new Error("No file provided");

    console.debug(`Searching for possible sources of image: ${typeof file === "string" ? file : "Buffer"}`);

    const form = new FormData();
    const { results, mask, excludeMask, testMode } = { ...defaultOpts, ...opts };

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

    if (typeof file === "string") {
      if (/^https?:\/\//.test(file)) {
        form.append("url", file);
      } else {
        form.append("file", createReadStream(file), { filename: "image.jpg" });
      }
    } else if (file instanceof Buffer) {
      form.append("file", file, { filename: "image.jpg" });
    } else if (file instanceof Readable) {
      form.append("file", file, { filename: "image.jpg" });
    } else if (file instanceof Blob) {
      form.append("file", file, { filename: "image.jpg" });
    } else {
      throw new Error("Invalid file type");
    }

    const response = await fetchFn("https://saucenao.com/search.php", {
      method: "POST",
      body: form.getBuffer(),
      headers: form.getHeaders(),
    });

    // I'm sure there's a better way to do this but I'll just re-assign a new var
    // because I am writing this in midnight and I want to go to sleep
    const res = (await response.json()) as IResponse;

    const {
      header: { status, message, results_returned: resultsReturned },
    } = res;

    // server-side error
    if (status > 0) throw new SagiriServerError(status, message!);
    // client-side error
    if (status < 0) throw new SagiriClientError(status, message!);

    // filter unknowns
    const unknownIds = new Set(
      res.results.filter((result) => !sites[result.header.index_id]).map((result) => result.header.index_id),
    );

    if (unknownIds.size > 0)
      console.warn(
        `Same results were not resolved, because they were not found in the list of supported sites.
        Please report this IDs to the library maintainer: ${Array.from(unknownIds).join(", ")}`,
      );

    const srcResults = res.results
      .filter((res) => !unknownIds.has(res.header.index_id))
      .sort((a, b) => b.header.similarity - a.header.similarity);

    console.debug(
      `Exepcted ${results} results, got ${srcResults.length}, with saucenao reporting ${resultsReturned} results.`,
    );

    // return the results
    return srcResults.map((res) => {
      const { url, name, id, authorName, authorUrl } = resolveResult(res);
      const {
        header: { similarity, thumbnail },
      } = res;

      return {
        url,
        site: name,
        index: parseInt(id),
        similarity: Number(similarity),
        thumbnail,
        authorName,
        authorUrl,
        raw: res,
      };
    });
  };
};

export default sagiri;
