/**
 * A function that asserts a value is of a specific type `T`.
 *
 * @template T The type to assert the value is.
 * @example Assertor<string> = (value: unknown) => asserts value is string
 */
export type Assertor<T> = (value: unknown, ...args: any[]) => asserts value is T

/** v8 ignore start */
if (import.meta.vitest) {
  test('should give a function that asserts a value is a string', () => {
    type Result = Assertor<string>
    expectTypeOf<Result>().toEqualTypeOf<(value: unknown, ...args: any[]) => asserts value is string>()
  })

  test('should give a function that asserts a value is a number', () => {
    type Result = Assertor<number>
    expectTypeOf<Result>().toEqualTypeOf<(value: unknown, ...args: any[]) => asserts value is number>()
  })
}
