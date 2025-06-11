import { attempt } from '@unshared/functions'
import { assertStringEndingWith } from './assertStringEndingWith'

describe('assertStringEndingWith', () => {
  describe('pass', () => {
    it('should pass if string ends with the expected suffix', () => {
      const result = assertStringEndingWith('World!')('Hello, World!')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string does not end with the expected suffix', () => {
      const shouldThrow = () => assertStringEndingWith('World!')('Hello, Universe!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_ENDING_WITH',
        message: 'String is not ending with "World!".',
        context: { value: 'Hello, Universe!', end: 'World!' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringEndingWith('World!')(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should infer string ending with suffix', () => {
      const value = 'Hello, World!' as unknown
      const assertEnding: (value: unknown) => asserts value is `${string}World!` = assertStringEndingWith('World!')
      assertEnding(value)
      expectTypeOf(value).toEqualTypeOf<`${string}World!`>()
    })
  })
})
