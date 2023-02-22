import { AllPositive, AnyIsNumber, AnyIsZero, MultiAdd } from './utils'

/**
 * Product of two positive integers.
 *
 * @template A The first positive integer.
 * @template B The second positive integer.
 * @returns The product of the two positive integers.
 */
export type MathMultiply<A extends number, B extends number> =
  AnyIsNumber<A, B> extends true ? number
    : AnyIsZero<A, B> extends true ? 0
      : MultiAdd<A, 0, B>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should compute the product of 10 and 10 as 100', () => {
    type result = MathMultiply<5, 10>
    expectTypeOf<result>().toEqualTypeOf<50>()
  })

  it('should compute the product of 0 and 10 as 0', () => {
    type result = MathMultiply<0, 10>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should compute the product of 10 and 0 as 0', () => {
    type result = MathMultiply<10, 0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should compute the product of 0 and 0 as 0', () => {
    type result = MathMultiply<0, 0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should return number when a negative integer is passed', () => {
    type result = MathMultiply<5, -10>
    expectTypeOf<result>().toEqualTypeOf<-50>()
  })
}
