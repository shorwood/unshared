/**
 * The NAND of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The NAND of the two booleans
 * @example BooleanNand<true, false> // true
 */
export type BooleanNand<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? false : true : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when [true, false] is passed', () => {
    type result = BooleanNand<true, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when [false, true] is passed', () => {
    type result = BooleanNand<false, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when [false, false] is passed', () => {
    type result = BooleanNand<false, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return false when [true, true] is passed', () => {
    type result = BooleanNand<true, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return true when [boolean, false] is passed', () => {
    type result = BooleanNand<boolean, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when [false, boolean] is passed', () => {
    type result = BooleanNand<false, boolean>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return false when [boolean, true] is passed', () => {
    type result = BooleanNand<boolean, true>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return false when [true, boolean] is passed', () => {
    type result = BooleanNand<true, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [boolean, boolean] is passed', () => {
    type result = BooleanNand<boolean, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })
}
