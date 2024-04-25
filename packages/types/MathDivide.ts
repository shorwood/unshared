import { Absolute, Divide, IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNegative, IsAnyNumber, IsDivisibleBy, IsZero, Negative } from './utils'

/**
 * Quotient of two positive integers.
 *
 * @template A The numerator.
 * @template B The denominator.
 * @returns The quotient of the two positive integers
 * @example MathDivide<10, 2> // 5
 */
export type MathDivide<A extends number, B extends number> =
  IsAnyNumber<A, B> extends true ? number
    : IsAnyDecimal<A, B> extends true ? number
      : IsZero<B> extends true ? never
        : IsDivisibleBy<A, B> extends false ? number
          : IsAllPositive<A, B> extends true ? Divide<A, B>
            : IsAllNegative<A, B> extends true ? Divide<Absolute<A>, Absolute<B>>
              : IsAnyNegative<A, B> extends true ? Negative<Divide<Absolute<A>, Absolute<B>>>
                : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should compute the quotient of 10 and 2 as 5', () => {
    type Result = MathDivide<10, 2>
    expectTypeOf<Result>().toEqualTypeOf<5>()
  })

  test('should return number when a negative integer is passed', () => {
    type Result = MathDivide<10, -2>
    expectTypeOf<Result>().toEqualTypeOf<-5>()
  })

  test('should return number when two negative integer are passed', () => {
    type Result = MathDivide<-10, -2>
    expectTypeOf<Result>().toEqualTypeOf<5>()
  })

  test('should compute the quotient of 0 and 10 as 0', () => {
    type Result = MathDivide<0, 10>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should compute the quotient of 10 and 0 as never', () => {
    type Result = MathDivide<10, 0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should compute the quotient of 0 and 0 as never', () => {
    type Result = MathDivide<0, 0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return number when number is not divisible by the divisor', () => {
    type Result = MathDivide<10, 3>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return number when a number is passed', () => {
    type Result = MathDivide<10, number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return number when a decimal is passed', () => {
    type Result = MathDivide<10, 3.14>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
