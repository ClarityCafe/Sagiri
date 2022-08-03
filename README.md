# Sagiri

A simple and lightweight NodeJS wrapper for [SauceNAO](https://saucenao.com/).

![NPM Downloads Badge](https://img.shields.io/npm/dm/sagiri.svg)
![Node.js CI (Test)](<https://github.com/ClarityCafe/Sagiri/workflows/Node.js%20CI%20(Test)/badge.svg>)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FClarityCafe%2FSagiri.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FClarityCafe%2FSagiri?ref=badge_shield)

## Installation

```sh
yarn add sagiri
# or with npm
npm install sagiri
```

## Usage

```js
const sagiri = require("sagiri");

const client = sagiri("token");
const results = await client("http://i.imgur.com/5yFTeRV.png");
```

`sagiri` is a function that returns an async function, so you can call it and store it in a variable to use multiple times, or you can call it and use it immediately.

Sagiri also has the ability to provide [options]() both when calling the main function, and the given async function.

```js
const client = sagiri("client", { results: 10 });
const results = await client("http://i.imgur.com/5yFTeRV.png", { mask: [5] });
```

### API

`sagiri(token: string, defaultOptions?: Options)`  
_Creates a function to be used for finding potential sources for a given image._  
By default has options set to give 5 results from SauceNAO.

You can get a token for SauceNAO by [registering an account](https://saucenao.com/user.php) and going to the API page.

Returns `async function (file: File, optionOverrides?: Options)` which is loaded with the given token and default options to use.

### Options

Options takes the form of a simple object passed to either the constructor function or the request function, which covers the options available in the SauceNAO API.

A basic overview of this object looks like this:

```ts
{
  results?: number;
  mask?: number[];
  excludeMask?: number[];
  testMode?: boolean;
  db?: number;
}
```

- `results` controls how many results are returned from SauceNAO.
- `mask` is an array of the only database indices you want returned from SauceNAO. A mask of `[5]` would only return results from Pixiv.
- `excludeMask` is like `mask`, but instead of only including the indices you give, it excludes them from the results - allowing everything but those indices. For example, a mask of `[5]` would disallow results from Pixiv.
- `testMode` causes each index that has a match for the given image to output at most `1` result. Useful for testing some things.
- `db` searches a specific database index without having to generate a mask.

## Contributing

Any contributions to this project are welcome, but please be sure to read over our [contributing guidelines](./.github/CONTRIBUTING.md).

## License

The code contained within this repository is licensed under the MIT License. See [LICENSE](./LICENSE) for more information.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FClarityCafe%2FSagiri.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FClarityCafe%2FSagiri?ref=badge_large)
