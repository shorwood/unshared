import type { RequestContext } from './parseRequest'
import { parseRequestParameters } from './parseRequestParameters'

describe('parseRequestParameters', () => {
  it('should replace path parameters with parameters values', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id/profile') }
    parseRequestParameters(context, { parameters: { id: '123' } })
    expect(context.url.toString()).toBe('https://api.example.com/users/123/profile')
  })

  it('should replace openapi-style path parameters with parameters values', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/{id}/profile') }
    parseRequestParameters(context, { parameters: { id: '123' } })
    expect(context.url.toString()).toBe('https://api.example.com/users/123/profile')
  })

  it('should delete the parameters property if it is used for path parameters', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestParameters(context, { parameters: { id: '123' } })
    expect(context.url.toString()).toBe('https://api.example.com/users/123')
    expect(context).not.toHaveProperty('id')
  })

  it('should replace multiple path parameters with string parameters values', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:userId/posts/:postId') }
    parseRequestParameters(context, { parameters: { userId: '123', postId: '456' } })
    expect(context.url.toString()).toBe('https://api.example.com/users/123/posts/456')
  })

  it('should replace multiple path parameters with number parameters values', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:userId/posts/:postId') }
    parseRequestParameters(context, { parameters: { userId: 123, postId: 456 } })
    expect(context.url.toString()).toBe('https://api.example.com/users/123/posts/456')
  })

  it('should replace multiple path parameters with boolean parameters values', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:userId/posts/:postId') }
    parseRequestParameters(context, { parameters: { userId: true, postId: false } })
    expect(context.url.toString()).toBe('https://api.example.com/users/true/posts/false')
  })

  it('should handle missing path parameters gracefully', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestParameters(context, { parameters: {} })
    expect(context.url.toString()).toBe('https://api.example.com/users/:id')
  })

  it('should return early if the parameters are not an object', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestParameters(context, { parameters: '123' })
    expect(context.url.toString()).toBe('https://api.example.com/users/:id')
  })

  it('should return early if the parameters are null', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestParameters(context, { parameters: null })
    expect(context.url.toString()).toBe('https://api.example.com/users/:id')
  })

  it('should return early if the URL is undefined', () => {
    const context = { init: { method: 'get' } } as RequestContext
    parseRequestParameters(context, { parameters: { id: '123' } })
    expect(context.url).toBeUndefined()
  })

  it('should not replace path parameters if parameters is not provided', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestParameters(context, {})
    expect(context.url.toString()).toBe('https://api.example.com/users/:id')
  })

  it('should delete properties that are used as path parameters', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    const parameters = { id: '123', name: { first: 'John', last: 'Doe' } }
    parseRequestParameters(context, { parameters })
    expect(context.url.toString()).toBe('https://api.example.com/users/123')
    expect(parameters).toStrictEqual({ name: { first: 'John', last: 'Doe' } })
  })
})
