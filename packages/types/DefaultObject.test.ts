import type { DefaultObject } from './DefaultObject'

describe('DefaultObject', () => {
  test('should default undefined properties', () => {
    type Result = DefaultObject<{ a: number | undefined }, { a: 1; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  test('should default optional properties', () => {
    type Result = DefaultObject<{ a?: number }, { a: 1; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  test('should default null properties', () => {
    type Result = DefaultObject<{ a: null | number }, { a: 1; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  test('should default null to undefined', () => {
    type Result = DefaultObject<{ a: null | number }, { a: undefined; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number | undefined; b: 2 }>()
  })

  test('should default undefined to null', () => {
    type Result = DefaultObject<{ a: number | undefined }, { a: null; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: null | number; b: 2 }>()
  })

  test('should default nested objects', () => {
    type Result = DefaultObject<{ a: { b: number | undefined } }, { a: { b: 1; c: 2 } }, 1>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b: number; c: 2 } }>()
  })

  test('should not default nested objects after the depth is reached', () => {
    type Result = DefaultObject<{ a: { b: number | undefined } }, { a: { b: 1; c: 2 } }, 0>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b: number | undefined } }>()
  })
})
