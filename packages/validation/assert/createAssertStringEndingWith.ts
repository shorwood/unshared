import { assertStringEndingWith } from './assertStringEndingWith'

/**
 * Create a function to assert that a value is a string ending with the given string.
 *
 * @param end The string to match the end of the value against.
 * @returns A function that asserts that a value is a string ending with the given string.
 * @example const isWorld = assertStringEndingWith('World') // (value: unknown) => asserts value is `${string}World`
 */
export function createAssertStringEndingWith<T extends string>(end: T) {
  return (value: unknown): asserts value is `${string}${T}` => assertStringEndingWith(value, end)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string ending with the given string', () => {
    const result = createAssertStringEndingWith('World!')('Hello, World!')
    expect(result).toBeUndefined()
  })

  test('should predicate a string ending with the given string', () => {
    const result = createAssertStringEndingWith('World')
    expectTypeOf(result).toEqualTypeOf<(value: unknown) => asserts value is `${string}World`>()
  })
}
