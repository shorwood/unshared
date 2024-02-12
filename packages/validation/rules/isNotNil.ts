/**
 * Check if value is not `null` and not `undefined`
 *
 * @param value The value to check
 * @returns `true` if value is not `null` and not `undefined`, `false` otherwise
 * @example
 * isNotNil(0) // true
 * isNotNil(null) // false
 * isNotNil(undefined) // false
 */
export function isNotNil <T>(value: T): value is Exclude<T, null | undefined> {
  return value !== undefined
  && value !== null
}
