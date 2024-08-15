import type { IsInteger, IsNumber } from './utils'

/**
 * An integer number.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be an integer.
 * @example NumberInteger<1> // 1
 */
export type NumberInteger<N extends number> =
  IsNumber<N> extends true ? number
    : IsInteger<N> extends true ? N
      : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match a positive integer', () => {
    type Result = NumberInteger<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should not match a positive decimal', () => {
    type Result = NumberInteger<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match a negative integer', () => {
    type Result = NumberInteger<-1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should not match a negative decimal', () => {
    type Result = NumberInteger<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match zero', () => {
    type Result = NumberInteger<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should match number', () => {
    type Result = NumberInteger<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
