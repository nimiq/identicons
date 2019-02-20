// removeIf(production)
import { IqonsCatalog } from './iqons-catalog.js';
// endRemoveIf(production)

export default class Iqons {

    /* Public API */

    static async svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(hash[0], hash[2], hash[3] + hash[4], hash[5] + hash[6], hash[7] + hash[8], hash[9] + hash[10], hash[11], hash[12]);
    }

    static async render(text, $element) {
        $element.innerHTML = await this.svg(text);
    }

    static async toDataUrl(text) {
        const base64string = this._btoa(await this.svg(text, true)); // .replace(/#/g, '%23')
        return `data:image/svg+xml;base64,${base64string}`;
    }

    static placeholder(color = '#bbb', strokeWidth = 1) {
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
<path fill="none" stroke="${color}" stroke-width="${2 * strokeWidth}" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
<g transform="scale(0.9) translate(9, 8)">
<circle cx="80" cy="80" r="40" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity=".9"></circle>
<g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>
</g></svg>`;
    }

    static renderPlaceholder($element, color, strokeWidth) {
        $element.innerHTML = this.placeholder(color, strokeWidth);
    }

    static placeholderToDataUrl(color, strokeWidth) {
        return `data:image/svg+xml;base64,${this._btoa(this.placeholder(color, strokeWidth))}`;
    }

    static async image(text) {
        const dataUrl = await this.toDataUrl(text);
        const image = await this._loadImage(dataUrl);
        image.style.width = '100%';
        image.style.height = '100%';
        return image;
    }

    /* Private API */

    static async _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return this._$svg(await this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor));
    }

    static async _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {

        color = parseInt(color);
        backgroundColor = parseInt(backgroundColor);
        accentColor = parseInt(accentColor);

        if (color === backgroundColor)
            if (++color > 9) color = 0;

        while (accentColor === color || accentColor === backgroundColor)
            if (++accentColor > 9) accentColor = 0;

        color = this.colors[color];
        backgroundColor = this.backgroundColors[backgroundColor];
        accentColor = this.colors[accentColor];
        return `<g color="${color}" fill="${accentColor}">
<rect fill="${backgroundColor}" x="0" y="0" width="160" height="160"></rect>
<circle cx="80" cy="80" r="40" fill="${color}"></circle>
<g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>
${await this._generatePart('top', topNr)}
${await this._generatePart('side', sidesNr)}
${await this._generatePart('face', faceNr)}
${await this._generatePart('bottom', bottomNr)}
</g>`;
    }

    static _$svg(content) { // eslint-disable-line no-unused-vars
        const randomId = this._getRandomId();
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
<defs><clipPath id="hexagon-clip-${ randomId }" transform="scale(0.5) translate(0, 16)">
<path d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
</clipPath></defs>
<g clip-path="url(#hexagon-clip-${ randomId })">
${ content }
</g></svg>`;
    }

    static async _generatePart(part, index) {
        const assets = await this._getAssets();
        const selector = part + '_' + this._assetIndex(index, part);
        const $part = assets.getElementById(selector);
        if (!$part) return ''; // Required for catalog.html and as a safeguard
        return $part.innerHTML;
    }

    static _loadImage(dataUrl) {
        return new Promise((resolve, err) => { // eslint-disable-line no-unused-vars
            const img = document.createElement('img');
            img.addEventListener('load', e => resolve(img), { once: true }); // eslint-disable-line no-unused-vars
            img.src = dataUrl;
        });
    }

    static async _getAssets() {
        return this._assetsPromise || (this._assetsPromise = new Promise(async function (resolve) {
            let assetsText;
            if (typeof IqonsAssets !== 'undefined') assetsText = IqonsAssets; // Check for inlined assets
            else assetsText = await fetch(self.NIMIQ_IQONS_SVG_PATH || Iqons.svgPath)
                .then(response => response.text());

            if (typeof module !== 'undefined' && module.exports) global.DOMParser = require('dom-parser');

            const parser = new DOMParser();
            resolve(parser.parseFromString(assetsText, 'image/svg+xml'));
        }));
    }

    static _btoa(text) {
        if (typeof module !== 'undefined' && module.exports) return new Buffer(text).toString('base64');
        return btoa(text);
    }

    static get colors() {
        return [
            '#FC8702', // orange-600
            '#D94432', // red-700
            '#E9B213', // yellow-700
            '#1A5493', // indigo-600
            '#0582CA', // light-blue-500
            '#5961A8', // purple-600
            '#21bca5', // teal-500
            '#FA7268', // pink-300
            '#88B04B', // light-green-600
            '#795548', // brown-400
        ];
    }

    static get backgroundColors() {
        return [
            '#FC8702', // orange-600
            '#D94432', // red-700
            '#E9B213', // yellow-700
            '#1F2348', // indigo-600
            '#0582CA', // light-blue-500
            '#5F4B8B', // purple-600
            '#21bca5', // teal-500
            '#FA7268', // pink-300
            '#88B04B', // light-green-600
            '#795548', // brown-400
        ];
    }

    static get assetCounts() {
        return {
            'face': IqonsCatalog.face.length,
            'side': IqonsCatalog.side.length,
            'top': IqonsCatalog.top.length,
            'bottom': IqonsCatalog.bottom.length,
        }
    }

    static _assetIndex(index, part) {
        index = (Number(index) % this.assetCounts[part]) + 1;
        if (index < 10) index = '0' + index;
        return index
    }

    static _hash(text) {
        const fullHash = ('' + text
                .split('')
                .map(c => Number(c.charCodeAt(0)) + 3)
                .reduce((a, e) => a * (1 - a) * this.__chaosHash(e), 0.5))
            .split('')
            .reduce((a, e) => e + a, '');

        const hash = fullHash
            .replace('.', fullHash[5]) // Replace the dot as it cannot be parsed to int
            .substr(4, 17);

        // A small percentage of returned values are actually too short,
        // leading to an invalid bottom index and feature color. Adding
        // padding creates a bottom feature and accent color where no
        // existed previously, thus it's not a disrupting change.
        return Iqons._padEnd(hash, 13, fullHash[5]);
    }

    static __chaosHash(number) {
        const k = 3.569956786876;
        let a_n = 1 / number;
        for (let i = 0; i < 100; i++) {
            a_n = (1 - a_n) * a_n * k;
        }
        return a_n;
    }

    static _getRandomId() {
        return Math.floor(Math.random() * 256);
    }

    // Polyfill
    static _padEnd(string, maxLength, fillString) {
        if (!!String.prototype.padEnd) return string.padEnd(maxLength, fillString);
        else {
            while (string.length < maxLength) string += fillString;
            return string;
        }
    }
}

/* @asset(/libraries/iqons/dist/iqons.min.svg) */
Iqons.svgPath = '/libraries/iqons/dist/iqons.min.svg';
