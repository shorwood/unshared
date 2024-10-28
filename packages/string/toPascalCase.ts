import { tokenize } from './tokenize'

/**
 * Convert a string to pascal case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to pascal case.
 * @example toConstantCase('FOO_BAR', 'Baz') // 'FooBarBaz'
 */
export function toPascalCase(...values: string[]): string {
  return values
    .flatMap(value => tokenize(value))
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join('')
}
