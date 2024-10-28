import { tokenize } from './tokenize'

/**
 * Convert a string to kebab case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to kebab case.
 * @example toKebabCase('FOO_BAR', 'Baz') // 'foo-bar-baz'
 */
export function toKebabCase(...values: string[]): string {
  return values
    .flatMap(value => tokenize(value))
    .map(token => token.toLowerCase())
    .join('-')
}
