import { attempt } from '@unshared/functions'
import { assertStringStartingWith } from './assertStringStartingWith'

describe('assertStringStartingWith', () => {
  describe('pass', () => {
    it('should pass if value is a string starting with the given string', () => {
      const result = assertStringStartingWith('Hello, World!', 'Hello')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringStartingWith(1, 'Hello')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 1, received: 'number' },
      })
    })

    it('should throw if value does not start with the given string', () => {
      const shouldThrow = () => assertStringStartingWith('Hello, World!', 'World')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_STARTING_WITH',
        message: 'String does not start with "World".',
        context: { value: 'Hello, World!', start: 'World' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a string starting with the given string', () => {
      const value: unknown = 'Hello, World!'
      assertStringStartingWith(value, 'Hello')
      expectTypeOf(value).toEqualTypeOf<`Hello${string}`>()
    })
  })
})
