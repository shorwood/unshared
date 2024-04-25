/**
 * Compute the [Jaro-Winkler](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance)
 * distance between two strings. The Jaro-Winkler distance is a measure of
 * similarity between two strings. The higher the Jaro-Winkler distance for
 * two strings is, the more similar the strings are.
 *
 * @param a The first string.
 * @param b The second string.
 * @returns The Jaro-Winkler distance between the strings.
 * @example distanceJaroWinkler('bar', 'baz') // 0.822
 */
export function distanceJaroWinkler(a: string, b: string): number {

  // --- Early exit if the strings are equal.
  if (a === b) return 1

  // --- Determining the length of each string
  const aLength = a.length
  const bLength = b.length
  const maxDistance = Math.floor(Math.max(aLength, bLength) / 2) - 1

  // --- Create the match arrays for both strings.
  const aMatches = Array.from({ length: aLength })
  const bMatches = Array.from({ length: bLength })

  // --- Find the number of matching characters between the strings.
  // --- For each character in the first string, check if there is a match
  // --- in the second string. If there is, increment the match count and
  // --- mark the character in both strings as matched.
  let matches = 0
  let transpositions = 0
  let indexA; for (indexA = 0; indexA < aLength; indexA++) {
    const start = Math.max(0, indexA - maxDistance)
    const end = Math.min(indexA + maxDistance + 1, bLength)
    let indexB; for (indexB = start; indexB < end; indexB++) {
      if (bMatches[indexB]) continue
      if (a[indexA] !== b[indexB]) continue
      aMatches[indexA] = true
      bMatches[indexB] = true
      matches++
      break
    }
  }

  // --- If there are no matches, return 0.
  if (matches === 0) return 0

  // --- Find the number of transpositions between the strings.
  // --- A transposition is when two characters match but are not in the
  // --- same position in both strings. For each matched character in the
  // --- first string, check if there is a matched character in the second
  // --- string that is not in the same position. If there is, increment
  // --- the transposition count.
  let k; for (indexA = 0, k = 0; indexA < aLength; indexA++) {
    if (!aMatches[indexA]) continue
    while (!bMatches[k]) k++
    if (a[indexA] !== b[k]) transpositions++
    k++
  }

  // --- Calculate the prefix length. The prefix length is the number of
  // --- characters at the start of the string that match exactly.
  let prefix = 0
  const prefixLength = Math.min(aLength, bLength, 4)
  for (indexA = 0; indexA < prefixLength; indexA++) {
    if (a[indexA] === b[indexA]) prefix++
    else break
  }

  // --- Calculate the distance using the Jaro-Winkler formula.
  const scoreMatchA = matches / aLength
  const scoreMatchB = matches / bLength
  const scoreTransposition = ((matches - (transpositions / 2)) / matches)
  const scoreDistance = (scoreMatchA + scoreMatchB + scoreTransposition) / 3
  const scorePrefix = prefix * 0.1 * (1 - scoreDistance)
  return scoreDistance + scorePrefix
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return the distance between two empty strings', () => {
    const result = distanceJaroWinkler('', '')
    expect(result).toBe(1)
  })

  test('should return the distance between Potato and Tomato', () => {
    const result = distanceJaroWinkler('Potato', 'Tomato')
    expect(result).toStrictEqual(0.6944444444444443)
  })

  test('should return the distance between Sitting and Kitten', () => {
    const result = distanceJaroWinkler('Sitting', 'Kitten')
    expect(result).toStrictEqual(0.746031746031746)
  })

  test('should return the distance between Saturday and Sunday', () => {
    const result = distanceJaroWinkler('Saturday', 'Sunday')
    expect(result).toStrictEqual(0.7475)
  })

  test('should return the distance between wikipedia and wikipédia', () => {
    const result = distanceJaroWinkler('wikipedia', 'wikipédia')
    expect(result).toStrictEqual(0.9555555555555556)
  })

  test('should return the distance between Mississippi and Missouri', () => {
    const result = distanceJaroWinkler('Mississippi', 'Missouri')
    expect(result).toStrictEqual(0.8159090909090909)
  })
}
