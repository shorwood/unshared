import { attempt } from '@unshared/functions'
import { assertNumberEven } from './assertNumberEven'

describe('assertNumberEven', () => {
  describe('pass', () => {
    it('should pass if value is an even number', () => {
      const result = assertNumberEven(2)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not an even number', () => {
      const shouldThrow = () => assertNumberEven(1)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_EVEN',
        message: 'Number is not even.',
        context: { value: 1 },
      })
    })

    it('should throw if value is not an integer', () => {
      const shouldThrow = () => assertNumberEven(1.5)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_INTEGER',
        message: 'Number is not an integer.',
        context: { value: 1.5 },
      })
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumberEven('1')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '1', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as an even number', () => {
      const value: unknown = 2
      assertNumberEven(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
