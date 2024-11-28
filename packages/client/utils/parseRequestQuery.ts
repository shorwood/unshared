/* eslint-disable unicorn/prevent-abbreviations */
import type { FetchOptions, RequestContext } from './parseRequest'
import type { SearchParamsObject as SearchParametersObject } from './toSearchParams'
import { toSearchParams } from './toSearchParams'

/**
 * Parse the query parameters from the request data. This function will append
 * the query parameters to the URL based on the method and the data provided.
 *
 * @param context The request context to modify.
 * @param options The options to pass to the request.
 */
export function parseRequestQuery(context: Partial<RequestContext>, options: FetchOptions): void {
  const { url } = context
  const { query, queryArrayFormat } = options

  // --- Return early if the query is not an object or the URL is not provided.
  if (url === undefined) return
  if (url instanceof URL === false) throw new Error('The `url` must be an instance of `URL.')
  if (typeof query !== 'object' || query === null) return

  // --- Append the `data` to the query parameters if the method does not expect a body.
  const queryObject: SearchParametersObject = {}
  for (const key in query) {
    const value = query[key]
    if (
      (typeof value === 'string' && value.length > 0)
      || (typeof value === 'number' && Number.isFinite(value))
      || (typeof value === 'boolean')
      || Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')
    ) {
      queryObject[key] = value
      delete query[key]
    }
  }

  // --- Apply the query parameters to the URL.
  url.search = toSearchParams(queryObject, { format: queryArrayFormat }).toString()
}
