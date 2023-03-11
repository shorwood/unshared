import { Absolute, Divide, IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNegative, IsAnyNumber, IsZero, Negative } from './utils/arithmetics'

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
        : IsAllPositive<A, B> extends true ? Divide<A, B>
          : IsAllNegative<A, B> extends true ? Divide<Absolute<A>, Absolute<B>>
            : IsAnyNegative<A, B> extends true ? Negative<Divide<Absolute<A>, Absolute<B>>>
              : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should compute the quotient of 10 and 2 as 5', () => {
    type result = MathDivide<10, 2>
    expectTypeOf<result>().toEqualTypeOf<5>()
  })

  it('should return number when a negative integer is passed', () => {
    type result = MathDivide<10, -2>
    expectTypeOf<result>().toEqualTypeOf<-5>()
  })

  it('should return number when two negative integer are passed', () => {
    type result = MathDivide<-10, -2>
    expectTypeOf<result>().toEqualTypeOf<5>()
  })

  it('should compute the quotient of 0 and 10 as 0', () => {
    type result = MathDivide<0, 10>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should compute the quotient of 10 and 0 as never', () => {
    type result = MathDivide<10, 0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should compute the quotient of 0 and 0 as never', () => {
    type result = MathDivide<0, 0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should return number when a number is passed', () => {
    type result = MathDivide<10, number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return number when a decimal is passed', () => {
    type result = MathDivide<10, 3.14>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
