import type { OpenAPIReference } from './isOpenapiReferenceObject'
import { isOpenapiReferenceObject } from './isOpenapiReferenceObject'

describe('isOpenapiReferenceObject', () => {
  it('should return true for a valid reference object', () => {
    const result = isOpenapiReferenceObject({ $ref: '#/components/schemas/MySchema' })
    expect(result).toBe(true)
  })

  it('should return false for an object without $ref', () => {
    const result = isOpenapiReferenceObject({ notRef: '#/components/schemas/MySchema' })
    expect(result).toBe(false)
  })

  it('should return false for a null value', () => {
    const result = isOpenapiReferenceObject(null)
    expect(result).toBe(false)
  })

  it('should return false for a non-object value', () => {
    const result = isOpenapiReferenceObject('string')
    expect(result).toBe(false)
  })

  it('should return false for an object with a non-string $ref', () => {
    const result = isOpenapiReferenceObject({ $ref: 123 })
    expect(result).toBe(false)
  })

  it('should return false for an undefined value', () => {
    const result = isOpenapiReferenceObject(undefined)
    expect(result).toBe(false)
  })

  it('should predicate type', () => {
    const value: unknown = { $ref: '#/components/schemas/MySchema' }
    const result = isOpenapiReferenceObject(value)
    if (result) expectTypeOf(value).toEqualTypeOf<OpenAPIReference>()
  })
})
