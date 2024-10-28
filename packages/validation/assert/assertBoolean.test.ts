import { attempt } from '@unshared/functions'
import { assertBoolean } from './assertBoolean'

describe('assertBoolean', () => {
  describe('pass', () => {
    it('should pass if value is a boolean', () => {
      const result = assertBoolean(true)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a boolean', () => {
      const shouldThrow = () => assertBoolean({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_BOOLEAN',
        message: 'Value is not a boolean.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a boolean', () => {
      const value: unknown = true
      assertBoolean(value)
      expectTypeOf(value).toEqualTypeOf<boolean>()
    })
  })
})
