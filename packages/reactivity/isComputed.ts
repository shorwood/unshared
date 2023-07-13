import { Computed, ComputedFlag, computed } from './computed'
import { reactive } from './reactive'
import { reference } from './reference'

/**
 * Predicate for checking if a value is a computed value.
 *
 * @param value The value to check.
 * @returns `true` if the value is a computed value.
 * @example isComputed(computed(() => 1)) // true
 */
export function isComputed(value: unknown): value is Computed {
  return typeof value === 'object' && value !== null && ComputedFlag in value === true
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true for computed', () => {
    const result = isComputed(computed(() => 1))
    expect(result).toEqual(true)
  })

  it('should return false for reactive', () => {
    const result = isComputed(reactive({}))
    expect(result).toEqual(false)
  })

  it('should return false for references', () => {
    const result = isComputed(reference())
    expect(result).toEqual(false)
  })

  it('should return false for non-reactive', () => {
    const result = isComputed({ foo: 'bar' })
    expect(result).toEqual(false)
  })

  it('should predicate the type of a computed', () => {
    const value = { [ComputedFlag]: true } as unknown
    const result = isComputed(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Computed>()
  })
}
