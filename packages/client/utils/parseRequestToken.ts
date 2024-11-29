import type { FetchOptions, RequestContext } from './parseRequest'
import { setCookie } from './setCookie'
import { setHeader } from './setHeader'

/**
 * Parse the token and dynamically extend either the query, headers, or cookies.
 *
 * @param context The request context.
 * @param options The request options.
 * @example
 * // Append the `token` to the query parameters.
 * const context = { url: new URL('https://example.com') }
 * parseRequestToken(context, { token: 'my-token', tokenLocation: 'query', tokenProperty: 'token' })
 * console.log(context.url.searchParams.get('token')) // 'my-token'
 *
 * @example
 * // Append the `token` to the headers.
 * const context = { init: { headers: new Headers() } }
 * parseRequestToken(context, { token: 'my-token', tokenLocation: 'header', tokenProperty: 'Authorization' })
 * console.log(context.init.headers.get('Authorization')) // 'Bearer my-token'
 *
 * @example
 * // Append the `token` to the cookies.
 * const context = { init: { headers: new Headers() } }
 * parseRequestToken(context, { token: 'my-token', tokenLocation: 'cookie', tokenProperty: 'token' })
 * console.log(context.init.headers.get('Cookie')) // 'token=my-token'
 */
export function parseRequestToken(context: Partial<RequestContext>, options: FetchOptions): void {
  const { token, tokenLocation = 'headers', tokenProperty } = options

  // --- Return early if the token is not provided.
  if (!token) return

  // --- Append the token to the query parameters.
  if (tokenLocation === 'query') {
    if (context.url instanceof URL === false) throw new Error('The `url` must be an instance of `URL`.')
    if (!tokenProperty) throw new Error('The `tokenProperty` must be provided when using `tokenLocation` of `query`.')
    context.url.searchParams.set(tokenProperty, token)
  }

  // --- Append the token to the path parameters.
  else if (tokenLocation === 'header') {
    context.init = context.init ?? {}
    context.init.headers = context.init.headers ?? {}
    if (tokenProperty) setHeader(context.init.headers, tokenProperty, token)
    else setHeader(context.init.headers, 'Authorization', `Bearer ${token}`)
  }

  // --- Append the token to the cookie header.
  else if (tokenLocation === 'cookie') {
    if (!tokenProperty) throw new Error('The `tokenProperty` must be provided when using `tokenLocation` of `cookie`.')
    context.init = context.init ?? {}
    context.init.headers = context.init.headers ?? {}
    setCookie(context.init.headers, tokenProperty, token)
  }
}
