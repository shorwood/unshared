/**
 * The NOR of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The NOR of the two booleans
 * @example BooleanNor<true, false> // false
 */
export type BooleanNor<A extends boolean, B extends boolean> = A extends true ? false : B extends true ? false : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return false when both booleans are true', () => {
    type result = BooleanNor<true, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when the first boolean is true', () => {
    type result = BooleanNor<true, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when the second boolean is true', () => {
    type result = BooleanNor<false, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return true when both booleans are false', () => {
    type result = BooleanNor<false, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })
}
