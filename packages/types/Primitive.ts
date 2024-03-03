/**
 * Primitive types as well as `null` and `undefined`. This type excludes
 * `object` and `function`.
 *
 * @example Primitive // null | undefined | number | string | boolean | symbol | bigint
 */
export type Primitive = bigint | boolean | number | string | symbol | null | undefined

/* v8 ignore next */
if (import.meta.vitest) {
  it('should match a primitive type', () => {
    type Result = Primitive
    expectTypeOf<Result>().toEqualTypeOf<bigint | boolean | number | string | symbol | null | undefined>()
  })
}
