# hyperapp-freeze

[![Build Status](https://travis-ci.org/okwolf/hyperapp-freeze.svg?branch=master)](https://travis-ci.org/okwolf/hyperapp-freeze)
[![Codecov](https://img.shields.io/codecov/c/github/okwolf/hyperapp-freeze/master.svg)](https://codecov.io/gh/okwolf/hyperapp-freeze)
[![npm](https://img.shields.io/npm/v/hyperapp-freeze.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/hyperapp-freeze)

A [HyperApp](https://github.com/hyperapp/hyperapp) higher-order `app` that [deep freeze](https://github.com/substack/deep-freeze)s the `state` passed to each of your `actions` and `view`, giving you an error during development if you accidently mutate state directly. Heavily inspired by [redux-freeze](https://github.com/buunguyen/redux-freeze).

## Installation

### Node.js

Install with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp-freeze">hyperapp-freeze</a>
</pre>

Then with a module bundler like [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack) use as you would anything else.

```jsx
import freeze from "hyperapp-freeze"
```

### Browser

Download the minified library from the [CDN](https://unpkg.com/hyperapp-freeze).

```html
<script src="https://unpkg.com/hyperapp-freeze"></script>
```

You can find the library in `window.freeze`.

## Usage

```js
freeze(app)({
  // ...
})
```

And your state is now frozen! ❄️

## License

hyperapp-freeze is MIT licensed. See [LICENSE](LICENSE.md).