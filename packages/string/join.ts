/**
 * Join all values in an array into a single string
 * @param values - The values to join
 * @param separator - The character to use as a separator
 * @return A single string containing all of the joined values
 * @example
  * join(['one', 'two', 'three'], ' ') // => 'one two three'
 */
export const join = (values: string[], separator: string): string => values.join(separator)
