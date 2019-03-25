// removeIf(production)
import { makeHash } from './hash.js';
import { colorNames } from './color-names.js';
// endRemoveIf(production)

export function hashToRGB(main, background, accent) {
    return indicesToRGB(hashToIndices(main, background, accent));
}

export function hashToIndices(main, background, accent) {
    main = parseInt(main, 10);
    background = parseInt(background, 10);
    accent = parseInt(accent, 10);

    if (main === background)
        if (++main > 9) main = 0;

    while (accent === main || accent === background)
        if (++accent > 9) accent = 0;

    return {
        main: main,
        background: background,
        accent: accent
    };
}

function indicesToRGB(indices) {
    return {
        main: colors[indices.main],
        background: backgroundColors[indices.background],
        accent: colors[indices.accent]
    };
}

export function getBackgroundColorName(text) {
    const hash = makeHash(text);
    const index = parseInt(hash[2], 10);
    return colorNames[index];
}

export const colors = [
    '#FC8702', // orange-600
    '#D94432', // red-700
    '#E9B213', // yellow-700
    '#1A5493', // indigo-600
    '#0582CA', // light-blue-500
    '#5961A8', // purple-600
    '#21BCA5', // teal-500
    '#FA7268', // pink-300
    '#88B04B', // light-green-600
    '#795548', // brown-400
];

export const backgroundColors = [
    '#FC8702', // orange-600
    '#D94432', // red-700
    '#E9B213', // yellow-700
    '#1F2348', //
    '#0582CA', // light-blue-500
    '#5F4B8B', //
    '#21BCA5', // teal-500
    '#FA7268', // pink-300
    '#88B04B', // light-green-600
    '#795548', // brown-400
];
