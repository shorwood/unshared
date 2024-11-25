import type { RequestContext } from './parseRequest'
import { parseRequestBody } from './parseRequestBody'

describe('parseRequestBody', () => {
  describe('when body is provided', () => {
    it('should set the body directly', () => {
      const context = { init: { method: 'post' } } as RequestContext
      parseRequestBody('', { body: 'test-body' }, context)
      expect(context.init.body).toBe('test-body')
    })

    it('should ignore the data property', () => {
      const context = { init: { method: 'post' } } as RequestContext
      parseRequestBody('', { body: 'test-body', data: { key: 'value' } }, context)
      expect(context.init.body).toBe('test-body')
    })
  })

  describe('when method is GET, HEAD, or DELETE', () => {
    it('should not set the body for GET method', () => {
      const context = { init: { method: 'get' } } as RequestContext
      parseRequestBody('', { data: { key: 'value' } }, context)
      expect(context.init.body).toBeUndefined()
    })

    it('should not set the body for HEAD method', () => {
      const context = { init: { method: 'head' } } as RequestContext
      parseRequestBody('', { data: { key: 'value' } }, context)
      expect(context.init.body).toBeUndefined()
    })

    it('should not set the body for DELETE method', () => {
      const context = { init: { method: 'delete' } } as RequestContext
      parseRequestBody('', { data: { key: 'value' } }, context)
      expect(context.init.body).toBeUndefined()
    })
  })

  describe('when data is provided', () => {
    it('should set FormData for FormData-like data', () => {
      const formData = new FormData()
      formData.append('key', 'value')
      const context = { init: { method: 'post' } } as RequestContext
      parseRequestBody('', { data: formData }, context)
      expect(context.init.body).toBeInstanceOf(FormData)
      expect(context.init.headers).toStrictEqual({ 'Content-Type': 'multipart/form-data' })
    })

    it('should set body for ReadableStream data', () => {
      const readableStream = new ReadableStream()
      const context = { init: { method: 'post' } } as RequestContext
      parseRequestBody('', { data: readableStream }, context)
      expect(context.init.body).toBe(readableStream)
    })

    it('should set body for File data', () => {
      const file = new File(['content'], 'test.txt')
      const context = { init: { method: 'post' } } as RequestContext
      parseRequestBody('', { data: file }, context)
      expect(context.init.body).toBeInstanceOf(ReadableStream)
      expect(context.init.headers).toStrictEqual({ 'Content-Type': 'application/octet-stream' })
    })

    it('should set JSON stringified body for object-like data', () => {
      const context = { init: { method: 'post' } } as RequestContext
      parseRequestBody('', { data: { key: 'value' } }, context)
      expect(context.init.body).toBe('{"key":"value"}')
      expect(context.init.headers).toStrictEqual({ 'Content-Type': 'application/json' })
    })

    it('should not set body for null or undefined data', () => {
      const context = { init: { method: 'post' } } as RequestContext
      // @ts-expect-error: intentionally passing null
      parseRequestBody('', { data: null }, context)
      expect(context.init.body).toBeUndefined()
    })

    it('should not set body for undefined data', () => {
      const context = { init: { method: 'post' } } as RequestContext
      parseRequestBody('', { data: undefined }, context)
      expect(context.init.body).toBeUndefined()
    })
  })

  describe('when no data or body is provided', () => {
    it('should not set the body', () => {
      const context = { init: {} } as RequestContext
      parseRequestBody('', {}, context)
      expect(context.init.body).toBeUndefined()
    })
  })
})
