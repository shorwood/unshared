import { attempt } from '@unshared/functions'
import { assertTrue } from './assertTrue'

describe('assertTrue', () => {
  describe('pass', () => {
    it('should pass if value is a boolean equal to true', () => {
      const result = assertTrue(true)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is a boolean equal to false', () => {
      const shouldThrow = () => assertTrue(false)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_BOOLEAN_NOT_TRUE',
        message: 'Boolean is not true.',
        context: { value: false },
      })
    })

    it('should throw if value is not a boolean', () => {
      const shouldThrow = () => assertTrue({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_BOOLEAN',
        message: 'Value is not a boolean.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a boolean equal to true', () => {
      const value: unknown = true
      assertTrue(value)
      expectTypeOf(value).toEqualTypeOf<true>()
    })
  })
})
