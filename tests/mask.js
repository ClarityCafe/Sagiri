/**
 * @file Test file for Sagiri for DB mask support.
 * @author Capuccino
 * @author Ovyerus
 */
 
const Sagiri = require('../');
const token = process.env.SAUCENAO_TOKEN || require('./token.json').token;

const sourcer = new Sagiri(token, {
    dbMaskI: [9],
    dbMask: [5, 10],
    testMode: true
});

console.log('Starting DB mask test...');

sourcer.getSauce('https://cdn.awwni.me/zqqd.jpg').then(console.log).catch(err => {
    console.error('File test failed!');
    console.error(err);
    process.exit(1);
});