import { attempt } from '@unshared/functions'
import { assertFalse } from './assertFalse'

describe('assertFalse', () => {
  describe('pass', () => {
    it('should pass if value is a boolean equal to false', () => {
      const result = assertFalse(false)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is a boolean equal to true', () => {
      const shouldThrow = () => assertFalse(true)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_BOOLEAN_NOT_FALSE',
        message: 'Boolean is not false.',
        context: { value: true },
      })
    })

    it('should throw if value is not a boolean', () => {
      const shouldThrow = () => assertFalse({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_BOOLEAN',
        message: 'Value is not a boolean.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a boolean equal to false', () => {
      const value: unknown = false
      assertFalse(value)
      expectTypeOf(value).toEqualTypeOf<false>()
    })
  })
})
