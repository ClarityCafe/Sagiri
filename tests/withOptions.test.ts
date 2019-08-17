import Sagiri from '../lib';

describe('Sagiri With Options test', () => {
  let sagiri: Sagiri;
  beforeAll(() => {
    const token = process.env.SAUCENAO_TOKEN as string;

    sagiri = new Sagiri(token, {
      dbMaskI: [9],
      dbMask: [5, 10],
      testMode: true,
      getRating: true
    });
  });

  test('should get source', async () => {
    const results = await sagiri.getSauce('https://i.imgur.com/YmaYT5L.jpg');

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});
