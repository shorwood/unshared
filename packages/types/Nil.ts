/**
 * Matches any type that is `null`, `undefined`, or `void`.
 */
export type Nil = null | undefined | void

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match nil', () => {
    expectTypeOf<null | undefined | void>().toMatchTypeOf<Nil>()
  })

  test('should not match non-nil', () => {
    expectTypeOf<boolean | number | string>().not.toMatchTypeOf<Nil>()
  })
}
