import { Reactive } from './reactive'
import { ReactiveFlag } from './constants'

/**
 * Predicate function that checks if a value is a `Reactive` object.
 *
 * @param value The value to check.
 * @returns `true` if the value is a `Reactive` object.
 * @example
 * const value = reactive({})
 * isReactive(value) // => true
 */
export function isReactive<T>(value: unknown): value is Reactive<T> {
  return typeof value === 'object'
    && value !== null
    && ReactiveFlag in value
    && value[ReactiveFlag] === true
}

/* v8 ignore next */
if (import.meta.vitest) {
  const { computed } = await import('./computed')
  const { reactive } = await import('./reactive')
  const { reference } = await import('./reference')

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
}
