import { assertStringStartingWith } from './assertStringStartingWith'

/**
 * Create a function to assert that a value is a string starting with the given string.
 *
 * @param start The string to match the start of the value against.
 * @returns A function that asserts that a value is a string starting with the given string.
 * @example const isHello = assertStringStartingWith('Hello') // (value: unknown) => asserts value is `Hello${string}`
 */
export function createAssertStringStartingWith<T extends string>(start: T) {
  return (value: unknown): asserts value is `${T}${string}` => assertStringStartingWith(value, start)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string starting with the given string', () => {
    const result = createAssertStringStartingWith('Hello')('Hello, World!')
    expect(result).toBeUndefined()
  })

  test('should predicate a string starting with the given string', () => {
    const result = createAssertStringStartingWith('Hello')
    expectTypeOf(result).toEqualTypeOf<(value: unknown) => asserts value is `Hello${string}`>()
  })
}
