/* eslint-disable sonarjs/no-hardcoded-credentials */
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

  it.each(['get', 'head', 'delete', 'options'])('should dispatch data into query and params for %s requests', (method) => {
    const options = { baseUrl: 'https://api.example.com', data: { id: '123', name: 'John' } }
    const context = parseRequest(`${method.toUpperCase()} /users/:id`, options)
    expect(context).toStrictEqual({
      init: { method },
      url: new URL('https://api.example.com/users/123?name=John'),
    })
  })

  it.each(['post', 'put', 'patch'])('should dispatch data into body for %s requests', (method) => {
    const options = { baseUrl: 'https://api.example.com', data: { id: '123', name: 'John' } }
    const context = parseRequest(`${method.toUpperCase()} /users/:id`, options)
    expect(context).toStrictEqual({
      init: { method, body: '{"name":"John"}', headers: { 'Content-Type': 'application/json' } },
      url: new URL('https://api.example.com/users/123'),
    })
  })

  it('should throw an error if the URL is missing', () => {
    const shouldThrow = () => parseRequest('GET /users', {})
    expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object: the `baseUrl` is missing.')
  })

  it('should set the Authorization header for basic authentication', () => {
    const context = parseRequest('GET /users', {
      baseUrl: 'https://api.example.com',
      username: 'user',
      password: 'pass',
    })
    expect(context).toStrictEqual({
      init: {
        method: 'get',
        headers: { Authorization: 'Basic dXNlcjpwYXNz' },
      },
      url: new URL('https://api.example.com/users'),
    })
  })

  it('should merge basic authentication with existing headers', () => {
    const context = parseRequest('GET /users', {
      baseUrl: 'https://api.example.com',
      headers: { 'Content-Type': 'application/json' },
      username: 'user',
      password: 'pass',
    })
    expect(context).toStrictEqual({
      init: {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic dXNlcjpwYXNz',
        },
      },
      url: new URL('https://api.example.com/users'),
    })
  })

  it('should set the token in the query parameters', () => {
    const context = parseRequest('GET /users', {
      baseUrl: 'https://api.example.com',
      token: 'my-api-key',
      tokenLocation: 'query',
      tokenProperty: 'api_key',
    })
    expect(context).toStrictEqual({
      init: { method: 'get' },
      url: new URL('https://api.example.com/users?api_key=my-api-key'),
    })
  })

  it('should set the token in the headers', () => {
    const context = parseRequest('GET /users', {
      baseUrl: 'https://api.example.com',
      token: 'my-api-key',
      tokenLocation: 'headers',
      tokenProperty: 'X-API-Key',
    })
    expect(context).toStrictEqual({
      init: {
        method: 'get',
        headers: { 'X-API-Key': 'my-api-key' },
      },
      url: new URL('https://api.example.com/users'),
    })
  })

  it('should set the token in the cookies', () => {
    const context = parseRequest('GET /users', {
      baseUrl: 'https://api.example.com',
      token: 'my-api-key',
      tokenLocation: 'cookie',
      tokenProperty: 'token',
    })
    expect(context).toStrictEqual({
      init: {
        method: 'get',
        headers: { Cookie: 'token=my-api-key' },
      },
      url: new URL('https://api.example.com/users'),
    })
  })
})
