/**
 * Checks if a string or character code is upper case. If the value is a string,
 * it must be a single character, otherwise an error is thrown.
 *
 * @param value The string or character code to check.
 * @returns `true` if the string or character code is upper case.
 * @example isUpper('A'.charCodeAt(0)) // true
 */
export function isUpper(value: number): boolean {
  return value >= 65 && value <= 90
}
