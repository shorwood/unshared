import type { UnionSplit } from './UnionSplit'

describe('UnionSplit', () => {
  test('should split the properties of an object into a union of objects', () => {
    type Result = UnionSplit<{ a: number; b: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number } | { b: string }>()
  })

  test('should split the properties of an object with one optional property into a union of objects', () => {
    type Result = UnionSplit<{ a?: number; b: string }>
    expectTypeOf<Result>().toEqualTypeOf<undefined | { a?: number } | { b: string }>()
  })

  test('should split the properties of an object with optional properties into a union of objects', () => {
    type Result = UnionSplit<Record<string, number> & Record<symbol, number>>
    expectTypeOf<Result>().toEqualTypeOf<Record<string, number> | Record<symbol, number>>()
  })

  test('should split an object with overlapping properties into a union', () => {
    type Result = UnionSplit<{ a: number; b: number | string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number } | { b: number | string }>()
  })
})
