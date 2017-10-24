# Sagiri
A simple, lightweight and actually good JS wrapper for the SauceNAO API.

[![NPM Info](https://nodei.co/npm/sagiri.png)](https://npmjs.org/package/sagiri)  
![NPM Downloads Badge](https://img.shields.io/npm/dm/sagiri.svg)

## Installation

```
npm install sagiri
```

## Examples

#### Regular
```js
const Sagiri = require('sagiri');
const handler = new Sagiri('TOKEN');

handler.getSauce('http://i.imgur.com/5yFTeRV.png').then(console.log);
```

#### Using DB masks
```js
const Sagiri = require('sagiri');
const handler = new Sagiri('TOKEN', {
  dbMask: [5, 35],
  dbMaskI: [29]
});

handler.getSauce('http://i.imgur.com/5yFTeRV.png').then(console.log);
```

## API 

Documentation for the module is available [here](./API.md).

## Ratings
If `options.getRatings` is true, then each source returned from the API will have a `rating` field, with a number from `0` to `3`.  
The meaning of these values are:
 - `0 (UNKNOWN)` The rating of the source could not be determined.
 - `1 (SAFE)` The source is safe and doesn't contain nudity, sex, etc.
 - `2 (QUESTIONABLE)` The source isn't 100% safe and may contain nudity.
 - `3 (NSFW)` The source is not safe, and contains nudity, sex, etc.

If `options.getRatings` is not true, then this value will always be `0`.

## Contributing

All contributions are accepted! If you think you can bring uploading support, or make the lib perform better, make a PR and start coding!

## Copyright

Copyright 2017 (c) ClarityMoe. This Library is from the [Clara base project](https://github.com/ClaraIO/Clara).

Sagiri is a character from Eromanga-sensei. All rights reserved to her authors.

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/AWTfak41YehZveZx8xMtTKdF/ClarityMoe/Sagiri'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/AWTfak41YehZveZx8xMtTKdF/ClarityMoe/Sagiri.svg' />
</a>