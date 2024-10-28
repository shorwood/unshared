import type { Collection } from './Collection'

describe('Collection', () => {
  test('should return a collection of numbers', () => {
    type Result = Collection<number>
    type Expected = Iterable<number> | Record<PropertyKey, number> | readonly number[]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a collection of unknowns', () => {
    type Expected = Iterable<unknown> | Record<PropertyKey, unknown> | readonly unknown[]
    expectTypeOf<Collection>().toEqualTypeOf<Expected>()
  })
})
