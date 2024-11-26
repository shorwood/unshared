import { attempt } from '@unshared/functions'
import { assertNil } from './assertNil'

describe('assertNil', () => {
  describe('pass', () => {
    it('should pass if value is null', () => {
      const result = assertNil(null)
      expect(result).toBeUndefined()
    })

    it('should pass if value is undefined', () => {
      const result = assertNil(undefined)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not null or undefined', () => {
      const shouldThrow = () => assertNil({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NIL',
        message: 'Value is neither null nor undefined.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as null or undefined', () => {
      const value: unknown = null
      assertNil(value)
      expectTypeOf(value).toEqualTypeOf<null | undefined>()
    })
  })
})
