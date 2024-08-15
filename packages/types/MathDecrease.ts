import type { MathAdd } from './MathAdd'

/**
 * Integer decreased by 1.
 *
 * @template N The integer to decrease.
 * @returns The integer decreased by 1.
 * @example MathDecrease<2> // 1
 */
export type MathDecrease<N extends number> = MathAdd<N, -1>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should decrease a positive integer', () => {
    type Result = MathDecrease<2>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should decrease a negative integer', () => {
    type Result = MathDecrease<-1>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  test('should decrease zero', () => {
    type Result = MathDecrease<0>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should decrease number', () => {
    type Result = MathDecrease<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
