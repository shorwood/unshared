import type { RequestContext } from './parseRequest'
import { parseRequestQuery } from './parseRequestQuery'

describe('parseRequestQuery', () => {
  it('should append string values to query parameters for GET requests', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery(context, { query: { active: true } } )
    expect(context.url.toString()).toBe('https://api.example.com/users?active=true')
  })

  it('should append number values to query parameters for GET requests', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery(context, { query: { id: 123 } })
    expect(context.url.toString()).toBe('https://api.example.com/users?id=123')
  })

  it('should append boolean values to query parameters for GET requests', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery(context, { query: { active: true } })
    expect(context.url.toString()).toBe('https://api.example.com/users?active=true')
  })

  it('should use the flat array format for query parameters by default', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery(context, { query: { tags: ['tag1', 'tag2'] } })
    expect(context.url.toString()).toBe('https://api.example.com/users?tags=tag1&tags=tag2')
  })

  it('should respect searchArrayFormat option', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery(context, { query: { tags: ['tag1', 'tag2'] }, queryArrayFormat: 'comma' })
    expect(context.url.toString()).toBe('https://api.example.com/users?tags=tag1%2Ctag2')
  })

  it('should append mixed type array values to query parameters for GET requests', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery(context, { query: { tags: ['tag1', 123, true] } })
    expect(context.url.toString()).toBe('https://api.example.com/users?tags=tag1&tags=123&tags=true')
  })

  it.each(['get', 'head', 'delete', 'options', 'post', 'put', 'patch'])('should take query from query when method is %s', (method) => {
    const context = { init: { method }, url: new URL('https://api.example.com/users') }
    parseRequestQuery(context, { query: { active: true } })
    expect(context.url.toString()).toBe('https://api.example.com/users?active=true')
  })

  it('should handle empty data and query parameters', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery(context, {})
    expect(context.url.toString()).toBe('https://api.example.com/users')
  })

  it('should return early if the parameters are not an object', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    // @ts-expect-error: testing invalid input
    parseRequestQuery(context, { query: '123' })
    expect(context.url.toString()).toBe('https://api.example.com/users/:id')
  })

  it('should return early if the parameters are null', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    // @ts-expect-error: testing invalid input
    parseRequestQuery(context, { query: null })
    expect(context.url.toString()).toBe('https://api.example.com/users/:id')
  })

  it('should return early if the parameters are undefined', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    parseRequestQuery(context, { query: undefined })
    expect(context.url.toString()).toBe('https://api.example.com/users/:id')
  })

  it('should return early if the URL is undefined', () => {
    const context = { init: { method: 'get' } } as RequestContext
    parseRequestQuery(context, { query: { id: '123' } })
    expect(context.url).toBeUndefined()
  })

  it('should delete properties that are used as query parameters', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users/:id') }
    const query = { id: '123', object: { key: 'value' } }
    parseRequestQuery(context, { query })
    expect(context.url.toString()).toBe('https://api.example.com/users/:id?id=123')
    expect(query).toStrictEqual({ object: { key: 'value' } })
  })
})
