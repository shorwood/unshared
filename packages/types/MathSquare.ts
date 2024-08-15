import type { MathMultiply } from './MathMultiply'

/**
 * The square of a number.
 *
 * @template N The number to square.
 * @returns The square of the number.
 * @example MathSquare<2> // 4
 */
export type MathSquare<N extends number> = MathMultiply<N, N>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should square a positive integer', () => {
    type Result = MathSquare<2>
    expectTypeOf<Result>().toEqualTypeOf<4>()
  })

  test('should square a negative integer', () => {
    type Result = MathSquare<-2>
    expectTypeOf<Result>().toEqualTypeOf<4>()
  })

  test('should return zero when squaring zero', () => {
    type Result = MathSquare<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should square number to number', () => {
    type Result = MathSquare<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should square decimal to number', () => {
    type Result = MathSquare<2.2>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
