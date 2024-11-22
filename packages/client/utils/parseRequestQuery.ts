/* eslint-disable unicorn/prevent-abbreviations */
import type { RequestContext, RequestOptions } from './parseRequest'
import { isObjectLike } from './isObjectLike'
import { toSearchParams } from './toSearchParams'

/**
 * Parse the query parameters from the request data. This function will append
 * the query parameters to the URL based on the method and the data provided.
 *
 * @param route The name of the route to fetch. (ignored)
 * @param options The options to pass to the request.
 * @param context The request context to modify.
 */
export function parseRequestQuery(route: string, options: Pick<RequestOptions, 'data' | 'query' | 'searchArrayFormat'>, context: RequestContext): void {
  const { url, init } = context
  const { data, query = {}, searchArrayFormat } = options
  if (!url) throw new Error('Could not resolve the `RequestInit` object: the `url` is missing.')

  // --- Append the `data` to the query parameters if the method does not expect a body.
  const isExpectingBody = ['post', 'put', 'patch'].includes(init.method ?? 'get')
  if (!isExpectingBody && isObjectLike(data)) {
    for (const key in data) {
      if (data[key] === undefined) continue
      if (query[key] !== undefined) continue
      // @ts-expect-error: Ignore type mismatch.
      query[key] = data[key]
      delete data[key]
    }
  }

  // --- Apply the query parameters to the URL.
  url.search = toSearchParams(query, { searchArrayFormat }).toString()
}
