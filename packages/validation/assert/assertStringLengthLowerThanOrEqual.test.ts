import { attempt } from '@unshared/functions'
import { assertStringLengthLowerThanOrEqual } from './assertStringLengthLowerThanOrEqual'

describe('assertStringLengthLowerThanOrEqual', () => {
  describe('pass', () => {
    it('should pass if string length is lower than maximum', () => {
      const result = assertStringLengthLowerThanOrEqual(5)('Foo')
      expect(result).toBeUndefined()
    })

    it('should pass if string length is equal to maximum', () => {
      const result = assertStringLengthLowerThanOrEqual(5)('Hello')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string length is greater than maximum', () => {
      const shouldThrow = () => assertStringLengthLowerThanOrEqual(5)('Toolong')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_LENGTH_NOT_LOWER_THAN_OR_EQUAL',
        message: 'String length 7 is not lower than or equal to 5.',
        context: { value: 7, maximum: 5 },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringLengthLowerThanOrEqual(5)(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate string with length lower than or equal to maximum', () => {
      const value = 'Hello' as unknown
      const assertLength: (value: unknown) => asserts value is string = assertStringLengthLowerThanOrEqual(5)
      assertLength(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
