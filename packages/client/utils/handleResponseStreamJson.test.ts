/* eslint-disable sonarjs/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { handleResponseStreamJson } from './handleResponseStreamJson'

function createResponse(...data: string[]): Response {
  const body = new ReadableStream({
    start(controller) {
      for (const item of data) controller.enqueue(new TextEncoder().encode(`${item}\0`))
      controller.close()
    },
  })
  return new Response(body)
}

describe('handleResponseStreamJson', () => {
  describe('iterable', () => {
    it('should yield parsed JSON objects from the stream', async() => {
      const response = createResponse('{"key":"value"}')
      const result = handleResponseStreamJson(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ key: 'value' }])
    })

    it('should call onData callback for each parsed JSON object', async() => {
      const response = createResponse('{"key":"value"}')
      const onData = vi.fn()
      const result = handleResponseStreamJson(response, { onData })
      for await (const _ of result) { /* empty */ }
      expect(onData).toHaveBeenCalledExactlyOnceWith({ key: 'value' }, { onData })
    })

    it('should call onError callback if an error occurs', async() => {
      const response = createResponse('invalid json\0')
      const onError = vi.fn()
      const result = handleResponseStreamJson(response, { onError })
      try { for await (const _ of result) { /* empty */ } }
      catch { /* empty */ }
      expect(onError).toHaveBeenCalledExactlyOnceWith(expect.any(SyntaxError), { onError })
    })

    it('should call onEnd callback when the stream ends', async() => {
      const response = createResponse('{"key":"value"}\0')
      const onEnd = vi.fn()
      const result = handleResponseStreamJson(response, { onEnd })
      for await (const _ of result) { /* empty */ }
      expect(onEnd).toHaveBeenCalledExactlyOnceWith(response, { onEnd })
    })

    it('should await async onData callback', async() => {
      const response = createResponse('{"key":"value"}')
      const onData = vi.fn(() => new Promise(resolve => setTimeout(resolve, 10)))
      const onEnd = vi.fn()
      const result = handleResponseStreamJson(response, { onData, onEnd })
      expect(onData).not.toHaveBeenCalled()
      expect(onEnd).not.toHaveBeenCalled()
      for await (const _ of result) { /* empty */ }
      expect(onData).toHaveBeenCalledOnce()
      expect(onEnd).toHaveBeenCalledOnce()
      expect(onData).toHaveBeenCalledBefore(onEnd)
    })

    it('should await async onSuccess callback', async() => {
      const response = createResponse('{"key":"value"}')
      const onSuccess = vi.fn(() => new Promise(resolve => setTimeout(resolve, 10)))
      const onEnd = vi.fn()
      const result = handleResponseStreamJson(response, { onSuccess, onEnd })
      expect(onSuccess).not.toHaveBeenCalled()
      expect(onEnd).not.toHaveBeenCalled()
      for await (const _ of result) { /* empty */ }
      expect(onSuccess).toHaveBeenCalledOnce()
      expect(onEnd).toHaveBeenCalledOnce()
      expect(onSuccess).toHaveBeenCalledBefore(onEnd)
    })

    it('should await async onError callback', async() => {
      const response = createResponse('invalid json\0')
      const onError = vi.fn(() => new Promise(resolve => setTimeout(resolve, 10)))
      const onEnd = vi.fn()
      const result = handleResponseStreamJson(response, { onError, onEnd })
      expect(onError).not.toHaveBeenCalled()
      expect(onEnd).not.toHaveBeenCalled()
      try { for await (const _ of result) { /* empty */ } }
      catch { /* empty */ }
      expect(onError).toHaveBeenCalledOnce()
      expect(onEnd).toHaveBeenCalledOnce()
      expect(onError).toHaveBeenCalledBefore(onEnd)
    })

    it('should await async onEnd callback', async() => {
      const response = createResponse('{"key":"value"}')
      const onEnd = vi.fn(() => new Promise(resolve => setTimeout(resolve, 10)))
      const result = handleResponseStreamJson(response, { onEnd })
      expect(onEnd).not.toHaveBeenCalled()
      for await (const _ of result) { /* empty */ }
      expect(onEnd).toHaveBeenCalledOnce()
    })
  })

  describe('awaitable', () => {
    it('should return an array of parsed JSON objects', async() => {
      const response = createResponse('{"key":"value1"}\0', '{"key":"value2"}\0')
      const result = handleResponseStreamJson(response, {})
      await expect(result).resolves.toEqual([{ key: 'value1' }, { key: 'value2' }])
    })
  })
})
