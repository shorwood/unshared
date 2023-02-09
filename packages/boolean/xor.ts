/**
 * Computes the logical XOR of the given booleans.
 *
 * @param a The first boolean to XOR.
 * @param b The second boolean to XOR.
 * @returns `true` if `a` and `b` are different.
 * @throws If a non-boolean is provided or if less than 2 booleans are provided.
 * @see https://en.wikipedia.org/wiki/Exclusive_or
 * @example xor(false, true) // true
 */
export function xor(a: true, b: true): false
export function xor(a: true, b: false): true
export function xor(a: false, b: true): true
export function xor(a: false, b: false): false
export function xor(a: boolean, b: boolean): boolean
export function xor(a: boolean, b: boolean): boolean {
  if (typeof a !== 'boolean')
    throw new TypeError(`Expected first parameter to be a boolean. Received ${a}.`)
  if (typeof b !== 'boolean')
    throw new TypeError(`Expected second parameter to be a boolean. Received ${b}.`)
  return a !== b
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    [[false, false], false],
    [[false, true], true],
    [[true, false], true],
    [[true, true], false],
  ])('should compute the logical XOR of %s and return %s', (booleans, expected) => {
    // @ts-expect-error: ignore
    const result = xor(...booleans)
    expect(result).toEqual(expected)
  })

  it('should throw an error if the second parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => xor(true, 'true')
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the first parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => xor('true', true)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should type the result of `xor(true, true)` to false', () => {
    const result = xor(true, true)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should type the result of `xor(true, false)` to true', () => {
    const result = xor(true, false)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should type the result of `xor(false, false)` to false', () => {
    const result = xor(false, false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should type the result of `xor(false, true)` to true', () => {
    const result = xor(false, true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })
}
