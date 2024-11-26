/* eslint-disable unicorn/prevent-abbreviations */
import type { MaybeLiteral } from '@unshared/types'
import type { HttpHeader, HttpMethod } from '../types'
import type { SearchArrayFormat, SearchParamsObject } from './toSearchParams'
import { parseRequestBody } from './parseRequestBody'
import { parseRequestHeaders } from './parseRequestHeaders'
import { parseRequestParameters } from './parseRequestParameters'
import { parseRequestQuery } from './parseRequestQuery'
import { parseRequestUrl } from './parseRequestUrl'

/** The methods to use for the request. */
export type RequestMethod = Lowercase<keyof typeof HttpMethod> | Uppercase<keyof typeof HttpMethod>

/** Headers to include in the request. */
export type RequestHeaders = Partial<Record<MaybeLiteral<HttpHeader>, string>>

/** The types of data that can be passed to the request. */
export type RequestBody = File | FormData | ReadableStream | Record<string, unknown> | string

/** Options to pass to the request. */
export interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {

  /**
   * The method to use for the request.
   *
   * @example 'GET'
   */
  method?: RequestMethod

  /**
   * The base URL to use for the request. This URL will be used to resolve the
   * path and query parameters of the request.
   *
   * @example 'https://api.example.com'
   */
  baseUrl?: string

  /**
   * The data to pass to the request. This data will be used to fill the path
   * parameters, query parameters, body, and form data of the request based on
   * the route method.
   */
  data?: RequestBody

  /**
   * The body to include in the request.
   */
  body?: RequestBody

  /**
   * The headers to include in the request.
   */
  headers?: RequestHeaders

  /**
   * Query parameters to include in the request.
   */
  query?: SearchParamsObject

  /**
   * The format to use when serializing the query parameters.
   */
  searchArrayFormat?: SearchArrayFormat

  /**
   * The path parameters to include in the request.
   */
  parameters?: Record<string, number | string>
}

export interface RequestContext {
  url?: URL
  init: RequestInit
}

/**
 * Resolves the request body and/or query parameters based on the method type. This function
 * will mutate the `init` object to include the request body and headers based on the data type.
 *
 * @param route The name of the route to fetch.
 * @param options The options to pass to the request.
 * @returns The URL and the `RequestInit` object.
 */
export function parseRequest(route: string, options: RequestOptions): RequestContext {
  const { data, body, query, headers, parameters, baseUrl, method, searchArrayFormat, ...requestInit } = options
  const context: RequestContext = { init: requestInit }
  parseRequestUrl(route, { baseUrl, method }, context)
  parseRequestParameters(route, { data, parameters }, context)
  parseRequestQuery(route, { data, query, searchArrayFormat }, context)
  parseRequestBody(route, { data, body }, context)
  parseRequestHeaders(route, { headers }, context)
  return context
}
