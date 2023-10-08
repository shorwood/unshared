import { computed } from './computed'
import { reactive } from './reactive'
import { Reference, ReferenceFlag, reference } from './reference'

/**
 * Predicate for checking if a value is a reference.
 *
 * @param value The value to check.
 * @returns `true` if the value is a reference.
 * @example isReference(reference('foo')) // true
 */
export function isReference(value: unknown): value is Reference<unknown> {
  // @ts-expect-error: Since `value` might be a Proxy, we need to access the internal property.
  return typeof value === 'object' && value !== null && value[ReferenceFlag] === true
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true for references', () => {
    const value = reference()
    const result = isReference(value)
    expect(result).toEqual(true)
  })

  it('should return false for reactive', () => {
    const value = reactive({})
    const result = isReference(value)
    expect(result).toEqual(false)
  })

  it('should return false for computed', () => {
    const value = computed([], () => 1)
    const result = isReference(value)
    expect(result).toEqual(false)
  })

  it('should return false for non-reactive', () => {
    const result = isReference({ foo: 'bar' })
    expect(result).toEqual(false)
  })

  it('should predicate the type of a reference', () => {
    const value = undefined as unknown
    const result = isReference(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reference<unknown>>()
  })
}
