import { attempt } from '@unshared/functions'
import { assertNumberLowerThan } from './assertNumberLowerThan'

describe('assertNumberLowerThan', () => {
  describe('pass', () => {
    it('should pass if number is lower than maximum', () => {
      const result = assertNumberLowerThan(10)(5)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if number is equal to maximum', () => {
      const shouldThrow = () => assertNumberLowerThan(10)(10)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_LOWER_THAN',
        message: 'Number is not lower than 10.',
        context: { value: 10, maximum: 10 },
      })
    })

    it('should throw if number is greater than maximum', () => {
      const shouldThrow = () => assertNumberLowerThan(10)(15)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_LOWER_THAN',
        message: 'Number is not lower than 10.',
        context: { value: 15, maximum: 10 },
      })
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumberLowerThan(10)('5' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '5', received: 'string' },
      })
    })

    it('should throw if value is NaN', () => {
      const shouldThrow = () => assertNumberLowerThan(10)(Number.NaN)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: Number.NaN, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a number lower than maximum', () => {
      const value = 5 as unknown
      const assertLower: (value: unknown) => asserts value is number = assertNumberLowerThan(10)
      assertLower(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
