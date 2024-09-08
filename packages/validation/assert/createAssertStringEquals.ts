import { assertStringEquals } from './assertStringEquals'

/**
 * Create a parse function that can be used to assert a string is striclty equal to a given value.
 *
 * @param expected The value to assert the string is equal to.
 * @returns A parser function that can be used to assert a string is striclty equal to a given value.
 * @example const parse = createAssertStringEqual('foo') // (value: unknown) => value is 'foo'
 */
export function createAssertStringEquals<T extends string>(expected: T) {
  return (value: unknown): asserts value is T => assertStringEquals(value, expected)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string equal to the expected string', () => {
    const result = createAssertStringEquals('Hello, World!')('Hello, World!')
    expect(result).toBeUndefined()
  })

  test('should predicate string literal', () => {
    const result = createAssertStringEquals('Hello, World!')
    expectTypeOf(result).toEqualTypeOf<(value: unknown) => asserts value is 'Hello, World!'>()
  })
}
