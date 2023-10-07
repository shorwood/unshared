import type { MathAdd } from './MathAdd'

/**
 * Computes the sum of a tuple of numbers.
 *
 * @template N The tuple of numbers.
 * @returns The sum of the numbers.
 * @example MathSum<[1, 2, 3]> // 6
 */
export type MathSum<N extends number[]> =
  N extends [infer A extends number, ...infer B extends number[]]
    ? MathAdd<A, MathSum<B>>
    : N extends [infer A extends number] ? A : 0

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute the sum of positive integers', () => {
    type Result = MathSum<[1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<6>()
  })

  it('should compute the sum of negative integers', () => {
    type Result = MathSum<[-1, -2, -3]>
    expectTypeOf<Result>().toEqualTypeOf<-6>()
  })

  it('should compute the sum of mixed integers', () => {
    type Result = MathSum<[-1, 2, -3]>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  it('should compute the sum of a single integer', () => {
    type Result = MathSum<[1]>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  it('should compute the sum of an empty tuple', () => {
    type Result = MathSum<[]>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  it('should compute the sum of decimals to a number', () => {
    type Result = MathSum<[1, 2.5, 3]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should compute the sum of a tuple of numbers to a number', () => {
    type Result = MathSum<[1, 2, number]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
