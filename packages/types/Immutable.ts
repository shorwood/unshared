/**
 * An immutable object where all nested properties are readonly.
 *
 * @template T The type of the object.
 * @example Immutable<{ a: number }> // { readonly a: number }
 */
export type Immutable<T> = T extends object
  ? { readonly [K in keyof T]: Immutable<T[K]> }
  : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should make all properties readonly', () => {
    type Result = Immutable<{ a: number; b: number }>
    interface Expected { readonly a: number; readonly b: number }
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should make all nested properties readonly', () => {
    type Result = Immutable<{ a: number; b: { c: number } }>
    interface Expected { readonly a: number; readonly b: { readonly c: number } }
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should passthrough primitives', () => {
    type Result = Immutable<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
