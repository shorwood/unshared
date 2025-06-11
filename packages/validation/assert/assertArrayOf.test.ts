import { attempt } from '@unshared/functions'
import { assertArrayOf } from './assertArrayOf'
import { assertString } from './assertString'
import { assertStringNumber } from './assertStringNumber'

describe('assertArrayOf', () => {
  describe('pass', () => {
    it('should assert it is an array', () => {
      const parse = assertArrayOf(assertString)
      const result = parse([])
      expect(result).toStrictEqual([])
    })

    it('should not mutate the original array', () => {
      const parse = assertArrayOf(assertString, (x: string) => x.toUpperCase())
      const value = ['Hello', 'World']
      const result = parse(value)
      expect(result).toStrictEqual(['HELLO', 'WORLD'])
      expect(value).toStrictEqual(['Hello', 'World'])
    })

    it('should assert it is an array of strings', () => {
      const parse = assertArrayOf(assertString)
      const result = parse(['Hello', 'World'])
      expect(result).toStrictEqual(['Hello', 'World'])
    })

    it('should assert it is an array of strings that matches a RegExp', () => {
      const parse = assertArrayOf(/\w+/)
      const result = parse(['Hello', 'World'])
      expect(result).toStrictEqual(['Hello', 'World'])
    })

    it('should assert strings and convert to numbers', () => {
      const parse = assertArrayOf(assertStringNumber, Number)
      const result = parse(['5', '10'])
      expect(result).toStrictEqual([5, 10])
    })

    it('should assert strings and convert to numbers if possible or uppercase', () => {
      const parse = assertArrayOf([assertStringNumber, Number], [assertString, (x: string) => x.toUpperCase()])
      const result = parse(['5', 'Hello'])
      expect(result).toStrictEqual([5, 'HELLO'])
    })

    it('should assert an array of object matching a schema', () => {
      const parse = assertArrayOf({ name: assertString, age: [assertStringNumber, Number] })
      const result = parse([{ name: 'John', age: '25' }])
      expect(result).toStrictEqual([{ name: 'John', age: 25 }])
    })
  })

  describe('fail', () => {
    it('should throw "E_ARRAY_ITEMS_ASSERTION_FAILED" if any item does not match the assertion rules', () => {
      const parse = assertArrayOf(assertString)
      const shouldThrow = () => parse(['Hello', 5])
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        message: 'Items at indices [1] did match the assertion rules.',
        name: 'E_ARRAY_ITEMS_ASSERTION_FAILED',
        context: {
          indices: [1],
          errors: {
            1: {
              name: 'E_NOT_STRING',
              message: 'Value is not a string.',
              context: { value: 5, received: 'number' },
            },
          },
        },
      })
    })

    it('should throw if value is not an array', () => {
      const parse = assertArrayOf(assertString)
      const shouldThrow = () => parse({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should return a value of type string if passing a single rule', () => {
      const parse = assertArrayOf(assertString)
      const value = parse(['Hello, World!'])
      expectTypeOf(value).toEqualTypeOf<string[]>()
    })

    it('should return a value of type string if passing a rule chain', () => {
      const parse = assertArrayOf(assertStringNumber, Number)
      const value = parse(['5'])
      expectTypeOf(value).toEqualTypeOf<number[]>()
    })

    it('should return a value of type string if passing a rule set', () => {
      const parse = assertArrayOf([assertStringNumber, Number], [assertString])
      const value = parse(['5'])
      expectTypeOf(value).toEqualTypeOf<Array<number | string>>()
    })

    it('should return a value of type string if passing a schema', () => {
      const parse = assertArrayOf({ name: assertString, age: [assertStringNumber, Number] })
      const value = parse([{ name: 'John', age: '25' }])
      expectTypeOf(value).toEqualTypeOf<Array<{ name: string; age: number }>>()
    })
  })
})
