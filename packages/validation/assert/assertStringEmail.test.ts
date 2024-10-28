import type { Email } from './assertStringEmail'
import { attempt } from '@unshared/functions'
import { assertStringEmail } from './assertStringEmail'

describe('assertStringEmail', () => {
  const email = 'john.doe@acme.com'

  describe('pass', () => {
    it('should pass if value is an email', () => {
      const result = assertStringEmail(email)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not an email', () => {
      const shouldThrow = () => assertStringEmail('not-an-email')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_EMAIL',
        message: 'String is not an email.',
        context: { value: 'not-an-email' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringEmail(1)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 1, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as an email', () => {
      const value: unknown = email
      assertStringEmail(value)
      expectTypeOf(value).toEqualTypeOf<Email>()
    })
  })
})
