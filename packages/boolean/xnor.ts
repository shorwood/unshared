import type { BooleanXnor } from '@unshared/types'

/**
 * Computes the logical [XNOR](https://en.wikipedia.org/wiki/XNOR_gate) of the given booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are the same.
 * @example xnor(false, true) // false
 */
export function xnor<A extends boolean, B extends boolean>(a: A, b: B): BooleanXnor<A, B> {
  // @ts-expect-error: ignore
  return (a === b) as BooleanXnor<A, B>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true if both parameters are true', () => {
    const result = xnor(true, true)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return false if the first parameter is false', () => {
    const result = xnor(true, false)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should return false if the second parameter is false', () => {
    const result = xnor(false, false)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return true if the first parameter is false', () => {
    const result = xnor(false, true)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })
}
