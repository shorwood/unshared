/**
 * The OR of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The OR of the two booleans
 * @example BooleanOr<true, false> // true
 */
export type BooleanOr<A extends boolean, B extends boolean> =
  A extends true ? true : B extends true ? true : false

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when [true, false] is passed', () => {
    type result = BooleanOr<true, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when [false, true] is passed', () => {
    type result = BooleanOr<false, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return false when [false, false] is passed', () => {
    type result = BooleanOr<false, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return true when [true, true] is passed', () => {
    type result = BooleanOr<true, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return boolean when [boolean, false] is passed', () => {
    type result = BooleanOr<boolean, false>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [false, boolean] is passed', () => {
    type result = BooleanOr<false, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return true when [boolean, true] is passed', () => {
    type result = BooleanOr<boolean, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return true when [true, boolean] is passed', () => {
    type result = BooleanOr<true, boolean>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return boolean when [boolean, boolean] is passed', () => {
    type result = BooleanOr<boolean, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })
}
