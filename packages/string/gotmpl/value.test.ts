/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GoTmpl } from './types'
import { isValueTrue, valueFromJS, valueToJS, valueToString } from './value'

describe('value', () => {
  describe('valueFromJS', () => {
    it('should convert null to nil', () => {
      const result = valueFromJS(null)
      expect(result).toStrictEqual({ kind: GoTmpl.Value.Kind.Nil })
    })

    it('should convert undefined to nil', () => {
      const result = valueFromJS()
      expect(result).toStrictEqual({ kind: GoTmpl.Value.Kind.Nil })
    })

    it('should convert boolean', () => {
      const result = valueFromJS(true)
      expect(result).toStrictEqual({ kind: GoTmpl.Value.Kind.Bool, value: true })
    })

    it('should convert number', () => {
      const result = valueFromJS(42)
      expect(result).toStrictEqual({ kind: GoTmpl.Value.Kind.Number, value: 42 })
    })

    it('should convert string', () => {
      const result = valueFromJS('hello')
      expect(result).toStrictEqual({ kind: GoTmpl.Value.Kind.String, value: 'hello' })
    })

    it('should convert array', () => {
      const result = valueFromJS([1, 'two', true])
      expect(result).toStrictEqual({
        kind: GoTmpl.Value.Kind.Array,
        value: [
          { kind: GoTmpl.Value.Kind.Number, value: 1 },
          { kind: GoTmpl.Value.Kind.String, value: 'two' },
          { kind: GoTmpl.Value.Kind.Bool, value: true },
        ],
      })
    })

    it('should convert object', () => {
      const result = valueFromJS({ a: 1, b: 'two' })
      expect(result).toStrictEqual({
        kind: GoTmpl.Value.Kind.Object,
        raw: { a: 1, b: 'two' },
        value: {
          a: { kind: GoTmpl.Value.Kind.Number, value: 1 },
          b: { kind: GoTmpl.Value.Kind.String, value: 'two' },
        },
      })
    })

    it('should convert function', () => {
      const fn = vi.fn(() => 42)
      const result = valueFromJS(fn)
      expect(result).toStrictEqual({ kind: GoTmpl.Value.Kind.Function, raw: fn, value: expect.any(Function) })
    })

    it('should wrap function return values', () => {
      const fn = vi.fn((x: number) => x * 2)
      const wrapped = valueFromJS(fn) as GoTmpl.Value.Function
      const result = wrapped.value(valueFromJS(21))
      expect(valueToJS(result)).toBe(42)
    })
  })

  describe('valueToJS', () => {
    it('should convert nil', () => {
      const result = valueToJS({ kind: GoTmpl.Value.Kind.Nil })
      expect(result).toBeUndefined()
    })

    it('should convert bool', () => {
      const result = valueToJS({ kind: GoTmpl.Value.Kind.Bool, value: true })
      expect(result).toBe(true)
    })

    it('should convert number', () => {
      const result = valueToJS({ kind: GoTmpl.Value.Kind.Number, value: 42 })
      expect(result).toBe(42)
    })

    it('should convert string', () => {
      const result = valueToJS({ kind: GoTmpl.Value.Kind.String, value: 'hello' })
      expect(result).toBe('hello')
    })

    it('should convert array', () => {
      const result = valueToJS({
        kind: GoTmpl.Value.Kind.Array,
        value: [
          { kind: GoTmpl.Value.Kind.Number, value: 1 },
          { kind: GoTmpl.Value.Kind.String, value: 'two' },
          { kind: GoTmpl.Value.Kind.Bool, value: true },
        ],
      })
      expect(result).toStrictEqual([1, 'two', true])
    })

    it('should convert function', () => {
      const fn = vi.fn(() => 42)
      const wrapped = valueFromJS(fn) as GoTmpl.Value.Function
      const result = valueToJS(wrapped)
      expect(result).toBe(fn)
    })

    it('should convert object', () => {
      const result = valueToJS({
        kind: GoTmpl.Value.Kind.Object,
        raw: { a: 1, b: 'two' },
        value: {
          a: { kind: GoTmpl.Value.Kind.Number, value: 1 },
          b: { kind: GoTmpl.Value.Kind.String, value: 'two' },
        },
      })
      expect(result).toStrictEqual({ a: 1, b: 'two' })
    })
  })

  describe('valueToString', () => {
    it('should convert bool', () => {
      const result = valueToString({ kind: GoTmpl.Value.Kind.Bool, value: true })
      expect(result).toBe('true')
    })

    it('should convert number', () => {
      const result = valueToString({ kind: GoTmpl.Value.Kind.Number, value: 42 })
      expect(result).toBe('42')
    })

    it('should convert string', () => {
      const result = valueToString({ kind: GoTmpl.Value.Kind.String, value: 'hello' })
      expect(result).toBe('hello')
    })

    it('should convert array', () => {
      const value = valueFromJS([1, 'two', true])
      const result = valueToString(value)
      expect(result).toBe('1 two true')
    })

    it('should convert object', () => {
      const value = valueFromJS({ a: 1, b: 'two' })
      const result = valueToString(value)
      expect(result).toBe('a:1 b:two')
    })

    it('should convert function', () => {
      const value = valueFromJS(() => {})
      const result = valueToString(value)
      expect(result).toBe('[function]')
    })

    it('should convert nil', () => {
      const result = valueToString({ kind: GoTmpl.Value.Kind.Nil })
      expect(result).toBe('')
    })
  })

  describe('isValueTrue', () => {
    it.each([
      [{ kind: GoTmpl.Value.Kind.Bool, value: true }, true],
      [{ kind: GoTmpl.Value.Kind.Bool, value: false }, false],
      [{ kind: GoTmpl.Value.Kind.Number, value: 0 }, false],
      [{ kind: GoTmpl.Value.Kind.Number, value: 42 }, true],
      [{ kind: GoTmpl.Value.Kind.String, value: '' }, false],
      [{ kind: GoTmpl.Value.Kind.String, value: 'hello' }, true],
      [{ kind: GoTmpl.Value.Kind.Array, value: [] }, false],
      [{ kind: GoTmpl.Value.Kind.Array, value: [{ kind: GoTmpl.Value.Kind.Number, value: 1 }] }, true],
      [{ kind: GoTmpl.Value.Kind.Object, value: {} }, false],
      [{ kind: GoTmpl.Value.Kind.Object, value: { a: { kind: GoTmpl.Value.Kind.Number, value: 1 } } }, true],
      [{ kind: GoTmpl.Value.Kind.Nil }, false],
    ])('should evaluate %o as %s', (value, expected) => {
      const result = isValueTrue(value as GoTmpl.Value)
      expect(result).toBe(expected)
    })
  })
})
