import { Tuple } from './Tuple'
import { IsDecimal, IsNumber, IsZero } from './utils/predicate'

/**
 * A 2-dimensional square matrix size `D` of elements of type `U`.
 *
 * @template U The type of the elements.
 * @example Matrix<number> // number[][][]
 */
export type Matrix<U = unknown, L extends number = number> =
  IsNumber<L> extends true ? U[][]
    : IsZero<L> extends true ? []
      : IsDecimal<L> extends true ? never
        : Tuple<L, Tuple<L, U>>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a 4x4 matrix of numbers', () => {
    type Result = Matrix<number, 4>
    type Expected = [
      [number, number, number, number],
      [number, number, number, number],
      [number, number, number, number],
      [number, number, number, number],
    ]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return a nested array of numbers by default', () => {
    type Result = Matrix<number>
    type Expected = number[][]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return a nested array of unknown by default', () => {
    type Result = Matrix
    type Expected = unknown[][]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return empty matrix if D is 0', () => {
    type Result = Matrix<number, 0>
    type Expected = []
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return never if D is negative', () => {
    type Result = Matrix<number, -1>
    type Expected = never
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return never if D is a decimal', () => {
    type Result = Matrix<number, 1.1>
    type Expected = never
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
