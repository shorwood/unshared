import type { FromEntries } from './FromEntries'

describe('FromEntries', () => {
  test('should infer the object type from an array of entries', () => {
    type Result = FromEntries<[['a', 1], ['b', 2]]>
    expectTypeOf<Result>().toEqualTypeOf<{ a: 1; b: 2 }>()
  })

  test('should infer the object type from an array of entries with a symbol', () => {
    type Result = FromEntries<[['a', 1], ['b', 2], [symbol, 3]]>
    expectTypeOf<Result>().toEqualTypeOf<{ [key: symbol]: 3; a: 1; b: 2 }>()
  })

  test('should infer the object type from an array of entries with a number', () => {
    type Result = FromEntries<[['a', 1], ['b', 2], [3, 3]]>
    expectTypeOf<Result>().toEqualTypeOf<{ 3: 3; a: 1; b: 2 }>()
  })
})
