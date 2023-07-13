/**
 * The XOR of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns The XOR of the two booleans
 * @example BooleanXor<true, false> // true
 */
export type BooleanXor<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? false : true : B extends true ? true : false

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when [true, false] is passed', () => {
    type Result = BooleanXor<true, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return true when [false, true] is passed', () => {
    type Result = BooleanXor<false, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return false when [true, true] is passed', () => {
    type Result = BooleanXor<true, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, false] is passed', () => {
    type Result = BooleanXor<false, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return boolean when [boolean, true] is passed', () => {
    type Result = BooleanXor<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [true, boolean] is passed', () => {
    type Result = BooleanXor<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [boolean, false] is passed', () => {
    type Result = BooleanXor<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [false, boolean] is passed', () => {
    type Result = BooleanXor<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanXor<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
}
