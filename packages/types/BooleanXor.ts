/**
 * The XOR of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The XOR of the two booleans
 * @example BooleanXor<true, false> // true
 */
export type BooleanXor<A extends boolean, B extends boolean> = A extends true ? B extends true ? false : true : B extends true ? true : false

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when the first boolean is true and the second boolean is false', () => {
    type result = BooleanXor<true, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when the first boolean is false and the second boolean is true', () => {
    type result = BooleanXor<false, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return false when both booleans are true', () => {
    type result = BooleanXor<true, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when both booleans are false', () => {
    type result = BooleanXor<false, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })
}
