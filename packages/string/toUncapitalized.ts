/**
 * Uncapitalize the first letter of a string.
 *
 * @template S The input string type.
 * @returns The capitalized string.
 * @example Uncapitalized<'fooBar'> // 'FooBar'
 */
export type Uncapitalized<S extends string> =
  S extends `${infer F}${infer R}`
    ? `${Lowercase<F>}${R}`
    : S

/**
 * Uncapitalize the first letter of a string. The returned type is inferred
 * from the input string.
 *
 * @param value The string to uncapitalize.
 * @returns The uncapitalized string.
 * @example toUncapitalized('FooBar') // 'fooBar'
 */
export function toUncapitalized<S extends string>(value: S): Uncapitalized<S> {
  if (value.length === 0) return value as Uncapitalized<S>
  if (value.length === 1) return value.toLowerCase() as Uncapitalized<S>
  return value.charAt(0).toLowerCase() + value.slice(1) as Uncapitalized<S>
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should capitalize the first letter of a string', () => {
    const result = toUncapitalized('FooBar')
    expect(result).toBe('fooBar')
    expectTypeOf(result).toEqualTypeOf<'fooBar'>()
  })

  test('should capitalize a single character', () => {
    const result = toUncapitalized('A')
    expect(result).toBe('a')
    expectTypeOf(result).toEqualTypeOf<'a'>()
  })

  test('should capitalize an empty string', () => {
    const result = toUncapitalized('')
    expect(result).toBe('')
    expectTypeOf(result).toEqualTypeOf<''>()
  })
}
