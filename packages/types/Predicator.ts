/**
 * Predicator function that returns `true` when the given value
 * is of the specified type.
 *
 * @template T The type to check for.
 * @example Predicator<string> // (value: unknown, ...args: any[]) => value is string
 */
export type Predicator<T = unknown> = (value: any, ...args: any[]) => value is T

/** v8 ignore start */
if (import.meta.vitest) {
  test('should return a predicator for unknowns', () => {
    type Result = Predicator
    type Expected = (value: any, ...args: any[]) => value is unknown
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a predicator for strings', () => {
    type Result = Predicator<string>
    type Expected = (value: any, ...args: any[]) => value is string
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a predicator for numbers', () => {
    type Result = Predicator<number>
    type Expected = (value: any, ...args: any[]) => value is number
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should match the predicator', () => {
    type Match = (value: unknown) => value is string
    expectTypeOf<Match>().toMatchTypeOf<Predicator>()
  })

  test('should not match functions that return a boolean', () => {
    type Match = (value: unknown) => boolean
    expectTypeOf<Match>().not.toMatchTypeOf<Predicator>()
  })
}
