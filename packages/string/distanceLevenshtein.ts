/**
 * Compute the [Levenshtein](https://en.wikipedia.org/wiki/Levenshtein_distance)
 * distance between two strings. The Levenshtein distance is a measure of
 * similarity between two strings. The higher the Levenshtein distance for
 * two strings is, the more different the strings are.
 *
 * @param a The first string.
 * @param b The second string.
 * @returns The Levenshtein distance between the strings.
 * @example distanceLevenshtein('bar', 'baz') // 1
 */
export function distanceLevenshtein(a: string, b: string): number {
  // --- Early exit if the strings are equal.
  if (a === b) return 0

  // --- Initialize a matrix of distances between substrings. This
  // --- matrix will be used to store the Levenshtein distance between
  // --- all positions of the two strings.
  const matrix = []
  let k; for (k = 0; k <= b.length; k++) matrix[k] = [k]
  let v; for (v = 0; v <= a.length; v++) matrix[0][v] = v

  // --- Compute the distance between all positions of the
  // --- two strings using the Levenshtein algorithm.
  for (k = 1; k <= b.length; k++) {
    for (v = 1; v <= a.length; v++) {
      const kChar = b.charAt(k - 1)
      const vChar = a.charAt(v - 1)

      // --- If the characters are equal, the distance is the same as
      // --- the distance between the substrings without the last
      // --- characters.
      if (kChar === vChar) {
        matrix[k][v] = matrix[k - 1][v - 1]
        continue
      }

      // --- If the characters are different, the distance is the
      // --- minimum distance between the substrings without the last
      // --- character plus one.
      const deletion = matrix[k - 1][v] + 1
      const insertion = matrix[k][v - 1] + 1
      const substitution = matrix[k - 1][v - 1] + 1
      matrix[k][v] = Math.min(deletion, insertion, substitution)

    }
  }

  // --- Return the last value of the matrix.
  return matrix[b.length][a.length]
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return the distance between two empty strings', () => {
    const result = distanceLevenshtein('', '')
    expect(result).toEqual(0)
  })

  it('should return the distance between Potato and Tomato', () => {
    const result = distanceLevenshtein('Potato', 'Tomato')
    expect(result).toEqual(2)
  })

  it('should return the distance between Sitting and Kitten', () => {
    const result = distanceLevenshtein('Sitting', 'Kitten')
    expect(result).toEqual(3)
  })

  it('should return the distance between Saturday and Sunday', () => {
    const result = distanceLevenshtein('Saturday', 'Sunday')
    expect(result).toEqual(3)
  })

  it('should return the distance between wikipedia and wikipédia', () => {
    const result = distanceLevenshtein('wikipedia', 'wikipédia')
    expect(result).toEqual(1)
  })

  it('should return the distance between Mississippi and Missouri', () => {
    const result = distanceLevenshtein('Mississippi', 'Missouri')
    expect(result).toEqual(6)
  })
}
