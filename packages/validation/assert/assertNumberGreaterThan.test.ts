import { attempt } from '@unshared/functions'
import { assertNumberGreaterThan } from './assertNumberGreaterThan'

describe('assertNumberGreaterThan', () => {
  describe('pass', () => {
    it('should pass if number is greater than minimum', () => {
      const result = assertNumberGreaterThan(0)(5)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if number is equal to minimum', () => {
      const shouldThrow = () => assertNumberGreaterThan(0)(0)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_GREATER_THAN',
        message: 'Number is not greater than 0.',
        context: { value: 0, minimum: 0 },
      })
    })

    it('should throw if number is less than minimum', () => {
      const shouldThrow = () => assertNumberGreaterThan(5)(3)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_GREATER_THAN',
        message: 'Number is not greater than 5.',
        context: { value: 3, minimum: 5 },
      })
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumberGreaterThan(0)('5' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '5', received: 'string' },
      })
    })

    it('should throw if value is NaN', () => {
      const shouldThrow = () => assertNumberGreaterThan(0)(Number.NaN)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: Number.NaN, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a number greater than minimum', () => {
      const value = 5 as unknown
      const assertGreater: (value: unknown) => asserts value is number = assertNumberGreaterThan(0)
      assertGreater(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
