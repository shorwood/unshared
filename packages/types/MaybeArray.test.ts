import type { MaybeArray } from './MaybeArray'

describe('MaybeArray', () => {
  test('should return a type that may be an array of unknown', () => {
    expectTypeOf<MaybeArray>().toEqualTypeOf<unknown>()
  })

  test('should return a type that may be an array of U', () => {
    type Result = MaybeArray<number>
    expectTypeOf<Result>().toEqualTypeOf<number | number[]>()
  })

  test('should return a type that may be an array of U when U is an array', () => {
    type Result = MaybeArray<number[]>
    expectTypeOf<Result>().toEqualTypeOf<number[] | number[][]>()
  })
})
