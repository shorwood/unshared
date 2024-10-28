import type { ObjectLike } from './ObjectLike'

describe('ObjectLike', () => {
  test('should return an object of unknowns', () => {
    type Expected = Record<string, unknown>
    expectTypeOf<ObjectLike>().toEqualTypeOf<Expected>()
  })

  test('should return an object of numbers', () => {
    type Result = ObjectLike<number>
    type Expected = Record<string, number>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return an object of numbers with string keys', () => {
    type Result = ObjectLike<number, string>
    type Expected = Record<string, number>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
})
