import { Add, IsInteger, IsNumber, Negative } from './utils/arithmetics'

/**
 * Ceils a number to the nearest integer.
 *
 * @template N The number to ceil.
 * @returns The ceiled number.
 * @example MathCeil<1.1> // 2
 */
export type MathCeil<N extends number> =
  IsNumber<N> extends true ? number
    :IsInteger<N> extends true ? N
      : `${N}` extends `-${infer S extends number}.${number}` ? Negative<S>
        : `${N}` extends `${infer S extends number}.${number}` ? Add<S, 1>
          : never

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
