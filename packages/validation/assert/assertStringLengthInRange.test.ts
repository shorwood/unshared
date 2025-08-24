import { attempt } from '@unshared/functions'
import { assertStringLengthInRange } from './assertStringLengthInRange'

describe('assertStringLengthInRange', () => {
  describe('pass', () => {
    it('should pass if string length is between min and max', () => {
      const result = assertStringLengthInRange(2, 5)('Foo')
      expect(result).toBeUndefined()
    })

    it('should pass if string length is equal to min', () => {
      const result = assertStringLengthInRange(2, 5)('Hi')
      expect(result).toBeUndefined()
    })

    it('should pass if string length is equal to max', () => {
      const result = assertStringLengthInRange(2, 5)('Hello')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string length is less than min', () => {
      const shouldThrow = () => assertStringLengthInRange(2, 5)('A')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_LENGTH_OUT_OF_RANGE',
        message: 'String length 1 is not between 2 and 5.',
        context: { value: 1, min: 2, max: 5 },
      })
    })

    it('should throw if string length is greater than max', () => {
      const shouldThrow = () => assertStringLengthInRange(2, 5)('Toolong')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_LENGTH_OUT_OF_RANGE',
        message: 'String length 7 is not between 2 and 5.',
        context: { value: 7, min: 2, max: 5 },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringLengthInRange(2, 5)(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate string with length in range', () => {
      const value = 'Foo' as unknown
      const assertLength: (value: unknown) => asserts value is string = assertStringLengthInRange(2, 5)
      assertLength(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
