/**
 * Removes whitespace from both sides of a string.
 *
 * @param value The string to trim
 * @returns The trimmed string
 * @throws If argument is not a string
 * @example trim('\nfoo bar\t') // returns 'foo bar'
 */
export function trim(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Trim the string.
  return value.trim()
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should remove whitespace from both sides of a string', () => {
    const result = trim(' foo bar ')
    expect(result).toEqual('foo bar')
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => trim(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
