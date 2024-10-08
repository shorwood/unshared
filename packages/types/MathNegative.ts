import type { IsNumber, IsZero, Negative } from './utils'

/**
 * The negative of a number.
 *
 * @template N The number to negate.
 * @returns The negative of the number.
 * @example MathNegative<1> // -1
 */
export type MathNegative<N extends number> =
  IsNumber<N> extends true ? number
    : IsZero<N> extends true ? 0
      : Negative<N>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should negate a positive integer', () => {
    type Result = MathNegative<1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should negate a negative integer', () => {
    type Result = MathNegative<-1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should negate a positive decimal', () => {
    type Result = MathNegative<1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1.1>()
  })

  test('should negate a negative decimal', () => {
    type Result = MathNegative<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  test('should not negate zero', () => {
    type Result = MathNegative<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should negate number', () => {
    type Result = MathNegative<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
