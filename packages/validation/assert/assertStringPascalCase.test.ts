import { attempt } from '@unshared/functions'
import { assertStringPascalCase } from './assertStringPascalCase'

describe('assertStringPascalCase', () => {
  describe('pass', () => {
    it('should pass if value is in pascal case', () => {
      const result = assertStringPascalCase('HelloWorld')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not in pascal case', () => {
      const shouldThrow = () => assertStringPascalCase('Hello, World!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_PASCAL_CASE',
        message: 'String is not in pascal case.',
        context: { value: 'Hello, World!' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringPascalCase({})
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
      const value: unknown = 'HelloWorld'
      assertStringPascalCase(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
