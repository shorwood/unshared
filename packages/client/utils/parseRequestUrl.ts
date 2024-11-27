import type { FetchOptions, RequestContext } from './parseRequest'

/** Regular expression to match the request method and URL. */
const EXP_REQUEST = /^((?<method>[a-z]+) )?(?<url>[^:]+?:\/{2}[^/]+)?(?<path>\/[^\s?]*)/i

/** Valid HTTP methods. */
const METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options'])

/**
 * Parses the route name to extract the URL and method. It allows the url and method to be
 * provided in the route name, or in the options object. The method will default to 'get'.
 *
 * @param context The request context to mutate.
 * @param route The name of the route to fetch.
 * @param options The options to pass to the request.
 * @example parseRequestUrl('GET /users', { baseUrl: 'https://api.example.com' }, context)
 */
export function parseRequestUrl(context: RequestContext, route: string, options: FetchOptions): void {
  const { method, baseUrl } = options

  // --- Extract the path, method, and base URL from the route name.
  const match = EXP_REQUEST.exec(route)
  if (!match?.groups) throw new Error('Could not resolve the `RequestInit` object: Invalid route name.')
  const routeMethod = method ?? match.groups.method ?? 'get'
  const routeBaseUrl = baseUrl ?? match.groups.url

  // --- Assert the base URL is provided, either in the options or the route name.
  if (!routeBaseUrl) throw new Error('Could not resolve the `RequestInit` object: the `baseUrl` is missing.')

  // --- Assert the method is valid.
  const methodLower = routeMethod.toLowerCase()
  const methodIsValid = METHODS.has(methodLower)
  if (!methodIsValid) throw new Error(`Could not resolve the \`RequestInit\` object:, the method \`${routeMethod}\` is invalid.`)

  // --- Create the url and apply the method.
  context.init = context.init ?? {}
  context.init.method = methodLower
  context.url = new URL(routeBaseUrl)

  // --- Append the path to the URL while making sure there are no double slashes.
  context.url.pathname += context.url.pathname.endsWith('/') ? match.groups.path.slice(1) : match.groups.path
}
