import { MathMultiply } from './MathMultiply'

/**
 * The square of a number.
 *
 * @template N The number to square.
 * @returns The square of the number.
 * @example MathSquare<2> // 4
 */
export type MathSquare<N extends number> = MathMultiply<N, N>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should square a positive integer', () => {
    type result = MathSquare<2>
    expectTypeOf<result>().toEqualTypeOf<4>()
  })

  it('should square a negative integer', () => {
    type result = MathSquare<-2>
    expectTypeOf<result>().toEqualTypeOf<4>()
  })

  it('should return zero when squaring zero', () => {
    type result = MathSquare<0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should square number to number', () => {
    type result = MathSquare<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should square decimal to number', () => {
    type result = MathSquare<2.2>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
