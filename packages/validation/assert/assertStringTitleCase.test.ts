import { attempt } from '@unshared/functions'
import { assertStringTitleCase } from './assertStringTitleCase'

describe('assertStringTitleCase', () => {
  describe('pass', () => {
    it('should pass if value is in title case', () => {
      const result = assertStringTitleCase('Hello World')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not in title case', () => {
      const shouldThrow = () => assertStringTitleCase('Hello, World!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_TITLE_CASE',
        message: 'String is not in title case.',
        context: { value: 'Hello, World!' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringTitleCase({})
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
      const value: unknown = 'Hello World'
      assertStringTitleCase(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
