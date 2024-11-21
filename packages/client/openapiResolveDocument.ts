import type { ObjectLike } from '@unshared/types'
import type { OpenAPIReference } from './isOpenapiReferenceObject'
import type { OpenAPIReferenceResolved } from './openapiResolveReference'
import { isOpenapiReferenceObject } from './isOpenapiReferenceObject'
import { openapiResolveReference as openapiResolveReference } from './openapiResolveReference'

/**
 * Resolve a type to the type it references. If the source is not a reference,
 * the source will be returned.
 *
 * @template T The type to resolve.
 * @returns The resolved type.
 * @example
 * type Resolved = OpenAPIResolved<{
 *   ...
 *   paths: {
 *     '/users': {
 *       get: { $ref: '#/components/routes/getUsers' }
 *     }
 *   }
 * }>
 */
export type OpenAPIResolved<T, D = T> =
  T extends OpenAPIReference
    ? D extends object ? OpenAPIResolved<OpenAPIReferenceResolved<T, D>, D> : never
    : T extends object ? { -readonly [K in keyof T]: OpenAPIResolved<T[K], D> } : T

/**
 * Recursively resolve all references in an OpenAPI specification. This function
 * will return a `Proxy` object that will resolve references on the fly.
 *
 * @param value The OpenAPI specification.
 * @returns The resolved OpenAPI specification.
 * @example
 * const resolved = openapiResolveReferences({
 *   ...
 *   paths: {
 *     '/users': {
 *       get: { $ref: '#/components/routes/getUsers' },
 *     },
 *   },
 * })
 */
export function openapiResolveDocument<T extends object>(value: Readonly<T>): OpenAPIResolved<T>
export function openapiResolveDocument<T extends object, D>(value: Readonly<T>, document: Readonly<D>): OpenAPIResolved<T, D>
export function openapiResolveDocument(value: Readonly<ObjectLike>, document = value): unknown {
  return new Proxy(value, {
    get(target, property: string) {
      let value = target[property]

      // --- Abort if no document is provided.
      if (!document) return value

      // --- Resolve the reference if it is a reference object.
      if (isOpenapiReferenceObject(value))
        value = openapiResolveReference(value, document)

      // --- Recursively resolve references in objects.
      if (typeof value === 'object' && value !== null)
        return openapiResolveDocument(value as ObjectLike, document)

      // --- Return the value as is.
      return value
    },
  })
}
