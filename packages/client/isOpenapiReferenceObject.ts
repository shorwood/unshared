import type { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types'

export type OpenAPIReference =
  | OpenAPIV2.ReferenceObject
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3_1.ReferenceObject

/**
 * Check if a value is an {@linkcode OpenAPIReference}.
 *
 * @param value The value to check.
 * @returns `true` if the value is a reference object.
 * @example isReferenceObject({ $ref: '#/components/schemas/MySchema' }) // true
 */
export function isOpenapiReferenceObject<T extends OpenAPIReference>(value: unknown): value is T {
  return typeof value === 'object'
    && value !== null
    && '$ref' in value
    && typeof value.$ref === 'string'
}
