/* eslint-disable unicorn/filename-case */
import type { OpenAPIV2 } from 'openapi-types'
import { isOpenAPIV2 } from './isOpenAPIV2'

describe('isOpenAPIV2', () => {
  it('should return true for valid OpenAPI v2 document', () => {
    const result = isOpenAPIV2({ swagger: '2.0' })
    expect(result).toBe(true)
  })

  it('should return false for invalid OpenAPI v2 document', () => {
    const result = isOpenAPIV2({ openapi: '3.0.0' })
    expect(result).toBe(false)
  })

  it('should return false for null value', () => {
    const result = isOpenAPIV2(null)
    expect(result).toBe(false)
  })

  it('should return false for undefined value', () => {
    const result = isOpenAPIV2(undefined)
    expect(result).toBe(false)
  })

  it('should return false for string value', () => {
    const result = isOpenAPIV2('string')
    expect(result).toBe(false)
  })

  it('should return false for number value', () => {
    const result = isOpenAPIV2(123)
    expect(result).toBe(false)
  })

  it('should infer OpenAPI v2 document type', () => {
    const value = { swagger: '2.0' } as unknown
    const result = isOpenAPIV2(value)
    if (result) expectTypeOf(value).toEqualTypeOf<OpenAPIV2.Document>()
  })
})
