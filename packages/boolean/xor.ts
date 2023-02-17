import { BooleanXor } from '@unshared/types/BooleanXor'

/**
 * Computes the logical [XOR](https://en.wikipedia.org/wiki/Exclusive_or) of the given booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are different.
 * @throws If a non-boolean is provided.
 * @example xor(false, true) // true
 */
export function xor<A extends boolean, B extends boolean>(a: A, b: B): BooleanXor<A, B> {
  if (typeof a !== 'boolean')
    throw new TypeError(`Expected first parameter to be a boolean. Received ${a}.`)
  if (typeof b !== 'boolean')
    throw new TypeError(`Expected second parameter to be a boolean. Received ${b}.`)
  // @ts-expect-error: ignore
  return (a !== b) as BooleanXor<A, B>
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
