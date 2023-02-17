/**
 * The NOT of this boolean.
 *
 * @param T The type of this boolean
 * @returns The NOT of this boolean
 * @example BooleanNot<true> // false
 */
export type BooleanNot<T extends boolean> = T extends true ? false : true

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return false when the boolean is true', () => {
    type result = BooleanNot<true>
    expectTypeOf<result>().toEqualTypeOf<false>()
  })

  it('should return true when the boolean is false', () => {
    type result = BooleanNot<false>
    expectTypeOf<result>().toEqualTypeOf<true>()
  })
}
