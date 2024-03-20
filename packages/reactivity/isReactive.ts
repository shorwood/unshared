import { ReactiveFlag } from './constants'
import { Reactive } from './reactive'

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

/** c8 ignore next */
if (import.meta.vitest) {
  const { computed } = await import('./computed')
  const { reactive } = await import('./reactive')
  const { reference } = await import('./reference')

  it('should return true for computed', () => {
    const value = computed([], () => 1)
    const result = isReactive(value)
    expect(result).toEqual(false)
  })

  it('should return false for reactive', () => {
    const value = reactive({})
    const result = isReactive(value)
    expect(result).toEqual(false)
  })

  it('should return false for references', () => {
    const value = reference()
    const result = isReactive(value)
    expect(result).toEqual(false)
  })

  it('should return false for non-reactive', () => {
    const result = isReactive({ foo: 'bar' })
    expect(result).toEqual(false)
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should predicate the type of a reactive', () => {
    const value = undefined as unknown
    const result = isReactive(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reactive<unknown>>()
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should predicate the type of a reactive with a type', () => {
    const value = undefined as unknown
    const result = isReactive<{ value: 'foobar' }>(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reactive<{ value: 'foobar' }>>()
  })
}
