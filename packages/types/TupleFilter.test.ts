import type { TupleFilter } from './TupleFilter'

describe('TupleFilter', () => {
  test('should filter out elements that do not match the given type in a tuple', () => {
    type Result = TupleFilter<[1, 'a', 2, 'b', 3], boolean>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  test('should filter in elements that match the given type in a tuple', () => {
    type Result = TupleFilter<[1, 'a', 2, 'b', 3], number>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2, 3]>()
  })

  test('should filter all elements that match the given type in a tuple', () => {
    type Result = TupleFilter<[1, 'a', 2, 'b', 3], any>
    expectTypeOf<Result>().toEqualTypeOf<[1, 'a', 2, 'b', 3]>()
  })

  test('should filter out elements that do not match the given type in an array', () => {
    type Result = TupleFilter<Array<number | string>, number>
    expectTypeOf<Result>().toEqualTypeOf<number[]>()
  })

  test('should filter in elements that match the given type in an array', () => {
    type Result = TupleFilter<[1, 'a', 2, 'b', 3], number | string>
    expectTypeOf<Result>().toEqualTypeOf<[1, 'a', 2, 'b', 3]>()
  })

  test('should return an empty array if no elements match the given type', () => {
    type Result = TupleFilter<Array<number | string>, boolean>
    expectTypeOf<Result>().toEqualTypeOf<never[]>()
  })

  test('should filter readonly tuples', () => {
    type Result = TupleFilter<readonly [1, 'a', 2, 'b', 3], number>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2, 3]>()
  })
})
