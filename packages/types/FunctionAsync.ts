/**
 * A function that returns a promise.
 *
 * @template T The type of the promise.
 * @example FunctionAsync<void> // () => Promise<void>
 */
export type FunctionAsync<T = unknown> = (...parameters: unknown[]) => Promise<T>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build a promise factory', () => {
    type result = FunctionAsync
    expectTypeOf<result>().toEqualTypeOf<(...parameters: unknown[]) => Promise<unknown>>()
  })

  it('should build a promise factory with a return value', () => {
    type result = FunctionAsync<number>
    expectTypeOf<result>().toEqualTypeOf<(...parameters: unknown[]) => Promise<number>>()
  })
}
