/**
 * A type that may be a promise that resolves to `U` or `U` itself. If `U` is a
 * promise, it won't be wrapped in another promise.
 *
 * @template U The type to check.
 * @returns The type if it is not a promise, otherwise `Promise<U>`.
 * @example
 * MaybePromise<number> // number | Promise<number>
 * MaybePromise<Promise<number>> // Promise<number>
 */
export type MaybePromise<U = unknown> = U extends Promise<infer V> ? Promise<V> : Promise<U> | U

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return U or a promise of U when U is not a promise', () => {
    type Result = MaybePromise<number>
    expectTypeOf<Result>().toEqualTypeOf<Promise<number> | number>()
  })

  test('should return a promise of U when U is a promise', () => {
    type Result = MaybePromise<Promise<number>>
    expectTypeOf<Result>().toEqualTypeOf<Promise<number>>()
  })
}
