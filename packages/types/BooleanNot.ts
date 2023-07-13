/**
 * The NOT of this boolean.
 *
 * @template T The type of this boolean
 * @returns The NOT of this boolean
 * @example BooleanNot<true> // false
 */
export type BooleanNot<T extends boolean> =
  T extends true ? false : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return false when true is passed', () => {
    type Result = BooleanNot<true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  it('should return true when false is passed', () => {
    type Result = BooleanNot<false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should return boolean when boolean is passed', () => {
    type Result = BooleanNot<boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
}
