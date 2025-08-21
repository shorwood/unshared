import type { Awaitable } from '@unshared/functions/awaitable'
import type { RequestOptions } from './request'
import { awaitable } from '@unshared/functions/awaitable'

async function * createResponseStreamJsonIterator(response: Response, options: RequestOptions): AsyncGenerator<unknown, void, unknown> {
  const { onError, onSuccess, onData, onEnd } = options
  try {
    const body = response.body
    if (body === null) throw new Error('Could not read the response body, it is empty.')
    const reader = body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const parts = new TextDecoder().decode(value).trim().split('\0').filter(Boolean)

      // --- For each part, parse as JSON and yield the data.
      for (const part of parts) {
        const payload = JSON.parse(part) as unknown
        if (onData) await onData(payload, options)
        yield payload
      }
    }
    if (onSuccess) await onSuccess(response, options)
  }
  catch (error) {
    if (onError) await onError(error as Error, options)
    else throw error
  }
  finally {
    if (onEnd) await onEnd(response, options)
  }
}

/**
 * Handle a request response where the content type is a stream of JSON objects. This function
 * will parse the JSON objects and yield the data to the caller. If an error occurs, the `onError`
 * callback will be called and the function will return.
 *
 * @param response The response to handle.
 * @param options The options to pass to the request.
 * @returns An awaitable iterator that yields the parsed JSON objects.
 */
export function handleResponseStreamJson(response: Response, options: RequestOptions): Awaitable<AsyncIterable<unknown>, unknown[]> {
  const responseIterator = createResponseStreamJsonIterator(response, options)
  return awaitable(responseIterator)
}
