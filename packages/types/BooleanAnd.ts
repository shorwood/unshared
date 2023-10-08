/**
 * The [AND](https://en.wikipedia.org/wiki/Logical_conjunction) of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns `true` if both booleans are `true`.
 * @example BooleanAnd<true, true> // true
 */
export type BooleanAnd<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? true : false : false

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true when [true, true] is passed', () => {
    type Result = BooleanAnd<true, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return false when [true, false] is passed', () => {
    type Result = BooleanAnd<false, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, true] is passed', () => {
    type Result = BooleanAnd<true, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, false] is passed', () => {
    type Result = BooleanAnd<false, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return boolean when [boolean, true] is passed', () => {
    type Result = BooleanAnd<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return boolean when [true, boolean] is passed', () => {
    type Result = BooleanAnd<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should return false when [boolean, false] is passed', () => {
    type Result = BooleanAnd<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return false when [false, boolean] is passed', () => {
    type Result = BooleanAnd<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanAnd<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
}
