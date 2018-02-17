class Iqons {

    /* Public API */

    static svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(hash[0], hash[2], hash[3] + hash[4], hash[5] + hash[6], hash[7] + hash[8], hash[9] + hash[10], hash[11], hash[12]);
    }

    static render(text, $element) {
        $element.innerHTML = this.svg(text)
    }

    static toDataUrl(text) {
        return `data:image/svg+xml;base64,${btoa(this.svg(text))}`;
    }

    /* Private API */
    static _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor, gaze) {
        return this._$svg(this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor), gaze);
    }

    static _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor, gaze) {
        color = this.colors[color];
        backgroundColor = this.bgColors[backgroundColor];
        accentColor = this.accentColors[accentColor];
        return `
            <g style="color:${color}; fill:${accentColor};">
                <rect fill="${backgroundColor}" x="0" y="0" width="160" height="160"></rect>
                <circle cx="80" cy="80" r="40" fill="${color}"></circle>
                <use width="160" height="160" xlink:href="/libraries/iqons/dist/iqons.min.svg#facebg"/>
                ${this._$use('face',faceNr)}
                ${this._$use('top',topNr)}
                ${this._$use('bottom',bottomNr)}
                ${this._$use('side',sidesNr)}
            </g>`
    }

    static _$svg(content, gaze) {
        return `
            <svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
                <defs>
                    <clipPath id="hexagon-clip" transform="scale(0.5) translate(0, 16)">
                        <path d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
                    </clipPath>
                    <!--<filter id="gaussian-blur" >
                      <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blurOut" />
                      <feOffset in="blurOut" dx="1" dy="3" result="offsetBlur" />
                      <feFlood flood-color="#333" flood-opacity="0.71" result="offsetColor"/>
                      <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur"/>
                      <feBlend in="SourceGraphic" in2="offsetBlur" mode="normal" />
                    </filter>-->
                </defs>
                <path fill="white" transform="scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
                <g transform="scale(0.9) translate(9, 0)" <!--filter="url(#gaussian-blur)"-->>
                    <g ${this._$flip(gaze)} clip-path="url(#hexagon-clip)">
                        ${content}
                    </g>
                </g>
            </svg>`
    }

    static _$use(part, index) {
        return `<use width="160" height="160" xlink:href="/libraries/iqons/dist/iqons.min.svg#${part}_${this._assetIndex(index,part)}"/>`;
    }

    static _$flip(gaze) {
        const doFlip = this._assetIndex(gaze, 'gaze') - 1;
        if (!doFlip) return '';
        // return 'transform-origin="center center" transform="scale(-1,1)"'
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
        ];
        return [
            /* Red  */
            '#c62828', // red-a800
            '#ec407a', // pink-400
            '#6a1b9a', // purple-a900

            /* Blue */
            '#3d5afe', // indigo-a400
            '#00b0ff', // light-blue-a400
            '#00e5ff', // cyan-a400

            /* Green */
            '#1DE9B6', // teal-a400
            '#00C853', // green-a700

            /* Orange */
            '#dd2c00', // deep-orange-a700
            '#ff6f00' // amber-900
        ];
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
            'face': IqonsCatalog.face.length,
            'side': IqonsCatalog.side.length,
            'top': IqonsCatalog.top.length,
            'bottom': IqonsCatalog.bottom.length,
            'gaze': 2
        }
    }

    static _assetIndex(index, part) {
        index = (Number(index) % Iqons.assetCounts[part]) + 1;
        if (index < 10) index = '0' + index;
        return index
    }

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