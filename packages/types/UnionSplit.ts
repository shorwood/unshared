/**
 * Split type of all properties of an object into a union.
 *
 * @template T The object to split.
 * @example UnionSplit<{ a: number, b: string }> // { a: number } | { b: string }
 */
export type UnionSplit<T> = { [K in keyof T]: { [P in K]: T[P] } }[keyof T]

/* v8 ignore next */
if (import.meta.vitest) {
  test('should split the properties of an object into a union of objects', () => {
    type Result = UnionSplit<{ a: number; b: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number } | { b: string }>()
  })

  test('should split the properties of an object with one optional property into a union of objects', () => {
    type Result = UnionSplit<{ a?: number; b: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a?: number } | { b: string } | undefined>()
  })

  test('should split the properties of an object with optional properties into a union of objects', () => {
    type Result = UnionSplit<Record<string, number> & Record<symbol, number>>
    expectTypeOf<Result>().toEqualTypeOf<Record<string, number> | Record<symbol, number>>()
  })

  test('should split an object with overlapping properties into a union', () => {
    type Result = UnionSplit<{ a: number; b: number | string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number } | { b: number | string }>()
  })
}
