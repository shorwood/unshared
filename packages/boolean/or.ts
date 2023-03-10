import { BooleanOr } from '@unshared/types/BooleanOr'

/**
 * Computes the logical [OR](https://en.wikipedia.org/wiki/OR_gate) of two booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` or `b` is `true`.
 * @throws If a non-boolean is provided.
 * @example or(false, true) // true
 */
export function or<A extends boolean, B extends boolean>(a: A, b: B): BooleanOr<A, B> {
  if (typeof a !== 'boolean')
    throw new TypeError(`Expected first parameter to be a boolean. Received ${a}.`)
  if (typeof b !== 'boolean')
    throw new TypeError(`Expected second parameter to be a boolean. Received ${b}.`)
  return (a || b) as BooleanOr<A, B>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    [[false, false], false],
    [[false, true], true],
    [[true, false], true],
    [[true, true], true],
  ])('should compute the logical OR of %s and return %s', (booleans, expected) => {
    // @ts-expect-error: ignore
    const result = or(...booleans)
    expect(result).toEqual(expected)
  })

  it('should throw an error if the second parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => or(true, 'true')
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the first parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => or('true', true)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should type the result of `or(true, true)` to true', () => {
    const result = or(true, true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should type the result of `or(true, false)` to true', () => {
    const result = or(true, false)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should type the result of `or(false, false)` to false', () => {
    const result = or(false, false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should type the result of `or(false, true)` to true', () => {
    const result = or(false, true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })
}
