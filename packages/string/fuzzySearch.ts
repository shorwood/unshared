/**
 * Fuzzy search for a string in an array of strings.
 *
 * @param search The string to search for.
 * @param pool The array of strings to search in.
 */
export const fuzzySearch = (search: string, pool: string[]): string[] => {
  // --- Validate arguments.
  if (typeof search !== 'string')
    throw new TypeError('Expected search to be a string')
  if (!Array.isArray(pool))
    throw new TypeError('Expected pool to be an array of strings')

  // --- Search for matches.
  // --- Return the results.
  return pool
    .map((value, index) => {
      const score = fuzzyScore(search, value)
      return { value, index, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ value }) => value)
}
