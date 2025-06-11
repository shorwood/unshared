import { attempt } from '@unshared/functions'
import { assertNumberInRange } from './assertNumberInRange'

describe('assertNumberInRange', () => {
  describe('pass', () => {
    it('should pass if value is a number between min and max', () => {
      const result = assertNumberInRange(1, 10)(5)
      expect(result).toBeUndefined()
    })

    it('should pass if value is equal to min', () => {
      const result = assertNumberInRange(1, 10)(1)
      expect(result).toBeUndefined()
    })

    it('should pass if value is equal to max', () => {
      const result = assertNumberInRange(1, 10)(10)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is less than min', () => {
      const shouldThrow = () => assertNumberInRange(1, 10)(0)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_OUT_OF_RANGE',
        message: 'Number is not between 1 and 10.',
        context: { value: 0, min: 1, max: 10 },
      })
    })

    it('should throw if value is greater than max', () => {
      const shouldThrow = () => assertNumberInRange(1, 10)(11)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_OUT_OF_RANGE',
        message: 'Number is not between 1 and 10.',
        context: { value: 11, min: 1, max: 10 },
      })
    })

    it('should throw if value is NaN', () => {
      const shouldThrow = () => assertNumberInRange(1, 10)(Number.NaN)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: Number.NaN, received: 'number' },
      })
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumberInRange(1, 10)('5' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '5', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a number between min and max', () => {
      const value = 5 as unknown
      const assertRange: (value: unknown) => asserts value is number = assertNumberInRange(1, 10)
      assertRange(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
