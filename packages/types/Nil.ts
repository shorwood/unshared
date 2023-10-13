/**
 * Matches any type that is `null`, `undefined`, or `void`.
 */
export type Nil = null | undefined | void

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match nil', () => {
    expectTypeOf<null | undefined | void>().toMatchTypeOf<Nil>()
  })

  it('should not match non-nil', () => {
    expectTypeOf<boolean | number | string>().not.toMatchTypeOf<Nil>()
  })
}
