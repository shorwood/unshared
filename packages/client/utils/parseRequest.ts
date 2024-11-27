import type { ObjectLike } from '@unshared/types'
import type { UnionMerge } from '@unshared/types'
import type { RequestBodyOptions } from './parseRequestBody'
import type { RequestHeadersOptions } from './parseRequestHeaders'
import type { RequestParametersOptions } from './parseRequestParameters'
import type { RequestQueryOptions } from './parseRequestQuery'
import type { RequestUrlOptions } from './parseRequestUrl'
import { isObjectLike } from './isObjectLike'
import { parseRequestBody } from './parseRequestBody'
import { parseRequestHeaders } from './parseRequestHeaders'
import { parseRequestParameters } from './parseRequestParameters'
import { parseRequestQuery } from './parseRequestQuery'
import { parseRequestUrl } from './parseRequestUrl'

/** Options to pass to the request. */
export interface ParseRequestOptions<
  Body = unknown,
  Query extends ObjectLike = ObjectLike,
  Headers extends ObjectLike = ObjectLike,
  Parameters extends ObjectLike = ObjectLike,
> extends
  Omit<RequestUrlOptions, 'route'>,
  RequestBodyOptions<Body>,
  RequestQueryOptions<Query>,
  RequestHeadersOptions<Headers>,
  RequestParametersOptions<Parameters>,
  Omit<RequestInit, 'body' | 'headers' | 'method'> {

  /**
   * The data to include in the request. This data will be used to populate the
   * query parameters, body, and headers of the request based on the method type.
   *
   * @example { id: 1 }
   */
  data?: UnionMerge<Body | Headers | Parameters | Query>
}

export interface RequestContext {
  url?: URL
  init?: RequestInit
}

/**
 * Resolves the request body and/or query parameters based on the method type. This function
 * will mutate the `init` object to include the request body and headers based on the data type.
 *
 * @param route The name of the route to fetch.
 * @param options The options to pass to the request.
 * @returns The URL and the `RequestInit` object.
 */
export function parseRequest(route: string, options: ParseRequestOptions = {}): RequestContext {
  const { data, body, query, parameters, headers, method, baseUrl, searchArrayFormat, ...init } = options
  const context: RequestContext = { init }
  const dataObject = isObjectLike(data) ? data : undefined

  // --- Parse the URL and insert the path parameters.
  parseRequestUrl(context, { route, baseUrl, method })
  parseRequestParameters(context, { parameters: parameters ?? dataObject })

  // --- Depending on the method, parse the query, body, and headers.
  const requestMethod = context.init?.method?.toLowerCase() ?? 'get'
  const requestExpectsBody = ['post', 'put', 'patch'].includes(requestMethod)
  parseRequestQuery(context, { searchArrayFormat, query: requestExpectsBody ? query : query ?? dataObject })
  parseRequestBody(context, { body: requestExpectsBody ? body ?? dataObject : undefined })
  parseRequestHeaders(context, { headers })

  // --- Return the context with the URL and the `RequestInit` object.
  return context
}
