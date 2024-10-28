import { attempt } from '@unshared/functions'
import { assertStringEndingWith } from './assertStringEndingWith'

describe('assertStringEndingWith', () => {
  describe('pass', () => {
    it('should pass if value ends with the given string', () => {
      const result = assertStringEndingWith('Hello, World!', 'World!')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value does not end with the given string', () => {
      const shouldThrow = () => assertStringEndingWith('Hello, World!', 'Hello!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_ENDING_WITH',
        message: 'String is not ending with "Hello!".',
        context: { value: 'Hello, World!', end: 'Hello!' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringEndingWith({}, 'Hello!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a string ending with the given string', () => {
      const value: unknown = 'Hello, World!'
      assertStringEndingWith(value, 'World!')
      expectTypeOf(value).toEqualTypeOf<`${string}World!`>()
    })
  })
})
