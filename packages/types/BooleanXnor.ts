/**
 * The XNOR of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns The XNOR of the two booleans
 * @example BooleanXnor<true, false> // false
 */
export type BooleanXnor<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? true : false : B extends true ? false : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return false when [true, false] is passed', () => {
    type Result = BooleanXnor<true, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, true] is passed', () => {
    type Result = BooleanXnor<false, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return true when [false, false] is passed', () => {
    type Result = BooleanXnor<false, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return true when [true, true] is passed', () => {
    type Result = BooleanXnor<true, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return boolean when [boolean, false] is passed', () => {
    type Result = BooleanXnor<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [false, boolean] is passed', () => {
    type Result = BooleanXnor<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [boolean, true] is passed', () => {
    type Result = BooleanXnor<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [true, boolean] is passed', () => {
    type Result = BooleanXnor<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanXnor<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
}
