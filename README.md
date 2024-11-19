# Nimiq Identicons

![Nimiq Identicons Example 1](https://raw.githubusercontent.com/nimiq/identicons/master/example1.png)

SVG+JS Identicons designed to run in browsers and NodeJS.
The library is heavily optimized for performance.

[See the Identicons in action here.](https://nimiq.github.io/identicons/)

- [Installation](#installation)
  - [Browsers](#browsers)
  - [NodeJS](#nodejs)
- [Usage](#usage)
- [Demos](#demos)

## Installation

Nimiq Identicons can be used in both browsers and NodeJS:

### Browsers

You can either use the Identicons script already bundled with the image data (default),
or with an external SVG file which is loaded separately.

The Identicons script is provided as an ES6 module and needs to be `import`ed
into module scripts or used with build systems such as Webpack and Rollup:

1. `npm install --save @nimiq/identicons` or `yarn add @nimiq/identicons`
2. `import Identicons from '@nimiq/identicons'`
3. See how to use it under [Usage](#usage)

To use the other version of the library, which loads the image data separately,
you have to `import Identicons from '@nimiq/identicons/dist/identicons.min.js'` instead.
Additionally you have to make sure that the `identicons.min.svg` file included in the
`dist` directory of this package is made available to website visitors.
Then specify the path where the library can find this SVG file, either by setting
`Identicons.svgPath = '/public/path/to/identicons.min.svg'` or in the global scope with
`window.NIMIQ_IDENTICONS_SVG_PATH = '/public/path/to/identicons.min.svg'`.

**Note:** Besides installing the package yourself, you can also use
a npm-enabled CDN:
`import Identicons from https://unpkg.com/@nimiq/identicons@1.4/dist/identicons.bundle.min.js`.

### NodeJS

For NodeJS a CommonJS module is provided,
which can simply be installed and used by doing:

1. `npm install --save @nimiq/identicons` or `yarn add @nimiq/identicons`
2. `const Identicons = require('@nimiq/identicons').default` (the `.default` is important!)
3. See how to use it under [Usage](#usage)

> If you are using a version of NodeJS with `import` enabled, or are using an
> ES6 loader such as [`esm`](https://www.npmjs.com/package/esm) or
> [`babel-register`](https://www.npmjs.com/package/babel-register), you can just
> do `import Identicons from '@nimiq/identicons'` for step 2.

## Usage

All methods generating identicons are async and return promises.

Get a raw SVG text string:

```js
const svg = await Identicons.svg(text)
```

Get a SVG data url string (the one starting with `data:image/svg+xml;base64,...`),
which can be set as `img.src`:

```js
const dataUrl = await Identicons.toDataUrl(text)
```

Render an identicon SVG into the DOM (only in browsers!):

```js
await Identicons.render(text, element)
```

Get an `<img>` DOM node (only in browsers!):

```js
const img = await Identicons.image(text)
```

You can generate a placeholder icon with these (sync) methods:

```js
// Placeholder SVG:
const svg = Identicons.placeholder(color = '#bbb', strokeWidth = 1)
// Placeholder data url:
const dataUrl = Identicons.placeholderToDataUrl(color = '#bbb', strokeWidth = 1)
// Render placeholder SVG into `element`:
Identicons.renderPlaceholder(element, color = '#bbb', strokeWidth = 1)
```

## Demos

- [Simple demo of custom identicons](https://nimiq.github.io/identicons/)
- [Catalog of all features](https://nimiq.github.io/identicons/catalog.html)
- [Identicon Builder](https://nimiq.github.io/identicons/builder.html)

## Background Info

For more information on our design decisions read our [design blog post](https://medium.com/nimiq-network/devblog-2-identicons-be50dca91d55)
or watch the [Vlog about the beginning of the Identicons](https://www.youtube.com/watch?v=cAkllk_fKwA).

---

This is an open source contribution by [Nimiq - the browser-based blockchain](https://nimiq.com).

![Nimiq Identicons Example 2](https://raw.githubusercontent.com/nimiq/identicons/master/example2.png)
