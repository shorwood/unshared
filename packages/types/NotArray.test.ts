import type { NotArray } from './NotArray'

describe('NotArray', () => {
  test('should return the type when it is not an array', () => {
    type Result = NotArray<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should exclude the array type when the type is an array', () => {
    type Result = NotArray<number | number[]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return never when the type is an array', () => {
    type Result = NotArray<number[]>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return never when the type is a readonly array', () => {
    type Result = NotArray<readonly number[]>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return never when the type is a tuple', () => {
    type Result = NotArray<[number, string]>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return never when the type is an array-like object', () => {
    interface ArrayLike { [key: number]: string; length: number }
    type Result = NotArray<ArrayLike>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
