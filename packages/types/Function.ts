/**
 * A function that takes parameters and returns a value.
 *
 * @template U The type of the return value.
 * @template P The type of the parameters.
 * @template T The type of the `this` context.
 * @example Function<boolean, [number, string]> // (a: number, b: string) => boolean
 */
export type Function<U = any, P extends any[] = any[], T = void> =
  T extends void
    ? (...args: P) => U
    : (this: T, ...args: P) => U

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return a function type', () => {
    expectTypeOf<Function>().toEqualTypeOf<(...args: any[]) => any>()
  })

  test('should return an function type with no parameters', () => {
    type Result = Function<boolean>
    expectTypeOf<Result>().toEqualTypeOf<(...args: any[]) => boolean>()
  })

  test('should return a function type with 1 parameter', () => {
    type Result = Function<string, [value: number]>
    expectTypeOf<Result>().toEqualTypeOf<(value: number) => string>()
  })

  test('should return a function with 3 parameters', () => {
    type Result = Function<string, [a: number, b: string, c: boolean]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string, c: boolean) => string>()
  })

  test('should return a function with rest parameters', () => {
    type Result = Function<string, [a: number, ...b: string[]]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, ...b: string[]) => string>()
  })

  test('should return a function with optional parameters', () => {
    type Result = Function<string, [a: number, b: string, c?: boolean]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string, c?: boolean) => string>()
  })

  test('should return a function with `this` context', () => {
    type Result = Function<string, [number, string], { foo: string }>
    expectTypeOf<Result>().toEqualTypeOf<(this: { foo: string }, a: number, b: string) => string>()
  })
}
