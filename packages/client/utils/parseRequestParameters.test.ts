import { parseRequestParameters } from './parseRequestParameters'

describe('parseRequestParameters', () => {
  it('should replace path parameters with data values', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id/profile') }
    parseRequestParameters('', { data: { id: '123' } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users/123/profile')
  })

  it.only('should replace openapi-style path parameters with data values', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/{id}/profile') }
    parseRequestParameters('', { data: { id: '123' } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users/123/profile')
  })

  it('should delete the data property if it is used for path parameters', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestParameters('', { data: { id: '123' } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users/123')
    expect(context).not.toHaveProperty('id')
  })

  it('should replace multiple path parameters with data values', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:userId/posts/:postId') }
    parseRequestParameters('', { data: { userId: '123', postId: '456' } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users/123/posts/456')
  })

  it('should handle missing path parameters gracefully', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestParameters('', { data: {} }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users/:id')
  })

  it('should throw an error if the URL is missing', () => {
    const shouldThrow = () => parseRequestParameters('', { data: { id: '123' } }, { init: {} })
    expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object: the `url` is missing.')
  })

  it('should not replace path parameters if data is not provided', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestParameters('', {}, context)
    expect(context.url.toString()).toBe('https://api.example.com/users/:id')
  })

  it('should replace path parameters with parameters values', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestParameters('', { parameters: { id: '123' } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users/123')
  })

  it('should prioritize parameters over data for path parameters', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestParameters('', { data: { id: '456' }, parameters: { id: '123' } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users/123')
  })
})
