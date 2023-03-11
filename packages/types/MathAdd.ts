
import { Absolute, Add, AddOneNegative, IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNegative, IsAnyNumber, IsZero, Negative } from './utils/arithmetics'

/**
 * Sum of two integers.
 *
 * @template A The first integer.
 * @template B The second integer.
 * @returns The sum of the two integers.
 * @example MathAdd<1, 2> // 3
 */
export type MathAdd<A extends number, B extends number> =
  IsAnyNumber<A, B> extends true ? number
    : IsAnyDecimal<A, B> extends true ? number
      : IsZero<A> extends true ? B
        : IsZero<B> extends true ? A
          : IsAllPositive<A, B> extends true ? Add<A, B>
            : IsAllNegative<A, B> extends true ? Negative<Add<Absolute<A>, Absolute<B>>>
              : IsAnyNegative<A, B> extends true ? AddOneNegative<A, B>
                : never

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

  it('should compute the sum of 0 and 10 as 10', () => {
    type result = MathAdd<0, 10>
    expectTypeOf<result>().toEqualTypeOf<10>()
  })

  it('should compute the sum of 10 and 0 as 10', () => {
    type result = MathAdd<10, 0>
    expectTypeOf<result>().toEqualTypeOf<10>()
  })

  it('should compute the sum of 0 and 0 as 0', () => {
    type result = MathAdd<0, 0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should return number the argument is number', () => {
    type result = MathAdd<number, 0>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return number the argument is decimal', () => {
    type result = MathAdd<10, 3.14>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
