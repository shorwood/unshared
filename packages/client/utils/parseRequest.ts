import type { Loose, MaybeLiteral, ObjectLike } from '@unshared/types'
import type { UnionMerge } from '@unshared/types'
import type { HttpHeader } from '../HttpHeaders'
import type { HttpMethod } from '../HttpMethods'
import type { SearchArrayFormat } from './toSearchParams'
import { isObjectLike } from './isObjectLike'
import { parseRequestBasicAuth } from './parseRequestBasicAuth'
import { parseRequestBody } from './parseRequestBody'
import { parseRequestHeaders } from './parseRequestHeaders'
import { parseRequestParameters } from './parseRequestParameters'
import { parseRequestQuery } from './parseRequestQuery'
import { parseRequestUrl } from './parseRequestUrl'

/** The methods to use for the request. */
export type FetchMethod = Lowercase<keyof typeof HttpMethod> | Uppercase<keyof typeof HttpMethod>

/** Headers to include in the request. */
export type FetchHeaders = Partial<Record<MaybeLiteral<HttpHeader>, number | string>>

/** Options to pass to the request. */
export interface FetchOptions<
  Method extends FetchMethod = FetchMethod,
  BaseUrl extends string = string,
  Parameters extends ObjectLike = ObjectLike,
  Query extends ObjectLike = ObjectLike,
  Body = unknown,
  Headers extends ObjectLike = ObjectLike,
> extends Omit<RequestInit, 'body' | 'headers' | 'method'> {

  /**
   * The method to use for the request.
   *
   * @example 'GET'
   */
  method?: Method

  /**
   * The base URL to use for the request. This URL will be used to resolve the
   * path and query parameters of the request.
   *
   * @example 'https://api.example.com'
   */
  baseUrl?: BaseUrl

  /**
   * The data to include in the request. This data will be used to populate the
   * query parameters, body, and headers of the request based on the method type.
   *
   * @example { id: 1 }
   */
  data?: Loose<UnionMerge<Body | Headers | Query>>

  /**
   * The path parameters to include in the request.
   */
  parameters?: Parameters

  /**
   * The query parameters to include in the request.
   */
  query?: Loose<Query>

  /**
   * The format to use when serializing the query parameters.
   */
  queryArrayFormat?: SearchArrayFormat

  /**
   * The body to include in the request.
   */
  body?: Body extends ObjectLike ? Loose<Body> : Body

  /**
   * The headers to include in the request.
   */
  headers?: FetchHeaders & Headers

  /**
   * The username for basic authentication.
   */
  username?: string

  /**
   * The password for basic authentication.
   */
  password?: string
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
export function parseRequest(route: string, options: FetchOptions = {}): RequestContext {
  const { username, password, data, body, query, parameters, headers, method, baseUrl, queryArrayFormat, ...init } = options
  const context: RequestContext = { init }
  const dataObject = isObjectLike(data) ? data : undefined

  // --- Parse the URL and insert the path parameters.
  parseRequestUrl(context, route, { baseUrl, method })
  parseRequestParameters(context, { parameters: parameters ?? dataObject })
  parseRequestBasicAuth(context, { username, password })

  // --- Depending on the method, parse the query, body, and headers.
  const requestMethod = context.init?.method?.toLowerCase() ?? 'get'
  const requestExpectsBody = ['post', 'put', 'patch'].includes(requestMethod)
  parseRequestQuery(context, { queryArrayFormat, query: requestExpectsBody ? query : query ?? dataObject })
  parseRequestBody(context, { body: requestExpectsBody ? body ?? dataObject : undefined })
  parseRequestHeaders(context, { headers })

  // --- Return the context with the URL and the `RequestInit` object.
  return context
}
