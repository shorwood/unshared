import { BooleanXnor } from '@unshared/types/BooleanXnor'

/**
 * Computes the logical [XNOR](https://en.wikipedia.org/wiki/XNOR_gate) of the given booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are the same.
 * @throws If a non-boolean is provided.
 * @example xnor(false, true) // false
 */
export function xnor<A extends boolean, B extends boolean>(a: A, b: B): BooleanXnor<A, B> {
  if (typeof a !== 'boolean')
    throw new TypeError(`Expected first parameter to be a boolean. Received ${a}.`)
  if (typeof b !== 'boolean')
    throw new TypeError(`Expected second parameter to be a boolean. Received ${b}.`)
  // @ts-expect-error: ignore
  return (a === b) as BooleanXnor<A, B>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    [[false, false], true],
    [[false, true], false],
    [[true, false], false],
    [[true, true], true],
  ])('should compute the logical XNOR of %s and return %s', (booleans, expected) => {
    // @ts-expect-error: ignore
    const result = xnor(...booleans)
    expect(result).toEqual(expected)
  })

  it('should throw an error if the second parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => xnor(true, 'true')
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the first parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => xnor('true', true)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should type the result of `xnor(true, true)` to true', () => {
    const result = xnor(true, true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should type the result of `xnor(true, false)` to false', () => {
    const result = xnor(true, false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should type the result of `xnor(false, false)` to true', () => {
    const result = xnor(false, false)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should type the result of `xnor(false, true)` to false', () => {
    const result = xnor(false, true)
    expectTypeOf(result).toEqualTypeOf<false>()
  })
}
