import { tokenize } from './tokenize'

/**
 * Convert a string to path case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to path case.
 * @example toPathCase('FOO_BAR', 'Baz') // 'foo/bar/baz'
 */
export function toPathCase(...values: string[]): string {
  return values
    .flatMap(value => tokenize(value))
    .map(token => token.toLowerCase())
    .join('/')
}
