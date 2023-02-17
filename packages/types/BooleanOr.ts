/**
 * The OR of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The OR of the two booleans
 * @example BooleanOr<true, false> // true
 */
export type BooleanOr<A extends boolean, B extends boolean> = A extends true ? true : B extends true ? true : false

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when both booleans are true', () => {
    type result = BooleanOr<true, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when the first boolean is true', () => {
    type result = BooleanOr<true, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when the second boolean is true', () => {
    type result = BooleanOr<false, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return false when both booleans are false', () => {
    type result = BooleanOr<false, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })
}
