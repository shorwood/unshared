import { ComputedFlag } from './constants'
import { Computed } from './computed'

/**
 * Predicate function that checks if a value is a `Computed` object.
 *
 * @param value The value to check.
 * @returns `true` if the value is a `Computed` object.
 * @example
 * const value = computed([], () => 1)
 * isComputed(value) // => true
 */
export function isComputed<T>(value: unknown): value is Computed<T> {
  return typeof value === 'object'
    && value !== null
    && ComputedFlag in value
    && value[ComputedFlag] === true
}

/* v8 ignore next */
if (import.meta.vitest) {
  const { computed } = await import('./computed')
  const { reactive } = await import('./reactive')
  const { reference } = await import('./reference')

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
}
