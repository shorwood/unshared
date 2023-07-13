import { Absolute, Multiply, Negative } from './utils/arithmetics'
import { IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNegative, IsAnyNumber, IsAnyZero } from './utils/predicate'

/**
 * Product of two positive integers.
 *
 * @template A The multiplicand.
 * @template B The multiplier.
 * @returns The product of the two positive integers.
 * @example MathMultiply<4, 4> // 16
 */
export type MathMultiply<A extends number, B extends number> =
  IsAnyNumber<A, B> extends true ? number
    : IsAnyDecimal<A, B> extends true ? number
      : IsAnyZero<A, B> extends true ? 0
        : IsAllPositive<A, B> extends true ? Multiply<A, B>
          : IsAllNegative<A, B> extends true ? Multiply<Absolute<A>, Absolute<B>>
            : IsAnyNegative<A, B> extends true ? Negative<Multiply<Absolute<A>, Absolute<B>>>
              : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should compute the product of 10 and 10 as 100', () => {
    type Result = MathMultiply<5, 10>
    expectTypeOf<Result>().toEqualTypeOf<50>()
  })

  it('should return number when a negative integer is passed', () => {
    type Result = MathMultiply<5, -10>
    expectTypeOf<Result>().toEqualTypeOf<-50>()
  })

  it('should return number when two negative integer are passed', () => {
    type Result = MathMultiply<-5, -10>
    expectTypeOf<Result>().toEqualTypeOf<50>()
  })

  it('should compute the product of 0 and 10 as 0', () => {
    type Result = MathMultiply<0, 10>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  it('should compute the product of 10 and 0 as 0', () => {
    type Result = MathMultiply<10, 0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  it('should compute the product of 0 and 0 as 0', () => {
    type Result = MathMultiply<0, 0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  it('should return number when a number is passed', () => {
    type Result = MathMultiply<10, number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
