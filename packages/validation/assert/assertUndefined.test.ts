import { attempt } from '@unshared/functions'
import { assertUndefined } from './assertUndefined'

describe('assertUndefined', () => {
  describe('pass', () => {
    it('should pass if value is undefined', () => {
      const result = assertUndefined(undefined)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not undefined', () => {
      const shouldThrow = () => assertUndefined({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_UNDEFINED',
        message: 'Value is not undefined.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is null', () => {
      const shouldThrow = () => assertUndefined(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_UNDEFINED',
        message: 'Value is not undefined.',
        context: { value: null, received: 'null' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as undefined', () => {
      const value: unknown = undefined
      assertUndefined(value)
      expectTypeOf(value).toEqualTypeOf<undefined>()
    })
  })
})
