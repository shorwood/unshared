/**
 * The XOR of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The XOR of the two booleans
 * @example BooleanXor<true, false> // true
 */
export type BooleanXor<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? false : true : B extends true ? true : false

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when [true, false] is passed', () => {
    type result = BooleanXor<true, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when [false, true] is passed', () => {
    type result = BooleanXor<false, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return false when [true, true] is passed', () => {
    type result = BooleanXor<true, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, false] is passed', () => {
    type result = BooleanXor<false, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return boolean when [boolean, true] is passed', () => {
    type result = BooleanXor<boolean, true>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [true, boolean] is passed', () => {
    type result = BooleanXor<true, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [boolean, false] is passed', () => {
    type result = BooleanXor<boolean, false>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [false, boolean] is passed', () => {
    type result = BooleanXor<false, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [boolean, boolean] is passed', () => {
    type result = BooleanXor<boolean, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })
}
