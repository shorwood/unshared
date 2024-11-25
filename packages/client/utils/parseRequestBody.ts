import type { RequestContext, RequestOptions } from './parseRequest'
import { isFormDataLike } from './isFormDataLike'
import { isObjectLike } from './isObjectLike'
import { toFormData } from './toFormData'

/**
 * Parse the request body based on the provided data and options.
 *
 * @param route The route path.
 * @param options The request options.
 * @param context The request context.
 */
export function parseRequestBody(route: string, options: Pick<RequestOptions, 'body' | 'data'>, context: RequestContext): void {
  const { data, body = data } = options
  const { init } = context
  init.headers = init.headers ?? {}

  // --- If the method is `GET`, `HEAD`, or `DELETE`, return early.
  if (['get', 'head', 'delete'].includes(init.method ?? 'get')) return

  // --- If no data is provided, return early.
  if (body === null || body === undefined) return

  // --- If data contains a `File` object, create a FormData object.
  if (isFormDataLike(body)) {
    init.body = toFormData(body)
    init.headers = { ...init.headers, 'Content-Type': 'multipart/form-data' }
  }

  // --- If the data is a `ReadableStream`, pass it directly to the body.
  else if (body instanceof ReadableStream) {
    init.body = body
  }

  // --- If the data is a Blob, pass it directly to the body.
  else if (body instanceof File) {
    init.body = body.stream()
    init.headers = { ...init.headers, 'Content-Type': 'application/octet-stream' }
  }

  // --- Otherwise, stringify the data and set the content type to JSON.
  else if (isObjectLike(body)) {
    init.body = JSON.stringify(body)
    init.headers = { ...init.headers, 'Content-Type': 'application/json' }
  }

  // --- For all other data types, set the body directly.
  else {
    init.body = body
  }
}
