import type { BooleanNot } from '@unshared/types'

/**
 * Computes the [NOT](https://en.wikipedia.org/wiki/NOT_gate) of a boolean.
 *
 * @param a The boolean to negate.
 * @returns `true` if `a` is `false`.
 * @example not(false) // true
 */
export function not<A extends boolean>(a: A): BooleanNot<A> {
  return !a as BooleanNot<A>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true if the parameter is false', () => {
    const result = not(false)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should return false if the parameter is true', () => {
    const result = not(true)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })
}
