import type { OpenAPI } from 'openapi-types'
import type { OpenAPIV2 } from './OpenApiV2'

/** The HTTP methods supported by OpenAPI. */
const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'] as const

/**
 * Given an OpenAPI specification, find an operation by its operationId.
 *
 * @param specification The OpenAPI specification.
 * @param operationId The operationId of the operation to resolve.
 * @returns The resolved operation.
 * @example openapiGetOperation(specification, 'getUser') // { method: 'get', path: '/users/{username}', ... }
 */
export function getOperationById<T, U extends OpenAPIV2.OperationId<T>>(
  specification: T,
  operationId: U,
): OpenAPIV2.OperationById<T, U> {

  // --- Validate the specification.
  if (!specification
    || typeof specification !== 'object'
    || specification === null
    || 'paths' in specification === false
    || typeof specification.paths !== 'object'
    || specification.paths === null)
    throw new Error('Missing paths object in the OpenAPI specification.')

  // --- Search for the operation in the specification's paths.
  const paths = specification.paths as OpenAPI.Document['paths']
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
      return { ...route[method], method, path } as OpenAPIV2.OperationById<T, U>
    }
  }

  // --- Throw an error if the operation was not found.
  throw new Error(`Operation "${operationId}" not found in specification.`)
}
