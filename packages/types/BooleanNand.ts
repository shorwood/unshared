/**
 * The NAND of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The NAND of the two booleans
 * @example BooleanNand<true, false> // true
 */
export type BooleanNand<A extends boolean, B extends boolean> = A extends true ? B extends true ? false : true : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return false when both booleans are true', () => {
    type result = BooleanNand<true, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return true when the first boolean is true and the second boolean is false', () => {
    type result = BooleanNand<true, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when the first boolean is false and the second boolean is true', () => {
    type result = BooleanNand<false, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when both booleans are false', () => {
    type result = BooleanNand<false, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })
}
