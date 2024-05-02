/**
 * Make all properties and nested properties of an object readonly. This type
 * is similar to `Readonly<T>` but it also makes nested properties readonly.
 *
 * @template T The type to make readonly.
 * @example ReadonlyDeep<{ a: { b: string } }> = { readonly a: { readonly b: string } }
 */
export type Immutable<T> = {
  readonly [P in keyof T]:
  T[P] extends Record<PropertyKey, unknown> ? Immutable<T[P]>
    : T[P] extends any[] ? Immutable<T[P]>
      : T[P]
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should make properties of an object readonly', () => {
    type Result = Immutable<{ a: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ readonly a: string }>()
  })

  test('should make nested properties of an object readonly', () => {
    type Result = Immutable<{ a: { b: string } }>
    expectTypeOf<Result>().toEqualTypeOf<{ readonly a: { readonly b: string } }>()
  })

  test('should make properties of a tuple readonly', () => {
    type Result = Immutable<[string]>
    expectTypeOf<Result>().toEqualTypeOf<readonly [string]>()
  })

  test('should make nested properties of a tuple readonly', () => {
    type Result = Immutable<[string, [string]]>
    expectTypeOf<Result>().toEqualTypeOf<readonly [string, readonly [string]]>()
  })
}
