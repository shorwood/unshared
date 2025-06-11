import { attempt } from '@unshared/functions'
import { assertNumber } from './assertNumber'
import { assertObjectValues } from './assertObjectValues'
import { assertString } from './assertString'

describe('assertObjectValues', () => {
  describe('pass', () => {
    it('should pass if all object property values assert as strings', () => {
      const object = { hello: 'world', foo: 'bar' }
      const result = assertObjectValues(assertString)(object)
      expect(result).toBeUndefined()
    })

    it('should pass if all object property values assert as numbers', () => {
      const object = { a: 1, b: 2, c: 3 }
      const result = assertObjectValues(assertNumber)(object)
      expect(result).toBeUndefined()
    })

    it('should pass for empty object', () => {
      const object = {}
      const result = assertObjectValues(assertString)(object)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if object property value does not assert as expected type', () => {
      const object = { hello: 'world', number: 123 }
      const shouldThrow = () => assertObjectValues(assertString)(object)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_OBJECT_VALUES_ASSERTION_FAILED',
        message: 'Object properties [number] did not match the assertion rules.',
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
      const shouldThrow = () => assertObjectValues(assertString)('not an object' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT',
        message: 'Value is not an object.',
        context: { value: 'not an object', received: 'string' },
      })
    })

    it('should throw if value is null', () => {
      const shouldThrow = () => assertObjectValues(assertString)(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT',
        message: 'Value is not an object.',
        context: { value: null, received: 'null' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate an object with property values of specific type', () => {
      const value = { hello: 'world', foo: 'bar' } as unknown
      const assertProperties: (value: unknown) => asserts value is Record<PropertyKey, string> = assertObjectValues(assertString)
      assertProperties(value)
      expectTypeOf(value).toEqualTypeOf<Record<PropertyKey, string>>()
    })
  })
})
