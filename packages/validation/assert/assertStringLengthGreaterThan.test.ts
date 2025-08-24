import { attempt } from '@unshared/functions'
import { assertStringLengthGreaterThan } from './assertStringLengthGreaterThan'

describe('assertStringLengthGreaterThan', () => {
  describe('pass', () => {
    it('should pass if string length is greater than minimum', () => {
      const result = assertStringLengthGreaterThan(3)('Hello')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string length is equal to minimum', () => {
      const shouldThrow = () => assertStringLengthGreaterThan(3)('Foo')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_LENGTH_NOT_GREATER_THAN',
        message: 'String length 3 is not greater than 3.',
        context: { value: 3, minimum: 3 },
      })
    })

    it('should throw if string length is less than minimum', () => {
      const shouldThrow = () => assertStringLengthGreaterThan(3)('Hi')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_LENGTH_NOT_GREATER_THAN',
        message: 'String length 2 is not greater than 3.',
        context: { value: 2, minimum: 3 },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringLengthGreaterThan(3)(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate string with length greater than minimum', () => {
      const value = 'Hello' as unknown
      const assertLength: (value: unknown) => asserts value is string = assertStringLengthGreaterThan(3)
      assertLength(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
