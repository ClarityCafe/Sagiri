/**
 * @file Test file for Sagiri for URL support.
 * @author Ovyerus
 */

const Sagiri = require('../');
const token = require('./token.json').token;

const sourcer = new Sagiri(token);

console.log('Starting url test...');

sourcer.getSource('http://cfile29.uf.tistory.com/image/277D9B3453F9D9283659F4').then(console.log).catch(err => {
    console.error('File test failed!');
    console.error(err);
    process.exit(1);
});