import { attempt } from '@unshared/functions'
import { assertStringHeaderCase } from './assertStringHeaderCase'

describe('assertStringHeaderCase', () => {
  describe('pass', () => {
    it('should pass if value is in header case', () => {
      const result = assertStringHeaderCase('Hello-World')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not in header case', () => {
      const shouldThrow = () => assertStringHeaderCase('Hello, World!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_HEADER_CASE',
        message: 'String is not in header case.',
        context: { value: 'Hello, World!' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringHeaderCase({})
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
      const value: unknown = 'Hello-World'
      assertStringHeaderCase(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
