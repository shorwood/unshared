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

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match a negative integer', () => {
    type Result = NumberNegative<-1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should match a negative decimal', () => {
    type Result = NumberNegative<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1.1>()
  })

  test('should not match a positive integer', () => {
    type Result = NumberNegative<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a positive decimal', () => {
    type Result = NumberNegative<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match zero', () => {
    type Result = NumberNegative<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match number', () => {
    type Result = NumberNegative<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
