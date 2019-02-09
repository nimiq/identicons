# Nimiq Iqons

![Nimiq Iqons Example 1](https://raw.githubusercontent.com/nimiq/iqons/master/example1.png)

SVG+JS Identicons designed to run in browsers and NodeJS.
The library is heavily optimized for performance.

[See the Iqons in action here.](https://nimiq.github.io/iqons/)

- [Installation](#installation)
    - [Browsers](#browsers)
    - [NodeJS](#nodejs)
- [Usage](#usage)
- [Demos](#demos)

## Installation

Nimiq Iqons can be used in both browsers and NodeJS:

### Browsers

You can either use the Iqons script already bundled with the image data (default),
or with an external SVG file which is loaded separately.

The Iqons script is provided as an ES6 module and needs to be `import`ed
into module scripts or used with build systems such as Webpack and Rollup:

1. `npm install --save @nimiq/iqons` or `yarn add @nimiq/iqons`
2. `import Iqons from '@nimiq/iqons'`
3. See how to use it under [Usage](#usage)

To use the other version of the library, which loads the image data separately,
you have to `import Iqons from '@nimiq/iqons/dist/iqons.min.js'` instead.
Additionally you have to make sure that the `iqons.min.svg` file included in the
`dist` directory of this package is made available to website visitors.
Then specify the path where the library can find this SVG file, either by setting
`Iqons.svgPath = '/public/path/to/iqons.min.svg'` or in the global scope with
`window.NIMIQ_IQONS_SVG_PATH = '/public/path/to/iqons.min.svg'`.

**Note:** Besides installing the package yourself, you can also use
a npm-enabled CDN:
`import Iqons from https://unpkg.com/@nimiq/iqons@1.2.0/dist/iqons.bundle.min.js`.

### NodeJS

For NodeJS a CommonJS module is provided,
which can simply be installed and used by doing:

1. `npm install --save @nimiq/iqons` or `yarn add @nimiq/iqons`
2. `const Iqons = require('@nimiq/iqons')`
3. See how to use it under [Usage](#usage)

## Usage

All methods generating identicons are async and return promises.

Get a raw SVG text string:

```js
    const svg = await Iqons.svg(text)
```

Get a SVG data url string (the one starting with `data:image/svg+xml;base64,...`),
which can be set as `img.src`:

```js
    const dataUrl = await Iqons.toDataUrl(text)
```

Render an identicon SVG into the DOM (only in browsers!):

```js
    await Iqons.render(text, element)
```

Get an `<img>` DOM node (only in browsers!):

```js
    const img = await Iqons.image(text)
```

You can generate a placeholder icon with these (sync) methods:

```js
    // Placeholder SVG:
    const svg = Iqons.placeholder(color = '#bbb', strokeWidth = 1)
    // Placeholder data url:
    const dataUrl = Iqons.placeholderToDataUrl(color = '#bbb', strokeWidth = 1)
    // Render placeholder SVG into `element`:
    Iqons.renderPlaceholder(element, color = '#bbb', strokeWidth = 1)
```

## Demos

- [Simple demo of custom identicons](https://nimiq.github.io/iqons/)
- [Catalog of all features](https://nimiq.github.io/iqons/catalog.html)
- [Identicon Builder](https://nimiq.github.io/iqons/builder.html)

## Background Info

For more information on our design decisions read our [design blog post](https://medium.com/nimiq-network/devblog-2-identicons-be50dca91d55)
or watch the [Vlog about the beginning of the Iqons](https://www.youtube.com/watch?v=cAkllk_fKwA).

---

This is an open source contribution by [Nimiq - the browser-based blockchain](https://nimiq.com).

![Nimiq Iqons Example 2](https://raw.githubusercontent.com/nimiq/iqons/master/example2.png)
