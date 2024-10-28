import { deburr } from './deburr'
import { toKebabCase } from './toKebabCase'

/**
 * Convert a string to a slug-like string. This function is similar to kebab-case
 * but it also deburrs (removes diacritics) from the string.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to slug-like string.
 * @example toHeaderCase('FOO_BAR', 'Bâz') // 'foo-bar-baz'
 */
export function toSlug(...values: string[]): string {
  const valuesDeburred = values.map(value => deburr(value))
  return toKebabCase(...valuesDeburred)
}
