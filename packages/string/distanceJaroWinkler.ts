/**
 * Calculates the Jaro-Winkler distance between two strings.
 *
 * @param a The first string.
 * @param b The second string.
 * @returns The Jaro-Winkler distance between the strings.
 * @throws If `a` or `b` is not a string.
 * @example distance('foo', 'bar') // returns 0.3333333333333333
 * @see https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
 */
export function distanceJaroWinkler(a: string, b: string): number {
  if (typeof a !== 'string')
    throw new TypeError('Expected a string')
  if (typeof b !== 'string')
    throw new TypeError('Expected a string')

  // --- Calculate the Jaro distance.
  const aLength = a.length
  const bLength = b.length
  const maxDistance = Math.floor(Math.max(aLength, bLength) / 2) - 1
  const aMatches = new Array(aLength)
  const bMatches = new Array(bLength)
  let matches = 0
  let transpositions = 0
  let index; for (index = 0; index < aLength; index++) {
    const start = Math.max(0, index - maxDistance)
    const end = Math.min(index + maxDistance + 1, bLength)
    let index_; for (index_ = start; index_ < end; index_++) {
      if (bMatches[index_])
        continue
      if (a[index] !== b[index_])
        continue
      aMatches[index] = true
      bMatches[index_] = true
      matches++
      break
    }
  }
  if (matches === 0)
    return 0
  let k; for (index = 0, k = 0; index < aLength; index++) {
    if (!aMatches[index])
      continue
    while (!bMatches[k])
      k++
    if (a[index] !== b[k])
      transpositions++
    k++
  }
  const distance = (
    (matches / aLength)
    + (matches / bLength)
    + ((matches - (transpositions / 2)) / matches)
  ) / 3

  // --- Calculate the Jaro-Winkler distance.
  const prefixLength = Math.min(
    aLength,
    bLength,
    4,
  )
  let prefix = 0
  for (index = 0; index < prefixLength; index++) {
    if (a[index] === b[index])
      prefix++
    else
      break
  }
  return distance + (prefix * 0.1 * (1 - distance))
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['', '', 0],
    ['Potato', 'Tomato', 0.6944444444444443],
    ['Sitting', 'Kitten', 0.7475],
    ['Saturday', 'Sunday', 0.5],
    ['wikipedia', 'wikipédia', 0.5],
    ['Mississippi', 'Missouri', 0.365],
  ])('should return compare "%s" and "%s" and return %s', (a, b, expected) => {
    const result = distanceJaroWinkler(a, b)
    expect(result).toEqual(expected)
  })

  it('should throw if a is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => distanceJaroWinkler(1, 'bar')
    expect(shouldThrow).toThrow(TypeError)
  })
}
