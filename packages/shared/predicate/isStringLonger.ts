/**
  * Check if the string is longer than length
  * @param {string} value The value to check
  * @param {number} length The length to compare to
  * @returns {boolean} `true` if the string is longer than length, `false` otherwise
  * @example
  * isStringLonger('foo', 3) // false
  * isStringLonger('foobar', 3) // true
  */
export const isStringLonger = (value: string, length: number): value is string =>
  typeof value === 'string'
  && typeof length === 'number'
  && value.length > length
