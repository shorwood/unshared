import type { NumberInteger } from '@unshared/types'

/**
 * Split the string into an array of substrings using the specified delimiter. This
 * function is similar to `String.prototype.split` but has a few differences:
 *
 * - The `limit` parameter can be a negative number to limit the number of elements
 *   returned from the end of the string.
 *
 * - The empty string are filtered out by default. This means that `split('ab', 'a')`
 *   will return `['b']` instead of `['', 'b']`.
 *
 * - The `delimiter` parameter is defaulted to an empty string. This means that
 *   `split('a b')` will return `['a', 'b']` instead of `['a b']`.
 *
 * @param value The string to split.
 * @param delimiter The character to use as a separator.
 * @param limit A value used to limit the number of elements returned in the array.
 * @returns An array of substrings.
 * @example split('a,b,c', ',') // => ['a', 'b', 'c']
 */
export function split<N extends number>(value: string, delimiter: string | RegExp = '', limit?: NumberInteger<N>): string[] {
  return limit !== undefined && limit < 0
    ? value.split(delimiter).slice(limit).filter(Boolean)
    : value.split(delimiter, limit).filter(Boolean)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should split a string with empty delimiter', () => {
    const result = split('abc')
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should split a string with a delimiter', () => {
    const result = split('a,b,c', ',')
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should split a string with a limit', () => {
    const result = split('a,b,c', ',', 2)
    expect(result).toEqual(['a', 'b'])
  })

  it('should split a string with a negative limit', () => {
    const result = split('a,b,c', ',', -2)
    expect(result).toEqual(['b', 'c'])
  })

  it('should filter out empty strings', () => {
    const result = split('a,,b,c', ',')
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should expose a type error when the limit is not an integer', () => {
    // @ts-expect-error: invalid argument type.
    split('a,b,c', ',', 2.5)
  })
}
