/**
 * Check if value is an array
 *
 * @param value The value to check
 * @returns `true` if value is an array, `false` otherwise
 * @example
 * isArray([]) // true
 * isArray({}) // false
 */
export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value)
