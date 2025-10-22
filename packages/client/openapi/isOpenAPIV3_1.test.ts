/* oxlint-disable unicorn/filename-case */
import type { OpenAPIV3_1 } from 'openapi-types'
import { isOpenAPIV3_1 } from './isOpenAPIV3_1'

describe('isOpenAPIV3_1', () => {
  it('should return true for valid OpenAPI v3.1 document', () => {
    const result = isOpenAPIV3_1({ openapi: '3.1.0' })
    expect(result).toBe(true)
  })

  it('should return false for invalid OpenAPI v3.1 document', () => {
    const result = isOpenAPIV3_1({ swagger: '2.0' })
    expect(result).toBe(false)
  })

  it('should return false for null value', () => {
    const result = isOpenAPIV3_1(null)
    expect(result).toBe(false)
  })

  it('should return false for undefined value', () => {
    const result = isOpenAPIV3_1(undefined)
    expect(result).toBe(false)
  })

  it('should return false for string value', () => {
    const result = isOpenAPIV3_1('string')
    expect(result).toBe(false)
  })

  it('should return false for number value', () => {
    const result = isOpenAPIV3_1(123)
    expect(result).toBe(false)
  })

  it('should infer OpenAPI v3.1 document type', () => {
    const value = { openapi: '3.1.0' } as unknown
    const result = isOpenAPIV3_1(value)
    if (result) expectTypeOf(value).toEqualTypeOf<OpenAPIV3_1.Document>()
  })
})
