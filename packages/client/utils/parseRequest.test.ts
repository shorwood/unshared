import { parseRequest } from './parseRequest'

describe('parseRequest', () => {
  it('should parse the request URL', () => {
    const context = parseRequest('GET /users', { baseUrl: 'https://api.example.com' })
    expect(context).toStrictEqual({
      init: { method: 'get' },
      url: new URL('https://api.example.com/users'),
    })
  })

  it('should parse the request parameters', () => {
    const context = parseRequest('GET /users/:id', { baseUrl: 'https://api.example.com', data: { id: '123' } })
    expect(context).toStrictEqual({
      init: { method: 'get' },
      url: new URL('https://api.example.com/users/123'),
    })
  })

  it('should parse the request query', () => {
    const context = parseRequest('GET /users', { baseUrl: 'https://api.example.com', query: { active: true } })
    expect(context).toStrictEqual({
      init: { method: 'get' },
      url: new URL('https://api.example.com/users?active=true'),
    })
  })

  it('should parse the request body', () => {
    const context = parseRequest('POST /users', { baseUrl: 'https://api.example.com', data: { name: 'John' } })
    expect(context).toStrictEqual({
      init: { method: 'post', body: '{"name":"John"}', headers: { 'Content-Type': 'application/json' } },
      url: new URL('https://api.example.com/users'),
    })
  })

  it('should parse the request headers', () => {
    const context = parseRequest('GET /users', { baseUrl: 'https://api.example.com', headers: { Authorization: 'Bearer token' } })
    expect(context).toStrictEqual({
      init: { method: 'get', headers: { Authorization: 'Bearer token' } },
      url: new URL('https://api.example.com/users'),
    })
  })

  it('should handle all options together', () => {
    const context = parseRequest('POST /users/:id', {
      baseUrl: 'https://api.example.com',
      data: { id: '123', name: 'John' },
      query: { active: true },
      headers: { Authorization: 'Bearer token' },
    })
    expect(context).toStrictEqual({
      init: {
        method: 'post',
        body: '{"name":"John"}',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' },
      },
      url: new URL('https://api.example.com/users/123?active=true'),
    })
  })

  it('should throw an error if the URL is missing', () => {
    const shouldThrow = () => parseRequest('GET /users', {})
    expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object: the `baseUrl` is missing.')
  })
})
