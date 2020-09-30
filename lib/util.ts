/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Result } from "./response";
import sites from "./sites";

export const generateMask = (masks: number[]): number =>
  // eslint-disable-next-line prefer-template
  masks.reduce((prev, curr) => prev ^ parseInt("1" + "0".repeat(curr), 2), 0);

export function resolveResult(result: Result): any {
  /* eslint-disable @typescript-eslint/no-unnecessary-condition */
  const { data, header } = result;
  const id = header.index_id;

  if (!sites[id])
    throw new Error(`Cannot resolve data for unknown index ${id}`);

  const { name, urlMatcher, backupUrl, authorData } = sites[id]!;
  let url: string | undefined;

  // Try to find matching url from ones provided by SauceNAO
  if (data.ext_urls && data.ext_urls.length > 1)
    [url] = data.ext_urls.filter((url) => urlMatcher.test(url));
  else if (data.ext_urls) [url] = data.ext_urls;

  // If we can't find out, generate one ourselves
  if (!url) url = backupUrl(result);

  return {
    id,
    url,
    name,
    ...(authorData?.(result.data) ?? { authorName: null, authorUrl: null }),
  };
  /* eslint-enable */
}
