import { attempt } from '@unshared/functions'
import { assertInstance } from './assertInstance'

describe('assertInstance', () => {
  describe('pass', () => {
    it('should pass if value is an instance of the given class', () => {
      const result = assertInstance(new Date(), Date)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not an instance of the given class', () => {
      const shouldThrow = () => assertInstance({}, Date)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_INSTANCE_OF',
        message: 'Value is not an instance of "Date"',
        context: { expected: 'Date', received: 'object', ctor: Date },
      })
    })

    it('should throw if value is undefined', () => {
      const shouldThrow = () => assertInstance(undefined, Date)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_INSTANCE_OF',
        message: 'Value is not an instance of "Date"',
        context: { expected: 'Date', received: 'undefined', ctor: Date },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as an instance of the given class', () => {
      const value: unknown = new Date()
      assertInstance(value, Date)
      expectTypeOf(value).toEqualTypeOf<Date>()
    })
  })
})
