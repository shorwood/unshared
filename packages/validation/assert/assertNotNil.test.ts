import { attempt } from '@unshared/functions'
import { assertNotNil } from './assertNotNil'

describe('assertNotNil', () => {
  describe('pass', () => {
    it('should pass if value is not null or undefined', () => {
      const result = assertNotNil(1)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is null', () => {
      const shouldThrow = () => assertNotNil(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_IS_NIL',
        message: 'Value is null or undefined.',
        context: { value: null },
      })
    })

    it('should throw if value is undefined', () => {
      const shouldThrow = () => assertNotNil()
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_IS_NIL',
        message: 'Value is null or undefined.',
        context: { value: undefined },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as not null or undefined', () => {
      const value: null | number | undefined = 1
      assertNotNil(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
