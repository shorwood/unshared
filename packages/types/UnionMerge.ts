import type { OmitNever } from './OmitNever'

/**
 * Merged type of all the objects in the union.
 *
 * @template T The union to merge.
 * @example MergeUnion<{ a: number } | { b: string }> // { a: number, b: string }
 */
export type UnionMerge<T> =
  (T extends any ? (x: T) => any : never) extends (x: infer U) => any
    ? OmitNever<{ [P in keyof U]: U[P] }>
    : never

/* v8 ignore next */
/* eslint-disable @typescript-eslint/no-empty-object-type */
if (import.meta.vitest) {
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
    // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
    type Result = UnionMerge<{ a: number } | { a: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number }>()
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
    expectTypeOf<Result>().toEqualTypeOf<{ a?: undefined }>()
  })

  test('should merge a union of objects with rest properties', () => {
    type Result = UnionMerge<Record<string, number> | Record<symbol, number>>
    expectTypeOf<Result>().toEqualTypeOf<Record<string | symbol, number>>()
  })
}
