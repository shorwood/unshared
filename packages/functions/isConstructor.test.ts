import type { Constructor } from '@unshared/types'
import { isConstructor } from './isConstructor'

describe('isConstructor', () => {
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
})
