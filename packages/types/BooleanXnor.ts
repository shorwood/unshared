/**
 * The XNOR of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The XNOR of the two booleans
 * @example BooleanXnor<true, false> // false
 */
export type BooleanXnor<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? true : false : B extends true ? false : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return false when [true, false] is passed', () => {
    type result = BooleanXnor<true, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, true] is passed', () => {
    type result = BooleanXnor<false, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return true when [false, false] is passed', () => {
    type result = BooleanXnor<false, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when [true, true] is passed', () => {
    type result = BooleanXnor<true, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return boolean when [boolean, false] is passed', () => {
    type result = BooleanXnor<boolean, false>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [false, boolean] is passed', () => {
    type result = BooleanXnor<false, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [boolean, true] is passed', () => {
    type result = BooleanXnor<boolean, true>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [true, boolean] is passed', () => {
    type result = BooleanXnor<true, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [boolean, boolean] is passed', () => {
    type result = BooleanXnor<boolean, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })
}
