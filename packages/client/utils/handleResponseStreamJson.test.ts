/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/sonar-no-unused-vars */
import { handleResponseStreamJson } from './handleResponseStreamJson'

describe('handleResponseStreamJson', () => {
  describe('iterable', () => {
    it('should yield parsed JSON objects from the stream', async() => {
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"key":"value"}\0'))
          controller.close()
        },
      })
      const response = new Response(body)
      const result = handleResponseStreamJson(response, {})
      const data = []
      for await (const item of result) data.push(item)
      expect(data).toEqual([{ key: 'value' }])
    })

    it('should call onData callback for each parsed JSON object', async() => {
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"key":"value"}\0'))
          controller.close()
        },
      })
      const response = new Response(body)
      const onData = vi.fn()
      const result = handleResponseStreamJson(response, { onData })
      for await (const _ of result) { /* empty */ }
      expect(onData).toHaveBeenCalledOnce()
      expect(onData).toHaveBeenCalledWith({ key: 'value' })
    })

    it('should call onError callback if an error occurs', async() => {
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('invalid json\0'))
          controller.close()
        },
      })
      const response = new Response(body)
      const onError = vi.fn()
      const result = handleResponseStreamJson(response, { onError })
      try { for await (const _ of result) { /* empty */ } }
      catch { /* empty */ }
      expect(onError).toHaveBeenCalledOnce()
      expect(onError).toHaveBeenCalledWith(expect.any(SyntaxError))
    })

    it('should call onEnd callback when the stream ends', async() => {
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"key":"value"}\0'))
          controller.close()
        },
      })
      const response = new Response(body)
      const onEnd = vi.fn()
      const result = handleResponseStreamJson(response, { onEnd })
      for await (const _ of result) { /* empty */ }
      expect(onEnd).toHaveBeenCalledOnce()
      expect(onEnd).toHaveBeenCalledWith(response)
    })
  })

  describe('awaitable', () => {
    it('should return an array of parsed JSON objects', async() => {
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"key":"value1"}\0'))
          controller.enqueue(new TextEncoder().encode('{"key":"value2"}\0'))
          controller.close()
        },
      })
      const response = new Response(body)
      const result = handleResponseStreamJson(response, {})
      await expect(result).resolves.toEqual([{ key: 'value1' }, { key: 'value2' }])
    })
  })
})
