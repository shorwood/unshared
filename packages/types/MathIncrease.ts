import { MathAdd } from './MathAdd'

/**
 * Integer increased by 1
 *
 * @template A The number to increase
 * @returns The number increased by 1
 * @example Increase<1> // 2
 */
export type MathIncrease<N extends number> = MathAdd<N, 1>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should increase a positive integer', () => {
    type result = MathIncrease<1>
    expectTypeOf<result>().toEqualTypeOf<2>()
  })

  it('should increase a negative integer', () => {
    type result = MathIncrease<-1>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should increase zero', () => {
    type result = MathIncrease<0>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should increase number', () => {
    type result = MathIncrease<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
