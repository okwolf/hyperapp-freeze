# Hyperapp Freeze

[![Build Status](https://travis-ci.org/okwolf/hyperapp-freeze.svg?branch=master)](https://travis-ci.org/okwolf/hyperapp-freeze)
[![Codecov](https://img.shields.io/codecov/c/github/okwolf/hyperapp-freeze/master.svg)](https://codecov.io/gh/okwolf/hyperapp-freeze)
[![npm](https://img.shields.io/npm/v/hyperapp-freeze.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/hyperapp-freeze)

A [Hyperapp](https://github.com/jorgebucaran/hyperapp) [dispatch initializer](https://github.com/jorgebucaran/hyperapp/blob/main/docs/architecture/dispatch.md#dispatch-initializer) that [deep freeze](https://github.com/substack/deep-freeze)s the state passed to each of your actions and view, giving you an error during development if you mutate state directly. If you or someone you love comes from an imperative programming background (where you might do things like `state++` instead of `return state + 1`) then this might be useful for you and your development team.

Perhaps you work with backend developers who are perfectly competent engineers, but need some help adjusting to writing functional state updates and stateless components. Take Emily for example: she wants to show a list of items in the view ordered by a property of the user's choosing. Her array of items in the state is in a different order so she calls `sort` on the array from inside the view. Now there are weird bugs introduced because the array items in the state are in a different order. Emily's friend Sam sees the bug and adds Hyperapp Freeze to their dev build to complain loudly when evil direct state mutations are made. Sam catches the source of the bug, and updates the view to copy the array items before sorting them based on the user's preferences.

## You might not need this

If you work on a team of seasoned functionalistas who are disciplined in immutability and don't need training wheels then Hyperapp Freeze is not meant for you. This is intended only for use in dev when you want to enforce no mutations as strictly as using a purely functional language like [Elm](http://elm-lang.org) would. The reasons you would want this vary from functional philosophical dogma to simple/predictable testing/debugging to avoiding real bugs in production caused by reckless mutation. This does come with a performance hit, so please ensure you are not using it in your production builds.

## Installation

### Node.js

Install with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp-freeze">hyperapp-freeze</a>
</pre>

Then with a module bundler like [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack) use as you would anything else.

```js
import freeze from "hyperapp-freeze";
```

Or using require.

```js
const freeze = require("hyperapp-freeze");
```

### Browser

Download the minified library from the [CDN](https://unpkg.com/hyperapp-freeze).

```html
<script src="https://unpkg.com/hyperapp-freeze"></script>
```

You can find the library in `window.hyperappFreeze`.

## Usage

```js
app({
  init,
  view,
  node,
  dispatch: freeze
});
```

And your state is now frozen! ❄️

## License

Hyperapp Freeze is MIT licensed. See [LICENSE](LICENSE.md).
