/**
 * A function that returns a promise.
 *
 * @template T The type of the promise.
 * @example PromiseFactory<void> // () => Promise<void>
 */
export type PromiseFactory<T = unknown> = () => Promise<T>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should build a promise factory', () => {
    type Result = PromiseFactory
    expectTypeOf<Result>().toEqualTypeOf<() => Promise<unknown>>()
  })

  test('should build a promise factory with a return value', () => {
    type Result = PromiseFactory<number>
    expectTypeOf<Result>().toEqualTypeOf<() => Promise<number>>()
  })
}
