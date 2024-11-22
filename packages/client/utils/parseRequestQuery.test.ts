import { parseRequestQuery } from './parseRequestQuery'

describe('parseRequestQuery', () => {
  it('should append data to query parameters for GET requests', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery('', { data: { active: true } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users?active=true')
  })

  it.each(['get', 'head', 'delete', 'options'])('should take query from data when method is %s', (method) => {
    const context = { init: { method }, url: new URL('https://api.example.com/users') }
    parseRequestQuery('', { data: { active: true } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users?active=true')
  })

  it.each(['post', 'put', 'patch'])('should not take query from data when method is %s', (method) => {
    const context = { init: { method }, url: new URL('https://api.example.com/users') }
    parseRequestQuery('', { data: { active: true } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users')
  })

  it.each(['get', 'head', 'delete', 'options', 'post', 'put', 'patch'])('should take query from query even when method is %s', (method) => {
    const context = { init: { method }, url: new URL('https://api.example.com/users') }
    parseRequestQuery('', { query: { active: true } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users?active=true')
  })

  it('should merge data and query parameters', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery('', { data: { active: true }, query: { sort: 'asc' } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users?sort=asc&active=true')
  })

  it('should handle empty data and query parameters', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery('', {}, context)
    expect(context.url.toString()).toBe('https://api.example.com/users')
  })

  it('should throw an error if the URL is missing', () => {
    const shouldThrow = () => parseRequestQuery('', {}, { init: {} })
    expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object: the `url` is missing.')
  })

  it('should use the flat array format for query parameters by default', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery('', { query: { tags: ['tag1', 'tag2'] } }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users?tags=tag1&tags=tag2')
  })

  it('should respect searchArrayFormat option', () => {
    const context = { init: { method: 'get' }, url: new URL('https://api.example.com/users') }
    parseRequestQuery('', { query: { tags: ['tag1', 'tag2'] }, searchArrayFormat: 'comma' }, context)
    expect(context.url.toString()).toBe('https://api.example.com/users?tags=tag1%2Ctag2')
  })
})
