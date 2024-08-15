import type { Tuple } from './Tuple'
import type { IsDecimal, IsNumber, IsZero } from './utils'

/**
 * A 2-dimensional square matrix size `D` of elements of type `U`.
 *
 * @template U The type of the elements.
 * @example Matrix<number> // number[][][]
 */
export type Matrix<L extends number = number, U = unknown> =
  IsNumber<L> extends true ? U[][]
    : IsZero<L> extends true ? []
      : IsDecimal<L> extends true ? never
        : Tuple<L, Tuple<L, U>>

/** v8 ignore start */
if (import.meta.vitest) {
  test('should return a 4x4 matrix of numbers', () => {
    type Result = Matrix<4, number>
    type Expected = [
      [number, number, number, number],
      [number, number, number, number],
      [number, number, number, number],
      [number, number, number, number],
    ]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a nested array of unknowns by default', () => {
    type Result = Matrix<number>
    type Expected = unknown[][]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a nested array of unknown by default', () => {
    type Result = Matrix
    type Expected = unknown[][]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return empty matrix if L is 0', () => {
    type Result = Matrix<0>
    type Expected = []
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return never if L is negative', () => {
    type Result = Matrix<-1>
    type Expected = never
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return never if L is a decimal', () => {
    type Result = Matrix<1.1>
    type Expected = never
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
