import { attempt } from '@unshared/functions'
import { assertStringConstantCase } from './assertStringConstantCase'

describe('assertStringConstantCase', () => {
  describe('pass', () => {
    it('should pass if value is in constant case', () => {
      const result = assertStringConstantCase('HELLO_WORLD')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not in constant case', () => {
      const shouldThrow = () => assertStringConstantCase('Hello, World!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_CONSTANT_CASE',
        message: 'String is not in constant case.',
        context: { value: 'Hello, World!' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringConstantCase({})
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
      const value: unknown = 'HELLO_WORLD'
      assertStringConstantCase(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
