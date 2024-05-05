import { Boolean } from './Boolean'

/**
 * Creates a `Boolean` instance from a boolean value.
 *
 * @param value The boolean value as a boolean.
 * @returns A boolean instance with the value.
 * @example createBoolean(true) // Boolean { value: true }
 */
export function createBoolean<T extends boolean>(value: T): Boolean {
  return new Boolean(value)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should create a Boolean instance from a boolean', () => {
    const result = createBoolean(true)
    expect(result).toBeInstanceOf(Boolean)
    expect(result.value).toBe(true)
    expectTypeOf(result).toEqualTypeOf<Boolean>()
  })
}
