import type { MathAdd } from './MathAdd'

/**
 * Integer increased by 1
 *
 * @template N The number to increase
 * @returns The number increased by 1
 * @example MathIncrease<1> // 2
 */
export type MathIncrease<N extends number> = MathAdd<N, 1>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should increase a positive integer', () => {
    type Result = MathIncrease<1>
    expectTypeOf<Result>().toEqualTypeOf<2>()
  })

  it('should increase a negative integer', () => {
    type Result = MathIncrease<-1>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  it('should increase zero', () => {
    type Result = MathIncrease<0>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  it('should increase number', () => {
    type Result = MathIncrease<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
