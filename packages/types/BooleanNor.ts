/**
 * The NOR of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The NOR of the two booleans
 * @example BooleanNor<true, false> // false
 */
export type BooleanNor<A extends boolean, B extends boolean> =
  A extends true ? false : B extends true ? false : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return false when [true, false] is passed', () => {
    type result = BooleanNor<true, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, true] is passed', () => {
    type result = BooleanNor<false, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return true when [false, false] is passed', () => {
    type result = BooleanNor<false, false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return false when [true, true] is passed', () => {
    type result = BooleanNor<true, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when [boolean, false] is passed', () => {
    type result = BooleanNor<boolean, false>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return false when [false, boolean] is passed', () => {
    type result = BooleanNor<false, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return false when [boolean, true] is passed', () => {
    type result = BooleanNor<boolean, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when [true, boolean] is passed', () => {
    type result = BooleanNor<true, boolean>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return boolean when [boolean, boolean] is passed', () => {
    type result = BooleanNor<boolean, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })
}
