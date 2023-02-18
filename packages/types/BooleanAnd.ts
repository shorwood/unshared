/**
 * The AND of two booleans.
 *
 * @param A The first boolean
 * @param B The second boolean
 * @returns The AND of the two booleans
 * @example BooleanAnd<true, true> // true
 */
export type BooleanAnd<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? true : false : false

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when [true, true] is passed', () => {
    type result = BooleanAnd<true, true>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return false when [true, false] is passed', () => {
    type result = BooleanAnd<false, true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, true] is passed', () => {
    type result = BooleanAnd<true, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, false] is passed', () => {
    type result = BooleanAnd<false, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return boolean when [boolean, true] is passed', () => {
    type result = BooleanAnd<boolean, true>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [true, boolean] is passed', () => {
    type result = BooleanAnd<true, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })

  it('should return false when [boolean, false] is passed', () => {
    type result = BooleanAnd<boolean, false>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, boolean] is passed', () => {
    type result = BooleanAnd<false, boolean>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return boolean when [boolean, boolean] is passed', () => {
    type result = BooleanAnd<boolean, boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })
}
