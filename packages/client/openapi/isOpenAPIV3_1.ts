/* eslint-disable unicorn/filename-case */
import type { OpenAPIV3_1 } from 'openapi-types'

/**
 * Check if the given document is an OpenAPI v3.1 specification.
 *
 * @param value The document to check.
 * @returns `true` if the document is an OpenAPI v3.1 specification, `false` otherwise.
 * @example isOpenAPIV3_1({ openapi: '3.1.0', info: { title: 'Test API', version: '1.0.0' } }) // => true
 */
export function isOpenAPIV3_1(value: unknown): value is OpenAPIV3_1.Document {
  return typeof value === 'object'
    && value !== null
    && 'openapi' in value
    && value.openapi === '3.1.0'
}
