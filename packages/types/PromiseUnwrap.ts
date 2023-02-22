/**
 * Extract the type contained in a promise. If the type is not a promise, the
 * type is returned as-is.
 *
 * @template T The type to unwrap.
 * @example PromiseUnwrap<Promise<number>> // number
 */
export type PromiseUnwrap<T = unknown> = T extends Promise<infer U> ? U : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should unwrap a promise', () => {
    type result = PromiseUnwrap<Promise<number>>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return the type as-is if it is not a promise', () => {
    type result = PromiseUnwrap<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return unknown if no type is passed', () => {
    type result = PromiseUnwrap
    expectTypeOf<result>().toEqualTypeOf<unknown>()
  })
}
