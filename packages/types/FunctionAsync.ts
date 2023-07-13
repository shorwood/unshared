/**
 * A function that takes parameters and returns a promise.
 *
 * @template U The type of the resolved value.
 * @template P The type of the parameters.
 * @example FunctionAsync<boolean, [number, string]> // (a: number, b: string) => Promise<boolean>
 */
export type FunctionAsync<U = unknown, P extends unknown[] = unknown[]> = (...parameters: P) => Promise<U>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build a function with no parameters', () => {
    type Result = FunctionAsync<boolean>
    expectTypeOf<Result>().toEqualTypeOf<(...p: unknown[]) => Promise<boolean>>()
  })

  it('should build a function with parameters', () => {
    type Result = FunctionAsync<string, [number, string]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string) => Promise<string>>()
  })
}
