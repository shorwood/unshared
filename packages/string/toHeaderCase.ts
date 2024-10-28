import { tokenize } from './tokenize'

/**
 * Convert a string to header case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to header case.
 * @example toHeaderCase('FOO_BAR', 'Baz') // 'Foo-Bar-Baz'
 */
export function toHeaderCase(...values: string[]): string {
  return values
    .flatMap(value => tokenize(value))
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join('-')
}
