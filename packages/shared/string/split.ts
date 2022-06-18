/**
 * Split the string into an array of substrings
 * @param {string} value The string to split
 * @param {string | RegExp} separator A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.
 * @param {number} [limit] A value used to limit the number of elements returned in the array.
 * @returns {string[]} An array containing the substrings from the original string that are found at the start of the string and are separated by the specified separator string.
 * @example
  * split('a,b,c', ',') // => ['a', 'b', 'c']
  * split('a,b,c', ',', 2) // => ['a', 'b']
  * split('a,b,c', ',', -2) // => ['b', 'c']
 */
export const split = (value: string, separator: string | RegExp, limit?: number): string[] => {
  if (!limit) return value.split(separator)
  if (limit > 0) return value.split(separator, limit)
  return value.split(separator).slice(limit)
}
