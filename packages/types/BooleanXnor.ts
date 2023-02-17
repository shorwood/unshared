/**
 * The XNOR of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The XNOR of the two booleans
 * @example BooleanXnor<true, false> // false
 */
export type BooleanXnor<A extends boolean, B extends boolean> = A extends true ? B extends true ? true : false : B extends true ? false : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when both booleans are true', () => {
    type result = BooleanXnor<true, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return false when the first boolean is true and the second boolean is false', () => {
    type result = BooleanXnor<true, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when the first boolean is false and the second boolean is true', () => {
    type result = BooleanXnor<false, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return true when both booleans are false', () => {
    type result = BooleanXnor<false, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })
}
