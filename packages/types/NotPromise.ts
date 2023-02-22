/**
 * A type that is not a promise.
 *
 * @template U The type to check.
 * @returns The type if it is not a promise, otherwise `never`.
 * @example NotPromise<number | Promise<number>> // number
 */
export type NotPromise<U = unknown> = U extends Promise<any> ? never : U

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the type when it is not a promise', () => {
    type result = NotPromise<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should exclude the promise type when unioned with a promise', () => {
    type result = NotPromise<Promise<number> | number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return never when the type is a promise', () => {
    type result = NotPromise<Promise<number>>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })
}
