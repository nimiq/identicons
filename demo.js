window.NIMIQ_IDENTICONS_SVG_PATH = location.pathname.replace(/[^/]*$/, 'dist/identicons.min.svg');

import Identicons from './src/js/identicons.js';
import { name } from './src/js/name.js';

window.Identicons = Identicons;

function renderIdenticons(text) {
    document.querySelectorAll('.identicons:not(.small)').forEach((e, i) => Identicons.render(text + (i === 0 ? '' : i), e));

    // for testing render the small identicons as image
    document.querySelectorAll('.identicons.small').forEach((e, i) => Identicons.image(text + i)
        .then($img => {
            e.textContent = ''; // clear old content
            e.appendChild($img);
        }));
}

function renderWords(text) {
    document.getElementById('words-text').innerText = text ? name(text) : '';
}

const firstText = '' + Date.now();
renderIdenticons(firstText);
renderWords(firstText);

document.querySelector('#text-input').addEventListener('input', event => {
    renderIdenticons(event.target.value);
    renderWords(event.target.value);
});
