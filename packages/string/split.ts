/* eslint-disable sonarjs/argument-type */
import type { NumberInteger } from '@unshared/types'

/**
 * Split the string into an array of substrings using the specified delimiter. This
 * function is similar to `String.prototype.split` but has a few differences:
 *
 * - The `limit` parameter can be a negative number to limit the number of elements
 * returned from the end of the string.
 *
 * - The empty string are filtered out by default. This means that `split('ab', 'a')`
 * will return `['b']` instead of `['', 'b']`.
 *
 * - The `delimiter` parameter is defaulted to a comma. This means that `split('a,b')`
 * will return `['a', 'b']` instead of `['a b']`.
 *
 * @param value The string to split.
 * @param delimiter The character to use as a separator.
 * @param limit A value used to limit the number of elements returned in the array.
 * @returns An array of substrings.
 * @example split('a b c') // => ['a', 'b', 'c']
 */
export function split<N extends number>(value: string, delimiter: RegExp | string = ',', limit?: NumberInteger<N>): string[] {
  return limit !== undefined && limit < 0
    ? value.split(delimiter).slice(limit).filter(Boolean)
    : value.split(delimiter, limit).filter(Boolean)
}
