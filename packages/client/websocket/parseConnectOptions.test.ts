import type { ConnectOptions } from './parseConnectOptions'
import { parseConnectOptions } from './parseConnectOptions'

describe('parseConnectOptions', () => {
  describe('URL parsing', () => {
    it('should parse the connection URL with baseUrl and protocol', () => {
      const options: ConnectOptions = { baseUrl: 'ws://localhost:8080', protocol: 'ws' }
      const result = parseConnectOptions('WS /users/:id', options)
      expect(result.url.toString()).toBe('ws://localhost:8080/users/:id')
      expect(result.protocol).toBe('ws')
    })

    it('should throw an error if the baseUrl is missing', () => {
      const shouldThrow = () => parseConnectOptions('WS /users', {})
      expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object: the `baseUrl` is missing.')
    })

    it('should throw an error if the protocol is invalid', () => {
      // @ts-expect-error: test invalid protocol
      const shouldThrow = () => parseConnectOptions('WS /users', { baseUrl: 'ftp://localhost:8080', protocol: 'ftp' })
      expect(shouldThrow).toThrowError('Could not resolve the `RequestInit` object:, the method `ftp` is invalid.')
    })
  })

  describe('Path parameters parsing', () => {
    it('should parse the connection URL with path parameters', () => {
      const options = { baseUrl: 'ws://localhost:8080', parameters: { id: '123' } }
      const result = parseConnectOptions('WS /users/:id', options)
      expect(result.url.toString()).toBe('ws://localhost:8080/users/123')
    })

    it('should handle multiple path parameters', () => {
      const options = { baseUrl: 'ws://localhost:8080', parameters: { userId: '123', postId: '456' } }
      const result = parseConnectOptions('WS /users/:userId/posts/:postId', options)
      expect(result.url.toString()).toBe('ws://localhost:8080/users/123/posts/456')
    })

    it('should handle missing path parameters gracefully', () => {
      const options = { baseUrl: 'ws://localhost:8080', parameters: {} }
      const result = parseConnectOptions('WS /users/:id', options)
      expect(result.url.toString()).toBe('ws://localhost:8080/users/:id')
    })
  })

  describe('Query parameters parsing', () => {
    it('should parse the connection URL with query parameters', () => {
      const options = { baseUrl: 'ws://localhost:8080', query: { active: true } }
      const result = parseConnectOptions('WS /users', options)
      expect(result.url.toString()).toBe('ws://localhost:8080/users?active=true')
    })

    it('should handle multiple query parameters', () => {
      const options = { baseUrl: 'ws://localhost:8080', query: { active: true, limit: 10 } }
      const result = parseConnectOptions('WS /users', options)
      expect(result.url.toString()).toBe('ws://localhost:8080/users?active=true&limit=10')
    })

    it('should handle empty query parameters gracefully', () => {
      const options = { baseUrl: 'ws://localhost:8080', query: {} }
      const result = parseConnectOptions('WS /users', options)
      expect(result.url.toString()).toBe('ws://localhost:8080/users')
    })
  })

  describe('Combined options parsing', () => {
    it('should handle all options together', () => {
      const options: ConnectOptions = {
        baseUrl: 'ws://localhost:8080',
        protocol: 'ws',
        parameters: { id: '123' },
        query: { active: true },
      }
      const result = parseConnectOptions('WS /users/:id', options)
      expect(result.url.toString()).toBe('ws://localhost:8080/users/123?active=true')
      expect(result.protocol).toBe('ws')
    })
  })
})
