import { attempt } from '@unshared/functions'
import { assertNumber } from './assertNumber'

describe('assertNumber', () => {
  describe('pass', () => {
    it('should pass if value is a number', () => {
      const result = assertNumber(1)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumber('1')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '1', received: 'string' },
      })
    })

    it('should throw if value is NaN', () => {
      const shouldThrow = () => assertNumber(Number.NaN)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: Number.NaN, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a number', () => {
      const value: unknown = 1
      assertNumber(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
