/**
 * Omit properties with value of `never` from the object.
 *
 * @template T The object to omit properties from.
 * @example type Result = OmitNever<{ a: string; b: never; c: number }> // { a: string; c: number }
 */
export type OmitNever<T> =
  { [K in keyof T as T[K] extends never ? never : K]: T[K] } extends infer U
    ? { [K in keyof U]: U[K] }
    : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should omit properties with value of never', () => {
    type Result = OmitNever<{ a: string; b: never; c: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string; c: number }>()
  })

  test('should omit properties with value of never from a union', () => {
    type Result = OmitNever<{ a: string; b: never } | { a: string; c: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string } | { a: string; c: number }>()
  })
}
