/**
 * A FunctionAsync that takes parameters and returns a promise.
 *
 * @template U The type of the value returned by the promise.
 * @template P The type of the parameters.
 * @example FunctionAsync<boolean, [number, string]> // (a: number, b: string) => boolean
 */
export type FunctionAsync<U = unknown, P = unknown[]> = P extends unknown[]
  ? (...args: P) => Promise<U>
  : (argument0: P) => Promise<U>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a FunctionAsync type with no parameters', () => {
    type Result = FunctionAsync<boolean>
    expectTypeOf<Result>().toEqualTypeOf<(...args: unknown[]) => Promise<boolean>>()
  })

  it('should return a FunctionAsync type with 1 parameter', () => {
    type Result = FunctionAsync<string, number>
    expectTypeOf<Result>().toEqualTypeOf<(argument0: number) => Promise<string>>()
  })

  it('should build a FunctionAsync with 2 parameters', () => {
    type Result = FunctionAsync<string, [number, string]>
    expectTypeOf<Result>().toEqualTypeOf<(...args: [number, string]) => Promise<string>>()
  })

  it('should build a FunctionAsync with 3 parameters', () => {
    type Result = FunctionAsync<string, [a: number, b: string, c: boolean]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string, c: boolean) => Promise<string>>()
  })
}
