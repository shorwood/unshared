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
