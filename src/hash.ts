export function makeHash(input: string): string {
  const fullHash = [...input]
    .map(c => c.charCodeAt(0) + 3)
    .reduce((a, e) => a * (1 - a) * chaosHash(e), 0.5)
    .toString(10)
    .split('')
    .reduce((a, e) => e + a, '')

  const hash = fullHash
    .replace('.', fullHash[5]) // Replace the dot as it cannot be parsed to int
    .slice(4, 21) // Changed from (4, 17) to (4, 21) to match legacy behavior

  // The index 5 of `fullHash` is currently unused (index 1 of `hash`,
  // after cutting off the first 4 elements). Identicons.svg() is not using it.

  // A small percentage of returned values are actually too short,
  // leading to an invalid bottom index and feature color. Adding
  // padding creates a bottom feature and accent color where no
  // existed previously, thus it's not a disrupting change.
  return hash.padEnd(13, fullHash[5])
}

function chaosHash(number: number): number {
  const k = 3.569956786876
  let a_n = 1 / number
  for (let i = 0; i < 100; i++)
    a_n = (1 - a_n) * a_n * k
  return a_n
}
