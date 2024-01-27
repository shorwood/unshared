/**
 * A function that takes parameters and returns a value.
 *
 * @template U The type of the return value.
 * @template P The type of the parameters.
 * @example Function<boolean, [number, string]> // (a: number, b: string) => boolean
 */
export type Function<U = unknown, P extends unknown[] = unknown[]> = (...args: P) => U

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a function type with no parameters', () => {
    type Result = Function<boolean>
    expectTypeOf<Result>().toEqualTypeOf<(...args: unknown[]) => boolean>()
  })

  it('should build a function with 2 parameters', () => {
    type Result = Function<string, [number, string]>
    expectTypeOf<Result>().toEqualTypeOf<(...args: [number, string]) => string>()
  })

  it('should build a function with rest parameters', () => {
    type Result = Function<string, [a: number, ...b: string[]]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, ...b: string[]) => string>()
  })

  it('should build a function with optional parameters', () => {
    type Result = Function<string, [a: number, b: string, c?: boolean]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string, c?: boolean) => string>()
  })
}
