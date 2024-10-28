import { attempt } from '@unshared/functions'
import { assertNotNull } from './assertNotNull'

describe('assertNotNull', () => {
  describe('pass', () => {
    it('should pass if value is not null', () => {
      const result = assertNotNull(1)
      expect(result).toBeUndefined()
    })

    it('should pass if value is undefined', () => {
      const result = assertNotNull(undefined)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is null', () => {
      const shouldThrow = () => assertNotNull(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_IS_NULL',
        message: 'Value is null.',
        context: { value: null },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as not null', () => {
      const value: null | number = 1
      assertNotNull(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
