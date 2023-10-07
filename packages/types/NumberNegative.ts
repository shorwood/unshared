import type { IsNegative, IsNumber } from './utils'

/**
 * A strictly negative number lower than zero.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be strictly negative.
 * @example NumberNegative<-1> // -1
 */
export type NumberNegative<N extends number> =
  IsNumber<N> extends true ? number
    : IsNegative<N> extends true ? N
      : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a negative integer', () => {
    type Result = NumberNegative<-1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  it('should match a negative decimal', () => {
    type Result = NumberNegative<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1.1>()
  })

  it('should not match a positive integer', () => {
    type Result = NumberNegative<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match a positive decimal', () => {
    type Result = NumberNegative<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type Result = NumberNegative<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type Result = NumberNegative<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
