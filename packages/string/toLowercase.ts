/**
 * Changes the case of a string to lower case. Is the same as
 * `String.prototype.toLowerCase` but provides type inference for
 * the new string.
 *
 * @param value The string to convert to lower case.
 * @returns The lower case string.
 * @example toLowerCase('FOO_BAR_1') // 'foo_bar_1'
 */
export function toLowercase<S extends string>(value: S): Lowercase<S> {
  return value.toLowerCase() as Lowercase<S>
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should convert a string to lower case', () => {
    const result = toLowercase('FOO_BAR_1')
    expect(result).toBe('foo_bar_1')
    expectTypeOf(result).toEqualTypeOf<'foo_bar_1'>()
  })
}
