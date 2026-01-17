import type { StringJoin } from '@unshared/types'

/**
 * Join all values in an array into a single string. This is a wrapper for the native
 * `Array.join()` but with a default separator of an empty string. It also allows for
 * a more functional style of programming.
 *
 * @param values The values to join.
 * @param separator The character to use as a separator.
 * @returns A single string containing all of the joined values separated by the separator
 * @example join(['a', 'b', 'c'], ',') // => 'a,b,c'
 */
export function join<T extends string[], S extends string = ''>(values: T, separator?: S): StringJoin<T, S>
export function join<T extends string[]>(values: T): StringJoin<T>
export function join(values: string[], separator = ''): string {
  return values.join(separator)
}
