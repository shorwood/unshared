/**
 * The OR of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns The OR of the two booleans
 * @example BooleanOr<true, false> // true
 */
export type BooleanOr<A extends boolean, B extends boolean> =
  A extends true ? true : B extends true ? true : false

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return true when [true, false] is passed', () => {
    type Result = BooleanOr<true, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return true when [false, true] is passed', () => {
    type Result = BooleanOr<false, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return false when [false, false] is passed', () => {
    type Result = BooleanOr<false, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return true when [true, true] is passed', () => {
    type Result = BooleanOr<true, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return boolean when [boolean, false] is passed', () => {
    type Result = BooleanOr<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [false, boolean] is passed', () => {
    type Result = BooleanOr<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return true when [boolean, true] is passed', () => {
    type Result = BooleanOr<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return true when [true, boolean] is passed', () => {
    type Result = BooleanOr<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanOr<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
}
