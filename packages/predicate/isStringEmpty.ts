/**
 * Check if the string is empty
 * @param value The value to check
 * @return `true` if value is empty, `false` otherwise
 * @example
 * isStringEmpty('') // true
 * isStringEmpty('\n\n') // true
 * isStringEmpty('foo') // false
 */
export const isStringEmpty = (value: string): value is '' =>
  typeof value === 'string'
  && value.trim().length === 0
