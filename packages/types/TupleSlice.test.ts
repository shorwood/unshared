import type { TupleSlice } from './TupleSlice'

describe('TupleSlice', () => {
  test('should extract a slice of a tuple type from the beginning', () => {
    type Result = TupleSlice<[1, 2, 3, 4, 5], 1>
    type Expected = [2, 3, 4, 5]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should extract a slice of a tuple type from the end', () => {
    type Result = TupleSlice<[1, 2, 3, 4, 5], 0, 4>
    type Expected = [1, 2, 3, 4]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should extract a slice of a tuple type from the middle', () => {
    type Result = TupleSlice<[1, 2, 3, 4, 5], 2, 4>
    type Expected = [3, 4]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return as-is if the starting index is number', () => {
    type Result = TupleSlice<[1, 2, 3, 4, 5], number>
    type Expected = [1, 2, 3, 4, 5]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
})
