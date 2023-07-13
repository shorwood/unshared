import { IsDecimal, IsNumber } from './utils/predicate'

/**
 * A decimal number.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a positive decimal number.
 * @example NumberDecimal<1.1> // 1.1
 */
export type NumberDecimal<N extends number = number> =
  IsNumber<N> extends true ? number
    : IsDecimal<N> extends true ? N
      : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a positive decimal', () => {
    type Result = NumberDecimal<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  it('should not match a positive integer', () => {
    type Result = NumberDecimal<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match a negative decimal', () => {
    type Result = NumberDecimal<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1.1>()
  })

  it('should not match a negative integer', () => {
    type Result = NumberDecimal<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type Result = NumberDecimal<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type Result = NumberDecimal<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
