/**
 * Computes the logical NOR of the given booleans.
 *
 * @param a The first boolean to NOR.
 * @param b The second boolean to NOR.
 * @returns `true` if `a` and `b` are `false`.
 * @throws If a non-boolean is provided or if less than 2 booleans are provided.
 * @see https://en.wikipedia.org/wiki/NOR_gate
 * @example nor(false, true) // false
 */
export function nor(a: true, b: true): false
export function nor(a: true, b: false): false
export function nor(a: false, b: true): false
export function nor(a: false, b: false): true
export function nor(a: boolean, b: boolean): boolean
export function nor(a: boolean, b: boolean): boolean {
  if (typeof a !== 'boolean')
    throw new TypeError(`Expected first parameter to be a boolean. Received ${a}.`)
  if (typeof b !== 'boolean')
    throw new TypeError(`Expected second parameter to be a boolean. Received ${b}.`)
  return !(a || b)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    [[false, false], true],
    [[false, true], false],
    [[true, false], false],
    [[true, true], false],
  ])('should compute the logical NOR of %s and return %s', (booleans, expected) => {
    // @ts-expect-error: ignore
    const result = nor(...booleans)
    expect(result).toEqual(expected)
  })

  it('should throw an error if the second parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => nor(true, 'true')
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the first parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => nor('true', true)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should type the result of `nor(true, true)` to false', () => {
    const result = nor(true, true)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should type the result of `nor(true, false)` to false', () => {
    const result = nor(true, false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should type the result of `nor(false, false)` to true', () => {
    const result = nor(false, false)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should type the result of `nor(false, true)` to false', () => {
    const result = nor(false, true)
    expectTypeOf(result).toEqualTypeOf<false>()
  })
}
