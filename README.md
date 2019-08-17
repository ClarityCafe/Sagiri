# Sagiri
A simple, lightweight and actually good JS wrapper for the SauceNAO API.

[![NPM Info](https://nodei.co/npm/sagiri.png)](https://npmjs.org/package/sagiri)
![NPM Downloads Badge](https://img.shields.io/npm/dm/sagiri.svg)
[![Build Status](https://travis-ci.com/ClarityCafe/Sagiri.svg?branch=master)](https://travis-ci.com/ClarityCafe/Sagiri)

## Installation

Install with [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com/).
This library also has 2 mandatory peer dependencies, [node-fetch](https://www.npmjs.com/package/node-fetch) and [form-data](https://www.npmjs.com/package/form-data).
You should also install these libraries.
Lastly if you're writing in TypeScript it would be a good idea to also add `@types/node-fetch` to your devDependencies.

```sh
npm install sagiri node-fetch form-data

yarn add sagiri node-fetch form-data
```

## Examples

#### Regular
```js
const Sagiri = require('sagiri');
const sagiri = new Sagiri('TOKEN');

sagiri.getSauce('http://i.imgur.com/5yFTeRV.png').then(console.log);
```

#### Using DB masks
```js
const Sagiri = require('sagiri');
const sagiri = new Sagiri('TOKEN', {
  dbMask: [5, 35],
  dbMaskI: [29]
});

sagiri.getSauce('http://i.imgur.com/5yFTeRV.png').then(console.log);
```

#### In TypeScript / with ES6 modules
```ts
import Sagiri from 'sagiri';
const sagiri = new Sagiri('TOKEN');

sagiri.getSauce('http://i.imgur.com/5yFTeRV.png').then(console.log);
```

## API Documentation

### Sagiri
The main class for the library to get sources of images.
An instance of this class can be created with a SauceNAO token upon which you can query the API get the `getSauce` method


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>string</code> |  | API Key for SauceNAO |
| [options] | <code>SagiriOptions</code> |  | Optional options |
| [options.numRes] | <code>number</code> | <code>5</code> | Number of results to get from SauceNAO. |
| [options.getRating] | <code>boolean</code> | <code>false</code> | Whether to retrieve the rating of a source or not. |
| [options.testMode] | <code>boolean</code> | <code>false</code> | Whether to enable "test mode", which causes each index that has a match to output 1 result at most. |
| [options.dbMask] | <code>Array&lt;number&gt;</code> \| <code>null</code> | <code></code> | Array of all the indexes to **ENABLE** results for. |
| [options.dbMaskI] | <code>Array&lt;number&gt;</code> \| <code>null</code> | <code></code> | Array of all the indexes to **DISABLE** results for. |

#### getSource(params)
An alias of `Sagiri#getSauce`, for those who are more mentally sane.

**Kind**: instance method of <code>sagiri</code>  
**Returns**: <code>Promise&lt;Array&lt;Source&gt;&gt;</code> - An array of all the results from the API, with parsed data.  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> \| <code>Buffer</code> | Either a file or URL or a file buffer that you want to find the source of |

#### getSauce(params)
Searches for potential sources of an image.

**Kind**: instance method of <code>Sagiri</code>  
**Returns**: <code>Promise&lt;Array&lt;Source&gt;&gt;</code> - An array of all the results from the API, with parsed data.  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> \| <code>Buffer</code> | Either a file or URL or a file buffer that you want to find the source of |

**Example**  
```ts
 const Sagiri = require('sagiri');
 const sagiri = new Sagiri('YOUR_TOKEN');
 (async function() {
   const data = await sagiri.getSauce('https://i.imgur.com/YmaYT5L.jpg');
   console.log(data);
 })();
```

## Ratings
If `options.getRatings` is true, then each source returned from the API will have a `rating` field, with a number from `0` to `3`.
The meaning of these values are:
 - `0 (UNKNOWN)` The rating of the source could not be determined.
 - `1 (SAFE)` The source is safe and doesn't contain nudity, sex, etc.
 - `2 (QUESTIONABLE)` The source isn't 100% safe and may contain nudity.
 - `3 (NSFW)` The source is not safe, and contains nudity, sex, etc.

If `options.getRatings` is not true, then this value will always be `0`.

* * *

## Contributing

All contributions are accepted! If you think you can bring uploading support, or make the lib perform better, make a PR and start coding!
For more detailed contribution guidelines please read over [this repositories Contributing Guidelines](https://github.com/ClarityCafe/Sagiri/blob/master/.github/CONTRIBUTING.md)

## Copyright

Copyright 2017 (c) ClarityMoe. This Library is from the [Clara base project](https://github.com/ClarityCafe/Clara).

Sagiri is a character from Eromanga-sensei. All rights reserved to her authors.
