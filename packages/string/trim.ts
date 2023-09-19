/**
 * Removes the leading and trailing white space and line terminator
 * characters from a string. This function is a wrapper around the
 * `String.prototype.trim` method but allows to use it in a functional
 * manner.
 *
 * @param string The string to trim
 * @returns The trimmed string
 * @throws If argument is not a string
 * @example trim('\nfoo bar\t') // returns 'foo bar'
 */
export function trim(string: string): string {
  return string.trim()
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should remove whitespace from both sides of a string', () => {
    const result = trim(' foo bar ')
    expect(result).toEqual('foo bar')
  })
}
