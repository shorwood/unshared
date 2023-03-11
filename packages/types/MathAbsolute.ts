import { Absolute, IsNumber, IsZero } from './utils/arithmetics'

/**
 * Returns the absolute value of a number.
 *
 * @template N The number to get the absolute value of.
 * @returns The absolute value of the number.
 * @example MathAbsolute<-1> // 1
 */
export type MathAbsolute<N extends number> =
  IsNumber<N> extends true ? number
    : IsZero<N> extends true ? 0
      : Absolute<N>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the absolute value of a positive integer', () => {
    type result = MathAbsolute<1>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should get the absolute value of a negative integer', () => {
    type result = MathAbsolute<-1>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should get the absolute value of a positive float', () => {
    type result = MathAbsolute<1.1>
    expectTypeOf<result>().toEqualTypeOf<1.1>()
  })

  it('should get the absolute value of a negative float', () => {
    type result = MathAbsolute<-1.1>
    expectTypeOf<result>().toEqualTypeOf<1.1>()
  })

  it('should get the absolute value of zero', () => {
    type result = MathAbsolute<0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should get the absolute value of number', () => {
    type result = MathAbsolute<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
