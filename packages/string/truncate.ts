import { NumberIntegerPositive } from '@unshared/types'

/**
 * Truncate a string to a specified length. If the string is longer than the
 * specified length, the string is truncated and the last three characters are
 * replaced with the ellipsis character sequence.
 *
 * @param string The string to truncate.
 * @param maxLength The length at which to truncate the string.
 * @param [elipsis="..."] The ellipsis character sequence to use.
 * @returns The truncated string
 * @example truncate('foo bar baz', 7) // returns 'foo b…'
 */
export function truncate<N extends number>(string: string, maxLength: NumberIntegerPositive<N>, elipsis = '...'): string {
  return string.length > maxLength
    ? string.slice(0, maxLength - elipsis.length) + elipsis
    : string
}

/* c8 ignore next */
if (import.meta.vitest) {
  const text = 'The quick brown fox jumps over the lazy dog'

  it('should truncate a string to a specified length', () => {
    const result = truncate(text, 10)
    expect(result).toEqual('The quick…')
  })

  it('should truncate a string to a specified length with a custom ellipsis', () => {
    const result = truncate(text, 10, ' .et cetera')
    expect(result).toEqual('The quick .et cetera')
  })

  it('should return the string if it is shorter than the specified length', () => {
    const result = truncate(text, 100)
    expect(result).toEqual(text)
  })

  it('should throw a type error when the length is not a positive integer', () => {
    // @ts-expect-error: Invalid argument.
    truncate(text, -1)
  })
}
