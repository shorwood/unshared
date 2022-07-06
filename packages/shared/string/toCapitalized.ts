/**
 * Converts a string to capitalized case.
 * @param {string} value The string to convert
 * @returns {string} The converted string
 * @example
 * ```
 * toCamelCase('foo_bar') // returns 'Foo_bar'
 * toCamelCase('FOO_BAR') // returns 'Foo_bar'
 * ```
 */
export const toCapitalized = (value: string): string => {
  if (value.length === 0) return value
  if (value.length === 1) return value.toUpperCase()
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}
