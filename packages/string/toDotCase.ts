import { tokenize } from './tokenize'

/**
 * Convert a string to dot case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to dot case.
 * @example toDotCase('FOO_BAR', 'Baz') // 'foo.bar.baz'
 */
export function toDotCase(...values: string[]): string {
  return values
    .flatMap(value => tokenize(value))
    .map(token => token.toLowerCase())
    .join('.')
}
