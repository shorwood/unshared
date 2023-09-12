
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
