import type { RequestContext } from './parseRequest'
import type { SearchArrayFormat, SearchParamsObject as SearchParametersObject } from './toSearchParams'
/* eslint-disable unicorn/prevent-abbreviations */
import type { ObjectLike } from '@unshared/types'
import { toSearchParams } from './toSearchParams'

/** The options to pass to the `parseRequestQuery` function. */
export interface RequestQueryOptions<T extends ObjectLike = ObjectLike> {

  /**
   * The query parameters to include in the request.
   */
  query?: T

  /**
   * The format to use when serializing the query parameters.
   */
  searchArrayFormat?: SearchArrayFormat
}

/**
 * Parse the query parameters from the request data. This function will append
 * the query parameters to the URL based on the method and the data provided.
 *
 * @param context The request context to modify.
 * @param options The options to pass to the request.
 */
export function parseRequestQuery(context: RequestContext, options: RequestQueryOptions): void {
  const { url } = context
  const { query, searchArrayFormat } = options

  // --- Return early if the query is not an object or the URL is not provided.
  if (url === undefined) return
  if (url instanceof URL === false) throw new Error('The `url` must be an instance of `URL.')
  if (typeof query !== 'object' || query === null) return

  // --- Append the `data` to the query parameters if the method does not expect a body.
  const searchObject: SearchParametersObject = {}
  for (const key in query) {
    const value = query[key]
    if (
      (typeof value === 'string' && value.length > 0)
      || (typeof value === 'number' && Number.isFinite(value))
      || (typeof value === 'boolean')
      || Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')
    ) {
      searchObject[key] = value
      delete query[key]
    }
  }

  // --- Apply the query parameters to the URL.
  url.search = toSearchParams(searchObject, { searchArrayFormat }).toString()
}
