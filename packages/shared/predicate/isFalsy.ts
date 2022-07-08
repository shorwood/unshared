import { isFunctionSkippable } from './isFunctionSkippable'

/**
 * Check if value is "falsy" extended to `Boolean`, arrays, objects an functions
 *
 * New falsy values are:
 * - a Boolean with a value of `false`
 * - an empty array `[]`
 * - an empty object `{}`
 * - a skippable function: `() => {}`
 * @param value The value to check
 * @returns {boolean} `true` if value is falsy, `false` otherwise
 * @example
 * isFalsy(false) // true
 * isFalsy(new Boolean(false)) // true
 * isFalsy([]) // true
 * isFalsy({}) // true
 * isFalsy(() => {}) // true
 */
export const isFalsy = (value: any): boolean => {
  // --- If value is a Boolean, return true if it is false
  if (value instanceof Boolean) return !value.valueOf()

  // --- If value is an array, return true if it is empty
  if (Array.isArray(value)) return value.length === 0

  // --- If value is an object, return true if it is empty
  if (typeof value === 'object' && value !== null) return Object.keys(value).length === 0

  // --- If value is a function, return true if it is empty
  if (typeof value === 'function') return isFunctionSkippable(value)

  // --- Fallback to default behavior
  return !value
}
