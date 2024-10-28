import { attempt } from '@unshared/functions'
import { assertNotUndefined } from './assertNotUndefined'

describe('assertNotUndefined', () => {
  describe('pass', () => {
    it('should pass if value is not undefined', () => {
      const result = assertNotUndefined(1)
      expect(result).toBeUndefined()
    })

    it('should pass if value is null', () => {
      const result = assertNotUndefined(null)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is undefined', () => {
      const shouldThrow = () => assertNotUndefined(undefined)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_IS_UNDEFINED',
        message: 'Value is undefined.',
        context: { value: undefined },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as not undefined', () => {
      const value: number | undefined = 1
      assertNotUndefined(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
