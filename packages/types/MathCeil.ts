import { MathAdd } from './MathAdd'
import { MathNegate } from './MathNegate'

/**
 * Ceils a number to the nearest integer.
 *
 * @template N The number to ceil.
 * @returns The ceiled number.
 * @example MathCeil<1.1> // 2
 */

export type MathCeil<N extends number> =
  number extends N ? number
    : `${N}` extends `-${infer S extends number}.${number}` ? MathNegate<S>
      : `${N}` extends `${infer S extends number}.${number}` ? MathAdd<S, 1>
        : N extends number ? N : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should ceil a positive decimal', () => {
    type result = MathCeil<1.1>
    expectTypeOf<result>().toEqualTypeOf<2>()
  })

  it('should ceil a negative decimal', () => {
    type result = MathCeil<-1.1>
    expectTypeOf<result>().toEqualTypeOf<-1>()
  })

  it('should ceil a positive integer', () => {
    type result = MathCeil<1>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should ceil a negative integer', () => {
    type result = MathCeil<-1>
    expectTypeOf<result>().toEqualTypeOf<-1>()
  })

  it('should ceil zero', () => {
    type result = MathCeil<0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should ceil number', () => {
    type result = MathCeil<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
