import type { Matrix } from './Matrix'

describe('Matrix', () => {
  test('should return a 4x4 matrix of numbers', () => {
    type Result = Matrix<4, number>
    expectTypeOf<Result>().toEqualTypeOf<[
      [number, number, number, number],
      [number, number, number, number],
      [number, number, number, number],
      [number, number, number, number],
    ]>()
  })

  test('should return a 3x3 matrix of strings', () => {
    type Result = Matrix<3, string>
    expectTypeOf<Result>().toEqualTypeOf<[
      [string, string, string],
      [string, string, string],
      [string, string, string],
    ]>()
  })

  test('should return a nested array of unknowns by default', () => {
    type Result = Matrix<number>
    expectTypeOf<Result>().toEqualTypeOf<unknown[][]>()
  })

  test('should return a nested array of unknown by default', () => {
    expectTypeOf<Matrix>().toEqualTypeOf<unknown[][]>()
  })

  test('should return empty matrix if L is 0', () => {
    type Result = Matrix<0>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  test('should return never if L is negative', () => {
    type Result = Matrix<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return never if L is a decimal', () => {
    type Result = Matrix<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
