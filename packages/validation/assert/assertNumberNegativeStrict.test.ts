import { assertNumberNegativeStrict } from './assertNumberNegativeStrict'
const { attempt } = await import('@unshared/functions')

describe('assertNumberNegativeStrict', () => {
  describe('pass', () => {
    it('should pass if value is a number less than 0', () => {
      const result = assertNumberNegativeStrict(-1)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is greater than or equal to 0', () => {
      const shouldThrow = () => assertNumberNegativeStrict(0)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_NEGATIVE_STRICT',
        message: 'Number is not strictly negative.',
        context: { value: 0 },
      })
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumberNegativeStrict('1')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '1', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a number less than 0', () => {
      const value: unknown = -1
      assertNumberNegativeStrict(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
