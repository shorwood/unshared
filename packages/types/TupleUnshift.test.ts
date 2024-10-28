import type { TupleUnshift } from './TupleUnshift'

describe('TupleUnshift', () => {
  test('should prepend an element to a tuple', () => {
    type Result = TupleUnshift<[1, 2, 3], 0>
    expectTypeOf<Result>().toEqualTypeOf<[0, 1, 2, 3]>()
  })

  test('should return a tuple with the prepended element if the tuple is empty', () => {
    type Result = TupleUnshift<[], 1>
    expectTypeOf<Result>().toEqualTypeOf<[1]>()
  })

  test('should return a tuple with the prepended element if an array is passed', () => {
    type Result = TupleUnshift<number[], 1>
    expectTypeOf<Result>().toEqualTypeOf<[1, ...number[]]>()
  })
})
