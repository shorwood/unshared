import { toPascalCase } from './toPascalCase'

/**
 * Convert a string to camel case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string in camel case.
 * @example toCamelCase('FOO_BAR', 'Baz') // 'fooBarBaz'
 */
export function toCamelCase(...values: string[]): string {
  return toPascalCase(...values).replace(/^[A-Z]/, char => char.toLowerCase())
}
