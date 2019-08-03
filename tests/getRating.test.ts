/**
 * @file Test file for Sagiri for URL and Getting Ratings support.
 * @author Favna
 */

import Sagiri from '../lib';

describe('Sagiri URL test', () => {
  let sagiri: Sagiri;
  beforeAll(() => {
    const token = process.env.SAUCENAO_TOKEN as string;

    sagiri = new Sagiri(token, {testMode: true, getRating: true});
  });

  test('should get source', async() => {
    const results = await sagiri.getSauce('https://i.imgur.com/YmaYT5L.jpg');

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});