/* eslint-disable sonarjs/no-duplicate-string */
import { Readable } from 'node:stream'
import { Result } from '@unshared/functions/attempt'
import { RequestContext } from '../../createServerRoute'
import { HttpError } from '../../HttpError'

/**
 * Handle the result of an HTTP/2 route handler and interact with the response object.
 *
 * @param context The request context.
 * @param result The result of the route handler.
 */
export function handleHttpResult(context: RequestContext, result: Result<unknown, HttpError>): void {
  const [data, error] = result
  const { response } = context

  // --- Set the status code if not already set.
  if (response.statusCode === undefined)
    response.statusCode = 200

  // --- Handle errors.
  if (error) {
    response.writeHead(error.statusCode ?? 500)
    response.setHeader('Content-Type', 'text/plain')
    response.end(error.name)
  }

  // --- Handle the result.
  if (data === undefined) context.next()

  // --- Handle objects.
  if (typeof data === 'object') {
    const json = JSON.stringify(data, undefined, 2)
    response.setHeader('Content-Type', 'application/json')
    response.end(json)
  }

  // --- Handle streams.
  if (Readable.isReadable(data)) {
    response.setHeader('Content-Type', 'application/octet-stream')
    data.pipe(response)
  }

  // --- Handle buffers.
  if (Buffer.isBuffer(data)) {
    response.setHeader('Content-Type', 'application/octet-stream')
    response.write(data)
    response.end()
  }
}
