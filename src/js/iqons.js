class Iqons {

    /* Public API */

    static svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(this.colors[hash[0]], this.bgColors[hash[2]], hash[3] + hash[4], hash[5] + hash[6], hash[7] + hash[8], hash[9] + hash[10], this.accentColors[hash[11]]);
    }

    static render(text, $element) {
        $element.innerHTML = this.svg(text)
    }

    static toDataUrl(text) {
        return `data:image/svg+xml;base64,${btoa(this.svg(text))}`;
    }

    /* Private API */
    static _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return this._$svg(this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor));
    }

    static _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return `
            <g style="color:${color}; fill:${accentColor};">
                <rect fill="${backgroundColor}" x="0" y="0" width="160" height="160"></rect>
                <circle cx="80" cy="80" r="40" fill="${color}" stroke="black"></circle>
                ${this._$use('face',faceNr)}
                ${this._$use('top',topNr)}
                ${this._$use('side',sidesNr)}
                ${this._$use('bottom',bottomNr)}
            </g>`
    }

    static _$svg(content) {
        return `
            <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
                <clipPath id="hexagon-clip">
                    <path d="M88.1247411,2.6381084 L142.907644,34.2670322 C147.858061,37.125157 150.907644,42.4071893 150.907644,48.1234387 L150.907644,111.381286 C150.907644,117.097536 147.858061,122.379568 142.907644,125.237693 L88.1247411,156.866617 C83.1743239,159.724741 77.0751584,159.724741 72.1247411,156.866617 L17.3418381,125.237693 C12.3914209,122.379568 9.34183808,117.097536 9.34183808,111.381286 L9.34183808,48.1234387 C9.34183808,42.4071893 12.3914209,37.125157 17.3418381,34.2670322 L72.1247411,2.6381084 C77.0751584,-0.220016318 83.1743239,-0.220016318 88.1247411,2.6381084 Z" id="Polygon" stroke="#000000" fill="#000000" transform="translate(80.124741, 79.752363) rotate(30.000000) translate(-80.124741, -79.752363) "></path>
                </clipPath>
                <g clip-path="url(#hexagon-clip)"${content}</g>
            </svg>`
    }

    static _$use(part, index) {
        return `<use width="160" height="160" xlink:href="${location.origin}/iqons/dist/iqons.min.svg#${part}-${this._assetIndex(index,part)}"/>`;
    }

    static get colors() {
        return [
            '#ff9800', // orange-500
            '#E53935', // red-600
            '#FDD835', // yellow-600
            '#3f51b5', // indigo-500
            '#03a9f4', // light-blue-500
            '#9c27b0', // purple-500
            '#009688', // teal-500
            '#EC407A', // pink-400
            '#8bc34a', // light-green-500
            '#795548' // brown-500
        ]
    }

    static get bgColors() {
        return [
            /* Red  */
            '#FF8A80', // red-a100
            '#F48FB1', // pink-200
            '#ea80fc', // purple-a100

            /* Blue */
            '#8c9eff', // indigo-a100
            '#80d8ff', // light-blue-a100
            '#CFD8DC', // blue-grey-100

            /* Green */
            '#1DE9B6', // teal-a400
            '#00C853', // green-a-700

            /* Orange */
            '#FF9E80', // deep-orange-a100
            '#FFE57F' // amber-a100
        ]
    }

    static get accentColors() {
        return [
            '#ff9800', // orange-500
            '#E53935', // red-600
            '#FDD835', // yellow-600
            '#3f51b5', // indigo-500
            '#03a9f4', // light-blue-500
            '#9c27b0', // purple-500
            '#009688', // teal-500
            '#EC407A', // pink-400
            '#8bc34a', // light-green-500
            '#795548' // brown-500
        ]
    }
    static get assetCounts() {
        return {
            'face': 24,
            'side': 18,
            'top': 20,
            'bottom': 17
        }
    }

    static _assetIndex(index, part) { index = Number(index) % Iqons.assetCounts[part] + 1; return index }

    static _hash(text) {
        return ('' + text
                .split('')
                .map(c => Number(c.charCodeAt(0)) + 3)
                .reduce((a, e) => a * (1 - a) * this.__chaosHash(e), 0.5))
            .split('')
            .reduce((a, e) => e + a, '')
            .substr(4, 17);
    }

    static __chaosHash(number) {
        const k = 3.569956786876;
        let a_n = 1 / number;
        for (let i = 0; i < 100; i++) {
            a_n = (1 - a_n) * a_n * k;
        }
        return a_n;
    }
}