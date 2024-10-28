import { assertNumberOdd } from './assertNumberOdd'
const { attempt } = await import('@unshared/functions')

describe('assertNumberOdd', () => {
  describe('pass', () => {
    it('should pass if value is an odd number', () => {
      const result = assertNumberOdd(1)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is an even number', () => {
      const shouldThrow = () => assertNumberOdd(2)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_ODD',
        message: 'Number is not odd.',
        context: { value: 2 },
      })
    })

    it('should throw if value is not an integer', () => {
      const shouldThrow = () => assertNumberOdd(1.5)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_NOT_INTEGER',
        message: 'Number is not an integer.',
        context: { value: 1.5 },
      })
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => assertNumberOdd('1')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_NUMBER',
        message: 'Value is not a number.',
        context: { value: '1', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as an odd number', () => {
      const value: unknown = 1
      assertNumberOdd(value)
      expectTypeOf(value).toEqualTypeOf<number>()
    })
  })
})
