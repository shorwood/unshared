/* eslint-disable sonarjs/cognitive-complexity */
import type { Awaitable } from '@unshared/functions/awaitable'
import type { RequestOptions } from './request'
import { awaitable } from '@unshared/functions/awaitable'

/** SSE event data structure */
export interface SseEvent<T = string> {

  /** The event type */
  event?: string

  /** The event data */
  data: T

  /** The event ID */
  id?: string

  /** The retry timeout in milliseconds */
  retry?: number
}

async function * createResponseStreamSseIterator<T>(response: Response, options: RequestOptions): AsyncGenerator<SseEvent<T>, void, unknown> {
  const { onError, onSuccess, onData, onEnd } = options
  try {
    const body = response.body
    if (body === null) throw new Error('Could not read the response body, it is empty.')
    const reader = body.getReader()
    const decoder = new TextDecoder()

    // SSE parsing state buffers according to spec
    let buffer = ''
    let bufferData = ''
    let bufferEvent = ''
    let bufferId = ''
    let bufferRetry: number | undefined

    function flush() {
      if (bufferData === '') return
      if (bufferData.endsWith('\n')) bufferData = bufferData.slice(0, -1)
      const sseEvent = {} as SseEvent<unknown>

      // --- Set `event`, `id`, and `retry` fields if they are set
      if (bufferEvent !== '') sseEvent.event = bufferEvent
      if (bufferId !== '') sseEvent.id = bufferId
      if (bufferRetry !== undefined) sseEvent.retry = bufferRetry

      // --- Attempt to parse the `data` field as JSON if it looks like an object
      try { sseEvent.data = JSON.parse(bufferData) as object }
      catch { sseEvent.data = bufferData }

      // --- Reset buffers for the next event
      bufferData = ''
      bufferEvent = ''
      bufferId = ''
      bufferRetry = undefined

      return sseEvent as SseEvent<T>
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // --- Split on all valid line endings: CRLF, LF, CR
      // --- Additionally, keep the last incomplete line in the buffer
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split(/\r\n|\n|\r/)
      buffer = lines.pop() ?? ''

      for (const line of lines) {

        // --- Empty line dispatches the event.
        if (line === '') {
          const event = flush()
          if (event) yield event
          if (event && onData) await onData(event, options)
          continue
        }

        // --- Skip comment lines (start with colon)
        if (line.startsWith(':')) continue

        // --- Parse field name and value by finding the first colon.
        const colonIndex = line.indexOf(':')
        let fieldName: string
        let fieldValue: string

        // --- No colon means field name only, empty value
        if (colonIndex === -1) {
          fieldName = line
          fieldValue = ''
        }
        else {
          fieldName = line.slice(0, colonIndex)
          fieldValue = line.slice(colonIndex + 1)
          if (fieldValue.startsWith(' ')) fieldValue = fieldValue.slice(1)
        }

        // --- Extract event type, data, id, and retry fields according to spec
        // --- Note that id must not contain null characters and retry must be a valid number.
        if (fieldName === 'event') {
          bufferEvent = fieldValue
        }
        else if (fieldName === 'data') {
          bufferData += `${fieldValue}\n`
        }
        else if (fieldName === 'id') {
          if (!fieldValue.includes('\0'))
            bufferId = fieldValue
        }
        else if (fieldName === 'retry' && /^\d+$/.test(fieldValue)) {
          bufferRetry = Number.parseInt(fieldValue, 10)
        }
      }
    }

    // --- Handle any remaining event in buffer at end of stream
    const event = flush()
    if (event) yield event
    if (event && onData) await onData(event, options)
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
 * Handle a request response where the content type is a Server-Sent Events stream. This function
 * will parse the SSE events and yield the data to the caller. If an error occurs, the `onError`
 * callback will be called and the function will return.
 *
 * @param response The response to handle.
 * @param options The options to pass to the request.
 * @returns An awaitable iterator that yields the parsed SSE events.
 */
export function handleResponseStreamSse<T>(response: Response, options: RequestOptions): Awaitable<AsyncIterable<SseEvent<T>>, Array<SseEvent<T>>> {
  const responseIterator = createResponseStreamSseIterator<T>(response, options)
  return awaitable(responseIterator)
}
