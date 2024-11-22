import type { OpenAPI } from 'openapi-types'
import type { OpenAPIV2 } from './OpenApiV2'

/**
 * Given an OpenAPI specification, find a route by its name.
 *
 * @param specification The OpenAPI specification.
 * @param name The name of the route to resolve.
 * @returns The resolved route.
 * @example getOperationByRoute(specification, 'GET /users') // { method: 'get', path: '/users', ... }
 */
export function getOperationByRoute<
  T extends object,
  U extends OpenAPIV2.Route<T>,
>(
  specification: Readonly<T>,
  name: U,
): OpenAPIV2.OperationByRoute<T, U> {

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
  const operation = path[method as keyof typeof path] as OpenAPI.Operation
  return { ...operation, method, path: routePath } as OpenAPIV2.OperationByRoute<T, U>
}
