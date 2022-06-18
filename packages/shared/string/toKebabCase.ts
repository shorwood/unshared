import { tokenize } from './tokenize'

/**
 * Converts a string to kebab case.
 * @param {string} value The string to convert
 * @returns {string} The converted string
 * @example
 * ```
 * toCamelCase('foo_bar') // returns 'foo-bar'
 * toCamelCase('FOO_BAR') // returns 'foo-bar'
 * ```
 */
export const toKebabCase = (value: string): string => tokenize(value)
  .map(token => token.toLowerCase())
  .join('-')
