import { attempt } from '@unshared/functions'
import { assertStringEmpty } from './assertStringEmpty'

describe('assertStringEmpty', () => {
  describe('pass', () => {
    it('should pass if value is an empty string', () => {
      const result = assertStringEmpty('')
      expect(result).toBeUndefined()
    })

    it('should pass if value is a string of whitespace characters', () => {
      const result = assertStringEmpty(' \n\t')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not an empty string', () => {
      const shouldThrow = () => assertStringEmpty('Hello, World!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_EMPTY',
        message: 'String is not empty.',
        context: { value: 'Hello, World!' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringEmpty({})
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
      const value: unknown = ''
      assertStringEmpty(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
