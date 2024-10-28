import { tokenize } from './tokenize'

/**
 * Convert a string to constant case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to constant case.
 * @example toConstantCase('FOO_BAR', 'Baz') // 'FOO_BAR_BAZ'
 */
export function toConstantCase(...values: string[]): string {
  return values
    .flatMap(value => tokenize(value))
    .map(token => token.toUpperCase())
    .join('_')
}
