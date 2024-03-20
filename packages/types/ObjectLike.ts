/**
 * A type that represents an object with unknown properties.
 * 
 * @example ObjectLike // Record<PropertyKey, unknown> | unknown[]
 */
export type ObjectLike = Record<PropertyKey, unknown> | unknown[]

/* v8 ignore start */
if (import.meta.vitest) {
  it('should return a type that represents an object with unknown properties', () => {
    type Result = ObjectLike
    expectTypeOf<Result>().toEqualTypeOf<Record<PropertyKey, unknown> | unknown[]>()
  })
}
