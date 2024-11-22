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
  const { data, body } = options
  const { init } = context
  init.headers = init.headers ?? {}

  // --- If the `body` is provided, return early.
  if (body !== undefined) {
    init.body = body
    return
  }

  // --- If the method is `GET`, `HEAD`, or `DELETE`, return early.
  if (['get', 'head', 'delete'].includes(init.method ?? 'get')) return

  // --- If no data is provided, return early.
  if (data === null || data === undefined) return

  // --- If data contains a `File` object, create a FormData object.
  if (isFormDataLike(data)) {
    init.body = toFormData(data)
    init.headers = { ...init.headers, 'Content-Type': 'multipart/form-data' }
  }

  // --- If the data is a `ReadableStream`, pass it directly to the body.
  else if (data instanceof ReadableStream) {
    init.body = data
  }

  // --- If the data is a Blob, pass it directly to the body.
  else if (data instanceof File) {
    init.body = data.stream()
    init.headers = { ...init.headers, 'Content-Type': 'application/octet-stream' }
  }

  // --- Otherwise, stringify the data and set the content type to JSON.
  else if (isObjectLike(data)) {
    init.body = JSON.stringify(data)
    init.headers = { ...init.headers, 'Content-Type': 'application/json' }
  }
}
