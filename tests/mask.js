/**
 * @file Test file for Sagiri for DB mask support.
 * @author Capuccino
 * @author Ovyerus
 */
 
const Sagiri = require('../');
const token = require('./token.json').token;

const sourcer = new Sagiri(token, {
    dbMaskI: 0,
    dbMask: 10,
    testMode: 1
});


sourcer.getSauce('https://cdn.awwni.me/zqqd.jpg').then(res => console.log(res)).catch(err => console.error(err));