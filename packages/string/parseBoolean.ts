import type { Trim } from '@unshared/types'

/**
 * Parse a string into a boolean. "true" and "1" are considered true and the
 * comparison is case insensitive. Any other value is considered false. This
 * function is useful for converting environment variables into booleans. If
 * the input string is a literal, the return type can be infered.
 *
 * @template S The string type.
 * @returns The boolean value.
 * @example ParseBoolean<'true'> // true
 */
export type ParseBoolean<S extends string> =
  string extends S
    ? boolean
    : Trim<Lowercase<S>> extends '1' | 'true' ? true : false

/**
 * Parse a string into a boolean. "true" and "1" are considered true and the
 * comparison is case insensitive. Any other value is considered false. This
 * function is useful for converting environment variables into booleans. If
 * the input string is a literal, the return type can be infered.
 *
 * @param string The string to parse.
 * @returns The parsed boolean value.
 * @example parseBoolean(process.env.ENABLE_FEATURE) // true
 */
export function parseBoolean<S extends string>(string: S): ParseBoolean<S> {
  return /^\s*1|true\s*$/i.test(string) as ParseBoolean<S>
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return true if the value is "true"', () => {
    const result = parseBoolean('true')
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the value is "TRUE"', () => {
    const result = parseBoolean('TRUE')
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the value is "True"', () => {
    const result = parseBoolean('True')
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the value is "1"', () => {
    const result = parseBoolean('1')
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true even if the value is padded with spaces', () => {
    const result = parseBoolean(' 1 ')
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the value is not one of the above', () => {
    const result = parseBoolean('false')
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return boolean if the value is a non-literal', () => {
    const result = parseBoolean('false' as string)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
