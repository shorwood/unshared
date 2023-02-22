
import { AllNegative, AnyIsNegative, AnyIsNumber, AnyIsZero, InternalAdd, InternalAddAllNegative, InternalAddOneNegative } from './utils'

/**
 * Sum of two integers.
 *
 * @template A The first integer.
 * @template B The second integer.
 * @returns The sum of the two integers.
 * @example MathAdd<1, 2> // 3
 */
export type MathAdd<A extends number, B extends number> =
  AnyIsNumber<A, B> extends true ? number
    : AnyIsZero<A, B> extends true ? 0
      : AllNegative<A, B> extends true ? InternalAddAllNegative<A, B>
        : AnyIsNegative<A, B> extends true ? InternalAddOneNegative<A, B>
          : InternalAdd<A, B>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should compute the sum of 10 and 10 as 20', () => {
    type result = MathAdd<10, 10>
    expectTypeOf<result>().toEqualTypeOf<20>()
  })

  it('should compute the sum of -10 and -10 as -20', () => {
    type result = MathAdd<-10, -10>
    expectTypeOf<result>().toEqualTypeOf<-20>()
  })

  it('should compute the sum of -5 and 10 as 5', () => {
    type result = MathAdd<-5, 10>
    expectTypeOf<result>().toEqualTypeOf<5>()
  })

  it('should compute the sum of 10 and -5 as 5', () => {
    type result = MathAdd<10, -5>
    expectTypeOf<result>().toEqualTypeOf<5>()
  })

  it('should compute the sum of -5 and 5 as 0', () => {
    type result = MathAdd<-5, 5>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should compute the sum of 5 and -5 as 0', () => {
    type result = MathAdd<5, -5>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should compute the sum of 0 and 0 as 0', () => {
    type result = MathAdd<0, 0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should return number the first argument is number', () => {
    type result = MathAdd<number, 0>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return number the second argument is number', () => {
    type result = MathAdd<0, number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
