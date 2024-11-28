import type { Collection } from './Collection'

describe('Collection', () => {
  test('should return a collection of numbers', () => {
    type Result = Collection<number>
    type Expected = Iterable<number> | readonly number[] | Record<PropertyKey, number>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a collection of unknowns', () => {
    type Expected = Iterable<unknown> | readonly unknown[] | Record<PropertyKey, unknown>
    expectTypeOf<Collection>().toEqualTypeOf<Expected>()
  })
})
