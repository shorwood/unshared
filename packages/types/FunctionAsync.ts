/**
 * A FunctionAsync that takes parameters and returns a promise.
 *
 * @template U The type of the value returned by the promise.
 * @template P The type of the parameters.
 * @template T The type of the `this` context.
 * @example FunctionAsync<boolean, [a: number, b: string]> // (a: number, b: string) => boolean
 */
export type FunctionAsync<U = any, P extends any[] = any[], T = void> =
  T extends void
    ? (...args: P) => Promise<U>
    : (this: T, ...args: P) => Promise<U>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return an asyncronous function type', () => {
    expectTypeOf<FunctionAsync>().toEqualTypeOf<(...args: any[]) => Promise<any>>()
  })

  test('should return an asyncronous function type with no parameters', () => {
    type Result = FunctionAsync<boolean>
    expectTypeOf<Result>().toEqualTypeOf<(...args: any[]) => Promise<boolean>>()
  })

  test('should return an asyncronous function type with 1 parameter', () => {
    type Result = FunctionAsync<string, [value: number]>
    expectTypeOf<Result>().toEqualTypeOf<(value: number) => Promise<string>>()
  })

  test('should return an asyncronous function with 3 parameters', () => {
    type Result = FunctionAsync<string, [a: number, b: string, c: boolean]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string, c: boolean) => Promise<string>>()
  })

  test('should return an asyncronous with rest parameters', () => {
    type Result = FunctionAsync<string, [a: number, ...b: string[]]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, ...b: string[]) => Promise<string>>()
  })

  test('should return an asyncronous with optional parameters', () => {
    type Result = FunctionAsync<string, [a: number, b: string, c?: boolean]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string, c?: boolean) => Promise<string>>()
  })

  test('should return an asyncronous function with `this` context', () => {
    type Result = FunctionAsync<string, [number, string], { foo: string }>
    expectTypeOf<Result>().toEqualTypeOf<(this: { foo: string }, a: number, b: string) => Promise<string>>()
  })
}
