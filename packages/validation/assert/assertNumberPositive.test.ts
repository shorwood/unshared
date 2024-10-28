import { assertNumberPositive } from './assertNumberPositive'
const { attempt } = await import('@unshared/functions')

describe('assertNumberPositive', () => {
  describe('pass', () => {
    it('should pass if value is a number greater than or equal to 0', () => {
      const result = assertNumberPositive(1)
      expect(result).toBeUndefined()
    })

    it('should pass if value is 0', () => {
      const result = assertNumberPositive(0)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is less than 0', () => {
      const shouldThrow = () => assertNumberPositive(-1)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_POSITIVE',
        message: 'Number is not positive.',
        context: { value: -1 },
      })
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumberPositive('1')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '1', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a number greater than or equal to 0', () => {
      const value: unknown = 1
      assertNumberPositive(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
