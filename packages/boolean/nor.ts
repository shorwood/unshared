import { BooleanNor } from '@unshared/types'

/**
 * Computes the logical [NOR](https://en.wikipedia.org/wiki/NOR_gate) of two booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean
 * @returns `true` if `a` and `b` are `false`.
 * @example nor(false, true) // false
 */
export function nor<A extends boolean, B extends boolean>(a: A, b: B): BooleanNor<A, B> {
  return !(a || b) as BooleanNor<A, B>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true if both parameters are false', () => {
    const result = nor(false, false)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return false if the first parameter is true', () => {
    const result = nor(true, false)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should return false if the second parameter is true', () => {
    const result = nor(false, true)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should return false if both parameters are true', () => {
    const result = nor(true, true)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })
}
