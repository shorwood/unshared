import type { RequestOptions } from './request'
import { handleResponseStreamJson } from './handleResponseStreamJson'
import { handleResponseStreamSse } from './handleResponseStreamSse'

/**
 * Handle a request response. This function will parse the response based on the content type and
 * return the data. If an error occurs, the `onError` callback will be called and the function will
 * throw an error.
 *
 * @param response The response to handle.
 * @param options The options to pass to the request.
 * @returns The parsed data from the response.
 */
export async function handleResponse(response: Response, options: RequestOptions = {}): Promise<unknown> {
  const { onError, onSuccess, onData, onEnd, onFailure } = options
  const contentType = response.headers.get('Content-Type')

  // --- If the response is not OK, throw an error with the response message.
  if (!response.ok) {
    if (onFailure) await onFailure(response, options)
    if (onEnd) await onEnd(response, options)
    throw new Error(response.statusText)
  }

  // --- If the status code is 204, return an empty response early.
  if (response.status === 204) {
    if (onSuccess) await onSuccess(response, options)
    if (onEnd) await onEnd(response, options)
    return
  }

  // --- If the response is a application/stream+json, return an iterator that parses the JSON.
  if (contentType?.startsWith('application/stream+json'))
    return handleResponseStreamJson(response, options)

  // --- If the response is a text/event-stream, return an iterator that parses the SSE events.
  if (contentType?.startsWith('text/event-stream'))
    return handleResponseStreamSse(response, options)

  // --- If the response is a application/json, parse the JSON and return it.
  if (contentType?.startsWith('application/json')) {
    return await response.json()
      .then(async(data) => {
        if (onData) await onData(data, options)
        if (onSuccess) await onSuccess(response, options)
        return data as unknown
      })
      .catch(async(error: Error) => {
        if (onError) await onError(error, options)
        else throw error
      })
      .finally(() => {
        if (onEnd) onEnd(response, options)
      })
  }

  // --- If the response is a text content type (but not event-stream), return the text response.
  if (contentType?.startsWith('text/')) {
    return await response.text()
      .then(async(data) => {
        if (onData) await onData(data, options)
        if (onSuccess) await onSuccess(response, options)
        return data
      })
      .catch(async(error: Error) => {
        if (onError) await onError(error, options)
        else throw error
      })
      .finally(() => {
        if (onEnd) onEnd(response, options)
      })
  }

  // --- Otherwise, fallback to returning the response body as-is.
  if (onSuccess) onSuccess(response, options)
  if (onEnd) onEnd(response, options)
  return response.body
}
