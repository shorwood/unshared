import type { MaybeFunction } from './MaybeFunction'

describe('MaybeFunction', () => {
  test('should return a union of a number and a function that returns a number', () => {
    type Result = MaybeFunction<number>
    expectTypeOf<Result>().toEqualTypeOf<(() => number) | number>()
  })

  test('should return a union of a string and a function that returns a string', () => {
    type Result = MaybeFunction<string>
    expectTypeOf<Result>().toEqualTypeOf<(() => string) | string>()
  })

  test('should return a union of a number and a function that returns a number with arguments', () => {
    type Result = MaybeFunction<number, [n: number]>
    expectTypeOf<Result>().toEqualTypeOf<((n: number) => number) | number>()
  })
})
