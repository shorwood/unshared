import { MathNegative } from './MathNegative'
import { MathAdd } from './MathAdd'

/**
 * Difference of two positive integers.
 *
 * @template A The first positive integer.
 * @template B The second positive integer
 * @returns The difference of the two positive integers.
 */
export type MathSubstract<A extends number, B extends number> = MathAdd<A, MathNegative<B>>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should compute the difference of 10 and 10 as 0', () => {
    type Result = MathSubstract<10, 10>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should compute the difference of -10 and -10 as 0', () => {
    type Result = MathSubstract<-10, -10>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should compute the difference of -5 and 10 as -15', () => {
    type Result = MathSubstract<-5, 10>
    expectTypeOf<Result>().toEqualTypeOf<-15>()
  })

  test('should compute the difference of 10 and -5 as 15', () => {
    type Result = MathSubstract<10, -5>
    expectTypeOf<Result>().toEqualTypeOf<15>()
  })

  test('should compute the difference of -5 and 5 as -10', () => {
    type Result = MathSubstract<-5, 5>
    expectTypeOf<Result>().toEqualTypeOf<-10>()
  })

  test('should compute the difference of 5 and -5 as 10', () => {
    type Result = MathSubstract<5, -5>
    expectTypeOf<Result>().toEqualTypeOf<10>()
  })

  test('should compute the difference of 0 and 0 as 0', () => {
    type Result = MathSubstract<0, 0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should return number the first argument is number', () => {
    type Result = MathSubstract<number, 0>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return number the second argument is number', () => {
    type Result = MathSubstract<0, number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
