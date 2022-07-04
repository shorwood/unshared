
// TODO: Implement `get` path iterator
// TODO: Rename `uniqBy` with `unique`
// TODO: Merge `uniqueBy` and `unique`

/**
 * Returns a new array containing only unique items, based on a given key.
 * @param {Array<T>} array The array to filter
 * @param {keyof T} key The key to use for filtering
 * @returns {Array<T>} The filtered array
 */
export const uniqBy = <T>(array: Array<T>, key: keyof T): Array<T> => {
  const seen: Set<T> = new Set()
  const result: Array<T> = []

  // --- Pick unseen elements.
  for (const item of array) {
    if (!seen.has(<any>item[key])) {
      seen.add(<any>item[key])
      result.push(item)
    }
  }

  // --- Return unique results.
  return result
}
