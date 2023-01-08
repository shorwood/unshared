/**
 * Convert the first letter of a string to uppercase.
 * @param value The string to convert
 * @return The converted string
 * @example
 * capitalize('foo_bar') // returns 'Foo_bar'
 * capitalize('FOO_BAR') // returns 'FOO_BAR'
 */
export const capitalize = (value: string): string => {
  if (value.length === 0) return value
  if (value.length === 1) return value.toUpperCase()
  return value.charAt(0).toUpperCase() + value.slice(1)
}
