import { NumberInteger } from '@unshared/types'

/**
 * Split the string into an array of substrings using the specified delimiter. The
 * main difference between this function and the native `String.prototype.split` is
 * that this function supports negative limits. Meaning that you can use a negative
 * limit to get the last N elements of the string.
 *
 * @param value The string to split.
 * @param delimiter The character to use as a separator.
 * @param limit A value used to limit the number of elements returned in the array.
 * @returns An array of substrings.
 * @example split('a,b,c', ',') // => ['a', 'b', 'c']
 */
export function split<N extends number = number>(value: string, delimiter: string | RegExp, limit?: NumberInteger<N>): string[] {
  return limit !== undefined && limit < 0
    ? value.split(delimiter).slice(limit)
    : value.split(delimiter, limit)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should split a string', () => {
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
}
