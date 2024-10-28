import { attempt } from '@unshared/functions'
import { assertStringNotEmpty } from './assertStringNotEmpty'

describe('assertStringNotEmpty', () => {
  describe('pass', () => {
    it('should pass if value is a non-empty string', () => {
      const result = assertStringNotEmpty('Hello, World!')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is an empty string', () => {
      const shouldThrow = () => assertStringNotEmpty('')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_EMPTY',
        message: 'String is empty.',
        context: { value: '' },
      })
    })

    it('should throw if value is a string with only whitespace characters', () => {
      const shouldThrow = () => assertStringNotEmpty(' ')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_EMPTY',
        message: 'String is empty.',
        context: { value: ' ' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringNotEmpty({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a non-empty string', () => {
      const value: unknown = 'Hello, World!'
      assertStringNotEmpty(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
