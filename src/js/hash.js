export function makeHash(text) {
    const fullHash = ('' + text
            .split('')
            .map(c => Number(c.charCodeAt(0)) + 3)
            .reduce((a, e) => a * (1 - a) * __chaosHash(e), 0.5))
        .split('')
        .reduce((a, e) => e + a, '');

    const hash = fullHash
        .replace('.', fullHash[5]) // Replace the dot as it cannot be parsed to int
        .substr(4, 17);

    // The index 5 of `fullHash` is currently unused (index 1 of `hash`,
    // after cutting off the first 4 elements). Identicons.svg() is not using it.

    // A small percentage of returned values are actually too short,
    // leading to an invalid bottom index and feature color. Adding
    // padding creates a bottom feature and accent color where no
    // existed previously, thus it's not a disrupting change.
    return _padEnd(hash, 13, fullHash[5]);
}

function __chaosHash(number) {
    const k = 3.569956786876;
    let a_n = 1 / number;
    for (let i = 0; i < 100; i++) {
        a_n = (1 - a_n) * a_n * k;
    }
    return a_n;
}

// Polyfill
function _padEnd(string, maxLength, fillString) {
    if (!!String.prototype.padEnd) return string.padEnd(maxLength, fillString);
    else {
        while (string.length < maxLength) string += fillString;
        return string.substring(0, Math.max(string.length, maxLength));
    }
}
