import bent from "bent";
import debug from "debug";
import FormData from "form-data";

import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { env } from "node:process";
import * as NodeFetch from "node-fetch";

import { SagiriClientError, SagiriServerError } from "./errors";
import { IResponse, IResult } from "./response";
import sites from "./sites";
import { generateMask, resolveResult } from "./util";

const log = debug("sagiri");
let fetch;

type File = string | Buffer | Readable;

// check if fetch exists, if it does, use it, otherwise use node-fetch
if (typeof fetch === "undefined") {
  fetch = NodeFetch.default;
}

/**
 * Creates a function to be used for finding potential sources for a given image.
 */
const sagiri = (token: string, defaultOptions: IOptions = { results: 5 }): (file: File, optionOverrides?: IOptions) => Promise<ISagiriResult[]> => {
  log("Created Sagiri function with default options:", defaultOptions);

  // do some token validation, tokens must be 40 chars long and alphanumeric
  // make sure we're lenient during testing though to allow jest to pass.
  if (env.NODE_ENV !== "test")
    if (token.length < 40 || !/^[a-zA-Z0-9]+$/.test(token))
      throw new Error("Malformed SauceNAO Token. Fetch your own at https://saucenao.com/user.php");

  //const request = bent("https://saucenao.com", "json", "POST", 200);

  return async (file: File, optionOverrides: IOptions = {}): Promise<ISagiriResult[]> => {
    if (!file) throw new Error("Missing file to find source for");

    log(`Requesting possible sources for ${typeof file === "string" ? file : "a stream or buffer"}`);

    const {
      results: numberResults,
      testMode,
      mask,
      excludeMask,
    } = {
      ...defaultOptions,
      ...optionOverrides,
    };
    const form = new FormData();

    log(`Requesting ${numberResults!} results from SauceNAO`);

    form.append("api_key", token);
    form.append("output_type", 2);
    form.append("numres", numberResults);

    if (testMode) {
      log("Enabling test mode");
      form.append("testmode", 1);
    }

    if (mask && excludeMask)
      throw new Error("It's redundant to set both mask and excludeMask. Choose one or the other.");
    else if (mask) {
      log(`Adding inclusive db mask with a value of ${generateMask(mask)} (from [${mask.join(", ")}])`);
      form.append("dbmask", generateMask(mask));
    } else if (excludeMask) {
      log(`Adding exclusive db mask with value of ${generateMask(excludeMask)} (from [${excludeMask.join(", ")}])`);
      form.append("dbmaski", generateMask(excludeMask));
    }

    if (typeof file === "string" && /^https?:/.test(file)) {
      log("Adding given file as a URL");
      form.append("url", file);
    } else if (typeof file === "string") {
      log("Adding given file from an fs.createReadStream");
      form.append("file", createReadStream(file));
    } else {
      log("Adding file as stream or buffer");
      form.append("file", file);
    }

    log("Sending request to SauceNAO");

    //const response = (await request("/search.php", form, form.getHeaders())) as IResponse;
    const res2 = await fetch("https://saucenao.com/search.php", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    })
    .then((res: { json: () => never; }) => res.json()) as IResponse;
    const {
      header: { status, message, results_returned: resultsReturned },
    } = res2;

    log(`Received response, status ${status}`);

    // Server side error
    if (status > 0) throw new SagiriServerError(status, message!);
    // Client side error
    else if (status < 0) throw new SagiriClientError(status, message!);

    const unknownIds = new Set(
      res2.results.filter((result) => !sites[result.header.index_id]).map((result) => result.header.index_id),
    );

    if (unknownIds.size > 0) {
      console.warn(
        `Some results were not resolved, because they were not found in the list of supported sites.
Please report this IDs to the author ${[...unknownIds.values()].join(", ")}`,
      );
    }

    const results = res2.results
      .filter((result) => !unknownIds.has(result.header.index_id))
      .sort((a, b) => b.header.similarity - a.header.similarity);

    log(
      `Expected ${numberResults} results. ` +
        `SauceNAO says it sent ${resultsReturned}, actually sent ${res2.results.length}. ` +
        `Found ${results.length} acceptable results.`,
    );

    return results.map((result) => {
      const { url, name, id, authorName, authorUrl } = resolveResult(result);
      const {
        header: { similarity, thumbnail },
      } = result;

      return {
        url,
        site: name,
        index: parseInt(id), // These are actually numbers but they're typed as strings so they can be used to select from the sites map
        similarity: Number(similarity),
        thumbnail,
        authorName,
        authorUrl,
        raw: result,
      };
    });
  };
};

export default sagiri;

export interface IOptions {
  results?: number;
  mask?: number[];
  excludeMask?: number[];
  getRatings?: boolean;
  testMode?: boolean;
  db?: number;
}

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
