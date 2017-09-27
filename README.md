# Sagiri
A lightweight wrapper for the SauceNAO API.


```js
npm install --save @sr229/sagiri
```

## Usage

Example:
```js
const Sagiri = require('sagiri');
const handler = new Sagiri('TOKEN'); // or new Sagiri('TOKEN', number of results)

handler.getSauce('http://i.imgur.com/5yFTeRV.png').then(res => {
    console.log(res);
});
```

**getSauce(`file`)**

Get potential sources for an image from SauceNAO.  
`file` can either be a filepath, or an image url.

Returns: `Promise<Object>` - A Promise that resolves with the closest match.

## Contributing

All contributions are accepted! If you think you can bring uploading support, or make the lib perform better, make a PR and start coding!

## Copyright

Copyright 2017 (c) ClaraI/O. This Library is from the [Clara base project](https://github.com/ClaraIO/Clara).

Sagiri is a character from Eromanga-sensei. All rights reserved to her authors.