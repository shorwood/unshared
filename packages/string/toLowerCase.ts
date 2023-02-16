
/**
 * Converts a string to lower case.
 *
 * @param value The string to convert
 * @returns The converted string
 * @throws If `value` is not a string
 * @example toCamelCase('fooBar') // returns 'foobar'
 */
export function toLowerCase(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Convert to lower case.
  return value.toLowerCase()
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert a string to lower case', () => {
    const result = toLowerCase('FOO_BAR_1')
    expect(result).toEqual('foo_bar_1')
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => toLowerCase(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
