/* eslint-disable unicorn/prevent-abbreviations */
/**
 * Calculates the Levenshtein distance between two strings.
 *
 * @param a The first string.
 * @param b The second string.
 * @returns The Levenshtein distance between the strings.
 * @throws If `a` or `b` is not a string.
 * @example distance('foo', 'bar') // returns 3
 * @see https://en.wikipedia.org/wiki/Levenshtein_distance
 */
export function distanceLevenshtein(a: string, b: string): number {
  if (typeof a !== 'string')
    throw new TypeError('Expected a string')
  if (typeof b !== 'string')
    throw new TypeError('Expected a string')

  // --- Initialize the matrix.
  const matrix = []
  let i; for (i = 0; i <= b.length; i++)
    matrix[i] = [i]
  let j; for (j = 0; j <= a.length; j++)
    matrix[0][j] = j

  // --- Calculate the Levenshtein distance.
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
        ? matrix[i - 1][j - 1]
        : Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          ),
        )
    }
  }

  // --- Return the Levenshtein distance.
  return matrix[b.length][a.length]
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['', '', 0],
    ['Potato', 'Tomato', 2],
    ['Sitting', 'Kitten', 3],
    ['Saturday', 'Sunday', 3],
    ['wikipedia', 'wikipédia', 1],
    ['Algorithms', 'Algorithm', 1],
  ])('should return compare "%s" and "%s" and return %s', (a, b, expected) => {
    const result = distanceLevenshtein(a, b)
    expect(result).toEqual(expected)
  })

  it('should throw if a is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => distanceLevenshtein(1, 'bar')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if b is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => distanceLevenshtein('foo', 1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
