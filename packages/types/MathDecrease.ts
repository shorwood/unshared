import { MathAdd } from './MathAdd'

/**
 * Integer decreased by 1.
 *
 * @template N The integer to decrease.
 * @returns The integer decreased by 1.
 * @example MathDecrease<2> // 1
 */
export type MathDecrease<N extends number> =
  MathAdd<N, -1>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should decrease a positive integer', () => {
    type result = MathDecrease<2>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should decrease a negative integer', () => {
    type result = MathDecrease<-1>
    expectTypeOf<result>().toEqualTypeOf<-2>()
  })

  it('should decrease zero', () => {
    type result = MathDecrease<0>
    expectTypeOf<result>().toEqualTypeOf<-1>()
  })

  it('should decrease number', () => {
    type result = MathDecrease<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
