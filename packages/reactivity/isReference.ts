import { Reference } from './reference'
import { ReferenceFlag } from './constants'

/**
 * Predicate for checking if a value is a `Reference` object.
 *
 * @param value The value to check.
 * @returns `true` if the value is a `Reference` object.
 * @example
 * const value = reference('foo')
 * isReference(value) // => true
 */
export function isReference<T>(value: unknown): value is Reference<T> {
  return typeof value === 'object'
    && value !== null
    && ReferenceFlag in value
    && value[ReferenceFlag] === true
}

/* v8 ignore next */
if (import.meta.vitest) {
  const { computed } = await import('./computed')
  const { reactive } = await import('./reactive')
  const { reference } = await import('./reference')

  test('should return false for computed', () => {
    const value = computed([], () => 1)
    const result = isReference(value)
    expect(result).toBeFalsy()
  })

  test('should return false for reactive', () => {
    const value = reactive({})
    const result = isReference(value)
    expect(result).toBeFalsy()
  })

  test('should return true for references', () => {
    const value = reference()
    const result = isReference(value)
    expect(result).toBeTruthy()
  })

  test('should return false for non-reactive', () => {
    const result = isReference({ foo: 'bar' })
    expect(result).toBeFalsy()
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
}
