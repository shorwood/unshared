import { IsInteger, IsNegative, IsNumber } from './utils'

/**
 * A negative integer.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a negative integer.
 * @example NumberIntegerNegative<1> // 1
 */
export type NumberIntegerNegative<N extends number> =
  IsNumber<N> extends true ? number
    : IsInteger<N> extends true
      ? IsNegative<N> extends true ? N
        : never : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a negative integer', () => {
    type Result = NumberIntegerNegative<-1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  it('should not match a positive integer', () => {
    type Result = NumberIntegerNegative<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match a negative decimal', () => {
    type Result = NumberIntegerNegative<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match a positive decimal', () => {
    type Result = NumberIntegerNegative<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type Result = NumberIntegerNegative<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type Result = NumberIntegerNegative<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
