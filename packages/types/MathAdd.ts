import { Absolute, Add, IsLower, Negative, Substract } from './utils/arithmetics'
import { IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNumber, IsEqual, IsNegative, IsZero } from './utils/predicate'

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
              : IsEqual<Absolute<A>, Absolute<B>> extends true ? 0
                : IsNegative<A> extends true ? IsLower<Absolute<A>, B> extends true ? Substract<B, Absolute<A>> : Negative<Substract<Absolute<A>, B>>
                  : IsNegative<B> extends true ? IsLower<Absolute<B>, A> extends true ? Substract<A, Absolute<B>> : Negative<Substract<Absolute<B>, A>>
                    : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should compute the sum of 10 and 10 as 20', () => {
    type Result = MathAdd<10, 10>
    expectTypeOf<Result>().toEqualTypeOf<20>()
  })

  it('should compute the sum of -10 and -10 as -20', () => {
    type Result = MathAdd<-10, -10>
    expectTypeOf<Result>().toEqualTypeOf<-20>()
  })

  it('should compute the sum of -5 and 10 as 5', () => {
    type Result = MathAdd<-5, 10>
    expectTypeOf<Result>().toEqualTypeOf<5>()
  })

  it('should compute the sum of 5 and -10 as -5', () => {
    type Result = MathAdd<5, -10>
    expectTypeOf<Result>().toEqualTypeOf<-5>()
  })

  it('should compute the sum of 10 and -5 as 5', () => {
    type Result = MathAdd<10, -5>
    expectTypeOf<Result>().toEqualTypeOf<5>()
  })

  it('should compute the sum of -5 and 5 as 0', () => {
    type Result = MathAdd<-5, 5>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  it('should compute the sum of 0 and 10 as 10', () => {
    type Result = MathAdd<0, 10>
    expectTypeOf<Result>().toEqualTypeOf<10>()
  })

  it('should compute the sum of 10 and 0 as 10', () => {
    type Result = MathAdd<10, 0>
    expectTypeOf<Result>().toEqualTypeOf<10>()
  })

  it('should compute the sum of 0 and 0 as 0', () => {
    type Result = MathAdd<0, 0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  it('should return number the argument is number', () => {
    type Result = MathAdd<number, 0>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return number the argument is decimal', () => {
    type Result = MathAdd<10, 3.14>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
