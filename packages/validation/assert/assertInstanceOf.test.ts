import { attempt } from '@unshared/functions'
import { assertInstanceOf } from './assertInstanceOf'

describe('assertInstanceOf', () => {
  describe('pass', () => {
    it('should pass if value is an instance of the given class', () => {
      const result = assertInstanceOf(Date)(new Date())
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not an instance of the given class', () => {
      const shouldThrow = () => assertInstanceOf(Date)({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_INSTANCE_OF',
        message: 'Value is not an instance of "Date"',
        context: {
          expected: 'Date',
          received: 'object',
          ctor: Date,
        },
      })
    })

    it('should throw if value is undefined', () => {
      const shouldThrow = () => assertInstanceOf(Date)(undefined)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_INSTANCE_OF',
        message: 'Value is not an instance of "Date"',
        context: {
          expected: 'Date',
          received: 'undefined',
          ctor: Date,
        },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as an instance of the given class', () => {
      const value: unknown = new Date()
      const assertDate: (value: unknown) => asserts value is Date = assertInstanceOf(Date)
      assertDate(value)
      expectTypeOf(value).toEqualTypeOf<Date>()
    })
  })
})
