import type { Reference } from './reference'
import { computed } from './computed'
import { isReference } from './isReference'
import { reactive } from './reactive'
import { reference } from './reference'

describe('isReference', () => {
  test('should return false for computed', () => {
    const value = computed([], () => 1)
    const result = isReference(value)
    expect(result).toBe(false)
  })

  test('should return false for reactive', () => {
    const value = reactive({})
    const result = isReference(value)
    expect(result).toBe(false)
  })

  test('should return true for references', () => {
    const value = reference()
    const result = isReference(value)
    expect(result).toBe(true)
  })

  test('should return false for non-reactive', () => {
    const result = isReference({ foo: 'bar' })
    expect(result).toBe(false)
  })

  test('should predicate the type of a reference', () => {
    const value = undefined as unknown
    const result = isReference(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reference<unknown>>()
  })

  test('should predicate the type of a reference with a type', () => {
    const value = undefined as unknown
    const result = isReference<string>(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reference<string>>()
  })
})
