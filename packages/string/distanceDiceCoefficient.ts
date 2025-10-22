/**
 * Compute the [Dice coefficient](https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient)
 * distance between two strings. The Dice coefficient is a measure of
 * similarity between two strings based on bigrams (character pairs). The
 * higher the Dice coefficient for two strings is, the more similar the
 * strings are.
 *
 * @param a The first string.
 * @param b The second string.
 * @returns The Dice coefficient distance between the strings.
 * @example distanceDiceCoefficient('bar', 'baz') // 0.5
 */
export function distanceDiceCoefficient(a: string, b: string): number {

  // --- Early exit if the strings are equal.
  if (a === b) return 1

  // --- Early exit if either string is too short to have bigrams.
  const aLength = a.length
  const bLength = b.length
  if (aLength < 2 || bLength < 2) return 0

  // --- Create bigrams for the first string.
  const aBigrams = new Map<string, number>()
  let indexA; for (indexA = 0; indexA < aLength - 1; indexA++) {
    const bigram = a.slice(indexA, indexA + 2)
    const count = aBigrams.get(bigram) ?? 0
    aBigrams.set(bigram, count + 1)
  }

  // --- Count matching bigrams in the second string.
  let matches = 0
  let indexB; for (indexB = 0; indexB < bLength - 1; indexB++) {
    const bigram = b.slice(indexB, indexB + 2)
    const count = aBigrams.get(bigram) ?? 0
    if (count > 0) {
      aBigrams.set(bigram, count - 1)
      matches++
    }
  }

  // --- Calculate the Dice coefficient using the formula:
  // --- (2 * matches) / (total bigrams in both strings)
  const totalBigrams = (aLength - 1) + (bLength - 1)
  return (2 * matches) / totalBigrams
}
