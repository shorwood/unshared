import type { RequestContext, RequestOptions } from './parseRequest'

/**
 * Parse the request headers based on the provided data and options.
 *
 * @param route The route path.
 * @param options The request options.
 * @param context The request context.
 */
export function parseRequestHeaders(route: string, options: Pick<RequestOptions, 'headers'>, context: RequestContext): void {
  const { headers = {} } = options
  const { init } = context

  // --- Merge the headers with the existing headers.
  for (const key in headers) {
    const value = headers[key]
    if (value === undefined) continue
    if (typeof value !== 'string') continue
    init.headers = init.headers ?? {}
    init.headers = { ...init.headers, [key]: value }
  }
}
