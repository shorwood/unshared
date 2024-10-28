/**
 * Checks if a string or character code is lower case. If the value is a string,
 * it must be a single character, otherwise an error is thrown.
 *
 * @param value The string or character code to check.
 * @returns `true` if the string or character code is lower case.
 * @example isLower('a'.charCodeAt(0)) // true
 */
export function isLower(value: number): boolean {
  return value >= 97 && value <= 122
}
