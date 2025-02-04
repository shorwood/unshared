/**
 * Checks if a string or character code is lower case. If the value is a string,
 * it must be a single character, otherwise an error is thrown.
 *
 * @param value The string or character code to check.
 * @returns `true` if the string or character code is lower case.
 * @example isLower('a') // true
 */
export function isLower(value: number | string): boolean {
  if (typeof value === 'string') value = value.codePointAt(0) ?? 0
  return value >= 97 && value <= 122
}
