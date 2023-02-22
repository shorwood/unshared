import { MathAdd } from './MathAdd'
import { MathNegate } from './MathNegate'
import { AnyIsNumber, AnyIsZero } from './utils'

/**
 * Difference of two positive integers.
 *
 * @template A The first positive integer.
 * @template B The second positive integer
 * @returns The difference of the two positive integers.
 */
export type MathSubtract<A extends number, B extends number> =
  AnyIsNumber<A, B> extends true ? number
    : AnyIsZero<A, B> extends true ? 0
      : MathAdd<A, MathNegate<B>>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should compute the difference of 10 and 10 as 0', () => {
    type result = MathSubtract<10, 10>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should compute the difference of -10 and -10 as 0', () => {
    type result = MathSubtract<-10, -10>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should compute the difference of -5 and 10 as -15', () => {
    type result = MathSubtract<-5, 10>
    expectTypeOf<result>().toEqualTypeOf<-15>()
  })

  it('should compute the difference of 10 and -5 as 15', () => {
    type result = MathSubtract<10, -5>
    expectTypeOf<result>().toEqualTypeOf<15>()
  })

  it('should compute the difference of -5 and 5 as -10', () => {
    type result = MathSubtract<-5, 5>
    expectTypeOf<result>().toEqualTypeOf<-10>()
  })

  it('should compute the difference of 5 and -5 as 10', () => {
    type result = MathSubtract<5, -5>
    expectTypeOf<result>().toEqualTypeOf<10>()
  })

  it('should compute the difference of 0 and 0 as 0', () => {
    type result = MathSubtract<0, 0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should return number the first argument is number', () => {
    type result = MathSubtract<number, 0>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return number the second argument is number', () => {
    type result = MathSubtract<0, number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
