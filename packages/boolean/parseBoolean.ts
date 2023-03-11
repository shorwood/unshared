/**
 * Parse a string into a boolean. "true" and "1" are considered true. Any other
 * value is considered false. This function is useful for converting environment
 * variables into booleans.
 *
 * @param value The value to parse.
 * @returns The parsed boolean.
 * @example parseBoolean(process.env.ENABLE_FEATURE) // true
 */
export function parseBoolean(value: string): boolean {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Parse the value.
  return /^1|true$/i.test(value)
}

/* c8 ignore next */
if (import.meta.vitest) {
  const trueCases = ['true', 'TRUE', '1']
  const falseCases = ['false', 'FALSE', '0']

  it.each(trueCases)('should return true when parsing "%s"', (value) => {
    const result = parseBoolean(value)
    expect(result).toEqual(true)
  })

  it.each(falseCases)('should return false when parsing "%s"', (value) => {
    const result = parseBoolean(value)
    expect(result).toEqual(false)
  })

  it('should return false when parsing non-trimmed string', () => {
    const result = parseBoolean(' true ')
    expect(result).toEqual(false)
  })

  it('should throw when value is not a string', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => parseBoolean(true)
    expect(shouldThrow).toThrow(TypeError)
  })
}
