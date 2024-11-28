import type { CollectKey, Pretty } from '@unshared/types'
import type { OpenAPI } from 'openapi-types'
import type { FetchMethod } from '../utils/parseRequest'

/** The HTTP methods supported by OpenAPI. */
const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'] as const

/** Union of all operation IDs in the specification. */
export type OperationId<T> =
T extends { paths: infer P }
  ? P extends Record<string, infer R>
    ? R extends Record<string, infer O>
      ? O extends { operationId: infer N }
        ? N
        : string
      : string
    : string
  : string

/** A union of possible Operations types in the specification. */
export type Operation = OpenAPI.Operation & { method: FetchMethod; path: string }

/** Find an operation by its operationId in an OpenAPI specification. */
export type OperationById<T, U extends OperationId<T>> =
  T extends { paths: infer P }
    ? CollectKey<P> extends Record<string, infer R>
      ? CollectKey<R> extends Record<string, infer O>
        ? O extends { $key: [infer P extends string, infer M extends string]; operationId: U }
          ? Pretty<Omit<O, '$key'> & { method: M; path: P }>
          : never
        : never
      : never
    : never

/**
 * Given an OpenAPI specification, find an operation by its operationId.
 *
 * @param document The OpenAPI specification document.
 * @param operationId The operationId of the operation to resolve.
 * @returns The resolved operation.
 * @example resolveOperation(document, 'getUser') // { method: 'get', path: '/users/{username}', ... }
 */
export function resolveOperation<T, U extends OperationId<T>>(document: T, operationId: U): OperationById<T, U>
export function resolveOperation(document: object, operationId: string): Operation
export function resolveOperation(document: object, operationId: string): Operation {

  // --- Validate the specification.
  if (!document
    || typeof document !== 'object'
    || document === null
    || 'paths' in document === false
    || typeof document.paths !== 'object'
    || document.paths === null)
    throw new Error('Missing paths object in the OpenAPI specification.')

  // --- Search for the operation in the specification's paths.
  const paths = document.paths as OpenAPI.Document['paths']
  for (const path in paths) {
    const route = paths[path]
    if (typeof route !== 'object' || route === null) continue

    // --- Search in each method for the operation.
    for (const method of methods) {
      const operation = route[method]
      if (method in route === false
        || typeof operation !== 'object'
        || operation === null
        || 'operationId' in operation === false
        || operation.operationId !== operationId) continue

      // --- Route was found, return the operation.
      return { ...route[method], method, path }
    }
  }

  // --- Throw an error if the operation was not found.
  throw new Error(`Operation "${operationId}" not found in specification.`)
}
