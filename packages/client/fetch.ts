import { parseRequest } from './utils/parseRequest'

/**
 * Fetch a route with the provided options. This function will parse the route and
 * options to create a `Request` object and return the response from the server.
 *
 * @param route The name of the route to fetch.
 * @param options The options to pass to the request.
 * @returns The response from the server.
 * @example fetch('GET /users', { query: { limit: 10 } })
 */
export function fetch(route: string, options: Record<string, unknown>) {
  const { url, init } = parseRequest(route, options)
  return globalThis.fetch(url!, init)
}
