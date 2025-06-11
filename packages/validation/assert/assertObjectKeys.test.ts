import { attempt } from '@unshared/functions'
import { assertNumber } from './assertNumber'
import { assertObjectKeys } from './assertObjectKeys'
import { assertString } from './assertString'

describe('assertObjectKeys', () => {
  describe('pass', () => {
    it('should pass if all object keys assert as strings', () => {
      const object = { hello: 'world', foo: 'bar' }
      const result = assertObjectKeys(assertString)(object)
      expect(result).toBeUndefined()
    })

    it('should pass if all object keys assert the RegExp', () => {
      const object = { hello: 'world', foo: 'bar' }
      const result = assertObjectKeys(/^[a-z]+$/)(object)
      expect(result).toBeUndefined()
    })

    it('should pass for empty object', () => {
      const object = {}
      const result = assertObjectKeys(assertString)(object)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if object key does not assert as expected type', () => {
      const object = { hello: 'world', 123: 'number key' }
      const shouldThrow = () => assertObjectKeys(assertNumber)(object)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_OBJECT_KEYS',
        message: 'Object keys do not pass the assertion.',
      })
      expect(error?.cause).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
      })
    })

    it('should throw if value is not an object', () => {
      const shouldThrow = () => assertObjectKeys(assertString)('not an object' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT',
        message: 'Value is not an object.',
        context: { value: 'not an object', received: 'string' },
      })
    })

    it('should throw if value is null', () => {
      const shouldThrow = () => assertObjectKeys(assertString)(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT',
        message: 'Value is not an object.',
        context: { value: null, received: 'null' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate an object with keys of specific type', () => {
      const value = { hello: 'world' } as unknown
      const assertKeys: (value: unknown) => asserts value is Record<string, unknown> = assertObjectKeys(assertString)
      assertKeys(value)
      expectTypeOf(value).toEqualTypeOf<Record<string, unknown>>()
    })
  })
})
