import type { LooseDeep } from './LooseDeep'

describe('LooseDeep', () => {
  test('should make all non-object properties of T optional', () => {
    type Result = LooseDeep<{ a: string | undefined; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a?: string; b: number }>()
  })

  test('should make all nested `undefined` properties of T optional', () => {
    type Result = LooseDeep<{ a: { b: string | undefined; c: number } }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b?: string; c: number } }>()
  })

  test('should make all nested `void` properties of T optional', () => {
    type Result = LooseDeep<{ a: { b: string | void; c: number } }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b?: string | void; c: number } }>()
  })

  test('should return nested arrays as-is', () => {
    type Result = LooseDeep<{ a: string[] }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string[] }>()
  })

  test('should return nested tuples as-is', () => {
    type Result = LooseDeep<{ a: [string, number] }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: [string, number] }>()
  })

  test('should loose objects in nested tuples', () => {
    type Result = LooseDeep<{ a: [{ b: string | undefined }] }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: [{ b?: string }] }>()
  })
})
