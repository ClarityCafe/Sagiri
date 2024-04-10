/* eslint-disable @typescript-eslint/no-explicit-any */

import { Result } from "./response";
import sites from "./sites";

export const generateMask = (masks: number[]): number =>

  masks.reduce((prev, curr) => {
    /* SauceNao API skips index 17 as it is reserved meaning all bitshifts above 17 are off by 1 */
    if (curr > 16)
    {
      return prev + Math.pow(2, curr - 1);
    } else {
      return prev + Math.pow(2, curr);
    }
  }, 0);

export function resolveResult(result: Result): any {

  const { data, header } = result;
  const id = header.index_id;

  if (!sites[id]) throw new Error(`Cannot resolve data for unknown index ${id}`);

  const { name, urlMatcher, backupUrl, authorData } = sites[id]!;
  let url: string | undefined;

  // Try to find matching url from ones provided by SauceNAO
  if (data.ext_urls && data.ext_urls.length > 1) [url] = data.ext_urls.filter((url) => urlMatcher.test(url));
  else if (data.ext_urls) [url] = data.ext_urls;

  // If we can't find out, generate one ourselves
  if (!url) url = backupUrl(result);

  return {
    id,
    url,
    name,
    ...(authorData?.(result.data) ?? { authorName: null, authorUrl: null }),
  };

}
