import { Primitive } from '@unshared/types/Primitive'

/**
 * Checks if the value is a primitive type. Meaning it is not an object
 * and has no properties or methods associated with it apart from the
 * built-in methods that are available to all JavaScript objects.
 *
 * @param value The value to check.
 * @returns `true` if the value is a primitive, `false` otherwise
 * @example isPrimitive(1) // true
 */
export function isPrimitive(value: unknown): value is Primitive {
  return typeof value !== 'object' || value === null
}

/** v8 ignore start */
if (import.meta.vitest) {
  test('should return true if value is a primitive', () => {
    const result = isPrimitive(1)
    expect(result).toBeTruthy()
  })

  test('should return true if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = isPrimitive(undefined)
    expect(result).toBeTruthy()
  })

  test('should return true if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = isPrimitive(null)
    expect(result).toBeTruthy()
  })

  test('should return false if value is an object', () => {
    const result = isPrimitive({})
    expect(result).toBeFalsy()
  })
}
