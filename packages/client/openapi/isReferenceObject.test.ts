import type { OpenAPIV2 } from 'openapi-types'
import type { OpenAPIReference } from './isReferenceObject'
import { isReferenceObject } from './isReferenceObject'

describe('isReferenceObject', () => {
  it('should return true for a valid reference object', () => {
    const result = isReferenceObject({ $ref: '#/components/schemas/MySchema' })
    expect(result).toBe(true)
  })

  it('should return false for an object without $ref', () => {
    const result = isReferenceObject({ notRef: '#/components/schemas/MySchema' })
    expect(result).toBe(false)
  })

  it('should return false for a null value', () => {
    const result = isReferenceObject(null)
    expect(result).toBe(false)
  })

  it('should return false for a non-object value', () => {
    const result = isReferenceObject('string')
    expect(result).toBe(false)
  })

  it('should return false for an object with a non-string $ref', () => {
    const result = isReferenceObject({ $ref: 123 })
    expect(result).toBe(false)
  })

  it('should return false for an undefined value', () => {
    const result = isReferenceObject(undefined)
    expect(result).toBe(false)
  })

  it('should predicate type', () => {
    const value: unknown = { $ref: '#/components/schemas/MySchema' }
    const result = isReferenceObject(value)
    if (result) expectTypeOf(value).toEqualTypeOf<OpenAPIReference>()
  })

  it('should predicate specific version type of the ReferenceObject', () => {
    const value: unknown = { $ref: '#/components/schemas/MySchema' }
    const result = isReferenceObject<OpenAPIV2.ReferenceObject>(value)
    if (result) expectTypeOf(value).toEqualTypeOf<OpenAPIV2.ReferenceObject>()
  })
})
