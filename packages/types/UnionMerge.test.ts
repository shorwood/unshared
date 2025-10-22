/* oxlint-disable @typescript-eslint/no-empty-object-type */
import type { UnionMerge } from './UnionMerge'

describe('UnionMerge', () => {
  test('should merge a union of objects', () => {
    type Result = UnionMerge<{ a: number } | { b: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: string }>()
  })

  test('should merge a union of 3 objects', () => {
    type Result = UnionMerge<{ a: number } | { b: string } | { c: boolean }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: string; c: boolean }>()
  })

  test('should return an empty object for a union of objects with incompatible property types', () => {
    type Result = UnionMerge<{ a: number } | { a: string }>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })

  test('should omit never properties from the result', () => {
    type Result = UnionMerge<{ a: number } | { b: string } | { c: never }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: string }>()
  })

  test('should merge a union of objects with compatible property types', () => {
    type Result = UnionMerge<{ a: 1 | 2 | 3 } | { a: 1 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: 1 }>()
  })

  test('should merge a union of objects with overlapping property types', () => {
    type Result = UnionMerge<{ a: number | string } | { a: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number }>()
  })

  test('should merge a union of objects with one optional properties', () => {
    type Result = UnionMerge<{ a: number } | { a?: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number }>()
  })

  test('should merge a union of objects with optional properties', () => {
    type Result = UnionMerge<{ a?: number } | { a?: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a?: never }>()
  })

  test('should merge a union of objects with rest properties', () => {
    type Result = UnionMerge<Record<string, number> | Record<symbol, number>>
    expectTypeOf<Result>().toEqualTypeOf<Record<string | symbol, number>>()
  })
})
