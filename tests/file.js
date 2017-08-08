/**
 * @file Test file for Sagiri for file support.
 * @author Ovyerus
 */

const Sagiri = require('../');
const token = require('./token.json').token;

const sourcer = new Sagiri(token);

console.log('Starting file test...');

sourcer.getSource('./image.jpg').then(console.log).catch(err => {
    console.error('File test failed!');
    console.error(err);
    process.exit(1);
});