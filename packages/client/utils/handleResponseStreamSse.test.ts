/* eslint-disable sonarjs/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { handleResponseStreamSse } from './handleResponseStreamSse'

function createEventStreamResponse(...data: string[]): Response {
  const body = new ReadableStream({
    start(controller) {
      for (const item of data) controller.enqueue(new TextEncoder().encode(item))
      controller.close()
    },
  })
  return new Response(body)
}

function createEventStreamResponseError(): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.error(new Error('Stream error'))
    },
  })
}

describe('handleResponseStreamSse', () => {
  describe('iterable', () => {
    it('should yield parsed SSE events from the stream', async() => {
      const response = createEventStreamResponse('data: Hello, world!\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ data: 'Hello, world!' }])
    })

    it('should parse SSE events with event type', async() => {
      const response = createEventStreamResponse('event: message\ndata: Hello, world!\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ event: 'message', data: 'Hello, world!' }])
    })

    it('should parse SSE events with ID', async() => {
      const response = createEventStreamResponse('id: 123\ndata: Hello, world!\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ id: '123', data: 'Hello, world!' }])
    })

    it('should parse SSE events with retry timeout', async() => {
      const response = createEventStreamResponse('retry: 3000\ndata: Hello, world!\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ retry: 3000, data: 'Hello, world!' }])
    })

    it('should handle multiline data', async() => {
      const response = createEventStreamResponse('data: First line\ndata: Second line\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ data: 'First line\nSecond line' }])
    })

    it('should handle complete SSE event with all fields', async() => {
      const response = createEventStreamResponse('event: update\nid: 456\nretry: 5000\ndata: Complete event\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ event: 'update', id: '456', retry: 5000, data: 'Complete event' }])
    })

    it('should handle multiple SSE events', async() => {
      const response = createEventStreamResponse('data: First event\n\ndata: Second event\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([
        { data: 'First event' },
        { data: 'Second event' },
      ])
    })

    it('should skip comment lines', async() => {
      const response = createEventStreamResponse(': This is a comment\ndata: Hello, world!\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ data: 'Hello, world!' }])
    })

    it('should handle field names without values (empty field)', async() => {
      const response = createEventStreamResponse('data\ndata: Hello\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ data: '\nHello' }])
    })

    it('should handle values with leading spaces', async() => {
      const response = createEventStreamResponse('data:  Spaced value\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ data: ' Spaced value' }])
    })

    it('should handle invalid retry values by ignoring them', async() => {
      const response = createEventStreamResponse('retry: invalid\ndata: Hello, world!\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ data: 'Hello, world!' }])
    })

    it('should handle different line endings (CRLF, LF, CR)', async() => {
      const response = createEventStreamResponse('data: Line 1\r\ndata: Line 2\ndata: Line 3\r\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ data: 'Line 1\nLine 2\nLine 3' }])
    })

    it('should ignore fields with null characters in id', async() => {
      const response = createEventStreamResponse('id: invalid\0id\ndata: Hello, world!\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ data: 'Hello, world!' }])
    })

    it('should ignore unknown fields', async() => {
      const response = createEventStreamResponse('unknown: field\ndata: Hello, world!\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ data: 'Hello, world!' }])
    })

    it('should call onData callback for each parsed SSE event', async() => {
      const response = createEventStreamResponse('data: Hello, world!\n\n')
      const onData = vi.fn()
      const result = handleResponseStreamSse(response, { onData })
      for await (const _ of result) { /* empty */ }
      expect(onData).toHaveBeenCalledOnce()
      expect(onData).toHaveBeenCalledWith({ data: 'Hello, world!' }, { onData })
    })

    it('should call onError callback if an error occurs', async() => {
      const body = createEventStreamResponseError()
      const response = new Response(body)
      const onError = vi.fn()
      const result = handleResponseStreamSse(response, { onError })
      try { for await (const _ of result) { /* empty */ } }
      catch { /* empty */ }
      expect(onError).toHaveBeenCalledOnce()
      expect(onError).toHaveBeenCalledWith(expect.any(Error), { onError })
    })

    it('should call onEnd callback when the stream ends', async() => {
      const response = createEventStreamResponse('data: Hello, world!\n\n')
      const onEnd = vi.fn()
      const result = handleResponseStreamSse(response, { onEnd })
      for await (const _ of result) { /* empty */ }
      expect(onEnd).toHaveBeenCalledOnce()
      expect(onEnd).toHaveBeenCalledWith(response, { onEnd })
    })

    it('should await async onData callback', async() => {
      const response = createEventStreamResponse('data: Hello, world!\n\n')
      const onData = vi.fn(() => new Promise(resolve => setTimeout(resolve, 10)))
      const onEnd = vi.fn()
      const result = handleResponseStreamSse(response, { onData, onEnd })
      expect(onData).not.toHaveBeenCalled()
      expect(onEnd).not.toHaveBeenCalled()
      for await (const _ of result) { /* empty */ }
      expect(onData).toHaveBeenCalledOnce()
      expect(onEnd).toHaveBeenCalledOnce()
      expect(onData).toHaveBeenCalledBefore(onEnd)
    })

    it('should await async onSuccess callback', async() => {
      const response = createEventStreamResponse('data: Hello, world!\n\n')
      const onSuccess = vi.fn(() => new Promise(resolve => setTimeout(resolve, 10)))
      const onEnd = vi.fn()
      const result = handleResponseStreamSse(response, { onSuccess, onEnd })
      expect(onSuccess).not.toHaveBeenCalled()
      expect(onEnd).not.toHaveBeenCalled()
      for await (const _ of result) { /* empty */ }
      expect(onSuccess).toHaveBeenCalledOnce()
      expect(onEnd).toHaveBeenCalledOnce()
      expect(onSuccess).toHaveBeenCalledBefore(onEnd)
    })

    it('should await async onError callback', async() => {
      const body = createEventStreamResponseError()
      const response = new Response(body)
      const onError = vi.fn(() => new Promise(resolve => setTimeout(resolve, 10)))
      const onEnd = vi.fn()
      const result = handleResponseStreamSse(response, { onError, onEnd })
      expect(onError).not.toHaveBeenCalled()
      expect(onEnd).not.toHaveBeenCalled()
      try { for await (const _ of result) { /* empty */ } }
      catch { /* empty */ }
      expect(onError).toHaveBeenCalledOnce()
      expect(onEnd).toHaveBeenCalledOnce()
      expect(onError).toHaveBeenCalledBefore(onEnd)
    })

    it('should await async onEnd callback', async() => {
      const response = createEventStreamResponse('data: Hello, world!\n\n')
      const onEnd = vi.fn(() => new Promise(resolve => setTimeout(resolve, 10)))
      const result = handleResponseStreamSse(response, { onEnd })
      expect(onEnd).not.toHaveBeenCalled()
      for await (const _ of result) { /* empty */ }
      expect(onEnd).toHaveBeenCalledOnce()
    })

    it('should throw an error if response body is null', async() => {
      const response = new Response(null)
      const result = handleResponseStreamSse(response, {})
      await expect(async() => {
        for await (const _ of result) { /* empty */ }
      }).rejects.toThrow('Could not read the response body, it is empty.')
    })
  })

  describe('awaitable', () => {
    it('should return an array of parsed SSE events', async() => {
      const response = createEventStreamResponse('data: First event\n\ndata: Second event\n\n')
      const result = handleResponseStreamSse(response, {})
      await expect(result).resolves.toEqual([
        { data: 'First event' },
        { data: 'Second event' },
      ])
    })
  })

  describe('json', () => {
    it('should try to parse JSON data', async() => {
      const response = createEventStreamResponse('data: {"message": "Hello, world!"}\n\n')
      const result = handleResponseStreamSse(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ data: { message: 'Hello, world!' } }])
    })

    it('should call onData with parsed JSON data', async() => {
      const response = createEventStreamResponse('data: {"message": "Hello, world!"}\n\n')
      const onData = vi.fn()
      const result = handleResponseStreamSse(response, { onData })
      for await (const _ of result) { /* empty */ }
      expect(onData).toHaveBeenCalledOnce()
      expect(onData).toHaveBeenCalledWith({ data: { message: 'Hello, world!' } }, { onData })
    })
  })
})
