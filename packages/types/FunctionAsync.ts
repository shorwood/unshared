/**
 * A function that returns a promise.
 *
 * @template U The type of the return value.
 * @template P The type of the parameters.
 * @example FunctionAsync<boolean, [number, string]> // (a: number, b: string) => Promise<boolean>
 */
export type FunctionAsync<U = unknown, P extends unknown[] = any[]> =
  (...parameters: P) => Promise<U>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build a function', () => {
    type result = FunctionAsync<boolean, [number, string]>
    expectTypeOf<result>().toEqualTypeOf<(a: number, b: string) => Promise<boolean>>()
  })

  it('should build a function with no parameters', () => {
    type result = FunctionAsync<boolean>
    expectTypeOf<result>().toEqualTypeOf<(...parameters: unknown[]) => Promise<boolean>>()
  })

  it('should build a function with no return value', () => {
    type result = FunctionAsync<unknown, [number, string]>
    expectTypeOf<result>().toEqualTypeOf<(a: number, b: string) => Promise<unknown>>()
  })
}
