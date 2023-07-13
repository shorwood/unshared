/**
 * Changes the case of a string to lower case.
 *
 * @param value The string to convert to lower case.
 * @returns The lower case string.
 * @example toCamelCase('FOO_BAR') // returns 'foo_bar'
 */
export function toLowerCase<S extends string>(value: S): Lowercase<S> {
  return value.toLowerCase() as Lowercase<S>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert a string to lower case', () => {
    const result = toLowerCase('FOO_BAR_1')
    expect(result).toEqual('foo_bar_1')
    expectTypeOf(result).toEqualTypeOf<'foo_bar_1'>()
  })
}
