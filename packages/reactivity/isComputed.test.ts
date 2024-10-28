import type { Computed } from './computed'
import { computed } from './computed'
import { isComputed } from './isComputed'
import { reactive } from './reactive'
import { reference } from './reference'

describe('isComputed', () => {
  test('should return true for computed', () => {
    const value = computed([], () => 1)
    const result = isComputed(value)
    expect(result).toBe(true)
  })

  test('should return false for reactive', () => {
    const value = reactive({})
    const result = isComputed(value)
    expect(result).toBe(false)
  })

  test('should return false for references', () => {
    const value = reference()
    const result = isComputed(value)
    expect(result).toBe(false)
  })

  test('should return false for non-reactive', () => {
    const result = isComputed({ foo: 'bar' })
    expect(result).toBe(false)
  })

  test('should predicate the type of a computed', () => {
    const value = undefined as unknown
    const result = isComputed(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Computed<unknown>>()
  })

  test('should predicate the type of a computed with a type', () => {
    const value = undefined as unknown
    const result = isComputed<string>(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Computed<string>>()
  })
})
