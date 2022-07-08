/**
  * Check if the string is shorter than length
  * @param {string} value The value to check
  * @param {number} length The length to compare to
  * @returns {boolean} `true` if the string is shorter than length, `false` otherwise
  * @example
  * isStringShorter('foo', 6) // true
  * isStringShorter('foobar', 6) // false
  */
export const isStringShorter = (value: string, length: number): boolean =>
  typeof value === 'string'
  && typeof length === 'number'
  && value.length < length
