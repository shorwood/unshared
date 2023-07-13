/* eslint-disable no-new-wrappers */
import { Boolean } from './Boolean'

/**
 * Creates a `Boolean` instance from a boolean value.
 *
 * @param value The boolean value as a boolean.
 * @returns A boolean instance with the value.
 * @example createBoolean(true) // Boolean { value: true }
 */
export function createBoolean<T extends boolean>(value: T): Boolean<T> {
  return new Boolean<T>(value)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a Boolean instance from a boolean', () => {
    const result = createBoolean(true)
    expect(result).toBeInstanceOf(Boolean)
    expect(result.value).toEqual(true)
    expectTypeOf(result.value).toEqualTypeOf<true>()
  })
}
