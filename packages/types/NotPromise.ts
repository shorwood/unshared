/**
 * A type that is not a promise.
 *
 * @template U The type to check.
 * @returns The type if it is not a promise, otherwise `never`.
 * @example NotPromise<number | Promise<number>> // number
 */
export type NotPromise<U = unknown> = U extends PromiseLike<unknown> ? never : U

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the type when it is not a promise', () => {
    type Result = NotPromise<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should exclude the promise type when unioned with a promise', () => {
    type Result = NotPromise<Promise<number> | number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return never when the type is a promise', () => {
    type Result = NotPromise<Promise<number>>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
