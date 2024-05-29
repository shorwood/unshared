import { assertStringEnum } from './assertStringEnum'

/**
 * Create a predicate function that asserts that a value is a string that is one of the values in an array.
 *
 * @param values The values to match the value against.
 * @returns A predicate function that asserts that a value is a string that is one of the values in an array.
 * @example const isHello = createAssertStringEnum(['Hello', 'World']) // (value: unknown) => asserts value is 'Hello' | 'World'
 */
export function createAssertStringEnum<T extends string>(values: T[]) {
  return (value: unknown): asserts value is T => assertStringEnum(value, values)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string in the array', () => {
    const result = createAssertStringEnum(['Hello', 'World'])('Hello')
    expect(result).toBeUndefined()
  })

  test('should predicate string union', () => {
    const result = createAssertStringEnum(['Hello', 'World'])
    expectTypeOf(result).toEqualTypeOf<(value: unknown) => asserts value is 'Hello' | 'World'>()
  })
}
