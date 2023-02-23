/**
 * A function that takes parameters and returns a value.
 *
 * @template U The type of the return value.
 * @template P The type of the parameters.
 * @example Function<boolean, [number, string]> // (a: number, b: string) => boolean
 */
export type Function<U = unknown, P extends unknown[] = any[]> =
  (...parameters: P) => U

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a function', () => {
    type result = Function
    expectTypeOf<result>().toEqualTypeOf<(...parameters: unknown[]) => unknown>()
  })

  it('should return a function with no parameters', () => {
    type result = Function<boolean>
    expectTypeOf<result>().toEqualTypeOf<(...parameters: unknown[]) => boolean>()
  })

  it('should build a function with parameters', () => {
    type result = Function<unknown, [number, string]>
    expectTypeOf<result>().toEqualTypeOf<(a: number, b: string) => unknown>()
  })

  it('should return a function with parameters and a return value', () => {
    type result = Function<boolean, [number, string]>
    expectTypeOf<result>().toEqualTypeOf<(a: number, b: string) => boolean>()
  })
}
