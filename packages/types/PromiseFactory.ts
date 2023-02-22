/**
 * A function that returns a promise.
 *
 * @template T The type of the promise.
 * @example PromiseFactory<void> // () => Promise<void>
 */
export type PromiseFactory<T = unknown> = () => Promise<T>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build a promise factory', () => {
    type result = PromiseFactory
    expectTypeOf<result>().toEqualTypeOf<() => Promise<unknown>>()
  })

  it('should build a promise factory with a return value', () => {
    type result = PromiseFactory<number>
    expectTypeOf<result>().toEqualTypeOf<() => Promise<number>>()
  })
}
