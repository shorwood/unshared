/**
 * Check if value is a boolean or a `Boolean` object
 * @param value The value to check
 * @returns {boolean} `true` if value is a boolean or a `Boolean` object
 * @example
 * isBoolean(1) // false
 * isBoolean(true) // true
 * isBoolean('true') // false
 * isBoolean(new Boolean(true)) // true
 */
export const isBoolean = (value: any): value is boolean =>
  typeof value === 'boolean'
  || value instanceof Boolean
