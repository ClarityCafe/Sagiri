import bent from "bent";
import debug from "debug";
import FormData from "form-data";

import { createReadStream } from "fs";
import { Readable } from "stream";

import { SagiriClientError, SagiriServerError } from "./errors";
import { Response, Result } from "./response";
import sites from "./sites";
import { generateMask, resolveResult } from "./util";

const log = debug("sagiri");

type File = string | Buffer | Readable;

/**
 * Creates a function to be used for finding potential sources for a given image.
 */
const sagiri = (token: string, defaultOptions: Options = { results: 5 }) => {
  log("Created Sagiri function with default options:", defaultOptions);

  const request = bent("https://saucenao.com", "json", "POST", 200);

  return async (
    file: File,
    optionOverrides: Options = {}
  ): Promise<SagiriResult[]> => {
    if (!file) throw new Error("Missing file to find source for");

    log(
      `Requesting possible sources for ${
        typeof file === "string" ? file : "a stream or buffer"
      }`
    );

    const { results: numResults, testMode, mask, excludeMask } = {
      ...defaultOptions,
      ...optionOverrides,
    };
    const form = new FormData();

    log(`Requesting ${numResults!} results from SauceNAO`);

    form.append("api_key", token);
    form.append("output_type", 2);
    form.append("numres", numResults);

    if (testMode) {
      log("Enabling test mode");
      form.append("testmode", 1);
    }

    if (mask && excludeMask)
      throw new Error(
        "It's redundant to set both mask and excludeMask. Choose one or the other."
      );
    else if (mask) {
      log(
        `Adding inclusive db mask with a value of ${generateMask(
          mask
        )} (from [${mask.join(", ")}])`
      );
      form.append("dbmask", generateMask(mask));
    } else if (excludeMask) {
      log(
        `Adding exclusive db mask with value of ${generateMask(
          excludeMask
        )} (from [${excludeMask.join(", ")}])`
      );
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

    const response = (await request(
      "/search.php",
      form,
      form.getHeaders()
    )) as Response;
    const {
      header: { status, message, results_returned: resultsReturned },
    } = response;

    log(`Received response, status ${status}`);

    // Server side error
    if (status > 0) throw new SagiriServerError(status, message!);
    // Client side error
    else if (status < 0) throw new SagiriClientError(status, message!);

    const results = response.results
      .filter(({ header: { index_id: id } }) => !!sites[id])
      .sort((a, b) => b.header.similarity - a.header.similarity);

    log(
      `Expected ${numResults} results. ` +
        `SauceNAO says it sent ${resultsReturned}, actually sent ${response.results.length}. ` +
        `Found ${results.length} acceptable results.`
    );

    return results.map((result) => {
      const { url, name, id } = resolveResult(result);
      const {
        data: { author_name: authorName, author_url: authorUrl },
        header: { similarity, thumbnail },
      } = result;

      return {
        url,
        site: name,
        index: (id as any) as number, // These are actually numbers but they're typed as strings so they can be used to select from the sites map
        similarity: Number(similarity),
        thumbnail,
        authorName,
        authorUrl,
        raw: result,
      };
    });
  };
};

module.exports = sagiri;
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

export default sagiri;
