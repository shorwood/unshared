/**
 * Check if value is an array
 * @param {any} value The value to check
 * @returns {boolean} `true` if value is an array, `false` otherwise
 * @example
 * isArray([]) // true
 * isArray({}) // false
 */
export const isArray = (value: any): value is any[] =>
  Array.isArray(value)
