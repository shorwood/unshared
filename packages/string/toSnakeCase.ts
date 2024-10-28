import { tokenize } from './tokenize'

/**
 * Convert a string to snake case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to snake case.
 * @example toSnakeCase('FOO_BAR', 'Baz') // 'foo_bar_baz'
 */
export function toSnakeCase(...values: string[]): string {
  return values
    .flatMap(value => tokenize(value))
    .map(token => token.toLowerCase())
    .join('_')
}
