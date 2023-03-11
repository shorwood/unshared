import { Absolute, IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNegative, IsAnyNumber, IsZero, Modulo, Negative } from './utils/arithmetics'

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
    type result = MathModulo<10, 8>
    expectTypeOf<result>().toEqualTypeOf<2>()
  })

  it('should compute the remainder of 10 and -8 as -2', () => {
    type result = MathModulo<10, -8>
    expectTypeOf<result>().toEqualTypeOf<-2>()
  })

  it('should compute the remainder of -10 and 8 as -2', () => {
    type result = MathModulo<-10, 8>
    expectTypeOf<result>().toEqualTypeOf<-2>()
  })

  it('should compute the remainder of -10 and -8 as 2', () => {
    type result = MathModulo<-10, -8>
    expectTypeOf<result>().toEqualTypeOf<2>()
  })

  it('should compute the remainder of 0 and 10 as 0', () => {
    type result = MathModulo<0, 10>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should compute the remainder of 10 and 0 as never', () => {
    type result = MathModulo<10, 0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should compute the remainder of 0 and 0 as never', () => {
    type result = MathModulo<0, 0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should return number when a number is passed', () => {
    type result = MathModulo<10, number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return number when a decimal is passed', () => {
    type result = MathModulo<10, 3.14>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
