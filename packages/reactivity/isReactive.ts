import { computed } from './computed'
import { Reactive, ReactiveFlag, reactive } from './reactive'
import { reference } from './reference'

/**
 * Predicate function that checks if a value is reactive.
 *
 * @param value The value to check.
 * @returns `true` if the value is reactive.
 * @example
 * const value = reactive({})
 * isReactive(value) // => true
 */
export function isReactive<T>(value: T): value is Reactive<T> {
  // @ts-expect-error: Since `value` might be a Proxy, we need to access the internal property.
  return typeof value === 'object' && value !== null && value[ReactiveFlag] === true
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true for reactive', () => {
    const result = isReactive(reactive({}))
    expect(result).toEqual(true)
  })

  it('should return true for references', () => {
    const result = isReactive(reference())
    expect(result).toEqual(true)
  })

  it('should return true for computed', () => {
    const result = isReactive(computed([], () => 1))
    expect(result).toEqual(true)
  })

  it('should return false for non-reactive', () => {
    const result = isReactive({ foo: 'bar' })
    expect(result).toEqual(false)
  })

  it('should predicate the type of a reactive', () => {
    const value = undefined as unknown
    const result = isReactive(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reactive<unknown>>()
  })
}
