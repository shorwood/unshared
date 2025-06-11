import { attempt } from '@unshared/functions'
import { assertNumberLowerThanOrEqual } from './assertNumberLowerThanOrEqual'

describe('assertNumberLowerThanOrEqual', () => {
  describe('pass', () => {
    it('should pass if number is lower than maximum', () => {
      const result = assertNumberLowerThanOrEqual(10)(5)
      expect(result).toBeUndefined()
    })

    it('should pass if number is equal to maximum', () => {
      const result = assertNumberLowerThanOrEqual(10)(10)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if number is greater than maximum', () => {
      const shouldThrow = () => assertNumberLowerThanOrEqual(10)(15)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_LOWER_THAN_OR_EQUAL',
        message: 'Number is not lower than or equal to 10.',
        context: { value: 15, maximum: 10 },
      })
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumberLowerThanOrEqual(10)('5' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '5', received: 'string' },
      })
    })

    it('should throw if value is NaN', () => {
      const shouldThrow = () => assertNumberLowerThanOrEqual(10)(Number.NaN)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: Number.NaN, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a number lower than or equal to maximum', () => {
      const value = 10 as unknown
      const assertLowerOrEqual: (value: unknown) => asserts value is number = assertNumberLowerThanOrEqual(10)
      assertLowerOrEqual(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
