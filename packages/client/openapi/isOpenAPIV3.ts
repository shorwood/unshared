/* eslint-disable unicorn/filename-case */
import type { OpenAPIV3 } from 'openapi-types'

/**
 * Check if the given document is an OpenAPI v3.0 specification.
 *
 * @param value The document to check.
 * @returns `true` if the document is an OpenAPI v3.0 specification, `false` otherwise.
 * @example isOpenAPIV3({ openapi: '3.0.0', info: { title: 'Test API', version: '1.0.0' } }) // => true
 */
export function isOpenAPIV3(value: unknown): value is OpenAPIV3.Document {
  return typeof value === 'object'
    && value !== null
    && 'openapi' in value
    && value.openapi === '3.0.0'
}
