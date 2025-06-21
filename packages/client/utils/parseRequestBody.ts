import type { FetchOptions, RequestContext } from './parseRequest'
import { isFormDataLike } from './isFormDataLike'
import { isObjectLike } from './isObjectLike'
import { setHeader } from './setHeader'
import { toFormData } from './toFormData'

/**
 * Parse the request body based on the provided data and options.
 *
 * @param context The request context.
 * @param options The request options.
 */
export function parseRequestBody(context: Partial<RequestContext>, options: FetchOptions): void {
  const { body } = options

  // --- If the method is `GET`, `HEAD`, or `DELETE`, return early.
  if (!context.init?.method) return
  if (['get', 'head', 'delete'].includes(context.init.method)) return

  // --- If no data is provided, return early.
  if (body === null || body === undefined) return

  // --- If data contains a `File` object, create a FormData object.
  if (isFormDataLike(body)) {
    context.init.body = toFormData(body)
  }

  // --- If the data is a `ReadableStream`, pass it directly to the body.
  else if (body instanceof ReadableStream) {
    context.init.body = body
    context.init.headers = context.init.headers ?? {}
    setHeader(context.init.headers, 'Content-Type', 'application/octet-stream')
  }

  // --- If the data is a Blob, pass it directly to the body.
  else if (body instanceof File) {
    context.init.body = body.stream()
    context.init.headers = context.init.headers ?? {}
    setHeader(context.init.headers, 'Content-Disposition', `attachment; filename="${body.name}"`)
    setHeader(context.init.headers, 'Content-Type', body.type)
    setHeader(context.init.headers, 'Content-Length', body.size)
    setHeader(context.init.headers, 'Content-Transfer-Encoding', 'binary')
  }

  // --- Otherwise, stringify the data and set the content type to JSON.
  else if (isObjectLike(body)) {
    context.init.body = JSON.stringify(body)
    context.init.headers = context.init.headers ?? {}
    setHeader(context.init.headers, 'Content-Type', 'application/json')
  }

  // --- For all other data types, set the body directly.
  else {
    context.init.body = body as BodyInit
  }
}
