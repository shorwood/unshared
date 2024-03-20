import { ReferenceFlag } from './constants'
import { Reference } from './reference'

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

/** c8 ignore next */
if (import.meta.vitest) {
  const { computed } = await import('./computed')
  const { reactive } = await import('./reactive')
  const { reference } = await import('./reference')

  it('should return false for computed', () => {
    const value = computed([], () => 1)
    const result = isReference(value)
    expect(result).toEqual(false)
  })

  it('should return false for reactive', () => {
    const value = reactive({})
    const result = isReference(value)
    expect(result).toEqual(false)
  })

  it('should return true for references', () => {
    const value = reference()
    const result = isReference(value)
    expect(result).toEqual(true)
  })

  it('should return false for non-reactive', () => {
    const result = isReference({ foo: 'bar' })
    expect(result).toEqual(false)
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should predicate the type of a reference', () => {
    const value = undefined as unknown
    const result = isReference(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reference<unknown>>()
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should predicate the type of a reference with a type', () => {
    const value = undefined as unknown
    const result = isReference<string>(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reference<string>>()
  })
}
