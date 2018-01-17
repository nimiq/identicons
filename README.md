# iqons SVG
SVG+JS Identicons based on [iqons](https://iqons.org). The original library is designed to run on a server while _iqons SVG_ is designed to run in browsers. The library is only ~27kB compressed and heaviliy optimized for performance. 

![iqons](https://iqons.org/nimiq42.png)

This is an open source contribution by [Nimiq - the browser-based blockchain](https://nimiq.com)

## Usage
 1. Include the script: `<script src="dist/iqons.min.js"></script>`
 2. Render: `iqons.render('any text here', document.getElementById('someElement'))`

## Demo
Here is a simple demo of [iqons SVG](https://nimiq.github.io/iqons/).

## Background Infos
For more information on our design decisions read our [design blog post](https://medium.com/nimiq-network/devblog-2-identicons-be50dca91d55).

## Hexagon-shaped Identicons
Since hexagons are part of our brand identity we've created another version of this library generating [hexagon-shaped iqonss](https://github.com/nimiq/x-identicon).
