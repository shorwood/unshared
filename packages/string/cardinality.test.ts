import { cardinality as cardinalityJS } from './cardinality'
import { cardinality as cardinalityCC } from './cardinality.bindings'

describe('cardinality', () => {
  const implementations = [['native', cardinalityJS], ['bindings', cardinalityCC]] as const

  for (const [implementation, cardinality] of implementations) {
    describe(`${implementation} implementation`, () => {
      describe('default options', () => {
        test('should return 0 for empty string', () => {
          const result = cardinality('')
          expect(result).toBe(0)
        })

        test('should return 26 for lowercase letters', () => {
          const result = cardinality('abcdefghijklmnopqrstuvwxyz')
          expect(result).toBe(26)
        })

        test('should return 26 for uppercase letters', () => {
          const result = cardinality('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
          expect(result).toBe(26)
        })

        test('should return 10 for digits', () => {
          const result = cardinality('0123456789')
          expect(result).toBe(10)
        })

        test('should return 33 for ASCII punctuation', () => {
          const result = cardinality('!@#$%^&*()_+-=[]{};:,./<>?`~')
          expect(result).toBe(33)
        })

        test('should return 100 for Unicode characters', () => {
          const result = cardinality('你好世界')
          expect(result).toBe(100)
        })

        test('should return combined cardinality for mixed types', () => {
          const result = cardinality('aA1!你')
          expect(result).toBe(26 + 26 + 10 + 33 + 100)
        })
      })

      describe('custom options', () => {
        test('should return 0 for empty string', () => {
          const result = cardinality('', { lower: 1, upper: 1, digit: 1, ascii: 1, unicode: 1 })
          expect(result).toBe(0)
        })

        test('should return 1 for lowercase letters', () => {
          const result = cardinality('abcdefghijklmnopqrstuvwxyz', { lower: 1 })
          expect(result).toBe(1)
        })

        test('should return 1 for uppercase letters', () => {
          const result = cardinality('ABCDEFGHIJKLMNOPQRSTUVWXYZ', { upper: 1 })
          expect(result).toBe(1)
        })

        test('should return 1 for digits', () => {
          const result = cardinality('0123456789', { digit: 1 })
          expect(result).toBe(1)
        })

        test('should return 1 for ASCII punctuation', () => {
          const result = cardinality('!@#$%^&*()_+-=[]{};:,./<>?`~', { ascii: 1 })
          expect(result).toBe(1)
        })

        test('should return 1 for Unicode characters', () => {
          const result = cardinality('你好世界', { unicode: 1 })
          expect(result).toBe(1)
        })

        test('should return combined cardinality for mixed types', () => {
          const result = cardinality('aA1!你', { lower: 1, upper: 1, digit: 1, ascii: 1, unicode: 1 })
          expect(result).toBe(5)
        })
      })
    })
  }
})
