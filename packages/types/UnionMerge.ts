/**
 * Merged type of all the objects in the union.
 *
 * @template T The union to merge.
 * @example MergeUnion<{ a: number } | { b: string }> // { a: number, b: string }
 */
export type UnionMerge<T> =
  (T extends any ? (x: T) => any : never) extends (x: infer U) => any
    ? { [P in keyof U]: U[P] }
    : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should merge a union of objects', () => {
    type result = UnionMerge<{ a: number } | { b: string }>
    expectTypeOf<result>().toEqualTypeOf<{ a: number; b: string }>()
  })

  it('should merge a union of 3 objects', () => {
    type result = UnionMerge<{ a: number } | { b: string } | { c: boolean }>
    expectTypeOf<result>().toEqualTypeOf<{ a: number; b: string; c: boolean }>()
  })

  it('should merge a union of objects with incompatible property types', () => {
    type result = UnionMerge<{ a: number } | { a: string }>
    expectTypeOf<result>().toEqualTypeOf<{ a: never }>()
  })

  it('should merge a union of objects with compatible property types', () => {
    type result = UnionMerge<{ a: number } | { a: number }>
    expectTypeOf<result>().toEqualTypeOf<{ a: number }>()
  })

  it('should merge a union of objects with overlapping property types', () => {
    type result = UnionMerge<{ a: number } | { a: string | number }>
    expectTypeOf<result>().toEqualTypeOf<{ a: number }>()
  })

  it('should merge a union of objects with one optional properties', () => {
    type result = UnionMerge<{ a?: number } | { a: number }>
    expectTypeOf<result>().toEqualTypeOf<{ a: number }>()
  })

  it('should merge a union of objects with optional properties', () => {
    type result = UnionMerge<{ a?: number } | { a?: string }>
    expectTypeOf<result>().toEqualTypeOf<{ a?: undefined }>()
  })

  it('should merge a union of objects with rest properties', () => {
    type result = UnionMerge<Record<string, number> | Record<symbol, number>>
    expectTypeOf<result>().toEqualTypeOf<Record<string | symbol, number>>()
  })
}
