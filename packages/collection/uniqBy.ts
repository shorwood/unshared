
// TODO: Implement `get` path iterator
// TODO: Rename `uniqBy` with `unique`
// TODO: Merge `uniqueBy` and `unique`

/**
 * Returns a new array containing only unique items, based on a given key.
 *
 * @param array The array to filter
 * @param key The key to use for filtering
 * @returns The filtered array
 */
export function uniqBy <T>(array: T[], key: keyof T): T[] {
  const seen = new Set<T>()
  const result: T[] = []

  // --- Pick unseen elements.
  for (const item of array) {
    if (!seen.has((item[key] as any))) {
      seen.add((item[key] as any))
      result.push(item)
    }
  }

  // --- Return unique results.
  return result
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('returns a new array containing only unique items, based on a given key', () => {
    const input = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'John' },
    ]
    const expected = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]
    expect(uniqBy(input, 'name')).toEqual(expected)
  })
}
