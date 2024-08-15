import type { Constructor } from '@unshared/types'

/**
 * Predicate to determine if a value is a constructor function.
 *
 * @param value The value to test.
 * @returns `true` if the value is a constructor function.
 * @example isConstructor(Boolean) // true
 */
export function isConstructor<T extends Constructor>(value: unknown): value is T {
  return typeof value === 'function'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    && value.prototype?.constructor === value
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return true for a constructor function', () => {
    const result = isConstructor(Boolean)
    expect(result).toBe(true)
  })

  test('should return false for a non-constructor function', () => {
    const result = isConstructor(() => {})
    expect(result).toBe(false)
  })

  test('should return false for a non-function value', () => {
    const result = isConstructor(10)
    expect(result).toBe(false)
  })

  test('should predicate a constructor function', () => {
    const value: unknown = Boolean
    const result = isConstructor(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Constructor>()
  })

  test('should predicate a constructor function with a given type', () => {
    const value: unknown = Boolean
    const result = isConstructor<BooleanConstructor>(value)
    if (result) expectTypeOf(value).toEqualTypeOf<BooleanConstructor>()
  })
}
