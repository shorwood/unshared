import { attempt } from '@unshared/functions'
import { assertStringEquals } from './assertStringEquals'

describe('assertStringEquals', () => {
  describe('pass', () => {
    it('should pass if value equals the expected string', () => {
      const result = assertStringEquals('Hello, World!', 'Hello, World!')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value does not equal the expected string', () => {
      const shouldThrow = () => assertStringEquals('Hello, World!', 'Hello, Universe!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_EQUAL',
        message: 'String is not equal to "Hello, Universe!".',
        context: { value: 'Hello, World!', expected: 'Hello, Universe!' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringEquals({}, 'Hello, World!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a string equal to the expected string', () => {
      const value: unknown = 'Hello, World!'
      assertStringEquals(value, 'Hello, World!')
      expectTypeOf(value).toEqualTypeOf<'Hello, World!'>()
    })
  })
})
