import type { IsDecimal, IsNumber, IsPositive } from './utils'

/**
 * A positive decimal number.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a positive decimal number.
 * @example NumberDecimalPositive<1.1> // 1.1
 */
export type NumberDecimalPositive<N extends number = number> =
  IsNumber<N> extends true ? number
    : IsDecimal<N> extends true
      ? IsPositive<N> extends true ? N
        : never : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a positive decimal', () => {
    type Result = NumberDecimalPositive<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  it('should not match a positive integer', () => {
    type Result = NumberDecimalPositive<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match a negative decimal', () => {
    type Result = NumberDecimalPositive<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match a negative integer', () => {
    type Result = NumberDecimalPositive<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type Result = NumberDecimalPositive<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type Result = NumberDecimalPositive<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
