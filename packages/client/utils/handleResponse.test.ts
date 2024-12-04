import { handleResponse } from './handleResponse'

describe('handleResponse', () => {
  describe('error', () => {
    it('should throw an error for a non-OK response', async() => {
      const response = new Response(null, { status: 400, statusText: 'Bad Request' })
      const result = handleResponse(response, {})
      await expect(result).rejects.toThrow()
    })

    it('should use the status text for the error message', async() => {
      const response = new Response(null, { status: 400, statusText: 'Bad Request' })
      const result = handleResponse(response, {})
      await expect(result).rejects.toThrow('Bad Request')
    })

    it('should call the onFailure callback if provided', async() => {
      const response = new Response(null, { status: 400, statusText: 'Bad Request' })
      const onFailure = vi.fn()
      const result = handleResponse(response, { onFailure })
      await expect(result).rejects.toThrow()
      expect(onFailure).toHaveBeenCalledOnce()
      expect(onFailure).toHaveBeenCalledWith(response)
    })

    it('should reject with the error created in the onFailure callback', async() => {
      const response = new Response(null, { status: 400, statusText: 'Bad Request' })
      const onFailure = vi.fn().mockImplementation(() => {
        throw new Error('Failed to handle error')
      })
      const result = handleResponse(response, { onFailure })
      await expect(result).rejects.toThrow('Failed to handle error')
    })
  })

  describe('no content', () => {
    it('should return undefined for 204 No Content', async() => {
      const response = new Response(null, { status: 204, headers: { 'Content-Type': 'application/json' } })
      const result = handleResponse(response, {})
      await expect(result).resolves.toBeUndefined()
    })

    it('should call the onSuccess callback if provided', async() => {
      const response = new Response(null, { status: 204, headers: { 'Content-Type': 'application/json' } })
      const onSuccess = vi.fn()
      const result = handleResponse(response, { onSuccess })
      await expect(result).resolves.toBeUndefined()
      expect(onSuccess).toHaveBeenCalledOnce()
      expect(onSuccess).toHaveBeenCalledWith(response)
    })

    it('should call the onEnd callback if provided', async() => {
      const response = new Response(null, { status: 204, headers: { 'Content-Type': 'application/json' } })
      const onEnd = vi.fn()
      const result = handleResponse(response, { onEnd })
      await expect(result).resolves.toBeUndefined()
      expect(onEnd).toHaveBeenCalledOnce()
      expect(onEnd).toHaveBeenCalledWith(response)
    })
  })

  describe('text', () => {
    describe('success', () => {
      it('should return text response for text content type', async() => {
        const body = 'Hello, world!'
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'text/plain' } })
        const result = handleResponse(response, {})
        await expect(result).resolves.toBe(body)
      })

      it('should return text response for html content type', async() => {
        const body = '<h1>Hello, world!</h1>'
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'text/html' } })
        const result = handleResponse(response, {})
        await expect(result).resolves.toBe(body)
      })

      it('should return text response for html content type with charset', async() => {
        const body = '<h1>Hello, world!</h1>'
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
        const result = handleResponse(response, {})
        await expect(result).resolves.toBe(body)
      })

      it('should call the onData callback if provided', async() => {
        const body = 'Hello, world!'
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'text/plain' } })
        const onData = vi.fn()
        const result = handleResponse(response, { onData })
        await expect(result).resolves.toBe(body)
        expect(onData).toHaveBeenCalledOnce()
        expect(onData).toHaveBeenCalledWith(body)
      })

      it('should call the onSuccess callback if provided', async() => {
        const body = 'Hello, world!'
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'text/plain' } })
        const onSuccess = vi.fn()
        const result = handleResponse(response, { onSuccess })
        await expect(result).resolves.toBe(body)
        expect(onSuccess).toHaveBeenCalledOnce()
        expect(onSuccess).toHaveBeenCalledWith(response)
      })

      it('should call the onEnd callback if provided', async() => {
        const body = 'Hello, world!'
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'text/plain' } })
        const onEnd = vi.fn()
        const result = handleResponse(response, { onEnd })
        await expect(result).resolves.toBe(body)
        expect(onEnd).toHaveBeenCalledOnce()
        expect(onEnd).toHaveBeenCalledWith(response)
      })
    })

    describe('failure', () => {
      it('should throw an error if the text response fails', async() => {
        const response = new Response(null, { status: 200, headers: { 'Content-Type': 'text/plain' } })
        response.text = () => Promise.reject(new TypeError('Failed to read text'))
        const result = handleResponse(response, {})
        await expect(result).rejects.toThrow(TypeError)
      })

      it('should call the onError callback if the text response fails', async() => {
        const response = new Response(null, { status: 200, headers: { 'Content-Type': 'text/plain' } })
        response.text = () => Promise.reject(new TypeError('Failed to read text'))
        const onError = vi.fn()
        const result = handleResponse(response, { onError })
        await expect(result).rejects.toThrow(TypeError)
        expect(onError).toHaveBeenCalledOnce()
        expect(onError).toHaveBeenCalledWith(expect.any(TypeError))
      })

      it('should call the onEnd callback if the text response fails', async() => {
        const response = new Response(null, { status: 200, headers: { 'Content-Type': 'text/plain' } })
        response.text = () => Promise.reject(new TypeError('Failed to read text'))
        const onEnd = vi.fn()
        const result = handleResponse(response, { onEnd })
        await expect(result).rejects.toThrow(TypeError)
        expect(onEnd).toHaveBeenCalledOnce()
        expect(onEnd).toHaveBeenCalledWith(response)
      })
    })
  })

  describe('json', () => {
    describe('success', () => {
      it('should return JSON response for application/json content type', async() => {
        const body = JSON.stringify({ key: 'value' })
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
        const result = handleResponse(response, {})
        await expect(result).resolves.toEqual({ key: 'value' })
      })

      it('should return JSON response for application/json content type with charset', async() => {
        const body = JSON.stringify({ key: 'value' })
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } })
        const result = handleResponse(response, {})
        await expect(result).resolves.toEqual({ key: 'value' })
      })

      it('should call the onData callback if provided', async() => {
        const body = JSON.stringify({ key: 'value' })
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
        const onData = vi.fn()
        const result = handleResponse(response, { onData })
        await expect(result).resolves.toEqual({ key: 'value' })
        expect(onData).toHaveBeenCalledOnce()
        expect(onData).toHaveBeenCalledWith({ key: 'value' })
      })

      it('should call the onSuccess callback if provided', async() => {
        const body = JSON.stringify({ key: 'value' })
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
        const onSuccess = vi.fn()
        const result = handleResponse(response, { onSuccess })
        await expect(result).resolves.toEqual({ key: 'value' })
        expect(onSuccess).toHaveBeenCalledOnce()
        expect(onSuccess).toHaveBeenCalledWith(response)
      })

      it('should call the onEnd callback if provided', async() => {
        const body = JSON.stringify({ key: 'value' })
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
        const onEnd = vi.fn()
        const result = handleResponse(response, { onEnd })
        await expect(result).resolves.toEqual({ key: 'value' })
        expect(onEnd).toHaveBeenCalledOnce()
        expect(onEnd).toHaveBeenCalledWith(response)
      })
    })

    describe('failure', () => {
      it('should throw an error if the JSON is invalid', async() => {
        const body = '{ key: value }'
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
        const result = handleResponse(response, {})
        await expect(result).rejects.toThrow(SyntaxError)
      })

      it('should call the onError callback if the JSON is invalid', async() => {
        const body = '{ key: value }'
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
        const onError = vi.fn()
        const result = handleResponse(response, { onError })
        await expect(result).rejects.toThrow()
        expect(onError).toHaveBeenCalledOnce()
        expect(onError).toHaveBeenCalledWith(expect.any(SyntaxError))
      })

      it('should call the onEnd callback if the JSON is invalid', async() => {
        const body = '{ key: value }'
        const response = new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
        const onEnd = vi.fn()
        const result = handleResponse(response, { onEnd })
        await expect(result).rejects.toThrow()
        expect(onEnd).toHaveBeenCalledOnce()
        expect(onEnd).toHaveBeenCalledWith(response)
      })
    })
  })

  describe('other', () => {
    it('should return response body for other content types', async() => {
      const body = new ReadableStream()
      const response = new Response(body, { status: 200, headers: { 'Content-Type': 'application/octet-stream' } })
      const result = handleResponse(response, {})
      await expect(result).resolves.toBeInstanceOf(ReadableStream)
    })
  })
})
