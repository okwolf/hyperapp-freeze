# hyperapp-freeze

[![npm](https://img.shields.io/npm/v/hyperapp-freeze.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/hyperapp-freeze)

A [HyperApp](https://github.com/hyperapp/hyperapp) [mixin](https://github.com/hyperapp/hyperapp/blob/master/docs/mixins.md) that [deep freeze](https://github.com/substack/deep-freeze)s your state on load to give you an error during development if you accidently mutate state directly. Heavily inspired by [redux-freeze](https://github.com/buunguyen/redux-freeze).

## Install

### npm

```sh
npm install hyperapp-freeze
```

### Yarn

```sh
yarn add hyperapp-freeze
```

## Usage

### ES6 Node

```js
import freeze from 'hyperapp-freeze';
...
app({
  ...
  mixins: [freeze]
})
```

### ES5 Node

```js
const freeze = require('hyperapp-freeze');
...
app({
  ...
  mixins: [freeze]
})
```

### Browser

Because this package exports as UMD you can add it to an existing HTML/pen with the following script: `https://unpkg.com/hyperapp-freeze` (For [CodePen](https://codepen.io) this is under Settings -> JavaScript -> Add External JavaScript). Then you just need to add the mixin to your app: `mixins: [hyperappFreeze]` and your state is now frozen! ❄️