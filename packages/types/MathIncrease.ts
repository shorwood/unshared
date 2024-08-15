import type { MathAdd } from './MathAdd'

/**
 * Integer increased by 1
 *
 * @template N The number to increase
 * @returns The number increased by 1
 * @example MathIncrease<1> // 2
 */
export type MathIncrease<N extends number> = MathAdd<N, 1>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should increase a positive integer', () => {
    type Result = MathIncrease<1>
    expectTypeOf<Result>().toEqualTypeOf<2>()
  })

  test('should increase a negative integer', () => {
    type Result = MathIncrease<-1>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should increase zero', () => {
    type Result = MathIncrease<0>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should increase number', () => {
    type Result = MathIncrease<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
