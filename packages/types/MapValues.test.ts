import type { MapValues } from './MapValues'

describe('MapValues', () => {
  test('should map the values of an object', () => {
    type Result = MapValues<{ foo: string }, number>
    expectTypeOf<Result>().toEqualTypeOf<{ foo: number }>()
  })

  test('should map the values of an array', () => {
    type Result = MapValues<string[], number>
    expectTypeOf<Result>().toEqualTypeOf<number[]>()
  })

  test('should map the values of a tuple', () => {
    type Result = MapValues<[string, string], number>
    expectTypeOf<Result>().toEqualTypeOf<[number, number]>()
  })
})
