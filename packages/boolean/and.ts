/**
 * Computes the logical AND of the given booleans.
 *
 * @param a The first boolean to AND.
 * @param b The second boolean to AND.
 * @returns `true` if `a` and `b` are both `true`.
 * @throws If a non-boolean is provided or if less than 2 booleans are provided.
 * @see https://en.wikipedia.org/wiki/AND_gate
 * @example and(true, true) // true
 */
export function and(a: true, b: true): true
export function and(a: true, b: false): false
export function and(a: false, b: true): false
export function and(a: false, b: false): false
export function and(a: boolean, b: boolean): boolean
export function and(a: boolean, b: boolean): boolean {
  if (typeof a !== 'boolean')
    throw new TypeError(`Expected first parameter to be a boolean. Received ${a}.`)
  if (typeof b !== 'boolean')
    throw new TypeError(`Expected second parameter to be a boolean. Received ${b}.`)
  return a && b
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    [[false, false], false],
    [[false, true], false],
    [[true, false], false],
    [[true, true], true],
  ])('should compute the logical AND of %s and return %s', (booleans, expected) => {
    // @ts-expect-error: ignore
    const result = and(...booleans)
    expect(result).toEqual(expected)
  })

  it('should throw an error if the second parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => and(true, 'true')
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the first parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => and('true', true)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should type the result of `and(true, true)` to true', () => {
    const result = and(true, true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should type the result of `and(true, false)` to false', () => {
    const result = and(true, false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should type the result of `and(false, false)` to false', () => {
    const result = and(false, false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should type the result of `and(false, true)` to false', () => {
    const result = and(false, true)
    expectTypeOf(result).toEqualTypeOf<false>()
  })
}
