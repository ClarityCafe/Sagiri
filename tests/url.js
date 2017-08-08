/**
 * @file Test file for Sagiri for URL support.
 * @author Ovyerus
 */

const Sagiri = require('../');
const token = require('./token.json').token;

const sourcer = new Sagiri(token);

console.log('Starting url test...');

sourcer.getSource('http://i.imgur.com/5yFTeRV.png').then(console.log).catch(err => {
    console.error('File test failed!');
    console.error(err);
    process.exit(1);
});