import type { IsNumber, IsPositive, IsZero } from './utils'

/**
 * A strictly positive number greater than zero.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be striclty positive.
 * @example NumberPositive<1> // 1
 */
export type NumberPositive<N extends number> =
  IsNumber<N> extends true ? number
    : IsZero<N> extends true ? never
      : IsPositive<N> extends true ? N
        : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match a positive integer', () => {
    type Result = NumberPositive<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should match a positive decimal', () => {
    type Result = NumberPositive<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  test('should not match a negative integer', () => {
    type Result = NumberPositive<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a negative decimal', () => {
    type Result = NumberPositive<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match zero', () => {
    type Result = NumberPositive<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match number', () => {
    type Result = NumberPositive<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
