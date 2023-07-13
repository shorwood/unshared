/**
 * A function that takes parameters and returns a value.
 *
 * @template U The type of the return value.
 * @template P The type of the parameters.
 * @example Function<boolean, [number, string]> // (a: number, b: string) => boolean
 */
export type Function<U = unknown, P extends unknown[] = any[]> = (...parameters: P) => U

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build a function with no parameters', () => {
    type Result = Function<boolean>
    expectTypeOf<Result>().toEqualTypeOf<(...p: unknown[]) => boolean>()
  })

  it('should build a function with parameters', () => {
    type Result = Function<string, [number, string]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string) => string>()
  })
}
