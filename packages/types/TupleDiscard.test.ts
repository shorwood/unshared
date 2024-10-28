import type { TupleDiscard } from './TupleDiscard'

describe('TupleDiscard', () => {
  test('should discard out elements that match the given type in a tuple', () => {
    type Result = TupleDiscard<[1, 'a', 2, 'b', 3], number>
    expectTypeOf<Result>().toEqualTypeOf<['a', 'b']>()
  })

  test('should discard all elements that match the given type in a tuple', () => {
    type Result = TupleDiscard<[1, 'a', 2, 'b', 3], any>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  test('should discard elements that match the given type in an array', () => {
    type Result = TupleDiscard<Array<number | string>, number>
    expectTypeOf<Result>().toEqualTypeOf<string[]>()
  })

  test('should leave the tuple unchanged if no elements match the given type', () => {
    type Result = TupleDiscard<[1, 'a', 2, 'b', 3], boolean>
    expectTypeOf<Result>().toEqualTypeOf<[1, 'a', 2, 'b', 3]>()
  })

  test('should discard readonly tuples', () => {
    type Result = TupleDiscard<readonly [1, 'a', 2, 'b', 3], number>
    expectTypeOf<Result>().toEqualTypeOf<['a', 'b']>()
  })
})
