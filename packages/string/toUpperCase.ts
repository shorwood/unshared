/**
 * Converts a string to upper case.
 *
 * @param value The string to convert.
 * @returns The upper cased string.
 * @throws If argument is not a string.
 * @example toCamelCase('fooBar') // returns 'FOOBAR'
 */
export function toUpperCase(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Convert to upper case.
  return value.toUpperCase()
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert a string to lower case', () => {
    const result = toUpperCase('foo_bar_1')
    expect(result).toEqual('FOO_BAR_1')
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => toUpperCase(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
