// Generate a word description of the Nimiqon
// Returns: [oneLineString, twoLineString]
export function words(text) {
    const hash1 = Iqons._hash(text);
    const hash2 = Iqons._hash(hash1);

    return wordsByEntropy(
        hash1[3]  + hash1[4],  // face
        hash1[5]  + hash1[6],  // top
        hash1[7]  + hash1[8],  // side
        hash1[9]  + hash1[10], // bottom
        hash2[0]  + hash1[0],  // entropy 1
        hash2[1]  + hash2[2],  // entropy 2
        hash1[0], // color
        hash1[2], // backgroundColor
        hash1[11] // accentColor
    );
}

// Generate a nice tuple of (adjective, verb, noun) describing the Nimiqon.
//  - The *Nr are indices of word families/modifiers (see catalog.html)
//  - featureSelectors decides which feature (face, top, side, bottom) is included as which word type
//  - wordsVariation   decides which variation of the max 27 legal tuples is chosen
// Returns: [oneLineString, twoLineString] by calling _wordRound until it succeeds
export function wordsByEntropy(faceNr, topNr, sidesNr, bottomNr, featureSelectors, wordsVariation, color, bgColor, accentColor) {
    featureSelectors = Number(featureSelectors);
    wordsVariation   = Number(wordsVariation);

    const colorIndices = hashToIndices(color, bgColor, accentColor);
    const mainColor = colorIndices.main;

    let i;
    for (i = 0; i < 100; i++) {
        const _e1 = featureSelectors + i;
        const result = _wordRound(faceNr, topNr, sidesNr, bottomNr, _e1, wordsVariation, mainColor);
        if (result) return [...result, i];
    }

    return ["Rare Shiny Bug", "Rare\nShiny Bug", 100];
}

// Returns: [oneLineString, twoLineString, iterations] or null
// oneLineString: Words in one line
// twoLineString: Words in two lines
// iterations: (Debug only) Iterations needed to build words
function _wordRound(faceNr, topNr, sidesNr, bottomNr, featureSelectors, wordsVariation, mainColor) {
    // Each word family consists of nine entries,
    //   indices 0-3 are adjectives,
    //   indices 3-6 are verbs,
    //   indices 6-9 are nouns
    const _adjectives = a => a.slice(0, 3);
    const _verbs      = a => a.slice(3, 6);
    const _nouns      = a => a.slice(6, 9);

    // Build array of all possible word lists
    //   (string[9])[4]
    // The catalog contains four of five features: Faces, Tops, Sides and Bottoms.
    // The fifth feature is the body color of the Iqon, which is not using synonyms.
    // Each feature has a list of 21 word families.
    // We select the same word families as shown in the identicon.
    const wordLists = [
        IqonsCatalog["face"  ][faceNr   % 21],
        IqonsCatalog["top"   ][topNr    % 21],
        IqonsCatalog["side"  ][sidesNr  % 21],
        IqonsCatalog["bottom"][bottomNr % 21]
    ];

    // We have four features, but we want only three words to describe them.
    // The order of the three words must be: adjective, verb, noun.
    // That leaves us with
    const _idx2 =  featureSelectors           % 2;
    const _idx1 = (featureSelectors / 2 | 0) % 3;
    const _idx0 = (featureSelectors / 6 | 0) % 5;

    // Build array of synonyms
    //   string[3][3]
    const features = [];

    // Get features by order from featureSelectors
    //   features[0]: 3 adjectives or color
    const useColor = _idx0 == 4;
    if (useColor) {
        features.push(IqonsCatalog.color[mainColor]);
    } else {
        features.push(_adjectives(wordLists[_idx0]));
        wordLists.splice(_idx0, 1);
    }
    //   features[1]: 3 verbs
    features.push(_verbs(wordLists[_idx1]));
    wordLists.splice(_idx1, 1);
    //   features[2]: 3 nouns
    features.push(_nouns(wordLists[_idx2]));

    // Permute features to combinations
    // Get each possible (adjective, verb, noun) tuple
    //   (string[3])[27]
    const combinations = [];
    for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) {
        if (useColor)
            combinations.push([features[0], features[1][j], features[2][k]]);
        else for (let i = 0; i < 3; i++)
            combinations.push([features[0][i], features[1][j], features[2][k]]);
    }

    const dim = WordsDimension;

    // Clean out illegal combinations
    //   (string[3])[<=27]
    const cleaned = [];
    for (const combo of combinations) {
        // Rule 1: Any two words must be <75px (space is 1px)
        const line1 = dim[combo[0]] + 1 + dim[combo[1]];
        const line2 = dim[combo[1]] + 1 + dim[combo[2]];
        if (line1 >= 75 && line2 >= 75)
            continue;

        // Rule 2: Max name width must be <125px (spaces are 2px)
        const line = dim[combo[0]] + 1 + dim[combo[1]] + 1 + dim[combo[2]];
        if (line >= 125)
            continue;

        // TODO Rule 3: One word must contain less than 3 syllables
        cleaned.push(combo);
    }

    // No fitting combination
    if (cleaned.length === 0)
        return null;

    // Finally, choose one combination with wordsVariation
    wordsVariation %= cleaned.length;
    const tuple = cleaned[wordsVariation];

    // Format the three strings in two ways:
    // 1. one line with three words
    const threeLine = tuple.join(" ");
    // 2. two lines, minimum total width
    let twoLine;
    const line1 = dim[tuple[0]] + dim[tuple[1]];
    const line2 = dim[tuple[1]] + dim[tuple[2]];
    if (line1 < line2)
        twoLine = `${tuple[0]} ${tuple[1]}\n${tuple[2]}`;
    else
        twoLine = `${tuple[0]}\n${tuple[1]} ${tuple[2]}`;

    // phew
    return [threeLine, twoLine];
}
