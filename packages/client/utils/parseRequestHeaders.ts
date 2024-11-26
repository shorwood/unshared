import type { MaybeLiteral, ObjectLike } from '@unshared/types'
import type { HttpHeader } from '../types'
import type { RequestContext } from './parseRequest'

/** Headers to include in the request. */
export type RequestHeaders = Partial<Record<MaybeLiteral<HttpHeader>, number | string>>

/** The options to pass to the `parseRequestHeaders` function. */
export interface RequestHeadersOptions<T extends ObjectLike = ObjectLike> {

  /**
   * The headers to include in the request.
   */
  headers?: RequestHeaders & T
}

/**
 * Parse the request headers based on the provided data and options.
 *
 * @param context The request context.
 * @param options The request options.
 * @example
 *
 * // Append the `Content-Type` header to the request.
 * const context = {}
 * parseRequestHeaders(context, { headers: { 'Content-Type': 'application/json' } })
 *
 * // Will mutate the `init` object to include the headers.
 * console.log(context) // => { init: { headers: { 'Content-Type': 'application/json' } } }
 */
export function parseRequestHeaders(context: RequestContext, options: RequestHeadersOptions): void {
  const { headers = {} } = options

  // --- Merge the headers with the existing headers.
  for (const key in headers) {
    const value = headers[key]
    if (((typeof value !== 'string' || value.length === 0) && typeof value !== 'number')) continue
    context.init = context.init ?? {}
    context.init.headers = context.init.headers ?? {}
    context.init.headers = { ...context.init.headers, [key]: String(value) }
  }
}
