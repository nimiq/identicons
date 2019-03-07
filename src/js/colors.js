export function hashToRGB(main, background, accent) {
    return entropyToRGB(hashToIndices(main, background, accent));
}

export function hashToIndices(main, background, accent) {
    main = parseInt(main);
    background = parseInt(background);
    accent = parseInt(accent);

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

export function entropyToRGB(entropy) {
    return {
        main: colors[entropy.main],
        background: backgroundColors[entropy.background],
        accent: colors[entropy.accent]
    };
}

export const colors = [
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

export const backgroundColors = [
    '#FC8702', // orange-600
    '#D94432', // red-700
    '#E9B213', // yellow-700
    '#1F2348', //
    '#0582CA', // light-blue-500
    '#5F4B8B', //
    '#21bca5', // teal-500
    '#FA7268', // pink-300
    '#88B04B', // light-green-600
    '#795548', // brown-400
];
