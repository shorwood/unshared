import type { CollectKey, Fallback, Pretty, StringSplit } from '@unshared/types'
import type { OpenAPI } from 'openapi-types'
import type { Operation } from './getOperationById'

/** Union of all operation route names in the specification. */
export type OperationRoute<T> =
  T extends { paths: infer P }
    ? CollectKey<P> extends Record<string, infer R>
      ? CollectKey<R> extends Record<string, infer O>
        ? O extends { $key: [infer P extends string, infer M extends string] }
          ? `${Uppercase<M>} ${P}`
          : string
        : string
      : string
    : string

/** Find an operation by its route name in an OpenAPI specification. */
export type OperationByRoute<T, U extends OperationRoute<T>> =
  StringSplit<U, ' '> extends [infer M extends string, infer P extends string]
    ? T extends { paths: infer U }
      ? U extends Record<P, infer R>
        ? R extends Record<Lowercase<M>, infer O>
          ? Pretty<{ method: Lowercase<M>; path: P } & O>
          : never
        : never
      : never
    : never

/**
 * Given an OpenAPI specification, find a route by its name.
 *
 * @param specification The OpenAPI specification.
 * @param name The name of the route to resolve.
 * @returns The resolved route.
 * @example getOperationByRoute(specification, 'GET /users') // { method: 'get', path: '/users', ... }
 */
export function getOperationByRoute<T, U extends OperationRoute<T>>(specification: Readonly<T>, name: U): Fallback<OperationByRoute<T, U>, Operation> {

  // --- Assert the specification has a paths object.
  if (!specification
    || typeof specification !== 'object'
    || specification === null
    || 'paths' in specification === false
    || typeof specification.paths !== 'object'
    || specification.paths === null)
    throw new Error('Missing paths object in the OpenAPI specification.')

  // --- Extract the path and method from the name.
  const match = /^(get|post|put|patch|delete|head|options) (\/.+)$/i.exec(name)
  if (!match) throw new Error('Could not resolve the path and method from the route name.')
  const [, routeMethod, routePath] = match
  const method = routeMethod.toLowerCase()

  // --- Search for the route in the specification's paths.
  const paths = specification.paths as Record<string, OpenAPI.Operation>
  const path = paths[routePath]
  if (!path) throw new Error(`Route "${name}" not found in specification.`)
  if (typeof path !== 'object' || path === null) throw new Error('Invalid path object in the OpenAPI specification.')
  if (method in path === false) throw new Error(`Method "${method}" not found in path "${routePath}".`)

  // --- Search for the operation in the specification's paths.
  const operation = path[method as keyof typeof path]
  if (typeof operation !== 'object' || operation === null) throw new Error('Invalid operation object in the OpenAPI specification.')
  if ('operationId' in operation === false) throw new Error('Missing operationId in the operation object.')

  // --- Return the operation with the method and path.
  return { ...operation, method, path: routePath } as OperationByRoute<T, U>
}
