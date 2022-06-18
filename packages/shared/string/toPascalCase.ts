import { tokenize } from './tokenize'

/**
 * Converts a string to pascal case.
 * @param {string} value The string to convert
 * @returns {string} The converted string
 * @example
 * ```
 * toCamelCase('foo_bar') // returns 'FooBar'
 * toCamelCase('FOO_BAR') // returns 'FooBar'
 * ```
 */
export const toPascalCase = (value: string): string => tokenize(value)
  .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
  .join('')
