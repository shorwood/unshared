import { attempt } from '@unshared/functions'
import { assertString } from './assertString'

describe('assertString', () => {
  describe('pass', () => {
    it('should pass if value is a string', () => {
      const result = assertString('Hello, World!')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertString({})
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
      const value: unknown = 'Hello, World!'
      assertString(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
