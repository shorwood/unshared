import type { NotPromise } from './NotPromise'

describe('NotPromise', () => {
  test('should return the type when it is not a promise', () => {
    type Result = NotPromise<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should exclude the promise type when unioned with a promise', () => {
    type Result = NotPromise<number | Promise<number>>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return never when the type is a promise', () => {
    type Result = NotPromise<Promise<number>>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
