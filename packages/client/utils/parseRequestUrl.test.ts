import { parseRequestUrl } from './parseRequestUrl'

describe('parseRequestUrl', () => {
  describe('with method and baseUrl in route name', () => {
    it('should parse the route name with method and baseUrl', () => {
      const context = { init: {} }
      parseRequestUrl('GET /users', { baseUrl: 'https://api.example.com' }, context)
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should override the method from the route name', () => {
      const context = { init: {} }
      parseRequestUrl('POST https://api.example.com/users', { method: 'get' }, context)
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should override the baseUrl from the route name', () => {
      const context = { init: {} }
      parseRequestUrl('GET https://api.example.com/users', { baseUrl: 'https://api.acme.com' }, context)
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.acme.com/users'),
      })
    })
  })

  describe('without method in route name', () => {
    it('should parse the route name without method and default to GET', () => {
      const context = { init: {} }
      parseRequestUrl('/users', { baseUrl: 'https://api.example.com' }, context)
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should default to GET method', () => {
      const context = { init: {} }
      parseRequestUrl('https://api.example.com/users', {}, context)
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should parse with root path', () => {
      const context = { init: {} }
      parseRequestUrl('GET /', { baseUrl: 'https://api.example.com' }, context)
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/'),
      })
    })

    it('should parse the route name with only path', () => {
      const context = { init: {} }
      parseRequestUrl('/users', { baseUrl: 'https://api.example.com' }, context)
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should parse the route name with full URL', () => {
      const context = { init: {} }
      parseRequestUrl('https://api.example.com/users', {}, context)
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should parse the route name with full URL and path', () => {
      const context = { init: {} }
      parseRequestUrl('https://api.example.com/users', {}, context)
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })
  })

  describe('edge cases', () => {
    it('should omit query string from the path', () => {
      const context = { init: {} }
      parseRequestUrl('GET /users?sort=asc', { baseUrl: 'https://api.example.com' }, context)
      expect(context).toStrictEqual({
        init: { method: 'get' },
        url: new URL('https://api.example.com/users'),
      })
    })

    it('should throw an error for invalid route name', () => {
      const shouldThrow = () => parseRequestUrl('INVALID_ROUTE', {}, { init: {} })
      expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object: Invalid route name.')
    })

    it('should throw if the baseUrl is missing', () => {
      const shouldThrow = () => parseRequestUrl('GET /users', {}, { init: {} })
      expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object: the `baseUrl` is missing.')
    })

    it('should throw if the method is invalid', () => {
      const shouldThrow = () => parseRequestUrl('INVALID /users', { baseUrl: 'https://api.example.com' }, { init: {} })
      expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object:, the method `INVALID` is invalid.')
    })
  })
})
