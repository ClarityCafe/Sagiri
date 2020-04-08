/* eslint-disable @typescript-eslint/camelcase */
import isMatch from "lodash.ismatch";
import nock from "nock";

import fs from "fs";
import { promisify } from "util";

import sagiri from "../lib";

import { normalData, inverseMaskData, regularMaskData } from "./fixtures/data";
import {
  normalExpectations,
  inverseMaskExpectations,
  regularMaskExpectations,
} from "./fixtures/expectations";
// import remoteData from './fixtures/remoteData';

const client = sagiri("");
const testImage = `${__dirname}/fixtures/image.png`;
const readFile = promisify(fs.readFile);
/* const ratingMatcher = expect.arrayContaining([
  expect.objectContaining({
    url: 'https://deviantart.com/view/507811345',
    rating: 'QUESTIONABLE'
  }),
  expect.objectContaining({
    url: 'https://deviantart.com/view/653284939',
    rating: 'QUESTIONABLE'
  }),
  expect.objectContaining({
    url: 'https://deviantart.com/view/605799146',
    rating: 'UNKNOWN'
  }),
  expect.objectContaining({
    url:
      'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=41817184',
    rating: 'SAFE'
  }),
  expect.objectContaining({
    url:
      'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=60231445',
    rating: 'NSFW'
  })
]);*/

/** Dumb 'n stupid "parser" for multipart/form-data bodies using regex and a bunch of string functions.
    Serves to provide an object for matching correct options in Nock calls.*/
const parseMultipart = (body: string): { [key: string]: any } => {
  const _ = body.match(/^(-+[^\r\n]*)/); // Try to find the first multipart boundary for the form.
  const boundary = _ ? _[0] : /^-+.*$/gm; // Fallback on generic dash regex if can't find first boundary for whatever reason. May break in some cases.

  return body
    .split(boundary) // Split on boundaries
    .slice(1, -1) // Remove blank elements at start and end
    .map(
      (x) =>
        x
          .trimLeft() // Remove padding at start
          .split("\r\n") // Split based on ending \r\n to get [name, blank, value]
          .slice(0, -1) // Remove blank element at end
    )
    .map(([name, ...r]) => [name.match(/name="(.*?)"/)![1], ...r.slice(1)]) // Extract field name from content disposition
    .reduce((prev, [name, value]) => ({ ...prev, [name]: value }), {}); // Reduce array into object of names and values
};

/** Convenience function for "parsing" encoded multipart/form-data bodies that occur when sending a file object.
    Doesn't end up returning the file field as that was too hard to properly do. */
const parseEncodedMultipart = (body: string) =>
  parseMultipart(Buffer.from(body, "hex").toString());

const mockApi = (...args: [nock.RequestBodyMatcher?, nock.Options?]) =>
  nock("https://saucenao.com").post("/search.php", ...args);

describe("Sagiri#getSauce", () => {
  test("gets source from url", async () => {
    mockApi((b) => {
      const body = parseMultipart(b);
      return isMatch(body, {
        api_key: "",
        output_type: "2",
        numres: "5",
        url: "https://owo.whats-th.is/6MtFNmm.png",
      });
    }).reply(200, normalData);

    const results = await client("https://owo.whats-th.is/6MtFNmm.png");

    expect(results).toEqual(normalExpectations);
  });

  describe("gets source from file", () => {
    test("path", async () => {
      mockApi((b) => {
        const body = parseEncodedMultipart(b);
        return isMatch(body, {
          api_key: "",
          output_type: "2",
          numres: "5",
        });
      }).reply(200, normalData);

      const results = await client(testImage);

      expect(results).toEqual(normalExpectations);
    });

    test("buffer", async () => {
      mockApi((b) => {
        const body = parseEncodedMultipart(b);
        return isMatch(body, {
          api_key: "",
          output_type: "2",
          numres: "5",
        });
      }).reply(200, normalData);

      const results = await client(await readFile(testImage));

      expect(results).toEqual(normalExpectations);
    });
  });

  describe("index masks", () => {
    test("regular", async () => {
      mockApi((b) => {
        const body = parseMultipart(b);
        return isMatch(body, {
          api_key: "",
          output_type: "2",
          numres: "5",
          dbmask: "32",
          url: "http://saucenao.com/images/static/banner.gif",
        });
      }).reply(200, regularMaskData);

      const results = await client(
        "http://saucenao.com/images/static/banner.gif",
        { mask: [5] }
      );

      expect(results).toEqual(regularMaskExpectations);
    });

    test("inverse", async () => {
      mockApi((b) => {
        const body = parseMultipart(b);
        return isMatch(body, {
          api_key: "",
          output_type: "2",
          numres: "5",
          dbmaski: "32",
          url: "http://saucenao.com/images/static/banner.gif",
        });
      }).reply(200, inverseMaskData);

      const results = await client(
        "http://saucenao.com/images/static/banner.gif",
        { excludeMask: [5] }
      );

      expect(results).toEqual(inverseMaskExpectations);
    });
  });

  // Uncomment when fetching ratings is supported again
  /* describe('fetching ratings', () => {
    test('gets the right ratings', async () => {
      // Mock SauceNao
      mockApi(b => {
        const body = parseMultipart(b);
        return isMatch(body, {
          api_key: '',
          output_type: '2',
          numres: '5',
          url: 'https://owo.whats-th.is/6MtFNmm.png'
        });
      }).reply(200, normalData);

      // Mock places to get data from
      nock('https://www.pixiv.net')
        .get('/member_illust.php?mode=medium&illust_id=41817184')
        .reply(
          200,
          remoteData[
            'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=41817184'
          ]
        )
        .get('/member_illust.php?mode=medium&illust_id=60231445')
        .reply(
          200,
          remoteData[
            'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=60231445'
          ]
        );

      nock('https://deviantart.com')
        .get('/view/507811345')
        .reply(200, remoteData['https://deviantart.com/view/507811345'])
        .get('/view/653284939')
        .reply(200, remoteData['https://deviantart.com/view/653284939']);

      const results = await client('https://owo.whats-th.is/6MtFNmm.png', {
        getRatings: true
      });

      expect(results).toEqual(ratingMatcher);
    });
  });*/
});
