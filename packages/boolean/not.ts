import { BooleanNot } from '@unshared/types'

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

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return true if the parameter is false', () => {
    const result = not(false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the parameter is true', () => {
    const result = not(true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return a boolean type if the parameter is a boolean', () => {
    const result = not(true as boolean)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
