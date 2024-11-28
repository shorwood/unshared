import type { FetchOptions, RequestContext } from './parseRequest'

/**
 * Parse the basic authentication headers based on the provided username and password.
 *
 * @param context The request context.
 * @param options The request options.
 * @example
 *
 * // Append the `Authorization` header to the request.
 * const context = {}
 * parseRequestBasicAuth(context, { username: 'user', password: 'pass' })
 *
 * // Will mutate the `init` object to include the headers.
 * console.log(context) // => { init: { headers: { 'Authorization': 'Basic dXNlcjpwYXNz' } } }
 */
export function parseRequestBasicAuth(context: Partial<RequestContext>, options: FetchOptions): void {
  const { username, password } = options

  // --- Return early if the username or password is not provided.
  if (typeof username !== 'string' || typeof password !== 'string') return

  // --- Encode the credentials and set the Authorization header.
  const credentials = btoa(`${username}:${password}`)
  context.init = context.init ?? {}
  context.init.headers = context.init.headers ?? {}
  context.init.headers = { ...context.init.headers, Authorization: `Basic ${credentials}` }
}
