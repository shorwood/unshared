import { IsInteger, IsNumber, IsPositive, IsZero } from './utils/predicate'

/**
 * A strictly positive integer number. Excludes zero.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a strict positive integer.
 * @example NumberIntegerPositive<1> // 1
 */
export type NumberIntegerPositive<N extends number> =
  IsNumber<N> extends true ? number
    : IsZero<N> extends true ? never
      : IsInteger<N> extends true
        ? IsPositive<N> extends true ? N
          : never : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a positive integer', () => {
    type Result = NumberIntegerPositive<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  it('should not match a positive decimal', () => {
    type Result = NumberIntegerPositive<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match a negative integer', () => {
    type Result = NumberIntegerPositive<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match a negative decimal', () => {
    type Result = NumberIntegerPositive<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type Result = NumberIntegerPositive<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type Result = NumberIntegerPositive<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
