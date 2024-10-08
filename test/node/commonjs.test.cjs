/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const assert = require('assert');
const sagiri = require('../../dist/sagiri.cjs');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('Sagiri#client', function() {
  it('should be a function', function() {
    assert.strictEqual(typeof sagiri, 'function');
  });

  it('should throw on invalid characters', function () {
    assert.throws(() => sagiri("!!!!!*&#@(!)"));
  })
})
