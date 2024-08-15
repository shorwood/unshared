import type { IsDecimal, IsNegative, IsNumber } from './utils'

/**
 * A negative decimal number.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a negative decimal number.
 * @example NumberDecimalNegative<-1.1> // -1.1
 */
export type NumberDecimalNegative<N extends number = number> =
  IsNumber<N> extends true ? number
    : IsDecimal<N> extends true
      ? IsNegative<N> extends true ? N
        : never : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should not match a positive decimal', () => {
    type Result = NumberDecimalNegative<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a positive integer', () => {
    type Result = NumberDecimalNegative<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match a negative decimal', () => {
    type Result = NumberDecimalNegative<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1.1>()
  })

  test('should not match a negative integer', () => {
    type Result = NumberDecimalNegative<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match zero', () => {
    type Result = NumberDecimalNegative<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match number', () => {
    type Result = NumberDecimalNegative<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
