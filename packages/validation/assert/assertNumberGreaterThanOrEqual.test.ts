import { attempt } from '@unshared/functions'
import { assertNumberGreaterThanOrEqual } from './assertNumberGreaterThanOrEqual'

describe('assertNumberGreaterThanOrEqual', () => {
  describe('pass', () => {
    it('should pass if number is greater than minimum', () => {
      const result = assertNumberGreaterThanOrEqual(0)(5)
      expect(result).toBeUndefined()
    })

    it('should pass if number is equal to minimum', () => {
      const result = assertNumberGreaterThanOrEqual(0)(0)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if number is less than minimum', () => {
      const shouldThrow = () => assertNumberGreaterThanOrEqual(5)(3)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_GREATER_THAN_OR_EQUAL',
        message: 'Number is not greater than or equal to 5.',
        context: { value: 3, minimum: 5 },
      })
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumberGreaterThanOrEqual(0)('5' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '5', received: 'string' },
      })
    })

    it('should throw if value is NaN', () => {
      const shouldThrow = () => assertNumberGreaterThanOrEqual(0)(Number.NaN)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: Number.NaN, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a number greater than or equal to minimum', () => {
      const value = 0 as unknown
      const assertGreaterOrEqual: (value: unknown) => asserts value is number = assertNumberGreaterThanOrEqual(0)
      assertGreaterOrEqual(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
