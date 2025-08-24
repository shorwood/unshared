import { attempt } from '@unshared/functions'
import { assertStringLengthGreaterThanOrEqual } from './assertStringLengthGreaterThanOrEqual'

describe('assertStringLengthGreaterThanOrEqual', () => {
  describe('pass', () => {
    it('should pass if string length is greater than minimum', () => {
      const result = assertStringLengthGreaterThanOrEqual(3)('Hello')
      expect(result).toBeUndefined()
    })

    it('should pass if string length is equal to minimum', () => {
      const result = assertStringLengthGreaterThanOrEqual(3)('Foo')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string length is less than minimum', () => {
      const shouldThrow = () => assertStringLengthGreaterThanOrEqual(3)('Hi')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_LENGTH_NOT_GREATER_THAN_OR_EQUAL',
        message: 'String length 2 is not greater than or equal to 3.',
        context: { value: 2, minimum: 3 },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringLengthGreaterThanOrEqual(3)(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate string with length greater than or equal to minimum', () => {
      const value = 'Hello' as unknown
      const assertLength: (value: unknown) => asserts value is string = assertStringLengthGreaterThanOrEqual(3)
      assertLength(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
