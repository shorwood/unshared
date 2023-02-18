/**
 * The NOT of this boolean.
 *
 * @param T The type of this boolean
 * @returns The NOT of this boolean
 * @example BooleanNot<true> // false
 */
export type BooleanNot<T extends boolean> =
  T extends true ? false : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return false when true is passed', () => {
    type result = BooleanNot<true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return true when false is passed', () => {
    type result = BooleanNot<false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })

  it('should return boolean when boolean is passed', () => {
    type result = BooleanNot<boolean>
    expectTypeOf<result>().toEqualTypeOf<boolean>()
  })
}
