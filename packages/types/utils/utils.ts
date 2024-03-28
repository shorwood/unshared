export type ExcludeEmptyObject<T> = T extends Record<PropertyKey, never> ? never : T
export type ExcludeEmptyArray<T> = T extends [] ? never : T

/** v8 ignore start */
if (import.meta.vitest) {
  it('should exclude empty objects', () => {
    type Result = ExcludeEmptyObject<{ a: number } | {}>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number }>()
  })

  it('should exclude empty arrays', () => {
    type Result = ExcludeEmptyArray<[] | [1]>
    expectTypeOf<Result>().toEqualTypeOf<[1]>()
  })
}

