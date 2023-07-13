/**
 * The [NAND](https://en.wikipedia.org/wiki/NAND_logic) of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns `true` if at least one of the booleans is `false`.
 * @example BooleanNand<true, false> // true
 */
export type BooleanNand<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? false : true : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when [true, false] is passed', () => {
    type Result = BooleanNand<true, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return true when [false, true] is passed', () => {
    type Result = BooleanNand<false, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return true when [false, false] is passed', () => {
    type Result = BooleanNand<false, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return false when [true, true] is passed', () => {
    type Result = BooleanNand<true, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return true when [boolean, false] is passed', () => {
    type Result = BooleanNand<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return true when [false, boolean] is passed', () => {
    type Result = BooleanNand<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return false when [boolean, true] is passed', () => {
    type Result = BooleanNand<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return false when [true, boolean] is passed', () => {
    type Result = BooleanNand<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanNand<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
}
