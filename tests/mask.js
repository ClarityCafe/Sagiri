/**
 * @file testing the Masking parameters in SauceNao
 * @author Capuccino
 * @license MIT
 **/
 
 const Handler = require('../');
 const token = require('./token.json').token;
 const s = new Handler(token, {
     // disable site index for this test
     dbMaskI: 0,
     dbMask: 10,
     testMode: 1
 });
 
 //one-liners ecksde
 s.getSauce('https://cdn.awwni.me/zqqd.jpg').then(res => console.log(res)).catch(err => console.error(err));