window.NIMIQ_IQONS_SVG_PATH = location.pathname.replace(/[^/]*$/, 'dist/iqons.min.svg');

import Iqons from './src/js/iqons.js';
import { words } from './src/js/words.js';

window.Iqons = Iqons;

function renderIdenticons(text) {
    document.querySelectorAll('.iqons:not(.small)').forEach((e, i) => Iqons.render(text + (i === 0 ? '' : i), e));

    // for testing render the small iqons as image
    document.querySelectorAll('.iqons.small').forEach((e, i) => Iqons.image(text + i)
        .then($img => {
            e.textContent = ''; // clear old content
            e.appendChild($img);
        }));
}

function renderWords(text) {
    document.getElementById('words-text').innerText = text ? words(text)[1] : '';
}

const firstText = '' + Date.now();
renderIdenticons(firstText);
renderWords(firstText);

document.querySelector('#text-input').addEventListener('input', event => {
    renderIdenticons(event.target.value);
    renderWords(event.target.value);
});
