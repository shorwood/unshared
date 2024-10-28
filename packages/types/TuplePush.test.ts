import type { TuplePush } from './TuplePush'

describe('TuplePush', () => {
  test('should push a type to the end of a tuple', () => {
    type Result = TuplePush<[1, 2, 3], 4>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2, 3, 4]>()
  })

  test('should push a type to an empty tuple', () => {
    type Result = TuplePush<[], 1>
    expectTypeOf<Result>().toEqualTypeOf<[1]>()
  })

  test('should push a type to an array', () => {
    type Result = TuplePush<number[], 1>
    expectTypeOf<Result>().toEqualTypeOf<[...number[], 1]>()
  })
})
