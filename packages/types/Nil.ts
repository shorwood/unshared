/**
 * Matches any type that is `null`, `undefined`, or `void`.
 */
export type Nil = void | null | undefined

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match nil', () => {
    expectTypeOf<void | null | undefined>().toMatchTypeOf<Nil>()
  })

  test('should not match non-nil', () => {
    expectTypeOf<boolean | number | string>().not.toMatchTypeOf<Nil>()
  })
}
