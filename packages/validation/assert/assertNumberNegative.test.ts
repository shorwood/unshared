import { assertNumberNegative } from './assertNumberNegative'
const { attempt } = await import('@unshared/functions')

describe('assertNumberNegative', () => {
  describe('pass', () => {
    it('should pass if value is a number less than or equal to 0', () => {
      const result = assertNumberNegative(-1)
      expect(result).toBeUndefined()
    })

    it('should pass if value is 0', () => {
      const result = assertNumberNegative(0)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is greater than 0', () => {
      const shouldThrow = () => assertNumberNegative(1)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_NEGATIVE',
        message: 'Number is not negative.',
        context: { value: 1 },
      })
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumberNegative('1')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '1', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a number less than or equal to 0', () => {
      const value: unknown = -1
      assertNumberNegative(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
