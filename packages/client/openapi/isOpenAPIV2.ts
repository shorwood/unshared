/* oxlint-disable unicorn/filename-case */
import type { OpenAPIV2 } from 'openapi-types'

/**
 * Check if the given document is an OpenAPI v2 specification.
 *
 * @param value The document to check.
 * @returns `true` if the document is an OpenAPI v2 specification, `false` otherwise.
 * @example isOpenAPIV2({ swagger: '2.0', info: { title: 'Test API', version: '1.0.0' } }) // => true
 */
export function isOpenAPIV2(value: unknown): value is OpenAPIV2.Document {
  return typeof value === 'object'
    && value !== null
    && 'swagger' in value
    && value.swagger === '2.0'
}
