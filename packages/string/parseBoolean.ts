/**
 * Extract the boolean value from a string.
 *
 * @template S The string type.
 * @returns The boolean value.
 * @example ParseBoolean<'true'> // true
 */
export type ParseBoolean<S extends string> = Lowercase<S> extends 'true' | '1' ? true : false

/**
 * Parse a string into a boolean. "true" and "1" are considered true. Any other
 * value is considered false. This function is useful for converting environment
 * variables into booleans.
 *
 * @param value The value to parse.
 * @returns The parsed boolean.
 * @example parseBoolean(process.env.ENABLE_FEATURE) // true
 */
export function parseBoolean<S extends string>(value: S): ParseBoolean<S> {
  return /^1|true$/i.test(value) as ParseBoolean<S>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true if the value is "true"', () => {
    const result = parseBoolean('true')
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return true if the value is "TRUE"', () => {
    const result = parseBoolean('TRUE')
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return true if the value is "True"', () => {
    const result = parseBoolean('True')
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return true if the value is "1"', () => {
    const result = parseBoolean('1')
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return false if the value is "false"', () => {
    const result = parseBoolean('false')
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })
}
