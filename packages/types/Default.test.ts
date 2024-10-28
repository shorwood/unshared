import type { Default } from './Default'

describe('Default', () => {
  test('should default objects', () => {
    type Result = Default<{ a: number; b: string | undefined }, { a: number; b: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: string }>()
  })

  test('should default tuples', () => {
    type Result = Default<[number, boolean] | undefined, [number, boolean]>
    expectTypeOf<Result>().toEqualTypeOf<[number, boolean]>()
  })

  test('should default arrays', () => {
    type Result = Default<number[] | undefined, string[]>
    expectTypeOf<Result>().toEqualTypeOf<number[] | string[]>()
  })

  test('should concat tuples', () => {
    type Result = Default<[number, boolean], [number, string], 0, true>
    expectTypeOf<Result>().toEqualTypeOf<[number, string, number, boolean]>()
  })

  test('should default primitives', () => {
    type Result = Default<number | undefined, string>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })

  test('should default non matching types from left to right', () => {
    type Result = Default<number | undefined, string[]>
    expectTypeOf<Result>().toEqualTypeOf<number | string[]>()
  })
})
