import { BooleanNand } from '@unshared/types/BooleanNand'

/**
 * Computes the logical [NAND](https://en.wikipedia.org/wiki/NAND_gate) of two booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are `false`.
 * @throws If a non-boolean is provided.
 * @example nand(false, true) // true
 */
export function nand<A extends boolean, B extends boolean>(a: A, b: B): BooleanNand<A, B> {
  if (typeof a !== 'boolean')
    throw new TypeError(`Expected first parameter to be a boolean. Received ${a}.`)
  if (typeof b !== 'boolean')
    throw new TypeError(`Expected second parameter to be a boolean. Received ${b}.`)
  return !(a && b) as BooleanNand<A, B>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    [[false, false], true],
    [[false, true], true],
    [[true, false], true],
    [[true, true], false],
  ])('should compute the logical NAND of %s and return %s', (booleans, expected) => {
    // @ts-expect-error: ignore
    const result = nand(...booleans)
    expect(result).toEqual(expected)
  })

  it('should throw an error if the second parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => nand(true, 'true')
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the first parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => nand('true', true)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should type the result of `nand(true, true)` to false', () => {
    const result = nand(true, true)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should type the result of `nand(true, false)` to true', () => {
    const result = nand(true, false)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should type the result of `nand(false, false)` to true', () => {
    const result = nand(false, false)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should type the result of `nand(false, true)` to true', () => {
    const result = nand(false, true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })
}
