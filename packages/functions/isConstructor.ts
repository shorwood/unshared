import { Constructor } from '@unshared/types'

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

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true for a constructor function', () => {
    const result = isConstructor(Boolean)
    expect(result).toEqual(true)
  })

  it('should return false for a non-constructor function', () => {
    const result = isConstructor(() => {})
    expect(result).toEqual(false)
  })

  it('should return false for a non-function value', () => {
    const result = isConstructor(10)
    expect(result).toEqual(false)
  })

  it('should predicate a constructor function', () => {
    const value: unknown = Boolean
    const result = isConstructor(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Constructor>()
  })

  it('should predicate a constructor function with a given type', () => {
    const value: unknown = Boolean
    const result = isConstructor<BooleanConstructor>(value)
    if (result) expectTypeOf(value).toEqualTypeOf<BooleanConstructor>()
  })
}
