import type { Absolute, IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNegative, IsAnyNumber, IsZero, Modulo, Negative } from './utils'

/**
 * Remainder of the division of two positive integers.
 *
 * @template A The first positive integer.
 * @template B The second positive integer.
 * @returns The remainder of the division of the two positive integers.
 * @example MathModulo<1, 2> // 1
 */
export type MathModulo<A extends number, B extends number> =
  IsAnyNumber<A, B> extends true ? number
    : IsAnyDecimal<A, B> extends true ? number
      : IsZero<B> extends true ? never
        : IsAllPositive<A, B> extends true ? Modulo<A, B>
          : IsAllNegative<A, B> extends true ? Modulo<Absolute<A>, Absolute<B>>
            : IsAnyNegative<A, B> extends true ? Negative<Modulo<Absolute<A>, Absolute<B>>>
              : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should compute the remainder of 10 and 8 as 2', () => {
    type Result = MathModulo<10, 8>
    expectTypeOf<Result>().toEqualTypeOf<2>()
  })

  it('should compute the remainder of 10 and -8 as -2', () => {
    type Result = MathModulo<10, -8>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  it('should compute the remainder of -10 and 8 as -2', () => {
    type Result = MathModulo<-10, 8>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  it('should compute the remainder of -10 and -8 as 2', () => {
    type Result = MathModulo<-10, -8>
    expectTypeOf<Result>().toEqualTypeOf<2>()
  })

  it('should compute the remainder of 0 and 10 as 0', () => {
    type Result = MathModulo<0, 10>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  it('should compute the remainder of 10 and 0 as never', () => {
    type Result = MathModulo<10, 0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should compute the remainder of 0 and 0 as never', () => {
    type Result = MathModulo<0, 0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should return number when a number is passed', () => {
    type Result = MathModulo<10, number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return number when a decimal is passed', () => {
    type Result = MathModulo<10, 3.14>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
