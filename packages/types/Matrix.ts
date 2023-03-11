import { Tuple } from './Tuple'
import { IsDecimal, IsNumber, IsZero } from './utils/arithmetics'

/**
 * A matrix of `D` dimensions of elements of type U.
 *
 * @template U The type of the elements.
 * @example Matrix<number> // number[][][]
 */
export type Matrix<U = unknown, D extends number = number> =
  IsNumber<D> extends true ? U[][]
    : IsZero<D> extends true ? U
      : IsDecimal<D> extends true ? never
        : Tuple<D, Tuple<D, U>>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a 4x4 matrix of numbers', () => {
    type result = Matrix<number, 4>
    type expected = [
      [number, number, number, number],
      [number, number, number, number],
      [number, number, number, number],
      [number, number, number, number],
    ]
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return a nested array of numbers by default', () => {
    type result = Matrix<number>
    type expected = number[][]
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return a nested array of unknown by default', () => {
    type result = Matrix
    type expected = unknown[][]
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return U if D is zero', () => {
    type result = Matrix<number, 0>
    type expected = number
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return never if D is negative', () => {
    type result = Matrix<number, -1>
    type expected = never
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return never if D is a decimal', () => {
    type result = Matrix<number, 1.1>
    type expected = never
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })
}
