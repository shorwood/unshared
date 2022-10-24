/**
  * Check if the string matches regex
  * @param value The value to check
  * @param regex The regex to match
  * @return `true` if string matches regex, `false` otherwise
  */
export const isStringMatching = (value: string, regex: string | RegExp): boolean => {
  // --- Handle edge cases
  if (typeof value !== 'string') return false
  if (typeof regex === 'string') regex = new RegExp(regex)
  if (!(regex instanceof RegExp)) return false

  // --- Check if string matches regex
  return regex.test(value)
}
