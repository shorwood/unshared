import { parseRequestUrl } from './parseRequestUrl'

describe('parseRequestUrl', () => {
  describe('with method and baseUrl in route name', () => {
    it('should parse the route name with method and baseUrl', () => {
      const context = {}
      parseRequestUrl(context, 'GET /users', { baseUrl: 'https://api.example.com' })
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should append the path to the baseUrl if it has a path', () => {
      const context = {}
      parseRequestUrl(context, 'GET /users/1', { baseUrl: 'https://api.example.com/v1' })
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/v1/users/1'),
      })
    })

    it('should append the path to the baseUrl if it has a path with a trailing slash', () => {
      const context = {}
      parseRequestUrl(context, 'GET /users/1', { baseUrl: 'https://api.example.com/v1/' })
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/v1/users/1'),
      })
    })

    it('should override the method from the route name', () => {
      const context = {}
      parseRequestUrl(context, 'POST https://api.example.com/users', { method: 'get' })
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should override the baseUrl from the route name', () => {
      const context = {}
      parseRequestUrl(context, 'GET https://api.example.com/users', { baseUrl: 'https://api.acme.com' })
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.acme.com/users'),
      })
    })
  })

  describe('without method in route name', () => {
    it('should parse the route name without method and default to GET', () => {
      const context = {}
      parseRequestUrl(context, '/users', { baseUrl: 'https://api.example.com' })
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should default to GET method', () => {
      const context = {}
      parseRequestUrl(context, 'https://api.example.com/users', {})
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should parse with root path', () => {
      const context = {}
      parseRequestUrl(context, 'GET /', { baseUrl: 'https://api.example.com' })
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/'),
      })
    })

    it('should parse the route name with only path', () => {
      const context = {}
      parseRequestUrl(context, '/users', { baseUrl: 'https://api.example.com' })
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should parse the route name with full URL', () => {
      const context = {}
      parseRequestUrl(context, 'https://api.example.com/users', {})
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should parse the route name with full URL and path', () => {
      const context = {}
      parseRequestUrl(context, 'https://api.example.com/users', {})
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })
  })

  describe('edge cases', () => {
    it('should omit query string from the path', () => {
      const context = {}
      parseRequestUrl(context, 'GET /users?sort=asc', { baseUrl: 'https://api.example.com' })
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should throw an error for invalid route name', () => {
      const shouldThrow = () => parseRequestUrl({}, 'INVALID_ROUTE', {})
      expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object: Invalid route name.')
    })

    it('should throw if the baseUrl is missing', () => {
      const shouldThrow = () => parseRequestUrl({}, 'GET /users', {})
      expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object: the `baseUrl` is missing.')
    })

    it('should throw if the method is invalid', () => {
      const shouldThrow = () => parseRequestUrl({}, 'INVALID /users', { baseUrl: 'https://api.example.com' })
      expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object:, the method `INVALID` is invalid.')
    })
  })
})
