/**
 * Join all values in an array into a single string
 * @param {string[]} values - The values to join
 * @param {string} separator - The character to use as a separator
 * @returns {string} A single string containing all of the joined values
 * @example
  * join(['one', 'two', 'three'], ' ') // => 'one two three'
 */
export const join = (values: string[], separator: string): string => values.join(separator)
