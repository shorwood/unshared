/**
 * Extract the type contained in a promise. If the type is not a promise, the
 * type is returned as-is.
 *
 * @template T The type to unwrap.
 * @example PromiseUnwrap<Promise<number>> // number
 */
export type PromiseUnwrap<T = unknown> = T extends Promise<infer U> ? U : T

/* v8 ignore next */
if (import.meta.vitest) {
  test('should unwrap a promise', () => {
    type Result = PromiseUnwrap<Promise<number>>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return the type as-is if it is not a promise', () => {
    type Result = PromiseUnwrap<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return unknown if no type is passed', () => {
    type Result = PromiseUnwrap
    expectTypeOf<Result>().toEqualTypeOf<unknown>()
  })
}
