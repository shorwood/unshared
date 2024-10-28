import type { Reactive } from './reactive'
import { computed } from './computed'
import { isReactive } from './isReactive'
import { reactive } from './reactive'
import { reference } from './reference'

describe('isReactive', () => {
  test('should return true for computed', () => {
    const value = computed([], () => 1)
    const result = isReactive(value)
    expect(result).toBe(false)
  })

  test('should return false for reactive', () => {
    const value = reactive({})
    const result = isReactive(value)
    expect(result).toBe(false)
  })

  test('should return false for references', () => {
    const value = reference()
    const result = isReactive(value)
    expect(result).toBe(false)
  })

  test('should return false for non-reactive', () => {
    const result = isReactive({ foo: 'bar' })
    expect(result).toBe(false)
  })

  test('should predicate the type of a reactive', () => {
    const value = undefined as unknown
    const result = isReactive(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reactive<unknown>>()
  })

  test('should predicate the type of a reactive with a type', () => {
    const value = undefined as unknown
    const result = isReactive<{ value: 'foobar' }>(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reactive<{ value: 'foobar' }>>()
  })
})
