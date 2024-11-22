/**
 * Predicate to check if a value is an object-like value.
 *
 * @param value The value to check.
 * @returns `true` if the value is an object-like value, `false` otherwise.
 * @example isObjectLike({}) // true
 */
export function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && value.constructor === Object
}
