import { BooleanNot } from '@unshared/types/BooleanNot'

/**
 * Computes the [NOT](https://en.wikipedia.org/wiki/NOT_gate) of a boolean.
 *
 * @param a The boolean to negate.
 * @returns `true` if `a` is `false`.
 * @throws If a non-boolean is provided.
 * @example not(false) // true
 */
export function not<A extends boolean>(a: A): BooleanNot<A> {
  if (typeof a !== 'boolean')
    throw new TypeError(`Expected parameter to be a boolean. Received ${a}.`)
  return !a as BooleanNot<A>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    [false, true],
    [true, false],
  ])('should compute the logical negation of %s and return %s', (boolean, expected) => {
    const result = not(boolean)
    expect(result).toEqual(expected)
  })

  it('should throw an error if the parameter is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => not('true')
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should type the result of `not(true)` to false', () => {
    const result = not(true)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should type the result of `not(false)` to true', () => {
    const result = not(false)
    expectTypeOf(result).toEqualTypeOf<true>()
  })
}
