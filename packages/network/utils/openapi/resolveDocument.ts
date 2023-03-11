import { OpenAPIV3 } from 'openapi-types'
import { resolveReference } from './resolveReference'

/**
 * Resolve a type to the type it references. If the source is not a reference,
 * the source will be returned.
 *
 * @template T The type to resolve.
 * @returns The resolved type.
 * @example ResolvedDeep<OpenAPIV3.Document>
 */
export type ResolvedDeep<T> =
  T extends OpenAPIV3.ReferenceObject ? never
    : T extends (infer U)[] ? ResolvedDeep<U>[]
      : T extends Record<string, any> ? { [K in keyof T]: ResolvedDeep<T[K]> }
        : T

/**
 * Recursively resolve all references in an OpenAPI specification. This function
 * will return a `Proxy` object that will resolve references on the fly.
 *
 * @param specification The OpenAPI specification.
 * @returns The resolved OpenAPI specification.
 * @example resolveDocument(specification) // Fully resolved `specification`.
 */
export function resolveDocument(specification: Partial<OpenAPIV3.Document>): ResolvedDeep<OpenAPIV3.Document>
// @ts-expect-error: ignore T not being OpenAPIV3.Document
export function resolveDocument<T>(specification: Partial<OpenAPIV3.Document>, source: T = specification): ResolvedDeep<T> {
  // --- Return the source if it is not an object.
  if (typeof source !== 'object' || source === null) return source as ResolvedDeep<T>

  // --- Proxify the object to resolve references on the fly.
  return new Proxy(source, {
    get(target, property) {
      const value = Reflect.get(target, property)
      const wrapped = resolveReference(specification, value)

      // --- Recursively resolve references in objects.
      return typeof wrapped === 'object' && wrapped !== null
        // @ts-expect-error: hidden parameter
        ? resolveDocument(specification, wrapped)
        : wrapped
    },
  }) as ResolvedDeep<T>
}

/** c8 ignore next */
if (import.meta.vitest) {
  const specRaw = await import('../../__fixtures__/example.json')
  const spec = specRaw as OpenAPIV3.Document

  it('should resolve a reference', () => {
    const result = resolveDocument(spec)
    // @ts-expect-error: ignore type error
    const resolved = result.components.schemas.user
    const expected = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        uuid: {
          type: 'string',
        },
      },
    }
    expect(resolved).toEqual(expected)
  })

  it('should resolve nested references', () => {
    const result = resolveDocument(spec)
    // @ts-expect-error: ignore type error
    const resolved = result?.paths['/2.0/repositories/{username}']?.get?.responses?.['200']?.content?.['application/json']?.schema?.items
    expect(resolved).toEqual({
      type: 'object',
      properties: {
        slug: {
          type: 'string',
        },
        owner: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
            },
            uuid: {
              type: 'string',
            },
          },
        },
      },
    })
  })
}
