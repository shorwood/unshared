import type { Unique } from './Unique'

describe('Unique', () => {
  test('should deduplicate a tuple of numbers', () => {
    type Result = Unique<[1, 1, 2, 3, 3]>
    type Expected = [1, 2, 3]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should deduplicate a tuple of strings', () => {
    type Result = Unique<['a', 'b', 'a', 'c', 'c']>
    type Expected = ['a', 'b', 'c']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should deduplicate a tuple of mixed types', () => {
    type Result = Unique<[1, 'a', 1, 'b', 'b']>
    type Expected = [1, 'a', 'b']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should handle empty tuples', () => {
    type Result = Unique<[]>
    type Expected = []
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should handle tuples with a single value', () => {
    type Result = Unique<[1]>
    type Expected = [1]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
})
