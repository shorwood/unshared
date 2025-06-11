import { attempt } from '@unshared/functions'
import { assertObjectOf } from './assertObjectOf'
import { assertString } from './assertString'
import { assertStringNumber } from './assertStringNumber'

describe('assertObjectOf', () => {
  describe('pass', () => {
    it('should parse an empty object', () => {
      const parse = assertObjectOf(assertString)
      const result = parse({})
      expect(result).toStrictEqual({})
    })

    it('should not mutate the original object', () => {
      const parse = assertObjectOf(assertString, (x: string) => x.toUpperCase())
      const value = { hello: 'world', foo: 'bar' }
      const result = parse(value)
      expect(result).toStrictEqual({ hello: 'WORLD', foo: 'BAR' })
      expect(value).toStrictEqual({ hello: 'world', foo: 'bar' })
    })

    it('should parse an object with string values', () => {
      const parse = assertObjectOf(assertString)
      const result = parse({ hello: 'world', foo: 'bar' })
      expect(result).toStrictEqual({ hello: 'world', foo: 'bar' })
    })

    it('should parse an object with values that match a RegExp', () => {
      const parse = assertObjectOf(/\w+/)
      const result = parse({ hello: 'world', foo: 'bar' })
      expect(result).toStrictEqual({ hello: 'world', foo: 'bar' })
    })

    it('should parse strings and convert to numbers', () => {
      const parse = assertObjectOf(assertStringNumber, Number)
      const result = parse({ a: '5', b: '10' })
      expect(result).toStrictEqual({ a: 5, b: 10 })
    })

    it('should parse strings and convert to numbers if possible or uppercase', () => {
      const parse = assertObjectOf([assertStringNumber, Number], [assertString, (x: string) => x.toUpperCase()])
      const result = parse({ a: '5', b: 'hello' })
      expect(result).toStrictEqual({ a: 5, b: 'HELLO' })
    })

    it('should parse an object with nested schema', () => {
      const parse = assertObjectOf({ name: assertString, age: [assertStringNumber, Number] })
      const result = parse({ user1: { name: 'John', age: '25' }, user2: { name: 'Jane', age: '30' } })
      expect(result).toStrictEqual({ user1: { name: 'John', age: 25 }, user2: { name: 'Jane', age: 30 } })
    })
  })

  describe('fail', () => {
    it('should throw "E_OBJECT_VALUES_ASSERTION_FAILED" if any property does not match the assertion rules', () => {
      const parse = assertObjectOf(assertString)
      const shouldThrow = () => parse({ hello: 'world', number: 123 })
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        message: 'Object properties [number] did not match the assertion rules.',
        name: 'E_OBJECT_VALUES_ASSERTION_FAILED',
        context: {
          keys: ['number'],
          errors: {
            number: {
              name: 'E_NOT_STRING',
              message: 'Value is not a string.',
              context: { value: 123, received: 'number' },
            },
          },
        },
      })
    })

    it('should throw if value is not an object', () => {
      const parse = assertObjectOf(assertString)
      const shouldThrow = () => parse('not an object')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT',
        message: 'Value is not an object.',
        context: { value: 'not an object', received: 'string' },
      })
    })

    it('should throw if value is null', () => {
      const parse = assertObjectOf(assertString)
      const shouldThrow = () => parse(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT',
        message: 'Value is not an object.',
        context: { value: null, received: 'null' },
      })
    })
  })

  describe('inference', () => {
    it('should return an object with values of specific type if passing a single rule', () => {
      const parse = assertObjectOf(assertString)
      const value = parse({ hello: 'world' })
      expectTypeOf(value).toEqualTypeOf<Record<PropertyKey, string>>()
    })

    it('should return an object with values of specific type if passing a rule chain', () => {
      const parse = assertObjectOf(assertStringNumber, Number)
      const value = parse({ a: '5' })
      expectTypeOf(value).toEqualTypeOf<Record<PropertyKey, number>>()
    })

    it('should return an object with values of union type if passing a rule set', () => {
      const parse = assertObjectOf([assertStringNumber, Number], [assertString])
      const value = parse({ a: '5' })
      expectTypeOf(value).toEqualTypeOf<Record<PropertyKey, number | string>>()
    })

    it('should return an object with values of specific schema type if passing a schema', () => {
      const parse = assertObjectOf({ name: assertString, age: [assertStringNumber, Number] })
      const value = parse({ user: { name: 'John', age: '25' } })
      expectTypeOf(value).toEqualTypeOf<Record<PropertyKey, { name: string; age: number }>>()
    })
  })
})
