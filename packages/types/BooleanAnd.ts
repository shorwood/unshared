/**
 * The AND of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The AND of the two booleans
 * @example BooleanAnd<true, true> // true
 */
export type BooleanAnd<A extends boolean, B extends boolean> = A extends true ? B extends true ? true : false : false

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when both booleans are true', () => {
    type result = BooleanAnd<true, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return false when the first boolean is false', () => {
    type result = BooleanAnd<false, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when the second boolean is false', () => {
    type result = BooleanAnd<true, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when both booleans are false', () => {
    type result = BooleanAnd<false, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })
}
