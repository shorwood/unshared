import type { TupleConcat } from './TupleConcat'

describe('TupleConcat', () => {
  test('should concatenate two tuples together', () => {
    type Result = TupleConcat<[1, 2], [3, 4]>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2, 3, 4]>()
  })

  test('should return the second tuple if the first tuple is empty', () => {
    type Result = TupleConcat<[], [1, 2]>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2]>()
  })

  test('should return the first tuple if the second tuple is empty', () => {
    type Result = TupleConcat<[1, 2], []>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2]>()
  })

  test('should return an empty tuple if both tuples are empty', () => {
    type Result = TupleConcat<[], []>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  test('should return the same array if an array is passed', () => {
    type Result = TupleConcat<number[], number[]>
    expectTypeOf<Result>().toEqualTypeOf<number[]>()
  })

  test('should return a tuple with rest parameters at the end', () => {
    type Result = TupleConcat<[1, 2], number[]>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2, ...number[]]>()
  })

  test('should return a tuple with rest parameters at the start', () => {
    type Result = TupleConcat<number[], [1, 2]>
    expectTypeOf<Result>().toEqualTypeOf<[...number[], 1, 2]>()
  })
})
