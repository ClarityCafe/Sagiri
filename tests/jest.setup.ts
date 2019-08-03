/**
 * @file Jest Setup file, runs before any other tests
 * @author Favna
 */

import {config} from 'dotenv';
import path from 'path';

if (!process.env.CI) {
  config({
    path: path.join(__dirname, 'fixtures', '.env'),
    encoding: 'utf8',
    debug: false,
  });
}