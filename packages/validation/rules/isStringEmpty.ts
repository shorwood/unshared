/**
 * Check if the string is empty
 *
 * @param value The value to check
 * @returns `true` if value is empty, `false` otherwise
 * @example
 * isStringEmpty('') // true
 * isStringEmpty('\n\n') // true
 * isStringEmpty('foo') // false
 */
export function isStringEmpty(value: string): value is '' {
  return typeof value === 'string'
  && value.trim().length === 0
}
