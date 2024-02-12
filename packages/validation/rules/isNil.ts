/**
 * Check if value is null or undefined
 *
 * @param value The value to check
 * @returns `true` if value is null or undefined, `false` otherwise
 * @example
 * isNil(0) // false
 * isNil(null) // true
 * isNil(undefined) // true
 */
export function isNil(value: any): value is null | undefined {
  return value === undefined
  || value === null
}
