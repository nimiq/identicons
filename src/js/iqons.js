class Iqons {

    /* Public API */

    static svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(this.colors[hash[0]], this.bgColors[hash[1]], hash[2], hash[3], hash[4], hash[5], hash[6]);
    }

    static render(text, $element) {
        $element.innerHTML = this.svg(text)
    }

    static toDataUrl(text) {
        return `data:image/svg+xml;base64,${btoa(this.svg(text))}`;
    }

    /* Private API */
    static _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr) {
        return this._$svg(this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr));
    }

    static _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr) {
        return `
            <g style="color:${color}">
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
                    <path d="M126.98 8.63l32.07 55.56a16 16 0 0 1 0 16l-32.07 55.56a16 16 0 0 1-13.86 8H48.97a16 16 0 0 1-13.86-8L3.04 80.19a16 16 0 0 1 0-16L35.1 8.63a16 16 0 0 1 13.86-8h64.15a16 16 0 0 1 13.86 8z" fill-rule="evenodd"/>
                </clipPath>
                <g clip-path="url(#hexagon-clip)"${content}</g>
            </svg>`
    }

    static _$use(part, index) {
        return `<use width="160" height="160" xlink:href="${location.origin}/iqons/dist/iqons.min.svg#${part}-${this._assetIndex(index)}" />`;
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

    static _assetIndex(index) { index = Number(index) % 4  + 1; return index  }

    static _hash(text) {
        return ('' + text
                .split('')
                .map(c => Number(c.charCodeAt(0)) + 3)
                .reduce((a, e) => a * (1 - a) * this.__chaosHash(e), 0.5))
            .split('')
            .reduce((a, e) => e + a, '')
            .substr(4, 10);
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