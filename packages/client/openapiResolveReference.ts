import type { StringJoin, StringReplace, WriteableDeep } from '@unshared/types'
import type { OpenAPIReference } from './isOpenapiReferenceObject'
import { isOpenapiReferenceObject } from './isOpenapiReferenceObject'

/**
 * Decode an OpenAPI reference path by replacing the encoded characters with
 * their original values. This function will replace `~0` with `~` and `~1`
 * with `/`.
 *
 * @example DecodeReference<'#/foo~1bar~0baz'> // '#/foo/bar~baz'
 */
export type OpenAPIReferenceDecoded<T extends string> =
  StringReplace<StringReplace<T, '~0', '~'>, '~1', '/'>

/**
 * Extract the parts of a reference path as a tuple.
 *
 * @example OpenAPIV3ReferencePath<'#/paths/~1users~1{username}'> // ['paths', '/users/{username}']
 */
export type OpenAPIReferencePath<T extends string> =
  T extends `#/${infer P}/${infer Rest}` ? [P, ...OpenAPIReferencePath<Rest>]
    : T extends `#/${infer P}` ? [P]
      : T extends `${infer P}/${infer Rest}` ? [P, ...OpenAPIReferencePath<Rest>]
        : T extends `${infer P}` ? [P]
          : []

/**
 * Resolve a type to the type it references. If the source is not a reference,
 * the source will be returned.
 *
 * @template T The type to resolve.
 * @returns The result type.
 * @example Resolved<{ $ref: '#/info' }, { info: { title: string } }> // { title: string }
 */
export type OpenAPIReferenceResolved<
  T extends OpenAPIReference,
  D extends object,
> =
  D extends object
    ? T extends { $ref: infer R extends string }

      // --- Match last part of the reference.
      ? OpenAPIReferencePath<R> extends [infer P extends string]
        ? OpenAPIReferenceDecoded<P> extends keyof D
          ? D[OpenAPIReferenceDecoded<P>] extends object
            ? WriteableDeep<Omit<D[OpenAPIReferenceDecoded<P>], keyof T>>
            : never
          : never

        // --- Match middle part of the reference.
        : OpenAPIReferencePath<R> extends [infer P extends string, ...infer Rest extends string[]]
          ? OpenAPIReferenceDecoded<P> extends keyof D
            ? D[OpenAPIReferenceDecoded<P>] extends object
              ? OpenAPIReferenceResolved<{ $ref: StringJoin<Rest, '/'> }, D[OpenAPIReferenceDecoded<P>]>
              : never
            : never
          : never
      : never
    : never

/**
 * Resolve an OpenAPI `ReferenceObject` to the component it references. If the
 * source is not a reference, the source will be returned.
 *
 * @private
 * @param reference The reference object to resolve.
 * @param document The OpenAPI document to resolve the reference from.
 * @returns The result component.
 * @example openapiResolveReference({ $ref: '#/components/schemas/User' }, document)
 */
export function openapiResolveReference<
  T extends OpenAPIReference,
  D extends object,
>(reference: Readonly<T>, document: Readonly<D>): OpenAPIReferenceResolved<T, D> {

  // --- Return the source if it is not a reference.
  if (!isOpenapiReferenceObject(reference))
    throw new TypeError('Expected reference to be a reference object.')

  // --- Assert that the parameters are valid.
  if (typeof document !== 'object' || document === null)
    throw new TypeError('Expected specification to have a components property.')

  // --- Resolve the component with it's reference path.
  const referenceParts = reference.$ref.replace(/^#\//, '').split('/')
  let result = document
  for (const part of referenceParts) {
    if (result === undefined) break
    if (typeof result !== 'object' || result === null) break
    const key = part.replaceAll('~1', '/').replaceAll('~0', '~')
    // @ts-expect-error: assume the part is a key of the object.
    result = result[key] as unknown
  }

  // --- Throw an error if the component could not be result.
  if (result === undefined)
    throw new Error(`Could not resolve OpenAPI component: ${reference.$ref}`)

  // --- Return the result component.
  return result as OpenAPIReferenceResolved<T, D>
}
