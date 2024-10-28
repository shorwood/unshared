import { attempt } from '@unshared/functions'
import { assertStringSnakeCase } from './assertStringSnakeCase'

describe('assertStringSnakeCase', () => {
  describe('pass', () => {
    it('should pass if value is in snake case', () => {
      const result = assertStringSnakeCase('hello_world')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not in snake case', () => {
      const shouldThrow = () => assertStringSnakeCase('Hello, World!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_SNAKE_CASE',
        message: 'String is not in snake case.',
        context: { value: 'Hello, World!' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringSnakeCase({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a string', () => {
      const value: unknown = 'hello_world'
      assertStringSnakeCase(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
