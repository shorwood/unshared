import { tokenize } from './tokenize'

/**
 * Converts a string to snake case.
 * @param value The string to convert
 * @return The converted string
 * @example
 * ```
 * toCamelCase('foo_bar') // returns 'foo_bar'
 * toCamelCase('FOO_BAR') // returns 'foo_bar'
 * ```
 */
export const toSnakeCase = (value: string): string => tokenize(value)
  .map(token => token.toLowerCase())
  .join('_')
