/**
 * Check if the string matches regex
 *
 * @param value The value to check
 * @param regex The regex to match
 * @returns `true` if string matches regex, `false` otherwise
 */
export function isStringMatching(value: string, regex: RegExp | string): boolean {
  // --- Handle edge cases
  if (typeof value !== 'string') return false
  if (typeof regex === 'string') regex = new RegExp(regex)
  if (!(regex instanceof RegExp)) return false

  // --- Check if string matches regex
  return regex.test(value)
}
