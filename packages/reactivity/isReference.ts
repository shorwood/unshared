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
  return typeof value === 'object' && value !== null && value[ReferenceFlag] === true
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true for references', () => {
    const result = isReference(reference())
    expect(result).toEqual(true)
  })

  it('should return false for reactive', () => {
    const result = isReference(reactive({}))
    expect(result).toEqual(false)
  })

  it('should return false for computed', () => {
    const result = isReference(reactive(() => 1))
    expect(result).toEqual(false)
  })

  it('should return false for non-reactive', () => {
    const result = isReference({ foo: 'bar' })
    expect(result).toEqual(false)
  })

  it('should predicate the type of a reference', () => {
    const value = { [ReferenceFlag]: true } as unknown
    const result = isReference(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Reference<unknown>>()
  })
}
