import { attempt } from '@unshared/functions'
import { assertStringLengthLowerThan } from './assertStringLengthLowerThan'

describe('assertStringLengthLowerThan', () => {
  describe('pass', () => {
    it('should pass if string length is lower than maximum', () => {
      const result = assertStringLengthLowerThan(5)('Foo')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string length is equal to maximum', () => {
      const shouldThrow = () => assertStringLengthLowerThan(5)('Hello')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_LENGTH_NOT_LOWER_THAN',
        message: 'String length 5 is not lower than 5.',
        context: { value: 5, maximum: 5 },
      })
    })

    it('should throw if string length is greater than maximum', () => {
      const shouldThrow = () => assertStringLengthLowerThan(5)('Toolong')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_LENGTH_NOT_LOWER_THAN',
        message: 'String length 7 is not lower than 5.',
        context: { value: 7, maximum: 5 },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringLengthLowerThan(5)(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate string with length lower than maximum', () => {
      const value = 'Foo' as unknown
      const assertLength: (value: unknown) => asserts value is string = assertStringLengthLowerThan(5)
      assertLength(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
