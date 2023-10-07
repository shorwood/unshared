import type { Absolute } from './utils/arithmetics'
import type { IsNumber, IsZero } from './utils/predicate'

/**
 * Returns the absolute value of a number.
 *
 * @template N The number to get the absolute value of.
 * @returns The absolute value of the number.
 * @example MathAbsolute<-1> // 1
 */
export type MathAbsolute<N extends number> =
  IsNumber<N> extends true ? number
    : IsZero<N> extends true ? 0
      : Absolute<N>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the absolute value of a positive integer', () => {
    type Result = MathAbsolute<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  it('should get the absolute value of a negative integer', () => {
    type Result = MathAbsolute<-1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  it('should get the absolute value of a positive float', () => {
    type Result = MathAbsolute<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  it('should get the absolute value of a negative float', () => {
    type Result = MathAbsolute<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  it('should get the absolute value of zero', () => {
    type Result = MathAbsolute<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  it('should get the absolute value of number', () => {
    type Result = MathAbsolute<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
