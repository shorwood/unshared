import { Http2ServerRequest } from 'node:http2'
import { Route } from '../../createServerRoute'

/**
 * Checks if a route matches a request. This is used to determine which handler
 * to call when a request is received.
 *
 * If the route does not have a method, it will match any request method.
 *
 * @param route The route to check.
 * @param request The request to check.
 * @returns Whether or not the route matches the request.
 * @example
 * const route = createRoute('GET /random/:min/:max')
 * const request = { url: '/random/1/10', method: 'GET' }
 * isRouteMatch(route, request) // true
 */
export function isRouteMatch(route: Route, request: Http2ServerRequest): boolean {
  const { method, path } = route
  const { url = '/', method: requestMethod } = request

  // --- Check the method.
  if (method && method !== requestMethod) return false

  // --- Check the path.
  const regexpString = path.replace(/:[a-z]+/g, '([a-z0-9]+)')
  const regexp = new RegExp(`^${regexpString}$`)
  return regexp.test(url)
}
