import type { BooleanXor } from '@unshared/types'

/**
 * Computes the logical [XOR](https://en.wikipedia.org/wiki/Exclusive_or) of the given booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are different.
 * @example xor(false, true) // true
 */
export function xor<A extends boolean, B extends boolean>(a: A, b: B): BooleanXor<A, B> {
  // @ts-expect-error: ignore
  return (a !== b) as BooleanXor<A, B>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true if both parameters are true', () => {
    const result = xor(true, true)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should return false if the first parameter is false', () => {
    const result = xor(true, false)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return false if the second parameter is false', () => {
    const result = xor(false, false)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should return true if the first parameter is false', () => {
    const result = xor(false, true)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })
}
