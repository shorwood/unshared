import { BooleanNand } from '@unshared/types/BooleanNand'

/**
 * Computes the logical [NAND](https://en.wikipedia.org/wiki/NAND_gate) of two booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are `false`.
 * @example nand(false, true) // true
 */
export function nand<A extends boolean, B extends boolean>(a: A, b: B): BooleanNand<A, B> {
  return !(a && b) as BooleanNand<A, B>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return false if both parameters are true', () => {
    const result = nand(true, true)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should return true if the first parameter is false', () => {
    const result = nand(true, false)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return true if the second parameter is false', () => {
    const result = nand(false, true)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return true if both parameters are false', () => {
    const result = nand(false, false)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })
}
