import type { TuplePop } from './TuplePop'

describe('TuplePop', () => {
  test('should pop the last element of a tuple', () => {
    type Result = TuplePop<[1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<[[1, 2], 3]>()
  })

  test('should pop an empty tuple and return undefined', () => {
    type Result = TuplePop<[]>
    expectTypeOf<Result>().toEqualTypeOf<[[], undefined]>()
  })

  test('should pop a tuple with one element and return an empty tuple', () => {
    type Result = TuplePop<[1]>
    expectTypeOf<Result>().toEqualTypeOf<[[], 1]>()
  })

  test('should pop an array', () => {
    type Result = TuplePop<number[]>
    expectTypeOf<Result>().toEqualTypeOf<[number[], number]>()
  })
})
