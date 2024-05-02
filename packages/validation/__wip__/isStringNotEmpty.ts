/**
 * Check if the string is not empty
 *
 * @param value The value to check
 * @returns `true` if value is not empty, `false` otherwise
 * @example
 * isStringNotEmpty('foo') // true
 * isStringNotEmpty('\n\n') // false
 */
export function isStringNotEmpty(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0
}
