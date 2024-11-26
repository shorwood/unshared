import { attempt } from '@unshared/functions'
import { assertNull } from './assertNull'

describe('assertNull', () => {
  describe('pass', () => {
    it('should pass if value is null', () => {
      const result = assertNull(null)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not null', () => {
      const shouldThrow = () => assertNull({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NULL',
        message: 'Value is not null.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is undefined', () => {
      const shouldThrow = () => assertNull(undefined)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NULL',
        message: 'Value is not null.',
        context: { value: undefined, received: 'undefined' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as null', () => {
      const value: unknown = null
      assertNull(value)
      expectTypeOf(value).toEqualTypeOf<null>()
    })
  })
})
