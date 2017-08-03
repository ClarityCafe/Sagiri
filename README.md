# Sagiri
Sagiri is a Saucenao API Handler.

### Usage

Simple Example : 
```js

const Sagiri = require('sagiri');
const handler = new Sagiri({
    token: 'TOKEN',
    numRes: 5
});

handler.getSauce('URL').then(res => {
    console.log(res);
});
```

**getSauce(``link``)**

Gets the image's source using the Suacenao API.

Returns : JSON Response (by default)

### Contributing

All contributions are accepted! If you think you can bring uploading support, or make the lib perform better, make a PR and start coding!

### Copyright

Copyright 2017 (c) ClaraI/O. This Library is from the [Clara base project](https://github.com/ClaraIO/Clara).

Sagiri is a character from Eromanga-sensei. All rights reserved to her authors.