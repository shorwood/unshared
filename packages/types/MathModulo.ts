import { MathSubtract } from './MathSubtract'
import { AllPositive, IsLowerThan } from './utils'

/**
 * Remainder of the division of two positive integers.
 *
 * @template A The first positive integer.
 * @template B The second positive integer.
 * @returns The remainder of the division of the two positive integers.
 * @example MathModulo<1, 2> // 1
 */

export type MathModulo<A extends number, B extends number> =
  AllPositive<A, B> extends true
    ? IsLowerThan<A, B> extends true ? A
      : MathModulo<MathSubtract<A, B>, B> : number

/** c8 ignore next */
if (import.meta.vitest) {
  it('should compute the remainder of 10 and 10 as 0', () => {
    type result = MathModulo<10, 10>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should compute the remainder of 0 and 0 as 0', () => {
    type result = MathModulo<0, 0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should return number when a negative integer is passed', () => {
    type result = MathModulo<1, -1>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
