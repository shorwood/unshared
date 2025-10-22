// oxlint-disable filename-case
import type { OpenAPIV3 } from 'openapi-types'
import { isOpenAPIV3 } from './isOpenAPIV3'

describe('isOpenAPIV3', () => {
  it('should return true for valid OpenAPI v3.0 document', () => {
    const result = isOpenAPIV3({ openapi: '3.0.0' })
    expect(result).toBeTruthy()
  })

  it('should return false for invalid OpenAPI v3.0 document', () => {
    const result = isOpenAPIV3({ swagger: '2.0' })
    expect(result).toBeFalsy()
  })

  it('should return false for null value', () => {
    const result = isOpenAPIV3(null)
    expect(result).toBeFalsy()
  })

  it('should return false for undefined value', () => {
    const result = isOpenAPIV3(undefined)
    expect(result).toBeFalsy()
  })

  it('should return false for string value', () => {
    const result = isOpenAPIV3('string')
    expect(result).toBeFalsy()
  })

  it('should return false for number value', () => {
    const result = isOpenAPIV3(123)
    expect(result).toBeFalsy()
  })

  it('should infer OpenAPI v3.0 document type', () => {
    const value = { openapi: '3.0.0' } as unknown
    const result = isOpenAPIV3(value)
    if (result) expectTypeOf(value).toEqualTypeOf<OpenAPIV3.Document>() 
  })
})
