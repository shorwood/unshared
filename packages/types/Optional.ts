/**
 * Make all properties of T optionally `undefined`. This type is
 * similar to `Partial` but it only makes properties optional. Meaning
 * they key must still exist in the object.
 *
 * @template T The type to make optional
 * @returns A new type with all properties of T optionally `undefined`
 * @example Optional<{ a: string, b: number }> // { a: string | undefined, b: number | undefined }
 */
export type Optional<T> = {
  [K in keyof T]-?: T[K] | undefined
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should make all properties of T optionally `undefined`', () => {
    type Result = Optional<{ a: string; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string | undefined; b: number | undefined }>()
  })
}
