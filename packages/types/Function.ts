/**
 * A function that takes parameters and returns a value.
 *
 * @template P The type of the parameters.
 * @template U The type of the return value.
 * @example Function<[number, string], boolean> // (number, string) => boolean
 */
export type Function<P extends unknown[] = any[], U = unknown> = (...parameters: P) => U

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build a function', () => {
    type result = Function<[number, string], boolean>
    expectTypeOf<result>().toEqualTypeOf<(a: number, b: string) => boolean>()
  })

  it('should build a function with no parameters', () => {
    type result = Function<[], boolean>
    expectTypeOf<result>().toEqualTypeOf<() => boolean>()
  })

  it('should build a function with no return value', () => {
    type result = Function<[number, string]>
    expectTypeOf<result>().toEqualTypeOf<(a: number, b: string) => unknown>()
  })
}
