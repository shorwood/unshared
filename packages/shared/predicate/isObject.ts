/**
 * Checks if the value is an object
 * @param value The value to check
 * @returns {boolean} `true` if value is an object, `false` otherwise
 * @example
 * isObject({}) // true
 * isObject([]) // false
 * isObject(null) // false
 */
export const isObject = (value: any): value is Record<string, any> =>
  typeof value === 'object'
  && value !== null
  && !Array.isArray(value)
