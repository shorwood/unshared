/* eslint-disable sonarjs/cognitive-complexity */
import type { Awaitable } from '@unshared/functions/awaitable'
import type { RequestOptions } from './request'
import { awaitable } from '@unshared/functions/awaitable'

/** SSE event data structure */
export interface SseEvent {

  /** The event type */
  event?: string

  /** The event data */
  data: string

  /** The event ID */
  id?: string

  /** The retry timeout in milliseconds */
  retry?: number
}

async function * createResponseStreamSseIterator(response: Response, options: RequestOptions): AsyncGenerator<SseEvent, void, unknown> {
  const { onError, onSuccess, onData, onEnd } = options
  try {
    const body = response.body
    if (body === null) throw new Error('Could not read the response body, it is empty.')
    const reader = body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    // SSE parsing state buffers according to spec
    let dataBuffer = ''
    let eventTypeBuffer = ''
    let lastEventIdBuffer = ''
    let retryBuffer: number | undefined

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Split on all valid line endings: CRLF, LF, CR
      const lines = buffer.split(/\r\n|\n|\r/)

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        // Empty line dispatches the event
        if (line === '') {
          if (dataBuffer !== '') {
            // Remove final trailing newline from data buffer as per spec
            if (dataBuffer.endsWith('\n'))
              dataBuffer = dataBuffer.slice(0, -1)

            const sseEvent: SseEvent = { data: dataBuffer }
            if (eventTypeBuffer !== '') sseEvent.event = eventTypeBuffer
            if (lastEventIdBuffer !== '') sseEvent.id = lastEventIdBuffer
            if (retryBuffer !== undefined) sseEvent.retry = retryBuffer

            if (onData) onData(sseEvent)
            yield sseEvent
          }

          // Reset buffers
          dataBuffer = ''
          eventTypeBuffer = ''
          // Note: lastEventIdBuffer and retryBuffer persist across events
          continue
        }

        // Skip comment lines (start with colon)
        if (line.startsWith(':')) continue

        // Parse field
        const colonIndex = line.indexOf(':')
        let fieldName: string
        let fieldValue: string

        if (colonIndex === -1) {
          // No colon means field name only, empty value
          fieldName = line
          fieldValue = ''
        }
        else {
          fieldName = line.slice(0, colonIndex)
          fieldValue = line.slice(colonIndex + 1)
          // Remove single leading space if present
          if (fieldValue.startsWith(' '))
            fieldValue = fieldValue.slice(1)

        }

        // Process field according to spec
        switch (fieldName) {
          case 'event': {
            eventTypeBuffer = fieldValue
            break
          }
          case 'data': {
            dataBuffer += `${fieldValue}\n`
            break
          }
          case 'id': {
            if (!fieldValue.includes('\0')) { // spec: id cannot contain null chars
              lastEventIdBuffer = fieldValue
            }
            break
          }
          case 'retry': {
            // Must be ASCII digits only
            if (/^\d+$/.test(fieldValue))
              retryBuffer = Number.parseInt(fieldValue, 10)

            break
          }
          // Other fields are ignored per spec
        }
      }
    }

    // Handle any remaining event in buffer at end of stream
    if (dataBuffer !== '') {
      if (dataBuffer.endsWith('\n'))
        dataBuffer = dataBuffer.slice(0, -1)

      const sseEvent: SseEvent = { data: dataBuffer }
      if (eventTypeBuffer !== '') sseEvent.event = eventTypeBuffer
      if (lastEventIdBuffer !== '') sseEvent.id = lastEventIdBuffer
      if (retryBuffer !== undefined) sseEvent.retry = retryBuffer

      if (onData) onData(sseEvent)
      yield sseEvent
    }

    if (onSuccess) onSuccess(response)
  }
  catch (error) {
    if (onError) onError(error as Error)
    throw error
  }
  finally {
    if (onEnd) onEnd(response)
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
export function handleResponseStreamSse(response: Response, options: RequestOptions): Awaitable<AsyncIterable<SseEvent>, SseEvent[]> {
  const responseIterator = createResponseStreamSseIterator(response, options)
  return awaitable(responseIterator)
}
