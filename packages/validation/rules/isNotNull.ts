/**
 * Check if value is not `null`.
 *
 * @param value The value to check
 * @returns `true` if value is not null, `false` otherwise
 * @example
 * isNotNull(0) // true
 * isNotNull(null) // false
 * isNotNull(undefined) // true
 */
export function isNotNull <T>(value: T): value is Exclude<T, null> {
  return value !== null
}
