import { isFunctionSkippable } from './isFunctionSkippable'

/**
 * Check if value is "truthy" extended to `Boolean`, arrays, objects an functions
 *
 * New non truthy values are:
 * - a Boolean with a value of `false`
 * - an empty array `[]`
 * - an empty object `{}`
 * - a skippable function: `() => {}`
 * @param value The value to check
 * @returns {boolean} `true` if value is truthy, `false` otherwise
 * @example
 * isTruthy(true) // true
 * isTruthy(new Boolean(false)) // false
 * isTruthy([]) // false
 * isTruthy({}) // false
 * isTruthy(() => {}) // false
 */
export const isTruthy = (value: any): boolean => {
  // --- If value is a Boolean, return value
  if (value instanceof Boolean) return value.valueOf()

  // --- If value is an array, return true if it is not empty
  if (Array.isArray(value)) return value.length > 0

  // --- If value is an object, return true if it is not empty
  if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0

  // --- If value is a function, return true if it is not empty
  if (typeof value === 'function') return !isFunctionSkippable(value)

  // --- Fallback to default behavior
  return !!value
}
