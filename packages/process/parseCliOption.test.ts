import { parseOption } from './parseCliOption'

describe('parseCliOption', () => {
  describe('simple', () => {
    it('should parse a simple option as a flag', () => {
      const result = parseOption('--foo')
      expect(result).toStrictEqual({ foo: true })
    })

    it('should parse a simple option with a value', () => {
      const result = parseOption('--foo', 'bar')
      expect(result).toStrictEqual({ foo: 'bar' })
    })
  })

  describe('nested', () => {
    it('should parse a nested option as a flag', () => {
      const result = parseOption('--foo.bar')
      expect(result).toStrictEqual({ foo: { bar: true } })
    })

    it('should parse a nested option with a value', () => {
      const result = parseOption('--foo.bar', 'baz')
      expect(result).toStrictEqual({ foo: { bar: 'baz' } })
    })

    it('should parse a deeply nested option', () => {
      const result = parseOption('--foo.bar.baz.qux', 'quux')
      expect(result).toStrictEqual({ foo: { bar: { baz: { qux: 'quux' } } } })
    })
  })

  describe('short', () => {
    it('should parse one short option as a flag', () => {
      const result = parseOption('-f')
      expect(result).toStrictEqual({ f: true })
    })

    it('should parse one short option with a value', () => {
      const result = parseOption('-f', 'bar')
      expect(result).toStrictEqual({ f: 'bar' })
    })

    it('should parse multiple short options as flags', () => {
      const result = parseOption('-fbq')
      expect(result).toStrictEqual({ b: true, f: true, q: true })
    })

    it('should parse multiple short options with value', () => {
      const result = parseOption('-fbq', 'bar')
      expect(result).toStrictEqual({ b: 'bar', f: 'bar', q: 'bar' })
    })
  })
})
