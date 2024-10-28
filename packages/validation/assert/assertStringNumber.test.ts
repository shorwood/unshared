import { attempt } from '@unshared/functions'
import { assertStringNumber } from './assertStringNumber'

describe('assertStringNumber', () => {
  describe('pass', () => {
    it('should pass if value is a string number', () => {
      const result = assertStringNumber('5')
      expect(result).toBeUndefined()
    })

    it('should pass if value is a string number with a decimal', () => {
      const result = assertStringNumber('5.5')
      expect(result).toBeUndefined()
    })

    it('should pass if value is a string number with a sign', () => {
      const result = assertStringNumber('-5')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a string number', () => {
      const shouldThrow = () => assertStringNumber('not-a-number')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING_NUMBER',
        message: 'String is not parseable as a number.',
        context: { value: 'not-a-number' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringNumber(1)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 1, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a string number', () => {
      const value: unknown = '5'
      assertStringNumber(value)
      expectTypeOf(value).toEqualTypeOf<`${number}`>()
    })
  })
})
