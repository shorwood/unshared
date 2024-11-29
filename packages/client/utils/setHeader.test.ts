import { setHeader } from './setHeader'

describe('setHeader', () => {
  describe('Headers', () => {
    it('should set a header in a Headers instance', () => {
      const headers = new Headers()
      setHeader(headers, 'Content-Type', 'application/json')
      expect([...headers]).toStrictEqual([['content-type', 'application/json']])
    })

    it('should replace a header with the same key but different case', () => {
      const headers = new Headers({ 'content-type': 'text/plain' })
      setHeader(headers, 'Content-Type', 'application/json')
      expect([...headers]).toStrictEqual([['content-type', 'application/json']])
    })

    it('should replace a header with the same key and case', () => {
      const headers = new Headers({ 'Content-Type': 'text/plain' })
      setHeader(headers, 'Content-Type', 'application/json')
      expect([...headers]).toStrictEqual([['content-type', 'application/json']])
    })

    it('should append a header in a Headers instance', () => {
      const headers = new Headers({ Accept: 'application/json' })
      setHeader(headers, 'Content-Type', 'application/json')
      expect([...headers.entries()]).toStrictEqual([
        ['accept', 'application/json'],
        ['content-type', 'application/json'],
      ])
    })
  })

  describe('Array', () => {
    it('should set a header in an array of key-value pairs', () => {
      const headers: Array<[string, string]> = []
      setHeader(headers, 'Content-Type', 'application/json')
      expect([...headers]).toStrictEqual([['Content-Type', 'application/json']])
    })

    it('should replace a header with the same key but different case', () => {
      const headers: Array<[string, string]> = [['content-type', 'text/plain']]
      setHeader(headers, 'Content-Type', 'application/json')
      expect(headers).toStrictEqual([['Content-Type', 'application/json']])
    })

    it('should replace a header with the same key and case', () => {
      const headers: Array<[string, string]> = [['Content-Type', 'text/plain']]
      setHeader(headers, 'Content-Type', 'application/json')
      expect(headers).toStrictEqual([['Content-Type', 'application/json']])
    })

    it('should append a header in an array of key-value pairs', () => {
      const headers: Array<[string, string]> = [['Accept', 'application/json']]
      setHeader(headers, 'Content-Type', 'application/json')
      expect([...headers]).toStrictEqual([
        ['Accept', 'application/json'],
        ['Content-Type', 'application/json'],
      ])
    })
  })

  describe('Object', () => {
    it('should set a header in an object', () => {
      const headers: Record<string, string> = {}
      setHeader(headers, 'Content-Type', 'application/json')
      expect(headers).toStrictEqual({ 'Content-Type': 'application/json' })
    })

    it('should replace a header with the same key but different case', () => {
      const headers: Record<string, string> = { 'content-type': 'text/plain' }
      setHeader(headers, 'Content-Type', 'application/json')
      expect(headers).toStrictEqual({ 'content-type': 'application/json' })
    })

    it('should replace a header with the same key and case', () => {
      const headers: Record<string, string> = { 'Content-Type': 'text/plain' }
      setHeader(headers, 'Content-Type', 'application/json')
      expect(headers).toStrictEqual({ 'Content-Type': 'application/json' })
    })

    it('should append a header in an object', () => {
      const headers: Record<string, string> = { Accept: 'application/json' }
      setHeader(headers, 'Content-Type', 'application/json')
      expect(headers).toStrictEqual({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      })
    })
  })
})
