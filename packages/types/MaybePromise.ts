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
export type MaybePromise<U = unknown> = Promise<U> | U

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return U or a promise of U when U is not a promise', () => {
    type Result = MaybePromise<number>
    expectTypeOf<Result>().toEqualTypeOf<Promise<number> | number>()
  })

  test('should be able to infer the type of a value if it is not a promise', () => {
    type InferFunction<T> = T extends () => MaybePromise<infer U> ? U : never
    type Result = InferFunction<() => number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should be able to infer the type of a value if it is a promise', () => {
    type InferFunction<T> = T extends () => MaybePromise<infer U> ? U : never
    type Result = InferFunction<() => Promise<number>>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should be able to infer the type of a value if it is a union of promises', () => {
    type InferFunction<T> = T extends () => MaybePromise<infer U> ? U : never
    type Result = InferFunction<() => Promise<number> | Promise<string>>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })

  test('should be able to infer the type of a value if it is a union of promises and non-promises', () => {
    type InferFunction<T> = T extends () => MaybePromise<infer U> ? U : never
    type Result = InferFunction<() => Promise<number> | string>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })

  test('should be able to infer the type of a value if it is a promise of unions', () => {
    type InferFunction<T> = T extends () => MaybePromise<infer U> ? U : never
    type Result = InferFunction<() => Promise<number | string>>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })
}
