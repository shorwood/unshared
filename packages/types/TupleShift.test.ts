import type { TupleShift } from './TupleShift'

describe('TupleShift', () => {
  test('should shift a tuple to the left by one', () => {
    type Result = TupleShift<[1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<[[2, 3], 1]>()
  })

  test('should shift an empty tuple and return undefined', () => {
    type Result = TupleShift<[]>
    expectTypeOf<Result>().toEqualTypeOf<[[], undefined]>()
  })

  test('should shift a tuple with one element and return an empty tuple', () => {
    type Result = TupleShift<[1]>
    expectTypeOf<Result>().toEqualTypeOf<[[], 1]>()
  })

  test('should shift an array', () => {
    type Result = TupleShift<number[]>
    expectTypeOf<Result>().toEqualTypeOf<[number[], number]>()
  })
})
