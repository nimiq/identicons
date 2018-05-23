# Nimiq Iqons
SVG+JS Identicons designed to run in browsers. The library is heavily optimized for performance.

This is an open source contribution by [Nimiq - the browser-based blockchain](https://nimiq.com)

## Usage
 1. Import the script: `import Iqons from './dist/iqons.min.js'`
 2. Specify where to find the SVG file: `Iqons.svgPath = '/url/to/iqons.min.svg'`
 2. Render: `await Iqons.render('any text or address here', document.getElementById('someElement'))`

## Public API
Get the raw SVG text string, `inline` specifies if the SVG includes the feature code into the string (`true`) or uses the `<use>` tag (`false`):

    await Iqons.svg(text, inline = false)

Render the identicon SVG as `element.innerHTML`:

    await Iqons.render(text, element)

Get a SVG data url string (the one starting with `data:image/svg+xml;base64,...`):

    await Iqons.toDataUrl(text)

Get an `<img>` DOM node:

    await Iqons.image(text)

Placeholder methods:

    Iqons.placeholder(color = '#bbb', strokeWidth = 1)
    Iqons.renderPlaceholder(element, color = '#bbb', strokeWidth = 1)
    Iqons.placeholderToDataUrl(color = '#bbb', strokeWidth = 1)

## Demo
Here is a simple demo of [iqons SVG](https://nimiq.github.io/iqons/).

## Background Infos
For more information on our design decisions read our [design blog post](https://medium.com/nimiq-network/devblog-2-identicons-be50dca91d55).
