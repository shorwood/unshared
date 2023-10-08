import { IsDecimal, IsNegative, IsNumber } from './utils'

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

/** c8 ignore next */
if (import.meta.vitest) {
  it('should not match a positive decimal', () => {
    type Result = NumberDecimalNegative<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match a positive integer', () => {
    type Result = NumberDecimalNegative<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should match a negative decimal', () => {
    type Result = NumberDecimalNegative<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1.1>()
  })

  it('should not match a negative integer', () => {
    type Result = NumberDecimalNegative<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type Result = NumberDecimalNegative<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type Result = NumberDecimalNegative<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
