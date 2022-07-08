/**
  * Check if the string is as long or longer than length
  * @param {string} value The value to check
  * @param {number} length The length to compare to
  * @returns {boolean} `true` if the string is as long or longer than length, `false` otherwise
  * @example
  * isStringLongerOrEq('foo', 3) // true
  * isStringLongerOrEq('foobar', 3) // true
  */
export const isStringLongerOrEq = (value: string, length: number): value is string =>
  typeof value === 'string'
  && typeof length === 'number'
  && value.length >= length
