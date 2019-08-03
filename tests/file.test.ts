import Sagiri from '../lib';
import path from 'path';

describe('Sagiri File test', () => {
  let sagiri: Sagiri;
  beforeAll(() => {
    const token = process.env.SAUCENAO_TOKEN as string;

    sagiri = new Sagiri(token, {testMode: true});
  });

  test('should get source', async () => {
    const imagePath = path.join(__dirname, 'fixtures', 'image.png');
    const results = await sagiri.getSauce(imagePath);

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});