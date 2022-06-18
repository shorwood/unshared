import { tokenize } from './tokenize'

/**
 * Converts a string to camel case.
 * @param {string} value The string to convert
 * @returns {string} The converted string
 * @example
 * ```
 * toCamelCase('foo_bar') // returns 'fooBar'
 * toCamelCase('FOO_BAR') // returns 'fooBar'
 * ```
 */
export const toCamelCase = (value: string): string => tokenize(value)
  .map((token, index) => {
    if (index === 0) return token.toLowerCase()
    return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
  })
  .join('')
