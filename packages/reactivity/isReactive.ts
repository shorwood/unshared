import { computed } from './computed'
import { Reactive, ReactiveFlag, reactive } from './reactive'
import { reference } from './reference'

/**
 * Predicate function that checks if a value is reactive.
 *
 * @param value The value to check.
 * @returns `true` if the value is reactive.
 * @example isReactive(reference({ foo: 'bar' })) // true
 */
export function isReactive(value: unknown): value is Reactive<object> {
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
    const result = isReactive(computed(() => 1))
    expect(result).toEqual(true)
  })

  it('should return false for non-reactive', () => {
    const result = isReactive({ foo: 'bar' })
    expect(result).toEqual(false)
  })

  it('should predicate the type of a reactive', () => {
    const value = {} as unknown
    const result = isReactive(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reactive<object>>()
  })
}
