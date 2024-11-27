import type { FetchOptions } from './parseRequest'
import { parseRequest } from './parseRequest'

/**
 * Fetch a route with the provided options. This function will parse the route and
 * options to create a `Request` object and return the response from the server.
 *
 * @param route The name of the route to fetch.
 * @param options The options to pass to the request.
 * @returns The response from the server.
 * @example fetch('GET /users', { query: { limit: 10 } })
 */
export async function fetch(route: string, options?: FetchOptions): Promise<Response>
export async function fetch(route: string, options: FetchOptions = {}): Promise<Response> {
  const { url, init } = parseRequest(route, options)
  if (!url) throw new Error('Could not parse request URL')
  return await globalThis.fetch(url, init)
}
